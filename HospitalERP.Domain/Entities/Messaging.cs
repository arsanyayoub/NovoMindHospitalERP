using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class Message : BaseEntity
{
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;
    
    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
}
