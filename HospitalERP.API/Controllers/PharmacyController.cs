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
    public async Task<IActionResult> GetPrescriptions([FromQuery] PagedRequest request, [FromQuery] string? status, [FromQuery] int? patientId, [FromQuery] int? admissionId) =>
        Ok(await _service.GetPrescriptionsAsync(request, status, patientId, admissionId));

    [HttpGet("prescriptions/{id}")]
    public async Task<IActionResult> GetPrescription(int id)
    {
        var p = await _service.GetPrescriptionByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost("prescriptions")]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionDto dto)
    {
        return Ok(await _service.CreatePrescriptionAsync(dto));
    }

    [HttpPost("prescriptions/{id}/cancel")]
    public async Task<IActionResult> CancelPrescription(int id)
    {
        await _service.CancelPrescriptionAsync(id);
        return NoContent();
    }

    [HttpGet("pending-dispensing")]
    public async Task<IActionResult> GetPendingDispensing([FromQuery] int? patientId) =>
        Ok(await _service.GetPendingDispensingAsync(patientId));

    [HttpGet("items/{itemId}/available-batches")]
    public async Task<IActionResult> GetAvailableBatches(int itemId) =>
        Ok(await _service.GetAvailableBatchesForItemAsync(itemId));

    [HttpPost("items/{id}/dispense")]
    public async Task<IActionResult> DispenseItem(int id, [FromBody] DispenseItemDto dto)
    {
        var dispensedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        await _service.DispenseItemAsync(id, dto, dispensedBy);
        return NoContent();
    }

    // MAR (Medication Administration Record)
    [HttpGet("mar/{admissionId}")]
    public async Task<IActionResult> GetMAR(int admissionId) =>
        Ok(await _service.GetMedicationAdministrationsAsync(admissionId));

    [HttpPost("mar")]
    public async Task<IActionResult> CreateMAR([FromBody] CreateMedicationAdministrationDto dto)
    {
        var administeredBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.CreateMedicationAdministrationAsync(dto, administeredBy));
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard() => Ok(await _service.GetPharmacyDashboardAsync());

    [HttpPost("check-expiry")]
    public async Task<IActionResult> CheckExpiry()
    {
        await _service.CheckExpiringBatchesAsync();
        return Ok(new { message = "Expiry check completed and notifications sent." });
    }
}
