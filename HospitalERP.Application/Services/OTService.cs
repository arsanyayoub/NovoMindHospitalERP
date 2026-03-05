using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class OTService : IOTService
{
    private readonly IUnitOfWork _uow;

    public OTService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<OperatingTheaterDto>> GetOperatingTheatersAsync()
    {
        var ots = await _uow.OperatingTheaters.GetAllAsync();
        return ots.Select(o => new OperatingTheaterDto(o.Id, o.Name, o.Location, o.Status));
    }

    public async Task<OperatingTheaterDto> CreateOperatingTheaterAsync(CreateOperatingTheaterDto dto)
    {
        var ot = new OperatingTheater
        {
            Name = dto.Name,
            Location = dto.Location,
            Status = dto.Status
        };

        await _uow.OperatingTheaters.AddAsync(ot);
        await _uow.SaveChangesAsync();

        return new OperatingTheaterDto(ot.Id, ot.Name, ot.Location, ot.Status);
    }

    public async Task UpdateOTStatusAsync(int id, string status)
    {
        var ot = await _uow.OperatingTheaters.GetByIdAsync(id) ?? throw new Exception("OT not found");
        ot.Status = status;
        await _uow.SaveChangesAsync();
    }

    public async Task<PagedResult<ScheduledSurgeryDto>> GetScheduledSurgeriesAsync(PagedRequest request, string? status = null, int? otId = null)
    {
        var query = _uow.ScheduledSurgeries.Query()
            .Include(s => s.Patient)
            .Include(s => s.LeadSurgeon)
            .Include(s => s.Anesthetist)
            .Include(s => s.OperatingTheater)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status)) query = query.Where(s => s.Status == status);
        if (otId.HasValue) query = query.Where(s => s.OperatingTheaterId == otId);
        
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(s => s.ProcedureName.Contains(request.Search) || s.Patient.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderBy(s => s.ScheduledStartTime)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(s => ToDto(s))
            .ToListAsync();

        return new PagedResult<ScheduledSurgeryDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<ScheduledSurgeryDto?> GetSurgeryByIdAsync(int id)
    {
        var s = await _uow.ScheduledSurgeries.Query()
            .Include(x => x.Patient)
            .Include(x => x.LeadSurgeon)
            .Include(x => x.Anesthetist)
            .Include(x => x.OperatingTheater)
            .FirstOrDefaultAsync(x => x.Id == id);

        return s == null ? null : ToDto(s);
    }

    public async Task<ScheduledSurgeryDto> ScheduleSurgeryAsync(CreateScheduledSurgeryDto dto)
    {
        var s = new ScheduledSurgery
        {
            PatientId = dto.PatientId,
            LeadSurgeonId = dto.LeadSurgeonId,
            AnesthetistId = dto.AnesthetistId,
            OperatingTheaterId = dto.OperatingTheaterId,
            ProcedureName = dto.ProcedureName,
            ScheduledStartTime = dto.ScheduledStartTime,
            ScheduledEndTime = dto.ScheduledEndTime,
            Priority = dto.Priority,
            PreOpDiagnosis = dto.PreOpDiagnosis,
            Notes = dto.Notes,
            Status = "Scheduled"
        };

        await _uow.ScheduledSurgeries.AddAsync(s);
        
        // Optionally update OT status to Busy if the surgery starts now
        // But usually we do this explicitly through UpdateOTStatusAsync or another triggered mechanism
        
        await _uow.SaveChangesAsync();
        
        // Reload to get names
        return (await GetSurgeryByIdAsync(s.Id))!;
    }

    public async Task UpdateSurgeryStatusAsync(int id, string status, string? postOpDiagnosis = null, string? notes = null)
    {
        var s = await _uow.ScheduledSurgeries.GetByIdAsync(id) ?? throw new Exception("Surgery not found");
        s.Status = status;
        if (!string.IsNullOrEmpty(postOpDiagnosis)) s.PostOpDiagnosis = postOpDiagnosis;
        if (!string.IsNullOrEmpty(notes)) s.Notes = notes;
        
        await _uow.SaveChangesAsync();
    }

    public async Task CancelSurgeryAsync(int id, string reason)
    {
        var s = await _uow.ScheduledSurgeries.GetByIdAsync(id) ?? throw new Exception("Surgery not found");
        s.Status = "Cancelled";
        s.Notes = (s.Notes ?? "") + "\nCancellation Reason: " + reason;
        await _uow.SaveChangesAsync();
    }

    private static ScheduledSurgeryDto ToDto(ScheduledSurgery s)
    {
        return new ScheduledSurgeryDto(
            s.Id, s.PatientId, s.Patient?.FullName ?? "Unknown", 
            s.LeadSurgeonId, s.LeadSurgeon?.FullName ?? "Unknown",
            s.AnesthetistId, s.Anesthetist?.FullName, 
            s.OperatingTheaterId, s.OperatingTheater?.Name ?? "Unknown OT",
            s.ProcedureName, s.ScheduledStartTime, s.ScheduledEndTime, 
            s.Priority, s.Status, s.PreOpDiagnosis, s.PostOpDiagnosis, s.Notes
        );
    }
}
