using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class InventoryService : IInventoryService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notif;
    public InventoryService(IUnitOfWork uow, INotificationService notif) { _uow = uow; _notif = notif; }

    public async Task<PagedResult<ItemDto>> GetItemsAsync(PagedRequest request)
    {
        var query = _uow.Items.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(i => i.ItemName.Contains(request.Search) || i.ItemCode.Contains(request.Search) || (i.Barcode != null && i.Barcode.Contains(request.Search)));
        var total = await query.CountAsync();
        var items = await query.OrderBy(i => i.ItemName)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .Select(i => ToDto(i)).ToListAsync();
        return new PagedResult<ItemDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<ItemDto?> GetItemByIdAsync(int id) { var i = await _uow.Items.GetByIdAsync(id); return i is null ? null : ToDto(i); }

    public async Task<ItemDto> CreateItemAsync(CreateItemDto dto, string createdBy)
    {
        var count = await _uow.Items.CountAsync();
        var item = new Item
        {
            ItemCode = $"ITM{(count + 1):D5}",
            ItemName = dto.ItemName, ItemNameAr = dto.ItemNameAr,
            Category = dto.Category, Unit = dto.Unit,
            SalePrice = dto.SalePrice, PurchasePrice = dto.PurchasePrice,
            TaxRate = dto.TaxRate, Barcode = dto.Barcode,
            Description = dto.Description, TrackBatches = dto.TrackBatches, CreatedBy = createdBy
        };
        await _uow.Items.AddAsync(item);
        await _uow.SaveChangesAsync();
        return ToDto(item);
    }

    public async Task<ItemDto> UpdateItemAsync(int id, CreateItemDto dto, string updatedBy)
    {
        var item = await _uow.Items.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        item.ItemName = dto.ItemName; item.ItemNameAr = dto.ItemNameAr;
        item.Category = dto.Category; item.Unit = dto.Unit;
        item.SalePrice = dto.SalePrice; item.PurchasePrice = dto.PurchasePrice;
        item.TaxRate = dto.TaxRate; item.Barcode = dto.Barcode;
        item.Description = dto.Description; item.TrackBatches = dto.TrackBatches; item.UpdatedBy = updatedBy;
        _uow.Items.Update(item);
        await _uow.SaveChangesAsync();
        return ToDto(item);
    }

    public async Task DeleteItemAsync(int id)
    {
        var item = await _uow.Items.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.Items.SoftDelete(item);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<WarehouseDto>> GetWarehousesAsync()
    {
        var whs = await _uow.Warehouses.GetAllAsync();
        return whs.Select(w => new WarehouseDto(w.Id, w.WarehouseCode, w.WarehouseName, w.Location, w.IsActive));
    }

    public async Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto, string createdBy)
    {
        var count = await _uow.Warehouses.CountAsync();
        var wh = new Warehouse { WarehouseCode = $"WH{(count + 1):D3}", WarehouseName = dto.WarehouseName, Location = dto.Location, CreatedBy = createdBy };
        await _uow.Warehouses.AddAsync(wh);
        await _uow.SaveChangesAsync();
        return new WarehouseDto(wh.Id, wh.WarehouseCode, wh.WarehouseName, wh.Location, wh.IsActive);
    }

    public async Task<IEnumerable<WarehouseStockDto>> GetStockAsync(int? warehouseId, int? itemId)
    {
        IQueryable<WarehouseStock> query = _uow.WarehouseStocks.Query().Include(ws => ws.Warehouse).Include(ws => ws.Item);
        if (warehouseId.HasValue) query = query.Where(ws => ws.WarehouseId == warehouseId.Value);
        if (itemId.HasValue) query = query.Where(ws => ws.ItemId == itemId.Value);
        var stocks = await query.ToListAsync();
        return stocks.Select(ws => new WarehouseStockDto(ws.Id, ws.WarehouseId, ws.Warehouse.WarehouseName, ws.ItemId, ws.Item.ItemName, ws.Quantity, ws.ReorderLevel, ws.MaxLevel, ws.Quantity <= ws.ReorderLevel, ws.Item.PurchasePrice));
    }

    public async Task<IEnumerable<WarehouseStockDto>> GetLowStockItemsAsync()
    {
        var stocks = await _uow.WarehouseStocks.Query().Include(ws => ws.Warehouse).Include(ws => ws.Item)
            .Where(ws => ws.Quantity <= ws.ReorderLevel).ToListAsync();
        return stocks.Select(ws => new WarehouseStockDto(ws.Id, ws.WarehouseId, ws.Warehouse.WarehouseName, ws.ItemId, ws.Item.ItemName, ws.Quantity, ws.ReorderLevel, ws.MaxLevel, true, ws.Item.PurchasePrice));
    }

    public async Task TransferStockAsync(StockTransferDto dto, string createdBy)
    {
        var fromStock = await _uow.WarehouseStocks.Query()
            .FirstOrDefaultAsync(ws => ws.WarehouseId == dto.FromWarehouseId && ws.ItemId == dto.ItemId)
            ?? throw new InvalidOperationException("Item not found in source warehouse.");
        if (fromStock.Quantity < dto.Quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {fromStock.Quantity}");

        fromStock.Quantity -= dto.Quantity;
        _uow.WarehouseStocks.Update(fromStock);

        var toStock = await _uow.WarehouseStocks.Query()
            .FirstOrDefaultAsync(ws => ws.WarehouseId == dto.ToWarehouseId && ws.ItemId == dto.ItemId);
        if (toStock is null)
        {
            toStock = new WarehouseStock { WarehouseId = dto.ToWarehouseId, ItemId = dto.ItemId, Quantity = dto.Quantity, CreatedBy = createdBy };
            await _uow.WarehouseStocks.AddAsync(toStock);
        }
        else { toStock.Quantity += dto.Quantity; _uow.WarehouseStocks.Update(toStock); }

        var item = await _uow.Items.GetByIdAsync(dto.ItemId);
        await _uow.StockTransactions.AddAsync(new StockTransaction { ItemId = dto.ItemId, WarehouseId = dto.FromWarehouseId, TransactionType = "OUT", Quantity = dto.Quantity, UnitCost = item?.PurchasePrice ?? 0, Notes = dto.Notes, TransactionDate = DateTime.UtcNow, CreatedBy = createdBy });
        await _uow.StockTransactions.AddAsync(new StockTransaction { ItemId = dto.ItemId, WarehouseId = dto.ToWarehouseId, TransactionType = "IN", Quantity = dto.Quantity, UnitCost = item?.PurchasePrice ?? 0, Notes = dto.Notes, TransactionDate = DateTime.UtcNow, CreatedBy = createdBy });
        await _uow.SaveChangesAsync();

        await _notif.CreateNotificationAsync("Stock Updated", $"Stock transfer of {dto.Quantity} units completed.", "StockUpdated");
    }

    // ── Packaging Units ───────────────────────────────────────────────
    public async Task<IEnumerable<ItemPackagingUnitDto>> GetItemPackagingUnitsAsync(int itemId)
    {
        var units = await _uow.ItemPackagingUnits.Query()
            .Include(u => u.Item)
            .Where(u => u.ItemId == itemId)
            .OrderBy(u => u.SortOrder)
            .ToListAsync();
        return units.Select(ToUnitDto);
    }

    public async Task<ItemPackagingUnitDto> CreateItemPackagingUnitAsync(CreateItemPackagingUnitDto dto, string createdBy)
    {
        var unit = new ItemPackagingUnit
        {
            ItemId = dto.ItemId,
            UnitName = dto.UnitName,
            UnitNameAr = dto.UnitNameAr,
            Barcode = dto.Barcode ?? "",
            UnitsPerPackage = dto.UnitsPerPackage,
            BaseUnitQty = dto.BaseUnitQty,
            SortOrder = dto.SortOrder,
            IsBaseUnit = dto.IsBaseUnit,
            SalePrice = dto.SalePrice,
            PurchasePrice = dto.PurchasePrice,
            CreatedBy = createdBy
        };
        await _uow.ItemPackagingUnits.AddAsync(unit);
        await _uow.SaveChangesAsync();
        
        // Fetch with Item included
        unit.Item = await _uow.Items.GetByIdAsync(dto.ItemId) ?? throw new KeyNotFoundException();
        return ToUnitDto(unit);
    }

    public async Task DeleteItemPackagingUnitAsync(int id)
    {
        var unit = await _uow.ItemPackagingUnits.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.ItemPackagingUnits.Remove(unit);
        await _uow.SaveChangesAsync();
    }

    // ── Batches ──────────────────────────────────────────────────────────
    public async Task<PagedResult<ItemBatchDto>> GetBatchesAsync(PagedRequest request, int? itemId, int? warehouseId, bool? excludeExpired, bool? excludeExhausted)
    {
        var query = _uow.ItemBatches.Query()
            .Include(b => b.Item)
            .Include(b => b.Supplier)
            .Include(b => b.Warehouse)
            .AsQueryable();

        if (itemId.HasValue) query = query.Where(b => b.ItemId == itemId.Value);
        if (warehouseId.HasValue) query = query.Where(b => b.WarehouseId == warehouseId.Value);
        if (excludeExpired == true) query = query.Where(b => b.Status != "Expired" && b.ExpiryDate > DateTime.UtcNow);
        if (excludeExhausted == true) query = query.Where(b => b.QuantityRemaining > 0 && b.Status != "Exhausted");
        
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(b => b.BatchNumber.Contains(request.Search) || b.Barcode.Contains(request.Search) || (b.LotNumber != null && b.LotNumber.Contains(request.Search)));

        var total = await query.CountAsync();
        var batches = await query.OrderBy(b => b.ExpiryDate)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .ToListAsync();
            
        return new PagedResult<ItemBatchDto>(batches.Select(ToBatchDto), total, request.Page, request.PageSize);
    }

    public async Task<ItemBatchDto?> GetBatchByIdAsync(int id)
    {
        var batch = await _uow.ItemBatches.Query()
            .Include(b => b.Item).Include(b => b.Supplier).Include(b => b.Warehouse)
            .FirstOrDefaultAsync(b => b.Id == id);
        return batch is null ? null : ToBatchDto(batch);
    }

    public async Task<ItemBatchDto> CreateBatchAsync(CreateItemBatchDto dto, string createdBy)
    {
        var count = await _uow.ItemBatches.CountAsync();
        var dateStr = DateTime.UtcNow.ToString("yyyyMMdd");
        
        var batch = new ItemBatch
        {
            ItemId = dto.ItemId,
            SupplierId = dto.SupplierId,
            WarehouseId = dto.WarehouseId,
            BatchNumber = $"BAT-{dateStr}-{(count + 1):D4}",
            Barcode = $"B{dateStr}{(count + 1):D4}", // Generates a unique barcode for the batch
            ManufactureDate = dto.ManufactureDate,
            ExpiryDate = dto.ExpiryDate,
            QuantityReceived = dto.QuantityReceived,
            QuantityRemaining = dto.QuantityReceived,
            UnitCost = dto.UnitCost,
            Status = "Active",
            LotNumber = dto.LotNumber,
            Notes = dto.Notes,
            ReceivedDate = DateTime.UtcNow,
            CreatedBy = createdBy
        };
        
        await _uow.ItemBatches.AddAsync(batch);
        await _uow.SaveChangesAsync();
        
        var fullBatch = await _uow.ItemBatches.Query()
            .Include(b => b.Item).Include(b => b.Supplier).Include(b => b.Warehouse)
            .FirstAsync(b => b.Id == batch.Id);
            
        return ToBatchDto(fullBatch);
    }

    public async Task<ItemBatchDto> UpdateBatchAsync(int id, UpdateItemBatchDto dto, string updatedBy)
    {
        var batch = await _uow.ItemBatches.Query()
            .Include(b => b.Item).Include(b => b.Supplier).Include(b => b.Warehouse)
            .FirstOrDefaultAsync(b => b.Id == id) ?? throw new KeyNotFoundException();
            
        batch.WarehouseId = dto.WarehouseId;
        batch.QuantityRemaining = dto.QuantityRemaining;
        batch.Status = dto.Status;
        batch.Notes = dto.Notes;
        batch.UpdatedBy = updatedBy;
        
        _uow.ItemBatches.Update(batch);
        await _uow.SaveChangesAsync();
        return ToBatchDto(batch);
    }

    public async Task DeleteBatchAsync(int id)
    {
        var batch = await _uow.ItemBatches.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.ItemBatches.Remove(batch);
        await _uow.SaveChangesAsync();
    }

    public async Task<BatchScanResultDto> ScanBarcodeAsync(string barcode, int? warehouseId)
    {
        if (string.IsNullOrWhiteSpace(barcode)) return new BatchScanResultDto(false, null, null, "Empty barcode");

        // First check batches (the precise lot of an item)
        var batchQuery = _uow.ItemBatches.Query()
            .Include(b => b.Item).Include(b => b.Supplier).Include(b => b.Warehouse)
            .Where(b => b.Barcode == barcode && b.QuantityRemaining > 0 && b.Status == "Active");
            
        if (warehouseId.HasValue) batchQuery = batchQuery.Where(b => b.WarehouseId == warehouseId.Value);
        
        var batch = await batchQuery.FirstOrDefaultAsync();
        if (batch != null) return new BatchScanResultDto(true, ToBatchDto(batch), null, null);

        // If no batch found, check packaging units (generic barcode for product)
        var unit = await _uow.ItemPackagingUnits.Query()
            .Include(u => u.Item)
            .FirstOrDefaultAsync(u => u.Barcode == barcode);
            
        if (unit != null) return new BatchScanResultDto(true, null, ToUnitDto(unit), null);

        // Third, fallback to standard item barcode
        var item = await _uow.Items.Query().FirstOrDefaultAsync(i => i.Barcode == barcode);
        if (item != null)
        {
            var fakeUnit = new ItemPackagingUnitDto(0, item.Id, item.ItemName, item.Unit ?? "Unit", item.Unit ?? "Unit", item.Barcode ?? "", 1, 1, 0, true, item.SalePrice, item.PurchasePrice);
            return new BatchScanResultDto(true, null, fakeUnit, null);
        }
            
        return new BatchScanResultDto(false, null, null, "Barcode not found in inventory.");
    }

    // ── Stock Transactions (Reports) ─────────────────────────────────
    public async Task<IEnumerable<StockTransactionDto>> GetStockTransactionsAsync(int? itemId, int? warehouseId, string? type, DateTime? from, DateTime? to)
    {
        var query = _uow.StockTransactions.Query()
            .Include(t => t.Item)
            .Include(t => t.Warehouse)
            .Include(t => t.ItemBatch)
            .AsQueryable();

        if (itemId.HasValue) query = query.Where(t => t.ItemId == itemId.Value);
        if (warehouseId.HasValue) query = query.Where(t => t.WarehouseId == warehouseId.Value);
        if (!string.IsNullOrWhiteSpace(type)) query = query.Where(t => t.TransactionType == type);
        if (from.HasValue) query = query.Where(t => t.TransactionDate >= from.Value);
        if (to.HasValue) query = query.Where(t => t.TransactionDate <= to.Value);

        var txns = await query.OrderByDescending(t => t.TransactionDate).Take(500).ToListAsync();
        return txns.Select(t => new StockTransactionDto(
            t.Id, t.ItemId, t.Item?.ItemName ?? "", t.Item?.ItemCode ?? "",
            t.WarehouseId, t.Warehouse?.WarehouseName ?? "",
            t.TransactionType, t.Quantity, t.UnitCost,
            t.Reference, t.Notes,
            t.ItemBatch?.BatchNumber,
            t.TransactionDate, t.CreatedBy ?? "system"
        ));
    }
    
    private static ItemPackagingUnitDto ToUnitDto(ItemPackagingUnit u) => new(
        u.Id, u.ItemId, u.Item?.ItemName ?? "", u.UnitName, u.UnitNameAr, u.Barcode, 
        u.UnitsPerPackage, u.BaseUnitQty, u.SortOrder, u.IsBaseUnit, u.SalePrice, u.PurchasePrice);
        
    private static ItemBatchDto ToBatchDto(ItemBatch b)
    {
        int days = (b.ExpiryDate - DateTime.UtcNow).Days;
        bool isExpired = days <= 0;
        bool isExpiringSoon = days > 0 && days <= 30;
        if (isExpired && b.Status != "Expired") b.Status = "Expired"; // Just local to DTO
        
        return new ItemBatchDto(
            b.Id, b.ItemId, b.Item?.ItemName ?? "", b.Item?.ItemCode ?? "", b.SupplierId, b.Supplier?.SupplierName,
            b.WarehouseId, b.Warehouse?.WarehouseName, b.BatchNumber, b.Barcode, b.ManufactureDate, b.ExpiryDate,
            b.QuantityReceived, b.QuantityRemaining, b.UnitCost, b.Status, b.LotNumber, b.Notes, b.ReceivedDate,
            days, isExpired, isExpiringSoon);
    }

    private static ItemDto ToDto(Item i) => new(i.Id, i.ItemCode, i.ItemName, i.ItemNameAr, i.Category, i.Unit, i.SalePrice, i.PurchasePrice, i.TaxRate, i.Barcode, i.Description, i.IsActive, i.TrackBatches, i.CreatedDate);
}
