using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalERP.Application.Interfaces;
using HospitalERP.Application.DTOs;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OTController : ControllerBase
{
    private readonly IOTService _service;

    public OTController(IOTService service)
    {
        _service = service;
    }

    [HttpGet("operating-theaters")]
    public async Task<IActionResult> GetOperatingTheaters() =>
        Ok(await _service.GetOperatingTheatersAsync());

    [HttpPost("operating-theaters")]
    public async Task<IActionResult> CreateOperatingTheater([FromBody] CreateOperatingTheaterDto dto) =>
        Ok(await _service.CreateOperatingTheaterAsync(dto));

    [HttpPatch("operating-theaters/{id}/status")]
    public async Task<IActionResult> UpdateOTStatus(int id, [FromQuery] string status)
    {
        await _service.UpdateOTStatusAsync(id, status);
        return NoContent();
    }

    [HttpGet("surgeries")]
    public async Task<IActionResult> GetScheduledSurgeries([FromQuery] PagedRequest request, [FromQuery] string? status, [FromQuery] int? otId) =>
        Ok(await _service.GetScheduledSurgeriesAsync(request, status, otId));

    [HttpGet("surgeries/{id}")]
    public async Task<IActionResult> GetSurgery(int id)
    {
        var s = await _service.GetSurgeryByIdAsync(id);
        return s == null ? NotFound() : Ok(s);
    }

    [HttpPost("surgeries")]
    public async Task<IActionResult> ScheduleSurgery([FromBody] CreateScheduledSurgeryDto dto) =>
        Ok(await _service.ScheduleSurgeryAsync(dto));

    [HttpPatch("surgeries/{id}/status")]
    public async Task<IActionResult> UpdateSurgeryStatus(int id, [FromQuery] string status, [FromQuery] string? postOpDiagnosis, [FromQuery] string? notes)
    {
        await _service.UpdateSurgeryStatusAsync(id, status, postOpDiagnosis, notes);
        return NoContent();
    }

    [HttpPost("surgeries/{id}/cancel")]
    public async Task<IActionResult> CancelSurgery(int id, [FromQuery] string reason)
    {
        await _service.CancelSurgeryAsync(id, reason);
        return NoContent();
    }
}
