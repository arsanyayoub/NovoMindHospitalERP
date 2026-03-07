using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities
{
    public class EmergencyAdmission : BaseEntity
    {
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        public DateTime ArrivalTime { get; set; } = DateTime.Now;
        public string ArrivalMode { get; set; } // Ambulance, Walk-in, Referral
        
        [Required]
        public string ChiefComplaint { get; set; }
        public string? InitialVitalSigns { get; set; } // Summary of first vitals

        // Triage Data
        public int? TriageLevel { get; set; } // 1 (Most Urgent) to 5 (Non-Urgent) - ESI Scale
        public string? TriageCategory { get; set; } // Resuscitation, Emergent, Urgent, etc.
        public DateTime? TriageTime { get; set; }
        public int? TriageNurseId { get; set; }
        public string? TriageNotes { get; set; }

        public int? AssignedDoctorId { get; set; }
        [ForeignKey("AssignedDoctorId")]
        public User? AssignedDoctor { get; set; }

        public string? ERBayNumber { get; set; } // Bay 1, Trauma Room, etc.
        public string Status { get; set; } = "Arrived"; // Arrived, Triaged, UnderTreatment, Admitted, Discharged, Expired

        public string? Disposition { get; set; } // Discharge, Admit, Transfer, Death
        public DateTime? DispositionTime { get; set; }
        
        public string? Diagnosis { get; set; }
        public string? Notes { get; set; }

        public int? InpatientAdmissionId { get; set; } // Link to BedAdmission
    }

    public class ERTriageVital : BaseEntity
    {
        public int EmergencyAdmissionId { get; set; }
        public double Temperature { get; set; }
        public string BloodPressure { get; set; }
        public int HeartRate { get; set; }
        public int RespiratoryRate { get; set; }
        public int SpO2 { get; set; }
        public string PainScale { get; set; } // 1-10
        public DateTime RecordedAt { get; set; } = DateTime.Now;
    }
}
