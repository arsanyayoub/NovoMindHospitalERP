using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== CLINICAL & PHARMACY =====

public class PatientVital : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    
    public DateTime RecordedDate { get; set; } = DateTime.UtcNow;
    public string RecordedBy { get; set; } = string.Empty;

    public decimal? Temperature { get; set; } // Celsius
    public int? BloodPressureSystolic { get; set; } // mmHg
    public int? BloodPressureDiastolic { get; set; } // mmHg
    public int? HeartRate { get; set; } // bpm
    public int? RespiratoryRate { get; set; } // breaths/min
    public int? SpO2 { get; set; } // Oxygen Saturation %
    public decimal? WeightKg { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? BMI { get; set; }
    public string? PainScale { get; set; } // 1-10
    public string? Notes { get; set; }
}

public class Prescription : BaseEntity
{
    public string PrescriptionNumber { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public DateTime PrescriptionDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending, Dispensed, Cancelled
    public string? Notes { get; set; }

    public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
}

public class PrescriptionItem : BaseEntity
{
    public int PrescriptionId { get; set; }
    public Prescription Prescription { get; set; } = null!;
    
    public int ItemId { get; set; } // Link to Inventory Item (Medicine)
    public Item Item { get; set; } = null!;

    public string Dosage { get; set; } = string.Empty; // e.g. 500mg
    public string Frequency { get; set; } = string.Empty; // e.g. TID, Once daily
    public string Duration { get; set; } = string.Empty; // e.g. 5 days
    public decimal Quantity { get; set; } // Total quantity to dispense
    public string? Instructions { get; set; } // e.g. After food
    
    public bool IsDispensed { get; set; } = false;
    public DateTime? DispensedDate { get; set; }
    public string? DispensedBy { get; set; }
}

public class ClinicalEncounter : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public DateTime EncounterDate { get; set; } = DateTime.UtcNow;
    
    // SOAP Notes
    public string? ChiefComplaint { get; set; }
    public string? Subjective { get; set; } // Symptoms, history
    public string? Objective { get; set; }  // Findings from exam
    public string? Assessment { get; set; } // Diagnosis
    public string? Plan { get; set; }       // Treatment, follow-up
    
    public string? InternalNotes { get; set; }
    public bool IsFinalized { get; set; } = false;
}
