using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BloodBankController : ControllerBase
{
    private readonly IBloodBankService _bloodBank;
    public BloodBankController(IBloodBankService bloodBank) => _bloodBank = bloodBank;

    // ── Donors ──────────────────────────────────────────────────────
    [HttpGet("donors")]
    public async Task<ActionResult<PagedResult<BloodDonorDto>>> GetDonors([FromQuery] PagedRequest request, string? bloodGroup)
        => Ok(await _bloodBank.GetDonorsAsync(request, bloodGroup));

    [HttpGet("donors/{id}")]
    public async Task<ActionResult<BloodDonorDto>> GetDonor(int id)
    {
        var d = await _bloodBank.GetDonorByIdAsync(id);
        return d == null ? NotFound() : Ok(d);
    }

    [HttpPost("donors")]
    public async Task<ActionResult<BloodDonorDto>> CreateDonor(CreateBloodDonorDto dto)
        => Ok(await _bloodBank.CreateDonorAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpPut("donors/{id}")]
    public async Task<ActionResult<BloodDonorDto>> UpdateDonor(int id, CreateBloodDonorDto dto)
        => Ok(await _bloodBank.UpdateDonorAsync(id, dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    // ── Donations ────────────────────────────────────────────────────
    [HttpGet("donations")]
    public async Task<ActionResult<PagedResult<BloodDonationDto>>> GetDonations([FromQuery] PagedRequest request, int? donorId)
        => Ok(await _bloodBank.GetDonationsAsync(request, donorId));

    [HttpPost("donations")]
    public async Task<ActionResult<BloodDonationDto>> RecordDonation(CreateBloodDonationDto dto)
        => Ok(await _bloodBank.RecordDonationAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    // ── Stock ────────────────────────────────────────────────────────
    [HttpGet("stock")]
    public async Task<ActionResult<PagedResult<BloodStockDto>>> GetStock([FromQuery] PagedRequest request, string? bloodGroup, string? component, string? status)
        => Ok(await _bloodBank.GetStockAsync(request, bloodGroup, component, status));

    [HttpPatch("stock/{id}/status")]
    public async Task<ActionResult<BloodStockDto>> UpdateStockStatus(int id, [FromBody] UpdateStockStatusRequest req)
        => Ok(await _bloodBank.UpdateStockStatusAsync(id, req.Status, req.StorageLocation, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    // ── Requests ──────────────────────────────────────────────────────
    [HttpGet("requests")]
    public async Task<ActionResult<PagedResult<BloodRequestDto>>> GetRequests([FromQuery] PagedRequest request, string? status)
        => Ok(await _bloodBank.GetRequestsAsync(request, status));

    [HttpPost("requests")]
    public async Task<ActionResult<BloodRequestDto>> CreateRequest(CreateBloodRequestDto dto)
        => Ok(await _bloodBank.CreateRequestAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpPatch("requests/{id}/status")]
    public async Task<ActionResult<BloodRequestDto>> UpdateRequestStatus(int id, [FromBody] string status)
        => Ok(await _bloodBank.UpdateRequestAsync(id, status, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));
}

public record UpdateStockStatusRequest(string Status, string? StorageLocation);
