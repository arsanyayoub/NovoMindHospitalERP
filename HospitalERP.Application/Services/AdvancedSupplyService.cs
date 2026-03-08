using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalERP.Application.Services;

public class AdvancedSupplyService : IAdvancedSupplyService
{
    private readonly IUnitOfWork _uow;

    public AdvancedSupplyService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PagedResult<PurchaseOrderDto>> GetPurchaseOrdersAsync(PagedRequest request)
    {
        var query = _uow.PurchaseOrders.Query().Include(p => p.Supplier);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.OrderDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new PurchaseOrderDto(p.Id, p.PoNumber, p.SupplierId, p.Supplier.SupplierName, p.OrderDate, p.Status, p.TotalAmount))
            .ToListAsync();

        return new PagedResult<PurchaseOrderDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PurchaseOrderDto> CreatePurchaseOrderAsync(CreatePurchaseOrderDto dto, string userId)
    {
        var supplier = await _uow.Suppliers.GetByIdAsync(dto.SupplierId);
        if (supplier == null) throw new Exception("Supplier not found");

        var po = new PurchaseOrder
        {
            PoNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(100, 999)}",
            SupplierId = dto.SupplierId,
            OrderDate = DateTime.UtcNow,
            ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
            Status = "Submitted",
            CreatedBy = userId,
            Notes = dto.Notes
        };

        decimal totalAmount = 0;
        foreach (var i in dto.Items)
        {
            var item = await _uow.Items.GetByIdAsync(i.ItemId);
            if (item != null)
            {
                decimal t = i.OrderedQuantity * i.UnitPrice;
                po.Items.Add(new PurchaseOrderItem
                {
                    ItemId = i.ItemId,
                    OrderedQuantity = i.OrderedQuantity,
                    UnitPrice = i.UnitPrice,
                    Total = t
                });
                totalAmount += t;
            }
        }
        po.TotalAmount = totalAmount;

        await _uow.PurchaseOrders.AddAsync(po);
        await _uow.SaveChangesAsync();

        return new PurchaseOrderDto(po.Id, po.PoNumber, po.SupplierId, supplier.SupplierName, po.OrderDate, po.Status, po.TotalAmount);
    }

    public async Task UpdatePurchaseOrderStatusAsync(int id, string status, string userId)
    {
        var po = await _uow.PurchaseOrders.GetByIdAsync(id);
        if (po != null)
        {
            po.Status = status;
            po.UpdatedBy = userId;
            po.UpdatedDate = DateTime.UtcNow;
            await _uow.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<WardStockDispensationDto>> GetWardStockDispensationsAsync(int wardId)
    {
        return await _uow.WardStockDispensations.Query()
            .Include(ws => ws.Ward)
            .Include(ws => ws.Item)
            .Where(ws => ws.WardId == wardId)
            .OrderByDescending(ws => ws.DispensedDate)
            .Select(ws => new WardStockDispensationDto(
                ws.Id, ws.WardId, ws.Ward.WardName, ws.ItemId, ws.Item.ItemName, ws.QuantityDispensed, ws.DispensedDate, ws.Status))
            .ToListAsync();
    }

    public async Task<WardStockDispensationDto> DispenseWardStockAsync(CreateWardStockDispensationDto dto, string userId)
    {
        var ward = await _uow.Wards.GetByIdAsync(dto.WardId);
        var item = await _uow.Items.GetByIdAsync(dto.ItemId);
        if (ward == null || item == null) throw new Exception("Ward or Item not found");

        var disp = new WardStockDispensation
        {
            WardId = dto.WardId,
            ItemId = dto.ItemId,
            QuantityDispensed = dto.QuantityDispensed,
            DispensedDate = DateTime.UtcNow,
            RequestedBy = dto.RequestedBy,
            Status = "Completed",
            CreatedBy = userId
        };

        await _uow.WardStockDispensations.AddAsync(disp);
        await _uow.SaveChangesAsync();

        return new WardStockDispensationDto(disp.Id, ward.Id, ward.WardName, item.Id, item.ItemName, disp.QuantityDispensed, disp.DispensedDate, disp.Status);
    }
}
