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

    public int? BedAdmissionId { get; set; }
    public BedAdmission? BedAdmission { get; set; }

    public string ProcedureName { get; set; } = string.Empty;
    public DateTime ScheduledStartTime { get; set; }
    public DateTime ScheduledEndTime { get; set; }
    
    public string Priority { get; set; } = "Routine"; // Routine, Emergency, Urgent
    public string Status { get; set; } = "Scheduled"; // Scheduled, Pre-Op, Intra-Op, Post-Op, Completed, Cancelled
    
    public string? PreOpDiagnosis { get; set; }
    public string? PostOpDiagnosis { get; set; }
    public string? Notes { get; set; }

    public ICollection<SurgeryResource> Resources { get; set; } = new List<SurgeryResource>();
    public ICollection<SurgeryChecklist>? Checklists { get; set; }
    public int? InvoiceId { get; set; }
    public Invoice? Invoice { get; set; }
    public decimal? TotalCost { get; set; }
}

public class SurgeryChecklist : BaseEntity
{
    public int ScheduledSurgeryId { get; set; }
    public ScheduledSurgery ScheduledSurgery { get; set; } = null!;

    public string Stage { get; set; } = string.Empty; // Sign-In, Time-Out, Sign-Out
    
    // Checklist Items (Boolean flags for demo, could be a dynamic list in real app)
    public bool PatientIdentityConfirmed { get; set; }
    public bool SiteMarked { get; set; }
    public bool ConsentChecked { get; set; }
    public bool AnesthesiaSafetyCheckDone { get; set; }
    public bool PulseOximeterOn { get; set; }
    public bool AllergyChecked { get; set; }
    public bool AirwayRiskAssessed { get; set; }
    
    public bool TeamMembersIntroduced { get; set; }
    public bool AnticipatedBloodLossChecked { get; set; }
    public bool AntibioticProphylaxisGiven { get; set; }
    
    public bool InstrumentCountConfirmed { get; set; }
    public bool SpecimenLabeled { get; set; }
    public bool EquipmentIssuesAddressed { get; set; }
    
    public string? CompletedBy { get; set; }
}

