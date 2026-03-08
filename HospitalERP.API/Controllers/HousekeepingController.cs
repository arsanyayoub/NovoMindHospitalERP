using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HousekeepingController : ControllerBase
{
    private readonly IHousekeepingService _housekeeping;

    public HousekeepingController(IHousekeepingService housekeeping)
    {
        _housekeeping = housekeeping;
    }

    [HttpGet("tasks")]
    public async Task<IActionResult> GetTasks([FromQuery] PagedRequest request, string? status = null)
    {
        return Ok(await _housekeeping.GetTasksAsync(request, status));
    }

    [HttpPost("tasks")]
    public async Task<IActionResult> CreateTask(CreateHousekeepingTaskDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        return Ok(await _housekeeping.CreateTaskAsync(dto, userId));
    }

    [HttpPut("tasks/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        await _housekeeping.UpdateTaskStatusAsync(id, status, userId);
        return NoContent();
    }
}
