using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalERP.Application.Interfaces;
using HospitalERP.Application.DTOs;

namespace HospitalERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SystemController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public SystemController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? search = null, [FromQuery] string? entityName = null, [FromQuery] int? entityId = null)
    {
        return Ok(await _auditLogService.GetLogsAsync(page, pageSize, search, entityName, entityId));
    }
}

