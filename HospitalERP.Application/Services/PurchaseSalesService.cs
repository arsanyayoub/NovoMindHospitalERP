using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class PurchaseService : IPurchaseService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notif;
    public PurchaseService(IUnitOfWork uow, INotificationService notif) { _uow = uow; _notif = notif; }

    public async Task<PagedResult<SupplierDto>> GetSuppliersAsync(PagedRequest request)
    {
        var query = _uow.Suppliers.Query();
        if (!string.IsNullOrWhiteSpace(request.Search)) query = query.Where(s => s.SupplierName.Contains(request.Search) || s.SupplierCode.Contains(request.Search));
        var total = await query.CountAsync();
        var items = await query.OrderBy(s => s.SupplierName).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<SupplierDto>(items.Select(ToSupDto), total, request.Page, request.PageSize);
    }

    public async Task<SupplierDto?> GetSupplierByIdAsync(int id) { var s = await _uow.Suppliers.GetByIdAsync(id); return s is null ? null : ToSupDto(s); }

    public async Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto, string createdBy)
    {
        var count = await _uow.Suppliers.CountAsync();
        var sup = new Supplier { SupplierCode = $"SUP{(count + 1):D4}", SupplierName = dto.SupplierName, ContactPerson = dto.ContactPerson, PhoneNumber = dto.PhoneNumber, Email = dto.Email, Address = dto.Address, TaxNumber = dto.TaxNumber, CreatedBy = createdBy };
        await _uow.Suppliers.AddAsync(sup);
        await _uow.SaveChangesAsync();
        return ToSupDto(sup);
    }

    public async Task<SupplierDto> UpdateSupplierAsync(int id, CreateSupplierDto dto, string updatedBy)
    {
        var sup = await _uow.Suppliers.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        sup.SupplierName = dto.SupplierName; sup.ContactPerson = dto.ContactPerson; sup.PhoneNumber = dto.PhoneNumber; sup.Email = dto.Email; sup.Address = dto.Address; sup.TaxNumber = dto.TaxNumber; sup.UpdatedBy = updatedBy;
        _uow.Suppliers.Update(sup); await _uow.SaveChangesAsync(); return ToSupDto(sup);
    }

    public async Task<PagedResult<PurchaseInvoiceDto>> GetPurchaseInvoicesAsync(PagedRequest request, string? status)
    {
        var query = _uow.PurchaseInvoices.Query().Include(pi => pi.Supplier).Include(pi => pi.Items).ThenInclude(i => i.Item).Include(pi => pi.Items).ThenInclude(i => i.Warehouse);
        var filtered = query.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) filtered = filtered.Where(pi => pi.Status == status);
        if (!string.IsNullOrWhiteSpace(request.Search)) filtered = filtered.Where(pi => pi.InvoiceNumber.Contains(request.Search) || pi.Supplier.SupplierName.Contains(request.Search));
        var total = await filtered.CountAsync();
        var items = await filtered.OrderByDescending(pi => pi.InvoiceDate).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<PurchaseInvoiceDto>(items.Select(ToPiDto), total, request.Page, request.PageSize);
    }

    public async Task<PurchaseInvoiceDto?> GetPurchaseInvoiceByIdAsync(int id)
    {
        var pi = await _uow.PurchaseInvoices.Query().Include(pi => pi.Supplier).Include(pi => pi.Items).ThenInclude(i => i.Item).Include(pi => pi.Items).ThenInclude(i => i.Warehouse).FirstOrDefaultAsync(pi => pi.Id == id);
        return pi is null ? null : ToPiDto(pi);
    }

    public async Task<PurchaseInvoiceDto> CreatePurchaseInvoiceAsync(CreatePurchaseInvoiceDto dto, string createdBy)
    {
        var count = await _uow.PurchaseInvoices.CountAsync();
        var subTotal = dto.Items.Sum(i => i.Quantity * i.UnitPrice - i.Discount);
        var taxAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice * i.TaxRate / 100);
        var pi = new PurchaseInvoice
        {
            InvoiceNumber = $"PI{(count + 1):D6}", SupplierId = dto.SupplierId,
            InvoiceDate = dto.InvoiceDate, DueDate = dto.DueDate,
            SubTotal = subTotal, TaxAmount = taxAmount, DiscountAmount = dto.DiscountAmount,
            TotalAmount = subTotal + taxAmount - dto.DiscountAmount,
            Notes = dto.Notes, CreatedBy = createdBy,
            Items = dto.Items.Select(i => new PurchaseInvoiceItem { ItemId = i.ItemId, WarehouseId = i.WarehouseId, Quantity = i.Quantity, UnitPrice = i.UnitPrice, TaxRate = i.TaxRate, Discount = i.Discount, Total = i.Quantity * i.UnitPrice - i.Discount, CreatedBy = createdBy }).ToList()
        };
        await _uow.PurchaseInvoices.AddAsync(pi);
        // Update stock
        foreach (var item in dto.Items)
        {
            var stock = await _uow.WarehouseStocks.Query().FirstOrDefaultAsync(ws => ws.WarehouseId == item.WarehouseId && ws.ItemId == item.ItemId);
            if (stock is null) await _uow.WarehouseStocks.AddAsync(new WarehouseStock { WarehouseId = item.WarehouseId, ItemId = item.ItemId, Quantity = item.Quantity, CreatedBy = createdBy });
            else { stock.Quantity += item.Quantity; _uow.WarehouseStocks.Update(stock); }
            await _uow.StockTransactions.AddAsync(new StockTransaction { ItemId = item.ItemId, WarehouseId = item.WarehouseId, TransactionType = "IN", Quantity = item.Quantity, UnitCost = item.UnitPrice, Reference = $"PI{(count + 1):D6}", TransactionDate = DateTime.UtcNow, CreatedBy = createdBy });
        }
        // Update supplier balance
        var supplier = await _uow.Suppliers.GetByIdAsync(dto.SupplierId);
        if (supplier is not null) { supplier.Balance += pi.TotalAmount; _uow.Suppliers.Update(supplier); }
        await _uow.SaveChangesAsync();
        await _notif.CreateNotificationAsync("Purchase Invoice Created", $"Invoice {pi.InvoiceNumber} created.", "InvoiceCreated");
        return (await GetPurchaseInvoiceByIdAsync(pi.Id))!;
    }

    public async Task PayPurchaseInvoiceAsync(int id, decimal amount, string paidBy)
    {
        var pi = await _uow.PurchaseInvoices.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        pi.PaidAmount += amount;
        pi.Status = pi.PaidAmount >= pi.TotalAmount ? "Paid" : "PartiallyPaid";
        pi.UpdatedBy = paidBy;
        _uow.PurchaseInvoices.Update(pi);
        var supplier = await _uow.Suppliers.GetByIdAsync(pi.SupplierId);
        if (supplier is not null) { supplier.Balance -= amount; _uow.Suppliers.Update(supplier); }
        await _uow.SaveChangesAsync();
    }

    private static SupplierDto ToSupDto(Supplier s) => new(s.Id, s.SupplierCode, s.SupplierName, s.ContactPerson, s.PhoneNumber, s.Email, s.Address, s.TaxNumber, s.Balance, s.IsActive, s.CreatedDate);
    private static PurchaseInvoiceDto ToPiDto(PurchaseInvoice pi) => new(pi.Id, pi.InvoiceNumber, pi.SupplierId, pi.Supplier?.SupplierName ?? "", pi.InvoiceDate, pi.DueDate, pi.Status, pi.SubTotal, pi.TaxAmount, pi.DiscountAmount, pi.TotalAmount, pi.PaidAmount, pi.Notes, pi.Items.Select(i => new PurchaseInvoiceItemDto(i.ItemId, i.Item?.ItemName ?? "", i.WarehouseId, i.Warehouse?.WarehouseName ?? "", i.Quantity, i.UnitPrice, i.TaxRate, i.Discount, i.Total)).ToList(), pi.CreatedDate);
}

