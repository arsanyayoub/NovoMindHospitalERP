using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AssetController : ControllerBase
{
    private readonly IAssetService _service;
    public AssetController(IAssetService service) => _service = service;

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";

    [HttpGet]
    public async Task<IActionResult> GetAssets([FromQuery] PagedRequest request, [FromQuery] string? category, [FromQuery] string? status, [FromQuery] bool? isBioMedical)
        => Ok(await _service.GetAssetsAsync(request, category, status, isBioMedical));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsset(int id) { var r = await _service.GetAssetByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost]
    [Authorize(Roles = "Admin,BioMedical")]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto dto) => Ok(await _service.CreateAssetAsync(dto, GetUserId()));

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,BioMedical")]
    public async Task<IActionResult> UpdateAsset(int id, [FromBody] CreateAssetDto dto) => Ok(await _service.UpdateAssetAsync(id, dto, GetUserId()));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsset(int id) { await _service.DeleteAssetAsync(id, GetUserId()); return NoContent(); }

    // --- Maintenance Tickets ---
    [HttpGet("tickets")]
    public async Task<IActionResult> GetTickets([FromQuery] PagedRequest request, [FromQuery] int? assetId, [FromQuery] string? status, [FromQuery] string? type)
        => Ok(await _service.GetMaintenanceTicketsAsync(request, assetId, status, type));

    [HttpGet("tickets/{id}")]
    public async Task<IActionResult> GetTicket(int id) { var r = await _service.GetTicketByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost("tickets")]
    public async Task<IActionResult> CreateTicket([FromBody] CreateMaintenanceTicketDto dto) => Ok(await _service.CreateTicketAsync(dto, GetUserId()));

    [HttpPatch("tickets/{id}/status")]
    public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] UpdateMaintenanceTicketDto dto) => Ok(await _service.UpdateTicketStatusAsync(id, dto, GetUserId()));
}
