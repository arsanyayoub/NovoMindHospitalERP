using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class OperatingTheater : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string Status { get; set; } = "Available"; // Available, Under Maintenance, Busy
}

public class ScheduledSurgery : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int LeadSurgeonId { get; set; }
    public Doctor LeadSurgeon { get; set; } = null!;

    public int? AnesthetistId { get; set; }
    public Doctor? Anesthetist { get; set; }

    public int OperatingTheaterId { get; set; }
    public OperatingTheater OperatingTheater { get; set; } = null!;

    public string ProcedureName { get; set; } = string.Empty;
    public DateTime ScheduledStartTime { get; set; }
    public DateTime ScheduledEndTime { get; set; }
    
    public string Priority { get; set; } = "Routine"; // Routine, Emergency, Urgent
    public string Status { get; set; } = "Scheduled"; // Scheduled, Pre-Op, Intra-Op, Post-Op, Completed, Cancelled
    
    public string? PreOpDiagnosis { get; set; }
    public string? PostOpDiagnosis { get; set; }
    public string? Notes { get; set; }

    public ICollection<SurgeryResource> Resources { get; set; } = new List<SurgeryResource>();
    public int? InvoiceId { get; set; }
    public Invoice? Invoice { get; set; }
    public decimal? TotalCost { get; set; }
}

