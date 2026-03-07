using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class PregnancyRecord : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    
    public DateTime? LMP { get; set; } // Last Menstrual Period
    public DateTime EDD { get; set; } // Estimated Date of Delivery
    public int Gravidity { get; set; } // Number of pregnancies
    public int Parity { get; set; } // Number of births
    public string BloodGroup { get; set; } = string.Empty;
    public string? RiskFactors { get; set; }
    public string? AttendingDoctorId { get; set; }
    public string Status { get; set; } = "Active"; // Active, Delivered, Terminated
    
    public ICollection<DeliveryRecord> Deliveries { get; set; } = new List<DeliveryRecord>();
}

public class DeliveryRecord : BaseEntity
{
    public int PregnancyRecordId { get; set; }
    public PregnancyRecord PregnancyRecord { get; set; } = null!;
    
    public DateTime DeliveryDateTime { get; set; }
    public string ModeOfDelivery { get; set; } = "Spontaneous"; // Spontaneous, C-Section, Forceps, Vacuum
    public string? Complications { get; set; }
    public string? AttendingDoctor { get; set; }
    public string? Midwife { get; set; }
    public decimal PlacentaWeight { get; set; }
    
    public ICollection<NeonatalRecord> NeonatalRecords { get; set; } = new List<NeonatalRecord>();
}

public class NeonatalRecord : BaseEntity
{
    public int DeliveryRecordId { get; set; }
    public DeliveryRecord DeliveryRecord { get; set; } = null!;
    
    public int BabyPatientId { get; set; }
    public Patient BabyPatient { get; set; } = null!; // Linked to the newly created patient record for the baby
    
    public decimal BirthWeight { get; set; }
    public decimal Length { get; set; }
    public decimal HeadCircumference { get; set; }
    public int Apgar1Min { get; set; }
    public int Apgar5Min { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? HealthStatus { get; set; } // Stable, Critical, NICU
    public int? IncubatorId { get; set; }
}
