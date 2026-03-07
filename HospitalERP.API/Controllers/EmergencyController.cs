using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using System.Security.Claims;

namespace HospitalERP.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmergencyController : ControllerBase
{
    private readonly IEmergencyService _emergency;

    public EmergencyController(IEmergencyService emergency)
    {
        _emergency = emergency;
    }

    [HttpGet("active")]
    public async Task<ActionResult<PagedResult<EmergencyAdmissionDto>>> GetActiveAdmissions([FromQuery] PagedRequest request)
    {
        return Ok(await _emergency.GetActiveAdmissionsAsync(request));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmergencyAdmissionDto>> GetById(int id)
    {
        var admission = await _emergency.GetAdmissionByIdAsync(id);
        if (admission == null) return NotFound();
        return Ok(admission);
    }

    [HttpPost("register")]
    public async Task<ActionResult<EmergencyAdmissionDto>> Register(CreateEmergencyAdmissionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        var admission = await _emergency.RegisterEmergencyAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = admission.Id }, admission);
    }

    [HttpPatch("{id}/triage")]
    public async Task<ActionResult<EmergencyAdmissionDto>> UpdateTriage(int id, TriageUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _emergency.UpdateTriageAsync(id, dto, userId));
    }

    [HttpPatch("{id}/assign-doctor")]
    public async Task<ActionResult<EmergencyAdmissionDto>> AssignDoctor(int id, [FromBody] int doctorId)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _emergency.AssignDoctorAsync(id, doctorId, userId));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<EmergencyAdmissionDto>> UpdateStatus(int id, [FromQuery] string status, [FromQuery] string? disposition, [FromBody] string? notes)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _emergency.UpdateStatusAsync(id, status, disposition, notes, userId));
    }

    [HttpGet("{id}/vitals")]
    public async Task<ActionResult<IEnumerable<ERTriageVitalDto>>> GetVitals(int id)
    {
        return Ok(await _emergency.GetTriageVitalsAsync(id));
    }

    [HttpGet("occupancy")]
    public async Task<ActionResult<EmergencyOccupancyDto>> GetOccupancy()
    {
        return Ok(await _emergency.GetEROccupancyAsync());
    }

    [HttpGet("{id}/treatment")]
    public async Task<ActionResult<ERTreatmentSummaryDto>> GetTreatmentSummary(int id)
    {
        return Ok(await _emergency.GetTreatmentSummaryAsync(id));
    }

    [HttpPost("{id}/transfer-inpatient")]
    public async Task<ActionResult<EmergencyAdmissionDto>> TransferToInpatient(int id, TransferToInpatientDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        try
        {
            return Ok(await _emergency.TransferToInpatientAsync(id, dto, userId));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
