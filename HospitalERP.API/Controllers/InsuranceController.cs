using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InsuranceController : ControllerBase
{
    private readonly IInsuranceService _insurance;
    public InsuranceController(IInsuranceService insurance) => _insurance = insurance;

    [HttpGet("providers")]
    public async Task<ActionResult<IEnumerable<InsuranceProviderDto>>> GetProviders() => Ok(await _insurance.GetProvidersAsync());

    [HttpGet("providers/{id}")]
    public async Task<ActionResult<InsuranceProviderDto>> GetProvider(int id)
    {
        var p = await _insurance.GetProviderByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost("providers")]
    public async Task<ActionResult<InsuranceProviderDto>> CreateProvider(CreateInsuranceProviderDto dto)
        => Ok(await _insurance.CreateProviderAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpPut("providers/{id}")]
    public async Task<ActionResult<InsuranceProviderDto>> UpdateProvider(int id, CreateInsuranceProviderDto dto)
        => Ok(await _insurance.UpdateProviderAsync(id, dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpGet("plans")]
    public async Task<ActionResult<IEnumerable<InsurancePlanDto>>> GetPlans(int? providerId) 
        => Ok(await _insurance.GetPlansAsync(providerId));

    [HttpPost("plans")]
    public async Task<ActionResult<InsurancePlanDto>> CreatePlan(CreateInsurancePlanDto dto)
        => Ok(await _insurance.CreatePlanAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpPut("plans/{id}")]
    public async Task<ActionResult<InsurancePlanDto>> UpdatePlan(int id, CreateInsurancePlanDto dto)
        => Ok(await _insurance.UpdatePlanAsync(id, dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpGet("claims")]
    public async Task<ActionResult<PagedResult<InsuranceClaimDto>>> GetClaims([FromQuery] PagedRequest request, string? status)
        => Ok(await _insurance.GetClaimsAsync(request, status));

    [HttpPost("claims")]
    public async Task<ActionResult<InsuranceClaimDto>> CreateClaim(CreateInsuranceClaimDto dto)
        => Ok(await _insurance.CreateClaimAsync(dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));

    [HttpPatch("claims/{id}/status")]
    public async Task<ActionResult<InsuranceClaimDto>> UpdateClaimStatus(int id, UpdateClaimStatusDto dto)
        => Ok(await _insurance.UpdateClaimStatusAsync(id, dto, User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system"));
}
