using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DietaryController : ControllerBase
{
    private readonly IDietaryService _svc;

    public DietaryController(IDietaryService svc)
    {
        _svc = svc;
    }

    [HttpGet("plan/{patientId}")]
    public async Task<ActionResult<DietPlanDto>> GetPlan(int patientId)
    {
        var plan = await _svc.GetPlanByPatientAsync(patientId);
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    [HttpPost("plan")]
    public async Task<ActionResult<DietPlanDto>> CreatePlan([FromBody] CreateDietPlanDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var plan = await _svc.CreateDietPlanAsync(dto, userId);
        return Ok(plan);
    }

    [HttpGet("meal-orders")]
    public async Task<ActionResult<PagedResult<MealOrderDto>>> GetOrders([FromQuery] PagedRequest request, [FromQuery] string? status)
    {
        var orders = await _svc.GetMealOrdersAsync(request, status);
        return Ok(orders);
    }

    [HttpPost("meal-orders")]
    public async Task<ActionResult<MealOrderDto>> CreateOrder([FromBody] CreateMealOrderDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var order = await _svc.CreateMealOrderAsync(dto, userId);
        return Ok(order);
    }

    [HttpPut("meal-orders/{id}/status")]
    public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var userId = User.Identity?.Name ?? "system";
        await _svc.UpdateMealOrderStatusAsync(id, status, userId);
        return NoContent();
    }
}
