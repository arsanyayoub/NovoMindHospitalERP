using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;
    public PatientsController(IPatientService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request) => Ok(await _service.GetAllAsync(request));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientDto dto)
    {
        var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        var result = await _service.CreateAsync(dto, user);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
    {
        try
        {
            var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
            return Ok(await _service.UpdateAsync(id, dto, user));
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpGet("{id}/appointments")]
    public async Task<IActionResult> GetAppointments(int id) => Ok(await _service.GetPatientAppointmentsAsync(id));

    [HttpGet("{id}/invoices")]
    public async Task<IActionResult> GetInvoices(int id) => Ok(await _service.GetPatientInvoicesAsync(id));
    
    [HttpGet("{id}/vitals")]
    public async Task<IActionResult> GetVitals(int id) => Ok(await _service.GetPatientVitalsAsync(id));

    [HttpGet("{id}/prescriptions")]
    public async Task<IActionResult> GetPrescriptions(int id) => Ok(await _service.GetPatientPrescriptionsAsync(id));

    [HttpGet("{id}/lab-requests")]
    public async Task<IActionResult> GetLabRequests(int id) => Ok(await _service.GetPatientLabRequestsAsync(id));

    [HttpGet("{id}/radiology-requests")]
    public async Task<IActionResult> GetRadiologyRequests(int id) => Ok(await _service.GetPatientRadiologyRequestsAsync(id));
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _service;
    public DoctorsController(IDoctorService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request) => Ok(await _service.GetAllAsync(request));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateDoctorDto dto)
    {
        var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        var result = await _service.CreateAsync(dto, user);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDoctorDto dto)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateAsync(id, dto, u)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpGet("{id}/appointments")]
    public async Task<IActionResult> GetAppointments(int id, [FromQuery] DateTime? date) => Ok(await _service.GetDoctorAppointmentsAsync(id, date));
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;
    public AppointmentsController(IAppointmentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request, [FromQuery] DateTime? date, [FromQuery] int? doctorId, [FromQuery] int? patientId, [FromQuery] string? status)
        => Ok(await _service.GetAllAsync(request, date, doctorId, patientId, status));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday() => Ok(await _service.GetTodayAppointmentsAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentDto dto)
    {
        var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        var result = await _service.CreateAsync(dto, user);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAppointmentDto dto)
    {
        try { var u = User.FindFirstValue(ClaimTypes.Name) ?? "system"; return Ok(await _service.UpdateAsync(id, dto, u)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _service;
    public InvoicesController(IInvoiceService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request, [FromQuery] string? status, [FromQuery] string? type) => Ok(await _service.GetAllAsync(request, status, type));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) { var r = await _service.GetByIdAsync(id); return r is null ? NotFound() : Ok(r); }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.CreateAsync(dto, user));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) { await _service.DeleteAsync(id); return NoContent(); }

    [HttpPost("payment")]
    public async Task<IActionResult> RecordPayment([FromBody] CreatePaymentDto dto)
    {
        var user = User.FindFirstValue(ClaimTypes.Name) ?? "system";
        return Ok(await _service.RecordPaymentAsync(dto, user));
    }

    [HttpGet("{id}/payments")]
    public async Task<IActionResult> GetPayments(int id) => Ok(await _service.GetPaymentsAsync(id));

    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> DownloadPdf(int id, [FromServices] IPdfService pdfService)
    {
        var pdf = await pdfService.GenerateInvoicePdfAsync(id);
        if (pdf == null) return NotFound();
        return File(pdf, "application/pdf", $"Invoice_{id}.pdf");
    }
}
