using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class RadiologyTest : BaseEntity
{
    public string TestCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // e.g., X-Ray, MRI, CT Scan, Ultrasound
    public string? PreparationInstructions { get; set; }
    public string? PreparationInstructionsAr { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}

public class RadiologyTemplate : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // e.g., X-Ray, MRI
    public string EnglishTemplate { get; set; } = string.Empty;
    public string ArabicTemplate { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class RadiologyRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public DateTime RequestDate { get; set; }
    public int? EmergencyAdmissionId { get; set; }
    public EmergencyAdmission? EmergencyAdmission { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed, Cancelled
    public decimal TotalAmount { get; set; }
    public ICollection<RadiologyResult> Results { get; set; } = new List<RadiologyResult>();
}

public class RadiologyResult : BaseEntity
{
    public int RadiologyRequestId { get; set; }
    public RadiologyRequest RadiologyRequest { get; set; } = null!;
    public int RadiologyTestId { get; set; }
    public RadiologyTest RadiologyTest { get; set; } = null!;
    
    public string? Findings { get; set; }
    public string? Impression { get; set; }
    public string? ImageUrl { get; set; } // Path to stored scan/image
    public DateTime? ResultDate { get; set; }
    public string? PerformedBy { get; set; } // Technician name
    public string? RadiologistName { get; set; }
    
    public int? RadiologyTemplateId { get; set; }
    public RadiologyTemplate? Template { get; set; }
}
