using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class PharmacyService : IPharmacyService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notif;

    public PharmacyService(IUnitOfWork uow, INotificationService notif)
    {
        _uow = uow;
        _notif = notif;
    }

    public async Task<PagedResult<PrescriptionDto>> GetPrescriptionsAsync(PagedRequest request, string? status = null, int? patientId = null, int? admissionId = null)
    {
        var query = _uow.Prescriptions.Query()
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);
        if (patientId.HasValue) query = query.Where(p => p.PatientId == patientId);
        if (admissionId.HasValue) query = query.Where(p => p.BedAdmissionId == admissionId);
        
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(p => p.PrescriptionNumber.Contains(request.Search) || p.Patient.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.PrescriptionDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => ToDto(p))
            .ToListAsync();

        return new PagedResult<PrescriptionDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PrescriptionDto?> GetPrescriptionByIdAsync(int id)
    {
        var p = await _uow.Prescriptions.Query()
            .Include(x => x.Patient)
            .Include(x => x.Doctor)
            .Include(x => x.Items).ThenInclude(i => i.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        return p == null ? null : ToDto(p);
    }

    public async Task<PrescriptionDto> CreatePrescriptionAsync(CreatePrescriptionDto dto)
    {
        var p = new Prescription
        {
            PrescriptionNumber = "PRX-" + DateTime.Now.ToString("yyyyMMdd") + "-" + (await _uow.Prescriptions.CountAsync() + 1).ToString("D5"),
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentId = dto.AppointmentId,
            BedAdmissionId = dto.BedAdmissionId,
            EmergencyAdmissionId = dto.EmergencyAdmissionId,
            Notes = dto.Notes,
            PrescriptionDate = DateTime.UtcNow,
            Status = "Pending"
        };

        foreach (var item in dto.Items)
        {
            p.Items.Add(new PrescriptionItem
            {
                ItemId = item.ItemId,
                Dosage = item.Dosage,
                Frequency = item.Frequency,
                Duration = item.Duration,
                Quantity = item.Quantity,
                Instructions = item.Instructions
            });
        }

        await _uow.Prescriptions.AddAsync(p);
        await _uow.SaveChangesAsync();

        await _notif.CreateNotificationAsync("New Prescription", $"Prescription {p.PrescriptionNumber} created for {p.PatientId}.", "Prescription", null, "Prescription", p.Id);

        return ToDto(p);
    }

    public async Task CancelPrescriptionAsync(int id)
    {
        var p = await _uow.Prescriptions.GetByIdAsync(id) ?? throw new Exception("Prescription not found");
        if (p.Status == "Dispensed") throw new Exception("Cannot cancel a dispensed prescription");
        
        p.Status = "Cancelled";
        await _uow.SaveChangesAsync();
    }

    public async Task DispenseItemAsync(int prescriptionItemId, DispenseItemDto dto, string dispensedBy)
    {
        var pi = await _uow.PrescriptionItems.Query()
            .Include(x => x.Prescription)
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == prescriptionItemId) ?? throw new Exception("Prescription item not found");

        if (pi.IsDispensed) throw new Exception("Item already dispensed");

        // Inventory Logic
        var batch = await _uow.ItemBatches.GetByIdAsync(dto.ItemBatchId ?? 0) ?? throw new Exception("Please select a valid batch for dispensing");
        if (batch.QuantityRemaining < dto.Quantity) throw new Exception($"Insufficient stock in batch {batch.BatchNumber}. Remaining: {batch.QuantityRemaining}");

        // Update Batch
        batch.QuantityRemaining -= dto.Quantity;
        if (batch.QuantityRemaining == 0) batch.Status = "Exhausted";

        var wStock = await _uow.WarehouseStocks.Query().FirstOrDefaultAsync(ws => ws.ItemId == pi.ItemId && ws.WarehouseId == batch.WarehouseId);
        if (wStock != null) 
        {
            wStock.Quantity -= dto.Quantity;
            _uow.WarehouseStocks.Update(wStock);
        }

        // Stock Transaction
        await _uow.StockTransactions.AddAsync(new StockTransaction
        {
            ItemId = pi.ItemId,
            WarehouseId = batch.WarehouseId ?? 0,
            ItemBatchId = batch.Id,
            TransactionType = "OUT",
            Quantity = dto.Quantity,
            UnitCost = batch.UnitCost,
            Reference = pi.Prescription.PrescriptionNumber,
            Notes = "Dispensed from Pharmacy"
        });

        // Update Prescription Item
        pi.IsDispensed = true;
        pi.DispensedDate = DateTime.UtcNow;
        pi.DispensedBy = dispensedBy;

        // Check if all items in prescription are dispensed
        var allDispensed = await _uow.PrescriptionItems.Query()
            .Where(x => x.PrescriptionId == pi.PrescriptionId)
            .AllAsync(x => x.IsDispensed || x.Id == pi.Id);

        if (allDispensed)
        {
            pi.Prescription.Status = "Dispensed";
        }
        else
        {
            pi.Prescription.Status = "Partially Dispensed";
        }
        await _uow.SaveChangesAsync();

        if (batch.WarehouseId.HasValue) 
        {
            await _notif.CheckStockLevelAsync(pi.ItemId, batch.WarehouseId.Value);
        }
    }

    public async Task<List<ItemBatchDto>> GetAvailableBatchesForItemAsync(int itemId)
    {
        var now = DateTime.UtcNow;
        var batches = await _uow.ItemBatches.Query()
            .Include(b => b.Warehouse)
            .Where(b => b.ItemId == itemId && b.QuantityRemaining > 0 && b.Status == "Available")
            .OrderBy(b => b.ExpiryDate) // FEFO: First Expired First Out
            .ToListAsync();

        return batches.Select(b => new ItemBatchDto(
            b.Id, b.ItemId, "", "", b.SupplierId, null, b.WarehouseId, b.Warehouse?.WarehouseName,
            b.BatchNumber, b.Barcode, b.ManufactureDate, b.ExpiryDate, b.QuantityReceived, b.QuantityRemaining,
            b.UnitCost, b.Status, b.LotNumber, b.Notes, b.ReceivedDate,
            (b.ExpiryDate - now).Days, b.ExpiryDate < now, (b.ExpiryDate - now).Days < 30
        )).ToList();
    }

    public async Task<List<PrescriptionItemDto>> GetPendingDispensingAsync(int? patientId)
    {
        var query = _uow.PrescriptionItems.Query()
            .Include(pi => pi.Prescription).ThenInclude(p => p.Patient)
            .Include(pi => pi.Item)
            .Where(pi => !pi.IsDispensed && pi.Prescription.Status != "Cancelled");

        if (patientId.HasValue) query = query.Where(pi => pi.Prescription.PatientId == patientId);

        return await query.OrderByDescending(pi => pi.Prescription.PrescriptionDate)
            .Select(pi => new PrescriptionItemDto(
                pi.Id, pi.PrescriptionId, pi.ItemId, pi.Item.ItemName, pi.Dosage, pi.Frequency, pi.Duration, pi.Quantity, pi.Instructions, 
                pi.IsDispensed, pi.DispensedDate, pi.DispensedBy, pi.Prescription.Patient.FullName, pi.Prescription.PrescriptionNumber
            )).ToListAsync();
    }

    public async Task<IEnumerable<MedicationAdministrationDto>> GetMedicationAdministrationsAsync(int admissionId)
    {
        var administrations = await _uow.MedicationAdministrations.Query()
            .Include(ma => ma.PrescriptionItem).ThenInclude(pi => pi.Item)
            .Where(ma => ma.BedAdmissionId == admissionId)
            .OrderByDescending(ma => ma.AdministeredDate)
            .ToListAsync();

        return administrations.Select(ma => new MedicationAdministrationDto(
            ma.Id, ma.PrescriptionItemId, ma.PrescriptionItem.Item?.ItemName ?? "Unknown Medicine",
            ma.BedAdmissionId, ma.AdministeredDate, ma.AdministeredBy, ma.Status, ma.Dose, ma.Notes,
            ma.PrescriptionItem.IsDispensed, ma.PrescriptionItem.DispensedDate, ma.PrescriptionItem.DispensedBy));
    }

    public async Task<MedicationAdministrationDto> CreateMedicationAdministrationAsync(CreateMedicationAdministrationDto dto, string administeredBy)
    {
        var ma = new MedicationAdministration
        {
            PrescriptionItemId = dto.PrescriptionItemId,
            BedAdmissionId = dto.BedAdmissionId,
            AdministeredDate = DateTime.UtcNow,
            AdministeredBy = administeredBy,
            Status = dto.Status,
            Dose = dto.Dose,
            Notes = dto.Notes
        };

        await _uow.MedicationAdministrations.AddAsync(ma);
        await _uow.SaveChangesAsync();

        // Check if there's related PrescriptionItem to mark it (optional logic if we want to track 'last dose' etc)
        
        var entity = await _uow.MedicationAdministrations.Query()
            .Include(x => x.PrescriptionItem).ThenInclude(pi => pi.Item)
            .FirstOrDefaultAsync(x => x.Id == ma.Id);
            
        return new MedicationAdministrationDto(
            entity!.Id, entity.PrescriptionItemId, entity.PrescriptionItem.Item?.ItemName ?? "Unknown Medicine",
            entity.BedAdmissionId, entity.AdministeredDate, entity.AdministeredBy, entity.Status, entity.Dose, entity.Notes,
            entity.PrescriptionItem.IsDispensed, entity.PrescriptionItem.DispensedDate, entity.PrescriptionItem.DispensedBy);
    }

    public async Task<PharmacyDashboardDto> GetPharmacyDashboardAsync()
    {
        var pendingPrescrCount = await _uow.Prescriptions.Query().CountAsync(p => p.Status == "Pending" || p.Status == "Partially Dispensed");
        
        var now = DateTime.UtcNow;
        var expiringSoonDate = now.AddDays(30);
        
        var expiringSoonBatches = await _uow.ItemBatches.Query()
            .Include(b => b.Item)
            .Include(b => b.Warehouse)
            .Where(b => b.ExpiryDate <= expiringSoonDate && b.QuantityRemaining > 0 && b.Status == "Active")
            .OrderBy(b => b.ExpiryDate)
            .Take(10)
            .ToListAsync();
            
        var expiringCount = await _uow.ItemBatches.Query()
            .CountAsync(b => b.ExpiryDate <= expiringSoonDate && b.QuantityRemaining > 0 && b.Status == "Active");

        var lowStockCount = await _uow.WarehouseStocks.Query()
            .CountAsync(ws => ws.Quantity <= ws.ReorderLevel);

        var recentPrescr = await _uow.Prescriptions.Query()
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .OrderByDescending(p => p.PrescriptionDate)
            .Take(5)
            .ToListAsync();

        var lowStockMedications = await _uow.WarehouseStocks.Query()
            .Include(ws => ws.Item)
            .Include(ws => ws.Warehouse)
            .Where(ws => ws.Quantity <= ws.ReorderLevel && ws.Item.Category == "Medication")
            .Take(10)
            .ToListAsync();

        return new PharmacyDashboardDto(
            pendingPrescrCount,
            expiringCount,
            lowStockCount,
            recentPrescr.Select(ToDto).ToList(),
            expiringSoonBatches.Select(MapBatchToDto).ToList(), 
            lowStockMedications.Select(ToStockDto).ToList() 
        );
    }

    public async Task CheckExpiringBatchesAsync()
    {
        var now = DateTime.UtcNow;
        var alertDate = now.AddDays(30);
        
        var expiring = await _uow.ItemBatches.Query()
            .Include(b => b.Item)
            .Where(b => (b.ExpiryDate <= alertDate || b.ExpiryDate <= now) && b.QuantityRemaining > 0 && b.Status == "Active")
            .ToListAsync();
            
        foreach(var b in expiring)
        {
            var isExpired = b.ExpiryDate <= now;
            var title = isExpired ? "Batch Expired!" : "Batch Expiring Soon";
            var msg = isExpired? $"Batch {b.BatchNumber} for {b.Item?.ItemName} has expired." : $"Batch {b.BatchNumber} for {b.Item?.ItemName} expires on {b.ExpiryDate:d}.";
            
            await _notif.CreateNotificationAsync(title, msg, isExpired ? "ExpiryError" : "ExpiryWarning", null, "ItemBatch", b.Id);
            
            if (isExpired) {
                b.Status = "Expired";
                _uow.ItemBatches.Update(b);
            }
        }
        
        await _uow.SaveChangesAsync();
    }

    // Advanced Clinical Pharmacy Implementation
    public async Task<List<MedicineInteractionDto>> CheckInteractionsAsync(int patientId, List<int> itemIds)
    {
        // Get currently active prescriptions for the patient
        var activePrescrItemIds = await _uow.PrescriptionItems.Query()
            .Where(pi => pi.Prescription.PatientId == patientId && pi.Prescription.Status == "Pending" || pi.Prescription.Status == "Partially Dispensed")
            .Select(pi => pi.ItemId)
            .Distinct()
            .ToListAsync();

        var allItemIdsToCheck = activePrescrItemIds.Concat(itemIds).Distinct().ToList();
        
        var interactions = await _uow.MedicineInteractions.Query()
            .Include(i => i.ItemA)
            .Include(i => i.ItemB)
            .Where(i => allItemIdsToCheck.Contains(i.ItemAId) && allItemIdsToCheck.Contains(i.ItemBId))
            .ToListAsync();

        return interactions.Select(i => new MedicineInteractionDto(
            i.Id, i.ItemAId, i.ItemA.ItemName, i.ItemBId, i.ItemB.ItemName,
            i.Severity, i.InteractionDescription, i.Recommendation
        )).ToList();
    }

    public async Task<MedicineReturnDto> HandleMedicineReturnAsync(CreateMedicineReturnDto dto, string userId)
    {
        var pi = await _uow.PrescriptionItems.Query()
            .Include(x => x.Prescription)
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == dto.PrescriptionItemId) ?? throw new Exception("Prescription item not found");

        if (dto.QuantityReturned > pi.Quantity) throw new Exception("Quantity returned exceeds original prescribed quantity");

        var mr = new MedicineReturn
        {
            PrescriptionItemId = dto.PrescriptionItemId,
            QuantityReturned = dto.QuantityReturned,
            Reason = dto.Reason,
            HandledBy = userId,
            ReturnDate = DateTime.UtcNow,
            Status = "Accepted",
            Notes = dto.Notes
        };

        // If it's accepted, we might want to return it to stock? 
        // For simplicity and safety, we mark as IN transaction but maybe to a separate 'Quarantine' or 'Returned' warehouse if we had one.
        // Returning to the warehouse from which it was dispensed (if we can find it)
        
        await _uow.MedicineReturns.AddAsync(mr);
        await _uow.SaveChangesAsync();

        return new MedicineReturnDto(mr.Id, mr.PrescriptionItemId, pi.Item.ItemName, mr.QuantityReturned, mr.Reason, mr.HandledBy, mr.ReturnDate, mr.Status, mr.Notes);
    }

    public async Task<List<MedicineInteractionDto>> GetInteractionsForItemAsync(int itemId)
    {
        var interactions = await _uow.MedicineInteractions.Query()
            .Include(i => i.ItemA)
            .Include(i => i.ItemB)
            .Where(i => i.ItemAId == itemId || i.ItemBId == itemId)
            .ToListAsync();

        return interactions.Select(i => new MedicineInteractionDto(
            i.Id, i.ItemAId, i.ItemA.ItemName, i.ItemBId, i.ItemB.ItemName,
            i.Severity, i.InteractionDescription, i.Recommendation
        )).ToList();
    }

    public async Task AddInteractionAsync(CreateMedicineInteractionDto dto)
    {
        var interaction = new MedicineInteraction
        {
            ItemAId = dto.ItemAId,
            ItemBId = dto.ItemBId,
            Severity = dto.Severity,
            InteractionDescription = dto.InteractionDescription,
            Recommendation = dto.Recommendation
        };

        await _uow.MedicineInteractions.AddAsync(interaction);
        await _uow.SaveChangesAsync();
    }

    public async Task<PagedResult<MedicineReturnDto>> GetReturnsAsync(PagedRequest request)
    {
        var query = _uow.MedicineReturns.Query()
            .Include(r => r.PrescriptionItem).ThenInclude(pi => pi.Item)
            .AsQueryable();

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.ReturnDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => new MedicineReturnDto(
                r.Id, r.PrescriptionItemId, r.PrescriptionItem.Item.ItemName, r.QuantityReturned,
                r.Reason, r.HandledBy, r.ReturnDate, r.Status, r.Notes
            )).ToListAsync();

        return new PagedResult<MedicineReturnDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<List<PrescriptionItemDto>> GetNarcoticsReportAsync(DateTime startDate, DateTime endDate)
    {
        var report = await _uow.PrescriptionItems.Query()
            .Include(pi => pi.Item)
            .Include(pi => pi.Prescription).ThenInclude(p => p.Patient)
            .Where(pi => pi.Item.IsNarcotic && pi.DispensedDate >= startDate && pi.DispensedDate <= endDate && pi.IsDispensed)
            .OrderByDescending(pi => pi.DispensedDate)
            .Select(pi => new PrescriptionItemDto(
                pi.Id, pi.PrescriptionId, pi.ItemId, pi.Item.ItemName, pi.Dosage, pi.Frequency, pi.Duration, pi.Quantity, pi.Instructions,
                pi.IsDispensed, pi.DispensedDate, pi.DispensedBy, pi.Prescription.Patient.FullName, pi.Prescription.PrescriptionNumber
            )).ToListAsync();

        return report;
    }

    internal static PrescriptionDto ToDto(Prescription p)
    {
        return new PrescriptionDto(
            p.Id, p.PrescriptionNumber, p.PatientId, p.Patient?.FullName ?? "Unknown", p.DoctorId, p.Doctor?.FullName,
            p.AppointmentId, p.BedAdmissionId, p.PrescriptionDate, p.Status, p.Notes,
            p.Items.Select(pi => new PrescriptionItemDto(
                pi.Id, pi.PrescriptionId, pi.ItemId, pi.Item?.ItemName ?? "Unknown Item", pi.Dosage, pi.Frequency, pi.Duration, pi.Quantity, pi.Instructions,
                pi.IsDispensed, pi.DispensedDate, pi.DispensedBy, p.Patient?.FullName, p.PrescriptionNumber
            )).ToList(), p.EmergencyAdmissionId
        );
    }

    private static ItemBatchDto MapBatchToDto(ItemBatch b)
    {
        int days = (b.ExpiryDate - DateTime.UtcNow).Days;
        return new ItemBatchDto(
            b.Id, b.ItemId, b.Item?.ItemName ?? "Unknown Medicine", b.Item?.ItemCode ?? "N/A", b.SupplierId, null,
            b.WarehouseId, b.Warehouse?.WarehouseName, b.BatchNumber, b.Barcode, b.ManufactureDate, b.ExpiryDate,
            b.QuantityReceived, b.QuantityRemaining, b.UnitCost, b.Status, b.LotNumber, b.Notes, b.ReceivedDate,
            days, days <= 0, (days > 0 && days <= 30)
        );
    }

    private static WarehouseStockDto ToStockDto(WarehouseStock ws)
    {
        return new WarehouseStockDto(
            ws.Id, ws.WarehouseId, ws.Warehouse?.WarehouseName ?? "N/A", ws.ItemId, ws.Item?.ItemName ?? "N/A",
            ws.Quantity, ws.ReorderLevel, ws.MaxLevel, ws.Quantity <= ws.ReorderLevel, ws.Item?.PurchasePrice ?? 0);
    }
}
