using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class RadiologyService : IRadiologyService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    public RadiologyService(IUnitOfWork uow, IAuditLogService auditLog)
    {
        _uow = uow;
        _auditLog = auditLog;
    }

    // ── Tests ──────────────────────────────────────────────────────
    public async Task<PagedResult<RadiologyTestDto>> GetTestsAsync(PagedRequest request)
    {
        var query = _uow.RadiologyTests.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(t => t.Name.Contains(request.Search) || t.TestCode.Contains(request.Search) || t.Category.Contains(request.Search));
        
        var total = await query.CountAsync();
        var items = await query.OrderBy(t => t.Name).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<RadiologyTestDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<RadiologyTestDto?> GetTestByIdAsync(int id) { var t = await _uow.RadiologyTests.GetByIdAsync(id); return t is null ? null : ToDto(t); }

    public async Task<RadiologyTestDto> CreateTestAsync(CreateRadiologyTestDto dto, string createdBy)
    {
        var count = await _uow.RadiologyTests.CountAsync();
        var test = new RadiologyTest
        {
            TestCode = $"RAD{(count + 1):D4}", Name = dto.Name, NameAr = dto.NameAr,
            Category = dto.Category, PreparationInstructions = dto.PreparationInstructions,
            Price = dto.Price, CreatedBy = createdBy
        };
        await _uow.RadiologyTests.AddAsync(test);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "RadiologyTest", test.Id, $"Radiology Test {test.Name} ({test.TestCode}) created.");
        return ToDto(test);
    }

    public async Task<RadiologyTestDto> UpdateTestAsync(int id, CreateRadiologyTestDto dto, string updatedBy)
    {
        var test = await _uow.RadiologyTests.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        test.Name = dto.Name; test.NameAr = dto.NameAr; test.Category = dto.Category;
        test.PreparationInstructions = dto.PreparationInstructions; test.Price = dto.Price;
        test.UpdatedBy = updatedBy;
        _uow.RadiologyTests.Update(test);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "RadiologyTest", test.Id, $"Radiology Test {test.Name} updated.");
        return ToDto(test);
    }

    public async Task DeleteTestAsync(int id, string deletedBy)
    {
        var test = await _uow.RadiologyTests.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.RadiologyTests.SoftDelete(test);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(deletedBy, deletedBy, "Delete", "RadiologyTest", test.Id, $"Radiology Test {test.Name} ({test.TestCode}) deleted.");
    }

    // ── Requests ──────────────────────────────────────────────────
    public async Task<PagedResult<RadiologyRequestDto>> GetRequestsAsync(PagedRequest request, string? status)
    {
        IQueryable<RadiologyRequest> query = _uow.RadiologyRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.RadiologyTest);
        if (status != null) query = query.Where(r => r.Status == status);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(r => r.RequestNumber.Contains(request.Search) || r.Patient.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedDate).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<RadiologyRequestDto>(items.Select(ToRDto), total, request.Page, request.PageSize);
    }

    public async Task<RadiologyRequestDto?> GetRequestByIdAsync(int id)
    {
        var r = await _uow.RadiologyRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.RadiologyTest).FirstOrDefaultAsync(x => x.Id == id);
        return r is null ? null : ToRDto(r);
    }

    public async Task<RadiologyRequestDto> CreateRequestAsync(CreateRadiologyRequestDto dto, string createdBy)
    {
        var count = await _uow.RadiologyRequests.CountAsync();
        var req = new RadiologyRequest
        {
            RequestNumber = $"RR{(count + 1):D5}", PatientId = dto.PatientId, DoctorId = dto.DoctorId,
            RequestDate = dto.RequestDate, Notes = dto.Notes, Status = "Pending", CreatedBy = createdBy
        };

        foreach (var tid in dto.TestIds)
        {
            var test = await _uow.RadiologyTests.GetByIdAsync(tid) ?? throw new Exception($"Radiology Test {tid} not found");
            req.Results.Add(new RadiologyResult { RadiologyTestId = tid, CreatedBy = createdBy });
            req.TotalAmount += test.Price;
        }

        await _uow.RadiologyRequests.AddAsync(req);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "RadiologyRequest", req.Id, $"Radiology Request {req.RequestNumber} created for Patient ID {req.PatientId}.");
        return ToRDto(req);
    }

    public async Task<RadiologyRequestDto> UpdateResultAsync(int resultId, UpdateRadiologyResultDto dto, string updatedBy)
    {
        var res = await _uow.RadiologyResults.GetByIdAsync(resultId) ?? throw new KeyNotFoundException();
        res.Findings = dto.Findings; res.Impression = dto.Impression; res.ImageUrl = dto.ImageUrl;
        res.PerformedBy = dto.PerformedBy; res.RadiologistName = dto.RadiologistName;
        res.ResultDate = DateTime.UtcNow; res.UpdatedBy = updatedBy;
        _uow.RadiologyResults.Update(res);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "RadiologyResult", resultId, $"Radiology Result updated for Radiology Request ID {res.RadiologyRequestId}.");

        var req = await _uow.RadiologyRequests.Query().Include(r => r.Patient).Include(r => r.Doctor).Include(r => r.Results).ThenInclude(res => res.RadiologyTest).FirstOrDefaultAsync(x => x.Id == res.RadiologyRequestId);
        return ToRDto(req!);
    }

    public async Task CompleteRequestAsync(int requestId, string updatedBy)
    {
        var req = await _uow.RadiologyRequests.GetByIdAsync(requestId) ?? throw new KeyNotFoundException();
        req.Status = "Completed"; req.UpdatedBy = updatedBy;
        _uow.RadiologyRequests.Update(req);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Complete", "RadiologyRequest", requestId, $"Radiology Request {req.RequestNumber} marked as Completed.");
    }

    internal static RadiologyTestDto ToDto(RadiologyTest t) => new(t.Id, t.TestCode, t.Name, t.NameAr, t.Category, t.PreparationInstructions, t.Price, t.IsActive);
    internal static RadiologyRequestDto ToRDto(RadiologyRequest r) => new(r.Id, r.RequestNumber, r.PatientId, r.Patient?.FullName ?? "N/A", r.DoctorId, r.Doctor?.FullName, r.RequestDate, r.Status, r.TotalAmount, r.Notes, r.Results.Select(ToResDto).ToList());
    internal static RadiologyResultDto ToResDto(RadiologyResult res) => new(res.Id, res.RadiologyRequestId, res.RadiologyTestId, res.RadiologyTest?.Name ?? "N/A", res.Findings, res.Impression, res.ImageUrl, res.ResultDate, res.PerformedBy, res.RadiologistName);
}
