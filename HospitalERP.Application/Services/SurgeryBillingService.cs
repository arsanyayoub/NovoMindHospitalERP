using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalERP.Application.Services;

public class SurgeryBillingService : ISurgeryBillingService
{
    private readonly IUnitOfWork _uow;
    private readonly IInvoiceService _invoiceService;
    private readonly ILogger<SurgeryBillingService> _logger;

    public SurgeryBillingService(IUnitOfWork uow, IInvoiceService invoiceService, ILogger<SurgeryBillingService> logger)
    {
        _uow = uow;
        _invoiceService = invoiceService;
        _logger = logger;
    }

    public async Task<decimal> CalculateSurgeryCostAsync(int surgeryId)
    {
        var surgery = await _uow.ScheduledSurgeries.Query()
            .Include(s => s.Resources).ThenInclude(r => r.Item)
            .FirstOrDefaultAsync(s => s.Id == surgeryId);

        if (surgery == null) return 0;

        decimal total = 0;
        // Base Fee (Could be dynamic based on surgery type later)
        total += 500; // Standard surgery fee placeholder

        foreach (var resource in surgery.Resources)
        {
            total += (resource.Item.SalePrice * resource.Quantity);
        }

        return total;
    }

    public async Task<int> GenerateSurgeryBillAsync(int surgeryId, string userId)
    {
        var surgery = await _uow.ScheduledSurgeries.Query()
            .Include(s => s.Patient)
            .Include(s => s.Resources).ThenInclude(r => r.Item)
            .FirstOrDefaultAsync(s => s.Id == surgeryId);

        if (surgery == null) throw new KeyNotFoundException("Surgery not found");
        if (surgery.InvoiceId != null) throw new InvalidOperationException("Surgery is already billed");

        var items = new List<CreateInvoiceItemDto>();

        // 1. Add Base Surgery Fee
        items.Add(new CreateInvoiceItemDto(
            ItemId: null,
            Description: $"Surgical Procedure: {surgery.ProcedureName}",
            Quantity: 1,
            UnitPrice: 500, // Placeholder base fee
            TaxRate: 0,
            Discount: 0
        ));

        // 2. Add Contributed Resources
        foreach (var resource in surgery.Resources)
        {
            items.Add(new CreateInvoiceItemDto(
                ItemId: resource.ItemId,
                Description: $"Surgical Supply: {resource.Item.ItemName} ({resource.BatchNumber ?? "No Batch"})",
                Quantity: resource.Quantity,
                UnitPrice: resource.Item.SalePrice,
                TaxRate: resource.Item.TaxRate,
                Discount: 0
            ));
        }

        var invoiceDto = new CreateInvoiceDto(
            PatientId: surgery.PatientId,
            CustomerId: null,
            InvoiceDate: DateTime.UtcNow,
            DueDate: DateTime.UtcNow.AddDays(15),
            InvoiceType: "Patient",
            TaxAmount: 0,
            DiscountAmount: 0,
            Notes: $"Automated billing for Surgery #{surgery.Id} - {surgery.ProcedureName}",
            Items: items
        );

        var invoice = await _invoiceService.CreateAsync(invoiceDto, userId);
        
        // Link invoice to surgery
        surgery.InvoiceId = invoice.Id;
        surgery.TotalCost = items.Sum(i => i.UnitPrice * i.Quantity);
        
        await _uow.ScheduledSurgeries.UpdateAsync(surgery);
        await _uow.SaveChangesAsync();

        _logger.LogInformation("Generated Invoice #{InvoiceId} for Surgery #{SurgeryId}", invoice.Id, surgeryId);
        
        return invoice.Id;
    }
}
