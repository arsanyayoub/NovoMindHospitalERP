using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DentalController : ControllerBase
{
    private readonly IDentalService _svc;

    public DentalController(IDentalService svc)
    {
        _svc = svc;
    }

    [HttpGet("chart/{patientId}")]
    public async Task<ActionResult<DentalChartDto>> GetChart(int patientId)
    {
        var chart = await _svc.GetChartByPatientAsync(patientId);
        if (chart == null) return NotFound();
        return Ok(chart);
    }

    [HttpPost("chart")]
    public async Task<ActionResult<DentalChartDto>> CreateChart([FromBody] CreateDentalChartDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var chart = await _svc.CreateChartAsync(dto, userId);
        return Ok(chart);
    }

    [HttpGet("chart/{chartId}/procedures")]
    public async Task<ActionResult<IEnumerable<DentalProcedureDto>>> GetProcedures(int chartId)
    {
        var procs = await _svc.GetProceduresByChartAsync(chartId);
        return Ok(procs);
    }

    [HttpPost("procedures")]
    public async Task<ActionResult<DentalProcedureDto>> RecordProcedure([FromBody] CreateDentalProcedureDto dto)
    {
        var userId = User.Identity?.Name ?? "system";
        var proc = await _svc.RecordProcedureAsync(dto, userId);
        return Ok(proc);
    }

    [HttpGet("orthodontic-cases")]
    public async Task<ActionResult<PagedResult<OrthodonticCaseDto>>> GetOrthodonticCases([FromQuery] PagedRequest request)
    {
        var cases = await _svc.GetOrthodonticCasesAsync(request);
        return Ok(cases);
    }
}
