using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FleetController : ControllerBase
{
    private readonly IFleetService _svc;

    public FleetController(IFleetService svc)
    {
        _svc = svc;
    }

    [HttpGet("ambulances")]
    public async Task<ActionResult<IEnumerable<AmbulanceDto>>> GetAmbulances()
    {
        var ambs = await _svc.GetAmbulancesAsync();
        return Ok(ambs);
    }

    [HttpPost("ambulances")]
    public async Task<ActionResult<AmbulanceDto>> CreateAmbulance([FromBody] CreateAmbulanceDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var amb = await _svc.CreateAmbulanceAsync(dto, userId);
        return Ok(amb);
    }

    [HttpPut("ambulances/{id}/status")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var userId = User.Identity?.Name ?? "system";
        await _svc.UpdateAmbulanceStatusAsync(id, status, userId);
        return NoContent();
    }

    [HttpPost("dispatch")]
    public async Task<ActionResult<AmbulanceDispatchDto>> Dispatch([FromBody] CreateAmbulanceDispatchDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var dispatch = await _svc.DispatchAmbulanceAsync(dto, userId);
        return Ok(dispatch);
    }

    [HttpGet("dispatches")]
    public async Task<ActionResult<PagedResult<AmbulanceDispatchDto>>> GetDispatches([FromQuery] PagedRequest request)
    {
        var dispatches = await _svc.GetDispatchesAsync(request);
        return Ok(dispatches);
    }
}
