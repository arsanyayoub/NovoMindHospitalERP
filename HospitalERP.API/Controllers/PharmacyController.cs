using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalERP.Application.Interfaces;
using HospitalERP.Application.DTOs;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PharmacyController : ControllerBase
{
    private readonly IPharmacyService _service;
    public PharmacyController(IPharmacyService service) => _service = service;

    [HttpGet("prescriptions")]
    public async Task<IActionResult> GetPrescriptions([FromQuery] PagedRequest request, [FromQuery] string? status) =>
        Ok(await _service.GetPrescriptionsAsync(request, status));

    [HttpGet("prescriptions/{id}")]
    public async Task<IActionResult> GetPrescription(int id)
    {
        var p = await _service.GetPrescriptionByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost("prescriptions")]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionDto dto)
    {
        var createdBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.CreatePrescriptionAsync(dto, createdBy));
    }

    [HttpPost("prescriptions/{id}/cancel")]
    public async Task<IActionResult> CancelPrescription(int id)
    {
        var updatedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        await _service.CancelPrescriptionAsync(id, updatedBy);
        return NoContent();
    }

    [HttpGet("pending-dispensing")]
    public async Task<IActionResult> GetPendingDispensing([FromQuery] int? patientId) =>
        Ok(await _service.GetPendingDispensingAsync(patientId));

    [HttpPost("items/{id}/dispense")]
    public async Task<IActionResult> DispenseItem(int id, [FromBody] DispenseItemDto dto)
    {
        var dispensedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        await _service.DispenseItemAsync(id, dto, dispensedBy);
        return NoContent();
    }
}
