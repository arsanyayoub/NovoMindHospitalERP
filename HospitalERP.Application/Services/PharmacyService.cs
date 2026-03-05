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
                pi.IsDispensed, pi.DispensedDate, pi.DispensedBy
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
            ma.BedAdmissionId, ma.AdministeredDate, ma.AdministeredBy, ma.Status, ma.Dose, ma.Notes));
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
            entity.BedAdmissionId, entity.AdministeredDate, entity.AdministeredBy, entity.Status, entity.Dose, entity.Notes);
    }

    internal static PrescriptionDto ToDto(Prescription p)
    {
        return new PrescriptionDto(
            p.Id, p.PrescriptionNumber, p.PatientId, p.Patient?.FullName ?? "Unknown", p.DoctorId, p.Doctor?.FullName,
            p.AppointmentId, p.BedAdmissionId, p.PrescriptionDate, p.Status, p.Notes,
            p.Items.Select(pi => new PrescriptionItemDto(
                pi.Id, pi.PrescriptionId, pi.ItemId, pi.Item?.ItemName ?? "Unknown Item", pi.Dosage, pi.Frequency, pi.Duration, pi.Quantity, pi.Instructions,
                pi.IsDispensed, pi.DispensedDate, pi.DispensedBy
            )).ToList()
        );
    }
}
