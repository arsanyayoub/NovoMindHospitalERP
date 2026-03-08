using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class ClinicalIncident : BaseEntity
{
    public int? PatientId { get; set; }
    
    [Required]
    public string IncidentType { get; set; } = string.Empty; // Medication Error, Fall, Surgical Complication
    
    [Required]
    public string Severity { get; set; } = "Low"; // Low, Medium, High, Critical
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    public string ActionTaken { get; set; } = string.Empty;
    
    public string Status { get; set; } = "Reported"; // Reported, UnderInvestigation, Resolved, Closed
    
    public string? InvestigatorId { get; set; }

    [ForeignKey("PatientId")]
    public Patient? Patient { get; set; }
}

public class PatientFeedback : BaseEntity
{
    public int PatientId { get; set; }
    
    public int Rating { get; set; } // 1 to 5
    
    public string? Comments { get; set; }
    
    public string Department { get; set; } = string.Empty; // ER, OPD, Inpatient
    
    public bool IsAnonymized { get; set; } = false;

    [ForeignKey("PatientId")]
    public Patient Patient { get; set; } = null!;
}
