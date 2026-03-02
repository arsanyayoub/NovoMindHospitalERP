using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Domain.Enums;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notif;
    public InvoiceService(IUnitOfWork uow, INotificationService notif) { _uow = uow; _notif = notif; }

    public async Task<PagedResult<InvoiceDto>> GetAllAsync(PagedRequest request, string? status, string? type)
    {
        var query = _uow.Invoices.Query()
            .Include(i => i.Patient).Include(i => i.Customer)
            .Include(i => i.InvoiceItems).ThenInclude(ii => ii.Item);
        var filtered = query.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<InvoiceStatus>(status, out var s))
            filtered = filtered.Where(i => i.Status == s);
        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<InvoiceType>(type, out var t))
            filtered = filtered.Where(i => i.InvoiceType == t);
        if (!string.IsNullOrWhiteSpace(request.Search))
            filtered = filtered.Where(i => i.InvoiceNumber.Contains(request.Search));
        var total = await filtered.CountAsync();
        var items = await filtered.OrderByDescending(i => i.InvoiceDate)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<InvoiceDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<InvoiceDto?> GetByIdAsync(int id)
    {
        var i = await _uow.Invoices.Query()
            .Include(i => i.Patient).Include(i => i.Customer)
            .Include(i => i.InvoiceItems).ThenInclude(ii => ii.Item)
            .FirstOrDefaultAsync(i => i.Id == id);
        return i is null ? null : ToDto(i);
    }

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto, string createdBy)
    {
        var count = await _uow.Invoices.CountAsync();
        if (!Enum.TryParse<InvoiceType>(dto.InvoiceType, out var invType))
            invType = InvoiceType.Hospital;
        var subTotal = dto.Items.Sum(i => i.Quantity * i.UnitPrice - i.Discount);
        var invoice = new Invoice
        {
            InvoiceNumber = $"INV{(count + 1):D6}",
            PatientId = dto.PatientId,
            CustomerId = dto.CustomerId,
            InvoiceDate = dto.InvoiceDate,
            DueDate = dto.DueDate,
            InvoiceType = invType,
            SubTotal = subTotal,
            TaxAmount = dto.TaxAmount,
            DiscountAmount = dto.DiscountAmount,
            TotalAmount = subTotal + dto.TaxAmount - dto.DiscountAmount,
            Notes = dto.Notes,
            CreatedBy = createdBy,
            InvoiceItems = dto.Items.Select(ii => new InvoiceItem
            {
                ItemId = ii.ItemId,
                Description = ii.Description,
                Quantity = ii.Quantity,
                UnitPrice = ii.UnitPrice,
                TaxRate = ii.TaxRate,
                Discount = ii.Discount,
                Total = ii.Quantity * ii.UnitPrice - ii.Discount,
                CreatedBy = createdBy
            }).ToList()
        };
        await _uow.Invoices.AddAsync(invoice);
        await _uow.SaveChangesAsync();
        await _notif.CreateNotificationAsync("Invoice Created", $"Invoice {invoice.InvoiceNumber} for {invoice.TotalAmount:C2}.",
            "InvoiceCreated", entityType: "Invoice", entityId: invoice.Id);
        return (await GetByIdAsync(invoice.Id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var inv = await _uow.Invoices.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.Invoices.SoftDelete(inv);
        await _uow.SaveChangesAsync();
    }

    public async Task<PaymentDto> RecordPaymentAsync(CreatePaymentDto dto, string createdBy)
    {
        var count = await _uow.Payments.CountAsync();
        if (!Enum.TryParse<PaymentMethod>(dto.PaymentMethod, out var pm)) pm = PaymentMethod.Cash;
        var payment = new Payment
        {
            PaymentNumber = $"PAY{(count + 1):D6}",
            InvoiceId = dto.InvoiceId,
            PatientId = dto.PatientId,
            Amount = dto.Amount,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = pm,
            ReferenceNumber = dto.ReferenceNumber,
            Notes = dto.Notes,
            CreatedBy = createdBy
        };
        if (dto.InvoiceId.HasValue)
        {
            var inv = await _uow.Invoices.GetByIdAsync(dto.InvoiceId.Value);
            if (inv is not null)
            {
                inv.PaidAmount += dto.Amount;
                inv.Status = inv.PaidAmount >= inv.TotalAmount ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid;
                _uow.Invoices.Update(inv);
            }
        }
        await _uow.Payments.AddAsync(payment);
        await _uow.SaveChangesAsync();
        await _notif.CreateNotificationAsync("Payment Received", $"Payment {payment.PaymentNumber} of {payment.Amount:C2} received.",
            "PaymentReceived", entityType: "Payment", entityId: payment.Id);
        return ToPaymentDto(payment);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsAsync(int? invoiceId)
    {
        IQueryable<Payment> query = _uow.Payments.Query().Include(p => p.Patient);
        if (invoiceId.HasValue) query = query.Where(p => p.InvoiceId == invoiceId.Value);
        var payments = await query.OrderByDescending(p => p.PaymentDate).ToListAsync();
        return payments.Select(ToPaymentDto);
    }

    internal static InvoiceDto ToDto(Invoice i) => new(
        i.Id, i.InvoiceNumber, i.PatientId, i.Patient?.FullName, i.CustomerId, i.Customer?.CustomerName,
        i.InvoiceDate, i.DueDate, i.InvoiceType.ToString(), i.Status.ToString(),
        i.SubTotal, i.TaxAmount, i.DiscountAmount, i.TotalAmount, i.PaidAmount, i.BalanceDue, i.Notes,
        i.InvoiceItems.Select(ii => new InvoiceItemDto(
            ii.Id, ii.ItemId, ii.Item?.ItemName, ii.Description,
            ii.Quantity, ii.UnitPrice, ii.TaxRate, ii.Discount, ii.Total)).ToList(),
        i.CreatedDate);

    private static PaymentDto ToPaymentDto(Payment p) => new(
        p.Id, p.PaymentNumber, p.InvoiceId, p.PatientId, p.Patient?.FullName,
        p.Amount, p.PaymentDate, p.PaymentMethod.ToString(), p.ReferenceNumber, p.Notes);
}
