using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class InpatientBillingController : ControllerBase
{
    private readonly IBedBillingService _billingService;

    public InpatientBillingController(IBedBillingService billingService)
    {
        _billingService = billingService;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0";

    [HttpPost("process-daily")]
    [Authorize(Roles = "Admin,Finance")]
    public async Task<IActionResult> ProcessDaily()
    {
        await _billingService.ProcessDailyBillingAsync(GetUserId());
        return Ok(new { message = "Daily bed billing processed successfully." });
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetPatientBills(int patientId)
    {
        return Ok(await _billingService.GetInpatientBillsAsync(patientId));
    }

    [HttpPost("admissions/{admissionId}/finalize")]
    [Authorize(Roles = "Admin,Finance")]
    public async Task<IActionResult> FinalizeBill(int admissionId)
    {
        await _billingService.GenerateFinalBillAsync(admissionId, GetUserId());
        return Ok(new { message = "Final bill for admission generated." });
    }
}
