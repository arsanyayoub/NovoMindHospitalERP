using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReferralController : ControllerBase
{
    private readonly IReferralService _referralService;

    public ReferralController(IReferralService referralService)
    {
        _referralService = referralService;
    }

    [HttpGet("facilities")]
    public async Task<IActionResult> GetFacilities() => Ok(await _referralService.GetFacilitiesAsync());

    [HttpPost("facilities")]
    public async Task<IActionResult> CreateFacility(CreateReferralFacilityDto dto) => Ok(await _referralService.CreateFacilityAsync(dto));

    [HttpGet]
    public async Task<IActionResult> GetReferrals([FromQuery] PagedRequest request) => Ok(await _referralService.GetReferralsAsync(request));

    [HttpPost]
    public async Task<IActionResult> CreateReferral(CreateExternalReferralDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
        return Ok(await _referralService.CreateReferralAsync(dto, userId));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        await _referralService.UpdateReferralStatusAsync(id, status);
        return NoContent();
    }

    [HttpPost("hie/export")]
    public async Task<IActionResult> ExportHieData(HieExportDto dto) => Ok(await _referralService.ExportReferralDataAsync(dto));

    [HttpGet("{id}/exchange-history")]
    public async Task<IActionResult> GetExchangeHistory(int id) => Ok(await _referralService.GetExchangeHistoryAsync(id));
}