public class SalesService : ISalesService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notif;
    public SalesService(IUnitOfWork uow, INotificationService notif) { _uow = uow; _notif = notif; }

    public async Task<PagedResult<CustomerDto>> GetCustomersAsync(PagedRequest request)
    {
        var query = _uow.Customers.Query();
        if (!string.IsNullOrWhiteSpace(request.Search)) query = query.Where(c => c.CustomerName.Contains(request.Search) || c.CustomerCode.Contains(request.Search));
        var total = await query.CountAsync();
        var items = await query.OrderBy(c => c.CustomerName).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<CustomerDto>(items.Select(ToCustDto), total, request.Page, request.PageSize);
    }

    public async Task<CustomerDto?> GetCustomerByIdAsync(int id) { var c = await _uow.Customers.GetByIdAsync(id); return c is null ? null : ToCustDto(c); }

    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, string createdBy)
    {
        var count = await _uow.Customers.CountAsync();
        var cust = new Customer { CustomerCode = $"CUST{(count + 1):D4}", CustomerName = dto.CustomerName, ContactPerson = dto.ContactPerson, PhoneNumber = dto.PhoneNumber, Email = dto.Email, Address = dto.Address, TaxNumber = dto.TaxNumber, CreatedBy = createdBy };
        await _uow.Customers.AddAsync(cust); await _uow.SaveChangesAsync(); return ToCustDto(cust);
    }

    public async Task<CustomerDto> UpdateCustomerAsync(int id, CreateCustomerDto dto, string updatedBy)
    {
        var cust = await _uow.Customers.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        cust.CustomerName = dto.CustomerName; cust.ContactPerson = dto.ContactPerson; cust.PhoneNumber = dto.PhoneNumber; cust.Email = dto.Email; cust.Address = dto.Address; cust.TaxNumber = dto.TaxNumber; cust.UpdatedBy = updatedBy;
        _uow.Customers.Update(cust); await _uow.SaveChangesAsync(); return ToCustDto(cust);
    }

    public async Task<PagedResult<SalesInvoiceDto>> GetSalesInvoicesAsync(PagedRequest request, string? status)
    {
        var query = _uow.SalesInvoices.Query().Include(si => si.Customer).Include(si => si.Items).ThenInclude(i => i.Item).Include(si => si.Items).ThenInclude(i => i.Warehouse);
        var filtered = query.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) filtered = filtered.Where(si => si.Status == status);
        if (!string.IsNullOrWhiteSpace(request.Search)) filtered = filtered.Where(si => si.InvoiceNumber.Contains(request.Search) || si.Customer.CustomerName.Contains(request.Search));
        var total = await filtered.CountAsync();
        var items = await filtered.OrderByDescending(si => si.InvoiceDate).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<SalesInvoiceDto>(items.Select(ToSiDto), total, request.Page, request.PageSize);
    }

    public async Task<SalesInvoiceDto?> GetSalesInvoiceByIdAsync(int id)
    {
        var si = await _uow.SalesInvoices.Query().Include(si => si.Customer).Include(si => si.Items).ThenInclude(i => i.Item).Include(si => si.Items).ThenInclude(i => i.Warehouse).FirstOrDefaultAsync(si => si.Id == id);
        return si is null ? null : ToSiDto(si);
    }

    public async Task<SalesInvoiceDto> CreateSalesInvoiceAsync(CreateSalesInvoiceDto dto, string createdBy)
    {
        var count = await _uow.SalesInvoices.CountAsync();
        var subTotal = dto.Items.Sum(i => i.Quantity * i.UnitPrice - i.Discount);
        var taxAmount = dto.Items.Sum(i => i.Quantity * i.UnitPrice * i.TaxRate / 100);
        var si = new SalesInvoice
        {
            InvoiceNumber = $"SI{(count + 1):D6}", CustomerId = dto.CustomerId,
            InvoiceDate = dto.InvoiceDate, DueDate = dto.DueDate,
            SubTotal = subTotal, TaxAmount = taxAmount, DiscountAmount = dto.DiscountAmount,
            TotalAmount = subTotal + taxAmount - dto.DiscountAmount,
            Notes = dto.Notes, CreatedBy = createdBy,
            Items = dto.Items.Select(i => new SalesInvoiceItem { ItemId = i.ItemId, WarehouseId = i.WarehouseId, Quantity = i.Quantity, UnitPrice = i.UnitPrice, TaxRate = i.TaxRate, Discount = i.Discount, Total = i.Quantity * i.UnitPrice - i.Discount, CreatedBy = createdBy }).ToList()
        };
        await _uow.SalesInvoices.AddAsync(si);
        // Deduct stock
        foreach (var item in dto.Items)
        {
            var stock = await _uow.WarehouseStocks.Query().FirstOrDefaultAsync(ws => ws.WarehouseId == item.WarehouseId && ws.ItemId == item.ItemId);
            if (stock is null || stock.Quantity < item.Quantity) throw new InvalidOperationException($"Insufficient stock for item {item.ItemId}.");
            stock.Quantity -= item.Quantity; _uow.WarehouseStocks.Update(stock);
            await _uow.StockTransactions.AddAsync(new StockTransaction { ItemId = item.ItemId, WarehouseId = item.WarehouseId, TransactionType = "OUT", Quantity = item.Quantity, UnitCost = item.UnitPrice, Reference = $"SI{(count + 1):D6}", TransactionDate = DateTime.UtcNow, CreatedBy = createdBy });
        }
        var customer = await _uow.Customers.GetByIdAsync(dto.CustomerId);
        if (customer is not null) { customer.Balance += si.TotalAmount; _uow.Customers.Update(customer); }
        await _uow.SaveChangesAsync();
        await _notif.CreateNotificationAsync("Sales Invoice Created", $"Invoice {si.InvoiceNumber} for {si.TotalAmount:C2}.", "InvoiceCreated");
        return (await GetSalesInvoiceByIdAsync(si.Id))!;
    }

    public async Task PaySalesInvoiceAsync(int id, decimal amount, string paidBy)
    {
        var si = await _uow.SalesInvoices.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        si.PaidAmount += amount; si.Status = si.PaidAmount >= si.TotalAmount ? "Paid" : "PartiallyPaid"; si.UpdatedBy = paidBy;
        _uow.SalesInvoices.Update(si);
        var customer = await _uow.Customers.GetByIdAsync(si.CustomerId);
        if (customer is not null) { customer.Balance -= amount; _uow.Customers.Update(customer); }
        await _uow.SaveChangesAsync();
    }

    private static CustomerDto ToCustDto(Customer c) => new(c.Id, c.CustomerCode, c.CustomerName, c.ContactPerson, c.PhoneNumber, c.Email, c.Address, c.TaxNumber, c.Balance, c.IsActive, c.CreatedDate);
    private static SalesInvoiceDto ToSiDto(SalesInvoice si) => new(si.Id, si.InvoiceNumber, si.CustomerId, si.Customer?.CustomerName ?? "", si.InvoiceDate, si.DueDate, si.Status, si.SubTotal, si.TaxAmount, si.DiscountAmount, si.TotalAmount, si.PaidAmount, si.Notes, si.Items.Select(i => new SalesInvoiceItemDto(i.ItemId, i.Item?.ItemName ?? "", i.WarehouseId, i.Warehouse?.WarehouseName ?? "", i.Quantity, i.UnitPrice, i.TaxRate, i.Discount, i.Total)).ToList(), si.CreatedDate);
}
