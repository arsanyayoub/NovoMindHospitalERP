using System.Security.Claims;
using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LabController : ControllerBase
{
    private readonly ILabService _service;
    private readonly IPdfService _pdf;
    public LabController(ILabService service, IPdfService pdf)
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
    public async Task<IActionResult> CreateTest([FromBody] CreateLabTestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateTestAsync(dto, u)); }

    [HttpPut("tests/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTest(int id, [FromBody] CreateLabTestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateTestAsync(id, dto, u)); }

    [HttpDelete("tests/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTest(int id) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.DeleteTestAsync(id, u); return NoContent(); }

    // ── Requests ───────────────
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests([FromQuery] PagedRequest request, [FromQuery] string? status) => Ok(await _service.GetRequestsAsync(request, status));

    [HttpGet("requests/{id}")]
    public async Task<IActionResult> GetRequest(int id) { var r = await _service.GetRequestByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateLabRequestDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.CreateRequestAsync(dto, u)); }

    [HttpPut("results/{id}")]
    public async Task<IActionResult> UpdateResult(int id, [FromBody] UpdateLabResultDto dto) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateResultAsync(id, dto, u)); }

    [HttpPost("requests/{id}/complete")]
    public async Task<IActionResult> CompleteRequest(int id) { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; await _service.CompleteRequestAsync(id, u); return Ok(new { message = "Request completed." }); }
    [HttpGet("requests/{id}/report")]
    public async Task<IActionResult> DownloadReport(int id, [FromServices] IPdfService pdfService)
    {
        var pdf = await pdfService.GenerateLabReportPdfAsync(id);
        return File(pdf, "application/pdf", $"LabReport_{id}.pdf");
    }

    [HttpPatch("requests/{id}/specimen-status")]
    public async Task<IActionResult> UpdateSpecimenStatus(int id, [FromQuery] string status, [FromQuery] string? collectedBy)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        await _service.UpdateSpecimenStatusAsync(id, status, collectedBy, u);
        return Ok(new { message = "Status updated" });
    }

    [HttpPost("tests/{id}/ranges")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddTestRange(int id, [FromBody] CreateLabTestReferenceRangeDto dto)
    {
        var u = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.AddTestRangeAsync(dto with { LabTestId = id }, u));
    }

    [HttpGet("tests/{id}/ranges")]
    public async Task<IActionResult> GetTestRanges(int id) => Ok(await _service.GetTestRangesAsync(id));
}
