using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize(Roles = "Patient")]
[ApiController]
[Route("api/[controller]")]
public class PatientPortalController : ControllerBase
{
    private readonly IPatientPortalService _portal;

    public PatientPortalController(IPatientPortalService portal)
    {
        _portal = portal;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var patientIdStr = User.FindFirstValue("PatientId");
        if (string.IsNullOrEmpty(patientIdStr)) return BadRequest("Not a patient account");
        return Ok(await _portal.GetProfileAsync(int.Parse(patientIdStr)));
    }

    [HttpGet("appointments")]
    public async Task<IActionResult> GetAppointments()
    {
        var patientIdStr = User.FindFirstValue("PatientId");
        if (string.IsNullOrEmpty(patientIdStr)) return BadRequest("Not a patient account");
        return Ok(await _portal.GetAppointmentHistoryAsync(int.Parse(patientIdStr)));
    }

    [HttpGet("export-clinical-summary")]
    public async Task<IActionResult> ExportSummary()
    {
        var patientIdStr = User.FindFirstValue("PatientId");
        if (string.IsNullOrEmpty(patientIdStr)) return BadRequest("Not a patient account");
        
        var pdf = await _portal.ExportClinicalSummaryAsync(int.Parse(patientIdStr));
        return File(pdf, "application/pdf", "ClinicalSummary.pdf");
    }
}
