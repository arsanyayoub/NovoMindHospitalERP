using HospitalERP.Domain.Common;
using HospitalERP.Domain.Enums;

namespace HospitalERP.Domain.Entities;

public class Payment : BaseEntity
{
    public string PaymentNumber { get; set; } = string.Empty;
    public int? InvoiceId { get; set; }
    public Invoice? Invoice { get; set; }
    public int? PatientId { get; set; }
    public Patient? Patient { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public PaymentMethod PaymentMethod { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
}
