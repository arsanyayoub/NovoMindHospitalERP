using System.Security.Claims;
using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RadiologyController : ControllerBase
{
    private readonly IRadiologyService _service;
    private readonly IPdfService _pdf;
    public RadiologyController(IRadiologyService service, IPdfService pdf)
    {
        _service = service;
        _pdf = pdf;
    }

    // ── Tests ──────────────────
    [HttpGet("tests")]
    public async Task<IActionResult> GetTests([FromQuery] PagedRequest request) => Ok(await _service.GetTestsAsync(request));

    [HttpGet("tests/{id}")]
    public async Task<IActionResult> GetTest(int id) { var t = await _service.GetTestByIdAsync(id); return t is null ? NotFound() : Ok(t); }

    [HttpPost("tests")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTest([FromBody] CreateRadiologyTestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateTestAsync(dto, u)); }

    [HttpPut("tests/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTest(int id, [FromBody] CreateRadiologyTestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateTestAsync(id, dto, u)); }

    [HttpDelete("tests/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTest(int id) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.DeleteTestAsync(id, u); return NoContent(); }

    // ── Requests ───────────────
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests([FromQuery] PagedRequest request, [FromQuery] string? status) => Ok(await _service.GetRequestsAsync(request, status));

    [HttpGet("requests/{id}")]
    public async Task<IActionResult> GetRequest(int id) { var r = await _service.GetRequestByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateRadiologyRequestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateRequestAsync(dto, u)); }

    [HttpPut("results/{id}")]
    public async Task<IActionResult> UpdateResult(int id, [FromBody] UpdateRadiologyResultDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateResultAsync(id, dto, u)); }

    [HttpPost("requests/{id}/complete")]
    public async Task<IActionResult> CompleteRequest(int id) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.CompleteRequestAsync(id, u); return Ok(new { message = "Request completed." }); }

    [HttpGet("requests/{id}/pdf")]
    public async Task<IActionResult> DownloadPdf(int id)
    {
        var pdf = await _pdf.GenerateRadiologyReportPdfAsync(id);
        if (pdf == null) return NotFound();
        return File(pdf, "application/pdf", $"RadiologyReport_{id}.pdf");
    }
}
