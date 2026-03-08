using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SupportController : ControllerBase
{
    private readonly ISupportService _supportService;

    public SupportController(ISupportService supportService)
    {
        _supportService = supportService;
    }

    [HttpGet("cssd/batches")]
    public async Task<IActionResult> GetCSSDBatches([FromQuery] PagedRequest request)
    {
        return Ok(await _supportService.GetSterilizationBatchesAsync(request));
    }

    [HttpPost("cssd/batches")]
    public async Task<IActionResult> CreateCSSDBatch(CreateSterilizationBatchDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
        return Ok(await _supportService.CreateSterilizationBatchAsync(dto, userId));
    }

    [HttpGet("mortuary/records")]
    public async Task<IActionResult> GetMortuaryRecords([FromQuery] PagedRequest request)
    {
        return Ok(await _supportService.GetDeceasedRecordsAsync(request));
    }

    [HttpPost("mortuary/records")]
    public async Task<IActionResult> RecordDeath(CreateDeceasedRecordDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
        return Ok(await _supportService.RecordDeathAsync(dto, userId));
    }
}
