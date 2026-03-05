using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class AuditLog : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Create, Update, Delete
    public string EntityName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string Changes { get; set; } = string.Empty; // JSON or text representing changes
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
