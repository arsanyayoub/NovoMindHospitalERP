using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class RehabPlan : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int AssignedPhysicianId { get; set; }
    public Doctor AssignedPhysician { get; set; } = null!;

    [Required]
    public string Diagnosis { get; set; } = string.Empty;
    public string ImprovementGoals { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EstimatedEndDate { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed, Cancelled

    public ICollection<PhysiotherapySession> Sessions { get; set; } = new List<PhysiotherapySession>();
}

public class PhysiotherapySession : BaseEntity
{
    public int RehabPlanId { get; set; }
    public RehabPlan RehabPlan { get; set; } = null!;

    public DateTime SessionDate { get; set; }
    public int TherapistId { get; set; }
    public Employee Therapist { get; set; } = null!;

    public string ProcedurePerformed { get; set; } = string.Empty; // e.g., Electrotherapy, Massage, Exercise
    public string ProgressNotes { get; set; } = string.Empty;
    public int PainLevelBefore { get; set; } // 1-10
    public int PainLevelAfter { get; set; } // 1-10
    
    public decimal DurationMinutes { get; set; }
    public bool PatientAttended { get; set; } = true;

    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
}

public class RehabEquipment : BaseEntity
{
    public string EquipmentName { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string Status { get; set; } = "Available"; // Available, InUse, Maintenance
}
