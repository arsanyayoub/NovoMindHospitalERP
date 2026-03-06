using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class OTService : IOTService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    private readonly INotificationService _notifService;

    public OTService(IUnitOfWork uow, IAuditLogService auditLog, INotificationService notifService)
    {
        _uow = uow;
        _auditLog = auditLog;
        _notifService = notifService;
    }

    public async Task<IEnumerable<OperatingTheaterDto>> GetOperatingTheatersAsync()
    {
        var ots = await _uow.OperatingTheaters.GetAllAsync();
        return ots.Select(o => new OperatingTheaterDto(o.Id, o.Name, o.Location, o.Status));
    }

    public async Task<OperatingTheaterDto> CreateOperatingTheaterAsync(CreateOperatingTheaterDto dto, string userId)
    {
        var ot = new OperatingTheater
        {
            Name = dto.Name,
            Location = dto.Location,
            Status = dto.Status,
            CreatedBy = userId
        };

        await _uow.OperatingTheaters.AddAsync(ot);
        await _uow.SaveChangesAsync();

        await _auditLog.LogAsync(userId, userId, "Create", "OperatingTheater", ot.Id, $"Created OT: {ot.Name}");

        return new OperatingTheaterDto(ot.Id, ot.Name, ot.Location, ot.Status);
    }

    public async Task UpdateOTStatusAsync(int id, string status, string userId)
    {
        var ot = await _uow.OperatingTheaters.GetByIdAsync(id) ?? throw new Exception("OT not found");
        var oldStatus = ot.Status;
        ot.Status = status;
        ot.UpdatedBy = userId;
        ot.UpdatedDate = DateTime.UtcNow;

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update Status", "OperatingTheater", id, $"Changed OT {ot.Name} status from {oldStatus} to {status}");
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
            .Include(x => x.Resources).ThenInclude(r => r.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        return s == null ? null : ToDto(s);
    }

    public async Task<ScheduledSurgeryDto> ScheduleSurgeryAsync(CreateScheduledSurgeryDto dto, string userId)
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
            Status = "Scheduled",
            CreatedBy = userId
        };

        await _uow.ScheduledSurgeries.AddAsync(s);
        await _uow.SaveChangesAsync();
        
        await _auditLog.LogAsync(userId, userId, "Schedule", "ScheduledSurgery", s.Id, $"Scheduled {s.ProcedureName} for patient ID {s.PatientId}");
        await _notifService.CreateNotificationAsync("Surgery Scheduled", $"Surgery '{s.ProcedureName}' scheduled for {s.ScheduledStartTime:f}", "OT", null, "ScheduledSurgery", s.Id);

        return (await GetSurgeryByIdAsync(s.Id))!;
    }

    public async Task UpdateSurgeryStatusAsync(int id, string status, string? postOpDiagnosis, string? notes, string userId)
    {
        var s = await _uow.ScheduledSurgeries.GetByIdAsync(id) ?? throw new Exception("Surgery not found");
        var oldStatus = s.Status;
        s.Status = status;
        if (!string.IsNullOrEmpty(postOpDiagnosis)) s.PostOpDiagnosis = postOpDiagnosis;
        if (!string.IsNullOrEmpty(notes)) s.Notes = notes;
        s.UpdatedBy = userId;
        s.UpdatedDate = DateTime.UtcNow;
        
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update Status", "ScheduledSurgery", id, $"Changed surgery status from {oldStatus} to {status}");
        await _notifService.CreateNotificationAsync("Surgery Update", $"Surgery status changed to {status}", "OT", null, "ScheduledSurgery", id);
    }

    public async Task CancelSurgeryAsync(int id, string reason, string userId)
    {
        var s = await _uow.ScheduledSurgeries.GetByIdAsync(id) ?? throw new Exception("Surgery not found");
        s.Status = "Cancelled";
        s.Notes = (s.Notes ?? "") + "\nCancellation Reason: " + reason;
        s.UpdatedBy = userId;
        s.UpdatedDate = DateTime.UtcNow;

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Cancel", "ScheduledSurgery", id, $"Cancelled surgery. Reason: {reason}");
        await _notifService.CreateNotificationAsync("Surgery Cancelled", $"Surgery was cancelled: {reason}", "OT", null, "ScheduledSurgery", id);
    }

    public async Task AddSurgeryResourceAsync(int surgeryId, CreateSurgeryResourceDto dto, string userId)
    {
        var surgery = await _uow.ScheduledSurgeries.GetByIdAsync(surgeryId) ?? throw new Exception("Surgery not found");
        
        var resource = new SurgeryResource
        {
            ScheduledSurgeryId = surgeryId,
            ItemId = dto.ItemId,
            Quantity = dto.Quantity,
            BatchNumber = dto.BatchNumber,
            Notes = dto.Notes,
            CreatedBy = userId
        };

        await _uow.SurgeryResources.AddAsync(resource);

        // Inventory Logic
        ItemBatch? batch = null;
        if (!string.IsNullOrEmpty(dto.BatchNumber))
        {
            batch = await _uow.ItemBatches.Query().FirstOrDefaultAsync(b => b.BatchNumber == dto.BatchNumber && b.ItemId == dto.ItemId);
        }
        else
        {
            batch = await _uow.ItemBatches.Query()
                .Where(b => b.ItemId == dto.ItemId && b.QuantityRemaining >= dto.Quantity && b.Status == "Active")
                .OrderBy(b => b.ExpiryDate)
                .FirstOrDefaultAsync();
        }

        if (batch != null)
        {
            if (batch.QuantityRemaining < dto.Quantity) throw new Exception($"Insufficient stock in batch {batch.BatchNumber}");
            
            batch.QuantityRemaining -= dto.Quantity;
            if (batch.QuantityRemaining == 0) batch.Status = "Exhausted";
            
            await _uow.StockTransactions.AddAsync(new StockTransaction
            {
                ItemId = dto.ItemId,
                WarehouseId = batch.WarehouseId ?? 0,
                ItemBatchId = batch.Id,
                TransactionType = "OUT",
                Quantity = dto.Quantity,
                UnitCost = batch.UnitCost,
                Reference = $"Surgery #{surgeryId}",
                Notes = "Consumed in Operating Theater",
                CreatedBy = userId
            });
        }
        
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Add Resource", "ScheduledSurgery", surgeryId, $"Added resource {dto.ItemId} (Qty: {dto.Quantity}) to surgery {surgeryId}");
    }

    public async Task<IEnumerable<SurgeryResourceDto>> GetSurgeryResourcesAsync(int surgeryId)
    {
        var resources = await _uow.SurgeryResources.Query()
            .Include(r => r.Item)
            .Where(r => r.ScheduledSurgeryId == surgeryId)
            .ToListAsync();

        return resources.Select(r => new SurgeryResourceDto(
            r.Id, r.ScheduledSurgeryId, r.ItemId, r.Item?.ItemName ?? "Unknown", 
            r.Quantity, r.BatchNumber, r.Notes, r.ConsumedDate));
    }

    public async Task RemoveSurgeryResourceAsync(int resourceId, string userId)
    {
        var resource = await _uow.SurgeryResources.GetByIdAsync(resourceId) ?? throw new Exception("Resource record not found");
        _uow.SurgeryResources.SoftDelete(resource);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Remove Resource", "ScheduledSurgery", resource.ScheduledSurgeryId, $"Removed resource ID {resourceId} from surgery {resource.ScheduledSurgeryId}");
    }

    private static ScheduledSurgeryDto ToDto(ScheduledSurgery s)
    {
        return new ScheduledSurgeryDto(
            s.Id, s.PatientId, s.Patient?.FullName ?? "Unknown", 
            s.LeadSurgeonId, s.LeadSurgeon?.FullName ?? "Unknown",
            s.AnesthetistId, s.Anesthetist?.FullName, 
            s.OperatingTheaterId, s.OperatingTheater?.Name ?? "Unknown OT",
            s.ProcedureName, s.ScheduledStartTime, s.ScheduledEndTime, 
            s.Priority, s.Status, s.PreOpDiagnosis, s.PostOpDiagnosis, s.Notes,
            s.InvoiceId, s.TotalCost,
            s.Resources?.Select(r => new SurgeryResourceDto(
                r.Id, r.ScheduledSurgeryId, r.ItemId, r.Item?.ItemName ?? "Unknown",
                r.Quantity, r.BatchNumber, r.Notes, r.ConsumedDate
            )).ToList()
        );
    }
}

