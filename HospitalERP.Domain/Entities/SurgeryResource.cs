using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class SurgeryResource : BaseEntity
{
    public int ScheduledSurgeryId { get; set; }
    public ScheduledSurgery ScheduledSurgery { get; set; } = null!;

    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;

    public decimal Quantity { get; set; }
    public string? BatchNumber { get; set; } // Optional: track which batch was used
    public string? Notes { get; set; }
    public DateTime ConsumedDate { get; set; } = DateTime.UtcNow;
}
