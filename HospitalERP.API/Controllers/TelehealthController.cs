using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TelehealthController : ControllerBase
{
    private readonly ITelehealthService _telehealthService;

    public TelehealthController(ITelehealthService telehealthService)
    {
        _telehealthService = telehealthService;
    }

    [HttpPost("generate-link/{appointmentId}")]
    public async Task<IActionResult> GenerateLink(int appointmentId)
    {
        var link = await _telehealthService.GenerateMeetingLinkAsync(appointmentId);
        return Ok(new { link });
    }

    [HttpPatch("waiting-room/{appointmentId}")]
    public async Task<IActionResult> UpdateStatus(int appointmentId, [FromBody] string status)
    {
        await _telehealthService.UpdateWaitingRoomStatusAsync(appointmentId, status);
        return NoContent();
    }
}
