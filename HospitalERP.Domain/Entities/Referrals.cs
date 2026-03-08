using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== HIE & EXTERNAL REFERRALS =====

public class ReferralFacility : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; } // Hospital, Clinic, Diagnostic Center
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? HieEndpoint { get; set; } // URL for FHIR/HL7 exchange if applicable
    public bool IsActive { get; set; } = true;
}

public class ExternalReferral : BaseEntity
{
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int FacilityId { get; set; }
    public ReferralFacility Facility { get; set; } = null!;

    public string ReferralType { get; set; } = "Inbound"; // Inbound, Outbound
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled
    public DateTime ReferralDate { get; set; } = DateTime.UtcNow;

    public string? ClinicalSummary { get; set; } // Brief medical context
    public string? ExternalDoctorName { get; set; }
    public string? Notes { get; set; }

    public ICollection<HieTransaction> ExchangeHistory { get; set; } = new List<HieTransaction>();
}

public class HieTransaction : BaseEntity
{
    public int? ExternalReferralId { get; set; }
    public ExternalReferral? ExternalReferral { get; set; }

    public string TransactionType { get; set; } = "Export"; // Export, Import
    public string DataStandard { get; set; } = "HL7-FHIR"; // FHIR, HL7_v2, CDA
    public string Payload { get; set; } = string.Empty; // JSON or XML snippet or link
    public string Status { get; set; } = "Success"; // Success, Failed
    public string? ErrorMessage { get; set; }
}
