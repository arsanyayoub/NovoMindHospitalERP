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
            Description = dto.Description, CreatedBy = createdBy
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
        item.Description = dto.Description; item.UpdatedBy = updatedBy;
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
        return stocks.Select(ws => new WarehouseStockDto(ws.Id, ws.WarehouseId, ws.Warehouse.WarehouseName, ws.ItemId, ws.Item.ItemName, ws.Quantity, ws.ReorderLevel, ws.MaxLevel, ws.Quantity <= ws.ReorderLevel));
    }

    public async Task<IEnumerable<WarehouseStockDto>> GetLowStockItemsAsync()
    {
        var stocks = await _uow.WarehouseStocks.Query().Include(ws => ws.Warehouse).Include(ws => ws.Item)
            .Where(ws => ws.Quantity <= ws.ReorderLevel).ToListAsync();
        return stocks.Select(ws => new WarehouseStockDto(ws.Id, ws.WarehouseId, ws.Warehouse.WarehouseName, ws.ItemId, ws.Item.ItemName, ws.Quantity, ws.ReorderLevel, ws.MaxLevel, true));
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

    private static ItemDto ToDto(Item i) => new(i.Id, i.ItemCode, i.ItemName, i.ItemNameAr, i.Category, i.Unit, i.SalePrice, i.PurchasePrice, i.TaxRate, i.Barcode, i.Description, i.IsActive, i.CreatedDate);
}
