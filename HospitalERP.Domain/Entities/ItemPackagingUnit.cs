using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ─── Packaging Unit ─────────────────────────────────────────────
/// <summary>
/// Describes how an Item is packaged at each sale/purchase level.
/// Example — "Antal 500mg":
///   Box    (علبة)   → Barcode 6001001000001 | UnitsPerPackage=10 | BaseUnitQty=100
///   Strip  (شريط)  → Barcode 6001001000018 | UnitsPerPackage=10 | BaseUnitQty=10
///   Tablet (قرص)   → Barcode 6001001000025 | UnitsPerPackage=1  | BaseUnitQty=1  (IsBaseUnit)
/// </summary>
public class ItemPackagingUnit : BaseEntity
{
    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;

    public string UnitName { get; set; } = string.Empty;    // "Box"
    public string UnitNameAr { get; set; } = string.Empty;  // "علبة"
    public string Barcode { get; set; } = string.Empty;

    /// <summary>How many of the next-smaller unit this package contains (e.g. 10 strips per box)</summary>
    public decimal UnitsPerPackage { get; set; } = 1;

    /// <summary>Total number of base units in this package (e.g. 100 tablets per box)</summary>
    public decimal BaseUnitQty { get; set; } = 1;

    public int SortOrder { get; set; } = 0;  // 0=largest (Box), ascending to smallest (Tablet)
    public bool IsBaseUnit { get; set; } = false;

    public decimal SalePrice { get; set; }
    public decimal PurchasePrice { get; set; }
}
