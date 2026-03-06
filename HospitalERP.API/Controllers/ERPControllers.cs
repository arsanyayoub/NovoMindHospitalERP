using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountingController : ControllerBase
{
    private readonly IAccountingService _service;
    public AccountingController(IAccountingService service) => _service = service;

    [HttpGet("accounts")]
    public async Task<IActionResult> GetChartOfAccounts() => Ok(await _service.GetChartOfAccountsAsync());

    [HttpGet("accounts/{id}")]
    public async Task<IActionResult> GetAccount(int id) { var r = await _service.GetAccountByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("accounts")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.CreateAccountAsync(dto, u));
    }

    [HttpPut("accounts/{id}")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> UpdateAccount(int id, [FromBody] CreateAccountDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.UpdateAccountAsync(id, dto, u));
    }

    [HttpGet("journal-entries")]
    public async Task<IActionResult> GetJournalEntries([FromQuery] PagedRequest request, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        => Ok(await _service.GetJournalEntriesAsync(request, from, to));

    [HttpGet("journal-entries/{id}")]
    public async Task<IActionResult> GetJournalEntry(int id) { var r = await _service.GetJournalEntryByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("journal-entries")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> CreateJournalEntry([FromBody] CreateJournalEntryDto dto)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateJournalEntryAsync(dto, u)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("journal-entries/{id}/post")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> PostJournalEntry(int id)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.PostJournalEntryAsync(id, u); return Ok(new { message = "Entry posted successfully." }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("reports/financial")]
    public async Task<IActionResult> GetFinancialReport([FromQuery] DateTime from, [FromQuery] DateTime to)
        => Ok(await _service.GetFinancialReportAsync(from, to));

    [HttpGet("reports/trial-balance")]
    public async Task<IActionResult> GetTrialBalance([FromQuery] DateTime asOf)
        => Ok(await _service.GetTrialBalanceAsync(asOf));
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;
    private readonly IPdfService _pdfService;
    public InventoryController(IInventoryService service, IPdfService pdfService) 
    { 
        _service = service; 
        _pdfService = pdfService;
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetItems([FromQuery] PagedRequest request) => Ok(await _service.GetItemsAsync(request));

    [HttpGet("items/{id}")]
    public async Task<IActionResult> GetItem(int id) { var r = await _service.GetItemByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("items")]
    public async Task<IActionResult> CreateItem([FromBody] CreateItemDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateItemAsync(dto, u)); }

    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] CreateItemDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateItemAsync(id, dto, u)); }

    [HttpDelete("items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        await _service.DeleteItemAsync(id, u);
        return NoContent();
    }

    [HttpGet("warehouses")]
    public async Task<IActionResult> GetWarehouses() => Ok(await _service.GetWarehousesAsync());

    [HttpPost("warehouses")]
    public async Task<IActionResult> CreateWarehouse([FromBody] CreateWarehouseDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateWarehouseAsync(dto, u)); }

    [HttpGet("stock")]
    public async Task<IActionResult> GetStock([FromQuery] int? warehouseId, [FromQuery] int? itemId) => Ok(await _service.GetStockAsync(warehouseId, itemId));

    [HttpGet("stock/low")]
    public async Task<IActionResult> GetLowStock() => Ok(await _service.GetLowStockItemsAsync());

    [HttpPost("stock/transfer")]
    public async Task<IActionResult> Transfer([FromBody] StockTransferDto dto)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.TransferStockAsync(dto, u); return Ok(new { message = "Stock transferred successfully." }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // ---------- Packaging Units ----------
    [HttpGet("items/{itemId}/packaging-units")]
    public async Task<IActionResult> GetPackagingUnits(int itemId) => Ok(await _service.GetItemPackagingUnitsAsync(itemId));

    [HttpPost("packaging-units")]
    public async Task<IActionResult> CreatePackagingUnit([FromBody] CreateItemPackagingUnitDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.CreateItemPackagingUnitAsync(dto, u));
    }

    [HttpDelete("packaging-units/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePackagingUnit(int id)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        await _service.DeleteItemPackagingUnitAsync(id, u);
        return NoContent();
    }

    // ---------- Batches ----------
    [HttpGet("batches")]
    public async Task<IActionResult> GetBatches([FromQuery] PagedRequest request, [FromQuery] int? itemId, [FromQuery] int? warehouseId, [FromQuery] bool? excludeExpired, [FromQuery] bool? excludeExhausted)
        => Ok(await _service.GetBatchesAsync(request, itemId, warehouseId, excludeExpired, excludeExhausted));

    [HttpGet("batches/{id}")]
    public async Task<IActionResult> GetBatch(int id) { var b = await _service.GetBatchByIdAsync(id); return b is null ? NotFound() : Ok(b); }

    [HttpPost("batches")]
    public async Task<IActionResult> CreateBatch([FromBody] CreateItemBatchDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.CreateBatchAsync(dto, u));
    }

    [HttpPut("batches/{id}")]
    public async Task<IActionResult> UpdateBatch(int id, [FromBody] UpdateItemBatchDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.UpdateBatchAsync(id, dto, u));
    }

    [HttpDelete("batches/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBatch(int id)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        await _service.DeleteBatchAsync(id, u);
        return NoContent();
    }

    // ---------- Reports ----------
    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] int? itemId, [FromQuery] int? warehouseId,
        [FromQuery] string? type, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        => Ok(await _service.GetStockTransactionsAsync(itemId, warehouseId, type, from, to));

    // ---------- Scanning ----------
    [HttpGet("scan")]
    public async Task<IActionResult> ScanBarcode([FromQuery] string barcode, [FromQuery] int? warehouseId)
        => Ok(await _service.ScanBarcodeAsync(barcode, warehouseId));

    [HttpGet("reports/pdf")]
    public async Task<IActionResult> GetInventoryPdf([FromQuery] int? warehouseId, [FromQuery] string? status)
    {
        var pdf = await _pdfService.GenerateInventoryReportPdfAsync(warehouseId, status);
        return File(pdf, "application/pdf", $"Inventory_Report_{DateTime.Now:yyyyMMdd}.pdf");
    }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PurchaseController : ControllerBase
{
    private readonly IPurchaseService _service;
    public PurchaseController(IPurchaseService service) => _service = service;

    [HttpGet("suppliers")]
    public async Task<IActionResult> GetSuppliers([FromQuery] PagedRequest request) => Ok(await _service.GetSuppliersAsync(request));

    [HttpGet("suppliers/{id}")]
    public async Task<IActionResult> GetSupplier(int id) { var r = await _service.GetSupplierByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("suppliers")]
    public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateSupplierAsync(dto, u)); }

    [HttpPut("suppliers/{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, [FromBody] CreateSupplierDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateSupplierAsync(id, dto, u)); }

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices([FromQuery] PagedRequest request, [FromQuery] string? status) => Ok(await _service.GetPurchaseInvoicesAsync(request, status));

    [HttpGet("invoices/{id}")]
    public async Task<IActionResult> GetInvoice(int id) { var r = await _service.GetPurchaseInvoiceByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreatePurchaseInvoiceDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreatePurchaseInvoiceAsync(dto, u)); }

    [HttpPost("invoices/{id}/pay")]
    public async Task<IActionResult> PayInvoice(int id, [FromBody] decimal amount) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.PayPurchaseInvoiceAsync(id, amount, u); return Ok(new { message = "Payment recorded." }); }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISalesService _service;
    public SalesController(ISalesService service) => _service = service;

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers([FromQuery] PagedRequest request) => Ok(await _service.GetCustomersAsync(request));

    [HttpGet("customers/{id}")]
    public async Task<IActionResult> GetCustomer(int id) { var r = await _service.GetCustomerByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("customers")]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateCustomerAsync(dto, u)); }

    [HttpPut("customers/{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CreateCustomerDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateCustomerAsync(id, dto, u)); }

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices([FromQuery] PagedRequest request, [FromQuery] string? status) => Ok(await _service.GetSalesInvoicesAsync(request, status));

    [HttpGet("invoices/{id}")]
    public async Task<IActionResult> GetInvoice(int id) { var r = await _service.GetSalesInvoiceByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateSalesInvoiceDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateSalesInvoiceAsync(dto, u)); }

    [HttpPost("invoices/{id}/pay")]
    public async Task<IActionResult> PayInvoice(int id, [FromBody] decimal amount) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.PaySalesInvoiceAsync(id, amount, u); return Ok(new { message = "Payment recorded." }); }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HRController : ControllerBase
{
    private readonly IHRService _service;
    public HRController(IHRService service) => _service = service;

    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployees([FromQuery] PagedRequest request) => Ok(await _service.GetEmployeesAsync(request));

    [HttpGet("employees/{id}")]
    public async Task<IActionResult> GetEmployee(int id) { var r = await _service.GetEmployeeByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("employees")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateEmployeeAsync(dto, u)); }

    [HttpPut("employees/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] CreateEmployeeDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateEmployeeAsync(id, dto, u)); }

    [HttpDelete("employees/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        await _service.DeleteEmployeeAsync(id, u);
        return NoContent();
    }

    [HttpGet("payrolls")]
    public async Task<IActionResult> GetPayrolls([FromQuery] PagedRequest request, [FromQuery] int? year, [FromQuery] int? month) => Ok(await _service.GetPayrollsAsync(request, year, month));

    [HttpPost("payrolls")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> GeneratePayroll([FromBody] CreatePayrollDto dto)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.GeneratePayrollAsync(dto, u)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("payrolls/bulk")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> BulkGeneratePayroll([FromQuery] int year, [FromQuery] int month)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.BulkGeneratePayrollAsync(year, month, u));
    }

    [HttpPost("payrolls/{id}/pay")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<IActionResult> ProcessPayroll(int id) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.ProcessPayrollPaymentAsync(id, u); return Ok(new { message = "Payroll processed." }); }

    // ---------- Attendance ----------
    [HttpGet("attendance")]
    public async Task<IActionResult> GetAttendance([FromQuery] PagedRequest request, [FromQuery] int? employeeId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        => Ok(await _service.GetAttendanceRecordsAsync(request, employeeId, fromDate, toDate));

    [HttpPost("attendance")]
    public async Task<IActionResult> RecordAttendance([FromBody] CreateAttendanceRecordDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.RecordAttendanceAsync(dto, u));
    }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _service.GetDashboardAsync());
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;
    public NotificationsController(INotificationService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _service.GetUserNotificationsAsync(userId));
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(new { count = await _service.GetUnreadCountAsync(userId) });
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id) { await _service.MarkAsReadAsync(id); return Ok(); }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _service.MarkAllAsReadAsync(userId);
        return Ok();
    }
}
