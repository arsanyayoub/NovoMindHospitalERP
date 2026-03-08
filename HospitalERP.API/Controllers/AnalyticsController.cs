using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[Authorize(Roles = "Admin,Accountant")]
[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AnalyticsController(IAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    [HttpGet("executive-dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        return Ok(await _analytics.GetExecutiveDashboardAsync());
    }

    [HttpGet("ward-occupancy")]
    public async Task<IActionResult> GetOccupancy()
    {
        return Ok(await _analytics.GetWardOccupancyAsync());
    }
}
