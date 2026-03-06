using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Common;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;

namespace HospitalERP.Application.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IUnitOfWork _uow;

    public AuditLogService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task LogAsync(string userId, string username, string action, string entityName, int entityId, string changes)
    {
        var log = new AuditLog
        {
            UserId = userId,
            Username = username,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            Changes = changes,
            Timestamp = DateTime.UtcNow
        };

        await _uow.AuditLogs.AddAsync(log);
        await _uow.SaveChangesAsync();
    }

    public async Task<PagedResult<AuditLogDto>> GetLogsAsync(int page = 1, int pageSize = 50, string? search = null, string? entityName = null, int? entityId = null)
    {
        var query = _uow.AuditLogs.Query().Where(l => 
            (string.IsNullOrEmpty(search) || l.EntityName.Contains(search) || l.Action.Contains(search) || l.Username.Contains(search)) &&
            (string.IsNullOrEmpty(entityName) || l.EntityName == entityName) &&
            (!entityId.HasValue || l.EntityId == entityId));

        var total = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(query);

        var logs = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
            query.OrderByDescending(x => x.Timestamp)
                 .Skip((page - 1) * pageSize)
                 .Take(pageSize));

        var dtos = logs.Select(l => new AuditLogDto
        {
            Id = l.Id,
            UserId = l.UserId,
            Username = l.Username,
            Action = l.Action,
            EntityName = l.EntityName,
            EntityId = l.EntityId,
            Changes = l.Changes,
            Timestamp = l.Timestamp
        });

        return new PagedResult<AuditLogDto>(dtos, total, page, pageSize);
    }
}

