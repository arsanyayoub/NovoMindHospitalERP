using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SupplyAndPharmacyController : ControllerBase
{
    private readonly IAdvancedSupplyService _supplyService;

    public SupplyAndPharmacyController(IAdvancedSupplyService supplyService)
    {
        _supplyService = supplyService;
    }

    private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

    [HttpGet("purchase-orders")]
    public async Task<IActionResult> GetPurchaseOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var req = new PagedRequest { Page = page, PageSize = pageSize };
        var pos = await _supplyService.GetPurchaseOrdersAsync(req);
        return Ok(pos);
    }

    [HttpPost("purchase-orders")]
    public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderDto dto)
    {
        var po = await _supplyService.CreatePurchaseOrderAsync(dto, UserId);
        return Ok(po);
    }

    [HttpPut("purchase-orders/{id}/status")]
    public async Task<IActionResult> UpdatePurchaseOrderStatus(int id, [FromBody] string status)
    {
        await _supplyService.UpdatePurchaseOrderStatusAsync(id, status, UserId);
        return Ok(new { message = "Status updated" });
    }

    [HttpGet("ward-stock/{wardId}")]
    public async Task<IActionResult> GetWardStockDispensations(int wardId)
    {
        var stocks = await _supplyService.GetWardStockDispensationsAsync(wardId);
        return Ok(stocks);
    }

    [HttpPost("ward-stock")]
    public async Task<IActionResult> DispenseWardStock([FromBody] CreateWardStockDispensationDto dto)
    {
        var stock = await _supplyService.DispenseWardStockAsync(dto, UserId);
        return Ok(stock);
    }
}
