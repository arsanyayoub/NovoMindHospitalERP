using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportingController : ControllerBase
{
    private readonly IReportingService _reportingService;
    public ReportingController(IReportingService reportingService) => _reportingService = reportingService;

    [HttpGet("patients")]
    public async Task<IActionResult> GetPatientAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetPatientAnalyticsAsync(from, to));
    }

    [HttpGet("appointments")]
    public async Task<IActionResult> GetAppointmentAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetAppointmentAnalyticsAsync(from, to));
    }

    [HttpGet("lab")]
    public async Task<IActionResult> GetLabAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetLabAnalyticsAsync(from, to));
    }

    [HttpGet("radiology")]
    public async Task<IActionResult> GetRadiologyAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetRadiologyAnalyticsAsync(from, to));
    }

    [HttpGet("pharmacy")]
    public async Task<IActionResult> GetPharmacyAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetPharmacyAnalyticsAsync(from, to));
    }

    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventoryAnalytics()
    {
        return Ok(await _reportingService.GetInventoryAnalyticsAsync());
    }

    [HttpGet("hr")]
    public async Task<IActionResult> GetHRAnalytics([FromQuery] int year)
    {
        return Ok(await _reportingService.GetHRAnalyticsAsync(year));
    }

    [HttpGet("beds")]
    public async Task<IActionResult> GetBedAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        return Ok(await _reportingService.GetBedAnalyticsAsync(from, to));
    }
}
