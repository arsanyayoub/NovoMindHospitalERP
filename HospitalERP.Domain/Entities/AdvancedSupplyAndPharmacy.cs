using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== ADVANCED SUPPLY CHAIN =====
public class PurchaseOrder : BaseEntity
{
    public string PoNumber { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Submitted, Approved, PartiallyReceived, Completed, Cancelled
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string? Notes { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
}

public class PurchaseOrderItem : BaseEntity
{
    public int PurchaseOrderId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    public decimal OrderedQuantity { get; set; }
    public decimal ReceivedQuantity { get; set; } = 0;
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

// ===== eMAR & PHARMACY EXTENSION =====
public class WardStockDispensation : BaseEntity
{
    public int WardId { get; set; }
    public Ward Ward { get; set; } = null!;
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    public decimal QuantityDispensed { get; set; }
    public DateTime DispensedDate { get; set; } = DateTime.UtcNow;
    public string? RequestedBy { get; set; }
    public string Status { get; set; } = "Completed";
}
