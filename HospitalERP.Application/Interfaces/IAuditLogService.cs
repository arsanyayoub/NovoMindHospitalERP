using HospitalERP.Application.DTOs;
using HospitalERP.Domain.Common;

namespace HospitalERP.Application.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(string userId, string username, string action, string entityName, int entityId, string changes);
    Task<PagedResult<AuditLogDto>> GetLogsAsync(int page = 1, int pageSize = 50, string? search = null);
}
