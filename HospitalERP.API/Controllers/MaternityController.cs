using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MaternityController : ControllerBase
{
    private readonly IMaternityService _maternity;
    public MaternityController(IMaternityService maternity) => _maternity = maternity;

    // ── Pregnancy ──────────────────────────────────────────────────
    [HttpGet("pregnancies")]
    public async Task<ActionResult<PagedResult<PregnancyRecordDto>>> GetPregnancies([FromQuery] PagedRequest request, string? status)
        => Ok(await _maternity.GetPregnanciesAsync(request, status));

    [HttpPost("pregnancies")]
    public async Task<ActionResult<PregnancyRecordDto>> CreatePregnancy(CreatePregnancyRecordDto dto)
        => Ok(await _maternity.CreatePregnancyAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    // ── Delivery ───────────────────────────────────────────────────
    [HttpPost("deliveries")]
    public async Task<ActionResult<DeliveryRecordDto>> RecordDelivery(CreateDeliveryRecordDto dto)
        => Ok(await _maternity.RecordDeliveryAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpGet("pregnancies/{id}/deliveries")]
    public async Task<ActionResult<IEnumerable<DeliveryRecordDto>>> GetDeliveries(int id)
        => Ok(await _maternity.GetDeliveriesByPregnancyAsync(id));

    // ── Neonatal ───────────────────────────────────────────────────
    [HttpPost("births")]
    public async Task<ActionResult<NeonatalRecordDto>> RecordBirth(CreateNeonatalRecordDto dto)
        => Ok(await _maternity.RecordBirthAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpGet("neonatal")]
    public async Task<ActionResult<PagedResult<NeonatalRecordDto>>> GetNeonatalRecords([FromQuery] PagedRequest request, string? gender)
        => Ok(await _maternity.GetNeonatalRecordsAsync(request, gender));
}
