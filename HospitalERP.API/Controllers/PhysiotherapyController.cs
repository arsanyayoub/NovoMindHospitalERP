using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PhysiotherapyController : ControllerBase
{
    private readonly IPhysiotherapyService _svc;

    public PhysiotherapyController(IPhysiotherapyService svc)
    {
        _svc = svc;
    }

    [HttpGet("rehab-plans")]
    public async Task<ActionResult<PagedResult<RehabPlanDto>>> GetPlans([FromQuery] PagedRequest request, [FromQuery] string? status)
    {
        var plans = await _svc.GetRehabPlansAsync(request, status);
        return Ok(plans);
    }

    [HttpPost("rehab-plans")]
    public async Task<ActionResult<RehabPlanDto>> CreatePlan([FromBody] CreateRehabPlanDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var plan = await _svc.CreateRehabPlanAsync(dto, userId);
        return Ok(plan);
    }

    [HttpGet("rehab-plans/{planId}/sessions")]
    public async Task<ActionResult<IEnumerable<PhysiotherapySessionDto>>> GetSessions(int planId)
    {
        var sessions = await _svc.GetSessionsByPlanAsync(planId);
        return Ok(sessions);
    }

    [HttpPost("sessions")]
    public async Task<ActionResult<PhysiotherapySessionDto>> RecordSession([FromBody] CreatePhysiotherapySessionDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var session = await _svc.RecordSessionAsync(dto, userId);
        return Ok(session);
    }
}
