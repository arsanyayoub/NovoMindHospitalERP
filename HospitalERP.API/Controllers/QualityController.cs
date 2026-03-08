using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QualityController : ControllerBase
{
    private readonly IQualityService _quality;

    public QualityController(IQualityService quality)
    {
        _quality = quality;
    }

    [HttpGet("incidents")]
    public async Task<IActionResult> GetIncidents([FromQuery] PagedRequest request, string? severity = null)
    {
        return Ok(await _quality.GetIncidentsAsync(request, severity));
    }

    [HttpPost("incidents")]
    public async Task<IActionResult> ReportIncident(CreateClinicalIncidentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        return Ok(await _quality.ReportIncidentAsync(dto, userId));
    }

    [HttpGet("feedback")]
    public async Task<IActionResult> GetFeedback([FromQuery] PagedRequest request)
    {
        return Ok(await _quality.GetFeedbackAsync(request));
    }

    [HttpPost("feedback")]
    public async Task<IActionResult> RecordFeedback(CreatePatientFeedbackDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        return Ok(await _quality.RecordFeedbackAsync(dto, userId));
    }
}
