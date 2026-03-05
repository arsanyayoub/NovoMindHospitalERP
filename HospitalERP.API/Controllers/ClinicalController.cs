using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalERP.Application.Interfaces;
using HospitalERP.Application.DTOs;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClinicalController : ControllerBase
{
    private readonly IClinicalService _service;
    private readonly IPdfService _pdf;
    public ClinicalController(IClinicalService service, IPdfService pdf)
    {
        _service = service;
        _pdf = pdf;
    }

    [HttpGet("vitals")]
    public async Task<IActionResult> GetVitals([FromQuery] PagedRequest request, [FromQuery] int? patientId, [FromQuery] int? admissionId) =>
        Ok(await _service.GetVitalsAsync(request, patientId, admissionId));

    [HttpPost("vitals")]
    public async Task<IActionResult> CreateVital([FromBody] CreatePatientVitalDto dto)
    {
        var recordedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.CreateVitalAsync(dto, recordedBy));
    }

    [HttpDelete("vitals/{id}")]
    public async Task<IActionResult> DeleteVital(int id)
    {
        var deletedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        await _service.DeleteVitalAsync(id, deletedBy);
        return NoContent();
    }

    [HttpGet("encounters")]
    public async Task<IActionResult> GetEncounters([FromQuery] PagedRequest request, [FromQuery] int? patientId, [FromQuery] int? doctorId) =>
        Ok(await _service.GetEncountersAsync(request, patientId, doctorId));

    [HttpGet("encounters/{id}")]
    public async Task<IActionResult> GetEncounter(int id)
    {
        var e = await _service.GetEncounterByIdAsync(id);
        return e == null ? NotFound() : Ok(e);
    }

    [HttpPost("encounters")]
    public async Task<IActionResult> CreateEncounter([FromBody] CreateClinicalEncounterDto dto)
    {
        var createdBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.CreateEncounterAsync(dto, createdBy));
    }

    [HttpPut("encounters/{id}")]
    public async Task<IActionResult> UpdateEncounter(int id, [FromBody] CreateClinicalEncounterDto dto)
    {
        var updatedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.UpdateEncounterAsync(id, dto, updatedBy));
    }

    [HttpDelete("encounters/{id}")]
    public async Task<IActionResult> DeleteEncounter(int id)
    {
        var deletedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        await _service.DeleteEncounterAsync(id, deletedBy);
        return NoContent();
    }

    // Nursing Assessments
    [HttpGet("nursing-assessments/{admissionId}")]
    public async Task<IActionResult> GetNursingAssessments(int admissionId) =>
        Ok(await _service.GetNursingAssessmentsAsync(admissionId));

    [HttpPost("nursing-assessments")]
    public async Task<IActionResult> CreateNursingAssessment([FromBody] CreateInpatientNursingAssessmentDto dto)
    {
        var recordedBy = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        return Ok(await _service.CreateNursingAssessmentAsync(dto, recordedBy));
    }

    // EMR Export
    [HttpGet("export/{patientId}")]
    public async Task<IActionResult> ExportEMR(int patientId, [FromQuery] int? admissionId)
    {
        var pdf = await _pdf.GenerateEmrPdfAsync(patientId, admissionId);
        return File(pdf, "application/pdf", $"EMR_{patientId}_{DateTime.Now:yyyyMMdd}.pdf");
    }
}
