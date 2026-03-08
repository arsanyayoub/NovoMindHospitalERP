using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class HousekeepingTask : BaseEntity
{
    public int? BedId { get; set; }
    public int? RoomId { get; set; }
    
    [Required]
    public string TaskType { get; set; } = "Routine Cleaning"; // Deep Clean, Discharge Clean, Routine
    
    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed, Inspected
    
    public string? AssignedStaffId { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? CompletionTime { get; set; }
    
    public string? Remarks { get; set; }

    [ForeignKey("BedId")]
    public Bed? Bed { get; set; }
}

public class LaundryRecord : BaseEntity
{
    [Required]
    public string ItemType { get; set; } = string.Empty; // Bed Sheet, Pillow Cover, Scrub, Gown
    
    public int Quantity { get; set; }
    
    [Required]
    public string Status { get; set; } = "Sent"; // Sent, Washing, Drying, Ready, Delivered
    
    public string? SourceWard { get; set; }
    public string? DestinationWard { get; set; }
    
    public DateTime? ExpectedReturnDate { get; set; }
}
