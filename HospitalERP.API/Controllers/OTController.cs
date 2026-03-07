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
    private readonly ISurgeryBillingService _billingService;

    public OTController(IOTService service, ISurgeryBillingService billingService)
    {
        _service = service;
        _billingService = billingService;
    }

    [HttpPost("surgeries/{id}/finalize-bill")]
    public async Task<IActionResult> FinalizeBill(int id)
    {
        var invoiceId = await _billingService.GenerateSurgeryBillAsync(id, User.Identity?.Name ?? "system");
        return Ok(new { InvoiceId = invoiceId });
    }

    [HttpGet("operating-theaters")]
    public async Task<IActionResult> GetOperatingTheaters() =>
        Ok(await _service.GetOperatingTheatersAsync());

    [HttpPost("operating-theaters")]
    public async Task<IActionResult> CreateOperatingTheater([FromBody] CreateOperatingTheaterDto dto) =>
        Ok(await _service.CreateOperatingTheaterAsync(dto, User.Identity?.Name ?? "system"));

    [HttpPatch("operating-theaters/{id}/status")]
    public async Task<IActionResult> UpdateOTStatus(int id, [FromQuery] string status)
    {
        await _service.UpdateOTStatusAsync(id, status, User.Identity?.Name ?? "system");
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
        Ok(await _service.ScheduleSurgeryAsync(dto, User.Identity?.Name ?? "system"));

    [HttpPatch("surgeries/{id}/status")]
    public async Task<IActionResult> UpdateSurgeryStatus(int id, [FromQuery] string status, [FromQuery] string? postOpDiagnosis, [FromQuery] string? notes)
    {
        await _service.UpdateSurgeryStatusAsync(id, status, postOpDiagnosis, notes, User.Identity?.Name ?? "system");
        return NoContent();
    }

    [HttpPost("surgeries/{id}/cancel")]
    public async Task<IActionResult> CancelSurgery(int id, [FromQuery] string reason)
    {
        await _service.CancelSurgeryAsync(id, reason, User.Identity?.Name ?? "system");
        return NoContent();
    }

    // Resource Tracking
    [HttpGet("surgeries/{id}/resources")]
    public async Task<IActionResult> GetSurgeryResources(int id) => Ok(await _service.GetSurgeryResourcesAsync(id));

    [HttpPost("surgeries/{id}/resources")]
    public async Task<IActionResult> AddSurgeryResource(int id, [FromBody] CreateSurgeryResourceDto dto)
    {
        await _service.AddSurgeryResourceAsync(id, dto, User.Identity?.Name ?? "system");
        return NoContent();
    }

    [HttpDelete("resources/{id}")]
    public async Task<IActionResult> RemoveSurgeryResource(int id)
    {
        await _service.RemoveSurgeryResourceAsync(id, User.Identity?.Name ?? "system");
        return NoContent();
    }

    [HttpGet("surgeries/{id}/checklist")]
    public async Task<ActionResult<IEnumerable<SurgeryChecklistDto>>> GetChecklists(int id)
    {
        return Ok(await _service.GetSurgeryChecklistsAsync(id));
    }

    [HttpPost("surgeries/{id}/checklist")]
    public async Task<IActionResult> SaveChecklist(int id, CreateSurgeryChecklistDto dto)
    {
        await _service.SaveChecklistAsync(id, dto, User.Identity?.Name ?? "system");
        return Ok();
    }
}

