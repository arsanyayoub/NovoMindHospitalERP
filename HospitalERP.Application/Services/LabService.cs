using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class LabService : ILabService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    private readonly INotificationService _notif;
    public LabService(IUnitOfWork uow, IAuditLogService auditLog, INotificationService notif) 
    { 
        _uow = uow; 
        _auditLog = auditLog;
        _notif = notif;
    }

    // ── Tests ──────────────────────────────────────────────────────
    public async Task<PagedResult<LabTestDto>> GetTestsAsync(PagedRequest request)
    {
        var query = _uow.LabTests.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(t => t.Name.Contains(request.Search) || t.TestCode.Contains(request.Search) || t.Category.Contains(request.Search));
        
        var total = await query.CountAsync();
        var items = await query.Include(t => t.ReferenceRanges).OrderBy(t => t.Name).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<LabTestDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<LabTestDto?> GetTestByIdAsync(int id) { var t = await _uow.LabTests.Query().Include(x => x.ReferenceRanges).FirstOrDefaultAsync(x => x.Id == id); return t is null ? null : ToDto(t); }

    public async Task<LabTestDto> CreateTestAsync(CreateLabTestDto dto, string createdBy)
    {
        var count = await _uow.LabTests.CountAsync();
        var test = new LabTest
        {
            TestCode = $"LAB{(count + 1):D4}", Name = dto.Name, NameAr = dto.NameAr,
            Category = dto.Category, NormalRange = dto.NormalRange, Unit = dto.Unit,
            Price = dto.Price, CreatedBy = createdBy
        };
        await _uow.LabTests.AddAsync(test); 
        await _uow.SaveChangesAsync(); 
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "LabTest", test.Id, $"Lab Test {test.Name} ({test.TestCode}) created.");
        return ToDto(test);
    }

    public async Task<LabTestDto> UpdateTestAsync(int id, CreateLabTestDto dto, string updatedBy)
    {
        var test = await _uow.LabTests.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        test.Name = dto.Name; test.NameAr = dto.NameAr; test.Category = dto.Category;
        test.NormalRange = dto.NormalRange; test.Unit = dto.Unit; test.Price = dto.Price;
        test.UpdatedBy = updatedBy; 
        _uow.LabTests.Update(test); 
        await _uow.SaveChangesAsync(); 
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "LabTest", test.Id, $"Lab Test {test.Name} updated.");
        return ToDto(test);
    }

    public async Task DeleteTestAsync(int id, string deletedBy)
    {
        var test = await _uow.LabTests.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.LabTests.SoftDelete(test); 
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(deletedBy, deletedBy, "Delete", "LabTest", id, $"Lab Test ID {id} deleted.");
    }

    // ── Requests ──────────────────────────────────────────────────
    public async Task<PagedResult<LabRequestDto>> GetRequestsAsync(PagedRequest request, string? status)
    {
        IQueryable<LabRequest> query = _uow.LabRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.LabTest);
        if (status != null) query = query.Where(r => r.Status == status);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(r => r.RequestNumber.Contains(request.Search) || r.Patient.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedDate).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<LabRequestDto>(items.Select(ToRDto), total, request.Page, request.PageSize);
    }

    public async Task<LabRequestDto?> GetRequestByIdAsync(int id)
    {
        var r = await _uow.LabRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.LabTest).FirstOrDefaultAsync(x => x.Id == id);
        return r is null ? null : ToRDto(r);
    }

    public async Task<LabRequestDto> CreateRequestAsync(CreateLabRequestDto dto, string createdBy)
    {
        var count = await _uow.LabRequests.CountAsync();
        var req = new LabRequest
        {
            RequestNumber = $"LR{(count + 1):D5}", PatientId = dto.PatientId, DoctorId = dto.DoctorId,
            RequestDate = dto.RequestDate, Notes = dto.Notes, Status = "Pending", CreatedBy = createdBy,
            EmergencyAdmissionId = dto.EmergencyAdmissionId
        };

        foreach (var tid in dto.TestIds)
        {
            var test = await _uow.LabTests.GetByIdAsync(tid) ?? throw new Exception($"Test {tid} not found");
            req.Results.Add(new LabResult { LabTestId = tid, NormalRange = test.NormalRange, Unit = test.Unit, CreatedBy = createdBy });
            req.TotalAmount += test.Price;
        }

        await _uow.LabRequests.AddAsync(req); 
        await _uow.SaveChangesAsync(); 
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "LabRequest", req.Id, $"Lab Request {req.RequestNumber} created for Patient ID {req.PatientId}.");
        return ToRDto(req);
    }

    public async Task<LabRequestDto> UpdateResultAsync(int resultId, UpdateLabResultDto dto, string updatedBy)
    {
        var res = await _uow.LabResults.Query()
            .Include(x => x.LabRequest).ThenInclude(x => x.Patient)
            .Include(x => x.LabTest).ThenInclude(x => x.ReferenceRanges)
            .FirstOrDefaultAsync(x => x.Id == resultId) ?? throw new KeyNotFoundException();

        res.ResultValue = dto.ResultValue;
        res.Remarks = dto.Remarks;
        res.PerformedBy = dto.PerformedBy;
        res.ResultDate = DateTime.UtcNow;
        res.UpdatedBy = updatedBy;

        // Auto-evaluate against reference ranges
        if (decimal.TryParse(dto.ResultValue, out decimal val))
        {
            var patient = res.LabRequest.Patient;
            var age = DateTime.UtcNow.Year - patient.DateOfBirth.Year;
            var ranges = res.LabTest.ReferenceRanges;

            var range = ranges.FirstOrDefault(r => 
                (r.Gender == "All" || r.Gender == patient.Gender) && 
                (!r.MinAge.HasValue || age >= r.MinAge.Value) && 
                (!r.MaxAge.HasValue || age <= r.MaxAge.Value));

            if (range != null)
            {
                if ((range.CriticalLow.HasValue && val <= range.CriticalLow.Value) || 
                    (range.CriticalHigh.HasValue && val >= range.CriticalHigh.Value))
                {
                    res.ResultFlag = "Critical";
                    res.IsCritical = true;
                }
                else if (range.MinValue.HasValue && val < range.MinValue.Value)
                {
                    res.ResultFlag = "Low";
                    res.IsCritical = false;
                }
                else if (range.MaxValue.HasValue && val > range.MaxValue.Value)
                {
                    res.ResultFlag = "High";
                    res.IsCritical = false;
                }
                else
                {
                    res.ResultFlag = "Normal";
                    res.IsCritical = false;
                }
            }
            else
            {
                 res.ResultFlag = dto.ResultFlag;
                 res.IsCritical = dto.IsCritical;
            }
        }
        else
        {
            res.ResultFlag = dto.ResultFlag;
            res.IsCritical = dto.IsCritical;
        }

        _uow.LabResults.Update(res);
        await _uow.SaveChangesAsync();

        if (res.IsCritical)
        {
             await _notif.CreateNotificationAsync(
                "CRITICAL LAB RESULT",
                $"Critical value detected: {res.LabTest.Name} = {res.ResultValue} {res.Unit} for patient {res.LabRequest.Patient.FullName}.",
                "Critical",
                int.TryParse(res.LabRequest.CreatedBy, out var drId) ? drId : null,
                "LabRequest",
                res.LabRequestId);
        }

        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "LabResult", resultId, $"Lab Result updated for Lab Request ID {res.LabRequestId}. Flag: {res.ResultFlag}");

        var req = await _uow.LabRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.LabTest).FirstOrDefaultAsync(x => x.Id == res.LabRequestId);
        return ToRDto(req!);
    }

    public async Task CompleteRequestAsync(int requestId, string updatedBy)
    {
        var req = await _uow.LabRequests.Query().Include(r => r.Patient).FirstOrDefaultAsync(r => r.Id == requestId) ?? throw new KeyNotFoundException();
        req.Status = "Completed"; req.UpdatedBy = updatedBy;
        _uow.LabRequests.Update(req); 
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Complete", "LabRequest", requestId, $"Lab Request {req.RequestNumber} marked as Completed.");

        // Notify ordering doctor/user
        await _notif.CreateNotificationAsync(
            "Lab Results Ready", 
            $"Results for {req.Patient?.FullName ?? "Patient"}'s lab request {req.RequestNumber} are now finalized.", 
            "Lab", 
            int.TryParse(req.CreatedBy, out var userId) ? userId : null,
            "LabRequest", 
            req.Id);
    }

    public async Task UpdateSpecimenStatusAsync(int requestId, string status, string? collectedBy, string userId)
    {
        var req = await _uow.LabRequests.GetByIdAsync(requestId) ?? throw new KeyNotFoundException();
        req.Status = status;
        req.UpdatedBy = userId;
        if (status == "Collected")
        {
            req.CollectionDate = DateTime.UtcNow;
            req.CollectedBy = collectedBy;
        }
        else if (status == "AtLab")
        {
            req.ReceivedAtLabDate = DateTime.UtcNow;
        }
        
        _uow.LabRequests.Update(req);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "UpdateStatus", "LabRequest", requestId, $"Specimen status for {req.RequestNumber} updated to {status}.");
    }

    public async Task<LabTestReferenceRangeDto> AddTestRangeAsync(CreateLabTestReferenceRangeDto dto, string userId)
    {
        var range = new LabTestReferenceRange
        {
            LabTestId = dto.LabTestId, Gender = dto.Gender, MinAge = dto.MinAge, MaxAge = dto.MaxAge,
            MinValue = dto.MinValue, MaxValue = dto.MaxValue, CriticalLow = dto.CriticalLow, CriticalHigh = dto.CriticalHigh,
            Description = dto.Description, CreatedBy = userId
        };
        await _uow.LabTestReferenceRanges.AddAsync(range);
        await _uow.SaveChangesAsync();
        return ToRangeDto(range);
    }

    public async Task<IEnumerable<LabTestReferenceRangeDto>> GetTestRangesAsync(int testId)
    {
        var ranges = await _uow.LabTestReferenceRanges.Query().Where(r => r.LabTestId == testId).ToListAsync();
        return ranges.Select(ToRangeDto);
    }

    internal static LabTestDto ToDto(LabTest t) => new(t.Id, t.TestCode, t.Name, t.NameAr, t.Category, t.NormalRange, t.Unit, t.Price, t.IsActive, t.ReferenceRanges?.Select(ToRangeDto).ToList() ?? new());
    internal static LabTestReferenceRangeDto ToRangeDto(LabTestReferenceRange r) => new(r.Id, r.LabTestId, r.Gender, r.MinAge, r.MaxAge, r.MinValue, r.MaxValue, r.CriticalLow, r.CriticalHigh, r.Description);
    internal static LabRequestDto ToRDto(LabRequest r) => new(r.Id, r.RequestNumber, r.PatientId, r.Patient?.FullName ?? "N/A", r.DoctorId, r.Doctor?.FullName, r.RequestDate, r.Status, r.CollectionDate, r.CollectedBy, r.ReceivedAtLabDate, r.TotalAmount, r.Notes, r.Results.Select(ToResDto).ToList(), r.EmergencyAdmissionId);
    internal static LabResultDto ToResDto(LabResult res) => new(res.Id, res.LabRequestId, res.LabTestId, res.LabTest?.Name ?? "N/A", res.ResultValue, res.NormalRange, res.Unit, res.ResultDate, res.Remarks, res.PerformedBy, res.ResultFlag, res.IsCritical);
}
