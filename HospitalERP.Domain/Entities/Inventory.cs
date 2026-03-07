using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== INVENTORY =====
public class Item : BaseEntity
{
    public string ItemCode { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string ItemNameAr { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Unit { get; set; }
    public decimal SalePrice { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal TaxRate { get; set; }
    public string? Barcode { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool TrackBatches { get; set; } = false;

    // Advanced Pharmacy Fields
    public string? GenericName { get; set; }
    public string? Strength { get; set; } // e.g., 500mg
    public string? DosageForm { get; set; } // e.g., Tablet, Syrup
    public bool IsNarcotic { get; set; } = false;
    public bool RequiresRefrigeration { get; set; } = false;

    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    public ICollection<WarehouseStock> WarehouseStocks { get; set; } = new List<WarehouseStock>();
    public ICollection<ItemBatch> Batches { get; set; } = new List<ItemBatch>();
}

public class MedicineInteraction : BaseEntity
{
    public int ItemAId { get; set; }
    public Item ItemA { get; set; } = null!;
    public int ItemBId { get; set; }
    public Item ItemB { get; set; } = null!;
    
    public string Severity { get; set; } = "Moderate"; // Minor, Moderate, Major, Contraindicated
    public string? InteractionDescription { get; set; }
    public string? Recommendation { get; set; }
}

/// <summary>
/// Tracks a physical lot/batch of received inventory with expiry date,
/// barcode, lot number and remaining quantity.
/// </summary>
public class ItemBatch : BaseEntity
{
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
    public int? WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    /// <summary>Auto-generated: BAT-YYYYMMDD-#####</summary>
    public string BatchNumber { get; set; } = string.Empty;

    /// <summary>EAN-13 / Code-128 barcode string, printed on box labels</summary>
    public string Barcode { get; set; } = string.Empty;

    public DateTime ManufactureDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public decimal QuantityReceived { get; set; }
    public decimal QuantityRemaining { get; set; }
    public decimal UnitCost { get; set; }

    /// <summary>Active | Expired | Exhausted | Recalled</summary>
    public string Status { get; set; } = "Active";

    public string? LotNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
}

public class Warehouse : BaseEntity
{
    public string WarehouseCode { get; set; } = string.Empty;
    public string WarehouseName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<WarehouseStock> WarehouseStocks { get; set; } = new List<WarehouseStock>();
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    public ICollection<ItemBatch> Batches { get; set; } = new List<ItemBatch>();
}

public class WarehouseStock : BaseEntity
{
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    public decimal Quantity { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal MaxLevel { get; set; }
}

public class StockTransaction : BaseEntity
{
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public int? ItemBatchId { get; set; }
    public ItemBatch? ItemBatch { get; set; }
    public string TransactionType { get; set; } = string.Empty; // IN, OUT, TRANSFER
    public decimal Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
}
