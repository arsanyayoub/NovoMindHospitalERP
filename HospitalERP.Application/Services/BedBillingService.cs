using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalERP.Application.Services;

public class BedBillingService : IBedBillingService
{
    private readonly IUnitOfWork _uow;
    private readonly IInvoiceService _invoiceService;
    private readonly IAuditLogService _auditLog;
    private readonly INotificationService _notificationService;
    private readonly ILogger<BedBillingService> _logger;

    public BedBillingService(IUnitOfWork uow, IInvoiceService invoiceService, IAuditLogService auditLog, INotificationService notificationService, ILogger<BedBillingService> logger)
    {
        _uow = uow;
        _invoiceService = invoiceService;
        _auditLog = auditLog;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task ProcessDailyBillingAsync(string userId)
    {
        _logger.LogInformation("Starting Automated Bed Billing for date: {Date}", DateTime.UtcNow.ToShortDateString());

        var admissions = await _uow.BedAdmissions.Query()
            .Where(a => a.Status == "Active")
            .Include(a => a.Patient)
            .Include(a => a.Bed).ThenInclude(b => b.Room).ThenInclude(r => r.Ward)
            .ToListAsync();

        var today = DateTime.UtcNow.Date;

        foreach (var adm in admissions)
        {
            try
            {
                // Check if already charged for today
                // Using a unique descriptor in Notes or Description to avoid double billing
                var chargeTag = $"[BED_CHARGE_ADM_{adm.Id}_{today:yyyyMMdd}]";
                
                var alreadyCharged = await _uow.InvoiceItems.Query()
                    .AnyAsync(ii => ii.Description.Contains(chargeTag));

                if (!alreadyCharged)
                {
                    await CreateBedChargeInvoiceAsync(adm, today, chargeTag, userId);
                    await _auditLog.LogAsync(userId, userId, "Daily Bed Charge", "BedAdmission", adm.Id, $"Generated automated bed charge for Patient {adm.Patient.FullName} for date {today:yyyy-MM-dd}.");
                    _logger.LogInformation("Generated daily bed charge for Patient {Patient} (Adm #{AdmId})", adm.Patient.FullName, adm.Id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing bed charge for Admission #{AdmId}", adm.Id);
            }
        }

        if (admissions.Any())
        {
            await _notificationService.CreateNotificationAsync(
                "Daily Billing Completed", 
                $"Automated bed billing processed for {admissions.Count} admissions on {today:yyyy-MM-dd}.",
                "Invoice",
                null // Broadcast to relevant staff
            );
        }
    }

    public async Task GenerateFinalBillAsync(int admissionId, string userId)
    {
        var adm = await _uow.BedAdmissions.Query()
            .Include(a => a.Patient)
            .Include(a => a.Bed).ThenInclude(b => b.Room).ThenInclude(r => r.Ward)
            .FirstOrDefaultAsync(a => a.Id == admissionId);

        if (adm == null) throw new KeyNotFoundException("Admission not found");

        _logger.LogInformation("Generating final bill for Admission #{AdmId}", admissionId);

        // Final bill logic: Charges all uncharged days from AdmissionDate to DischargeDate (which is usually UtcNow)
        var endDate = adm.DischargeDate?.Date ?? DateTime.UtcNow.Date;
        var startDate = adm.AdmissionDate.Date;

        for (var day = startDate; day <= endDate; day = day.AddDays(1))
        {
            var chargeTag = $"[BED_CHARGE_ADM_{adm.Id}_{day:yyyyMMdd}]";
            var charged = await _uow.InvoiceItems.Query()
                .AnyAsync(ii => ii.Description.Contains(chargeTag));

            if (!charged)
            {
                await CreateBedChargeInvoiceAsync(adm, day, chargeTag, userId);
                await _auditLog.LogAsync(userId, userId, "Final Bed Charge", "BedAdmission", adm.Id, $"Generated final/missing bed charge for date {day:yyyy-MM-dd}.");
            }
        }
    }

    public async Task<IEnumerable<InvoiceDto>> GetInpatientBillsAsync(int patientId)
    {
        var invoices = await _uow.Invoices.Query()
            .Include(i => i.InvoiceItems).ThenInclude(ii => ii.Item)
            .Include(i => i.Patient)
            .Where(i => i.PatientId == patientId && i.Notes != null && i.Notes.Contains("Inpatient Stay"))
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();

        return invoices.Select(InvoiceService.ToDto);
    }

    private async Task CreateBedChargeInvoiceAsync(BedAdmission adm, DateTime date, string chargeTag, string userId)
    {
        var rate = adm.DailyRate ?? 150;
        var description = $"Accommodation: {adm.Bed.Room.Ward.WardName} - Room {adm.Bed.Room.RoomNumber} - Bed {adm.Bed.BedNumber} | Date: {date:yyyy-MM-dd} {chargeTag}";

        var dto = new CreateInvoiceDto(
            PatientId: adm.PatientId,
            CustomerId: null,
            InvoiceDate: date,
            DueDate: date.AddDays(7),
            InvoiceType: "Patient",
            TaxAmount: 0,
            DiscountAmount: 0,
            Notes: $"Inpatient Stay Charge for Admission #{adm.Id}. Auto-generated.",
            Items: new List<CreateInvoiceItemDto>
            {
                new CreateInvoiceItemDto(
                    ItemId: null,
                    Description: description,
                    Quantity: 1,
                    UnitPrice: rate,
                    TaxRate: 0,
                    Discount: 0
                )
            }
        );

        await _invoiceService.CreateAsync(dto, userId);
    }
}
