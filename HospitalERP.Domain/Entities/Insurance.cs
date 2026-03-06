using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class InsuranceProvider : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? TPA { get; set; } // Third Party Administrator
    public bool IsActive { get; set; } = true;
    public ICollection<InsurancePlan> Plans { get; set; } = new List<InsurancePlan>();
}

public class InsurancePlan : BaseEntity
{
    public int InsuranceProviderId { get; set; }
    public InsuranceProvider InsuranceProvider { get; set; } = null!;
    
    public string PlanName { get; set; } = string.Empty;
    public string PlanCode { get; set; } = string.Empty;
    
    public decimal CoveragePercentage { get; set; } // e.g., 80 for 80% coverage
    public decimal CoPayAmount { get; set; } // Fixed amount patient pays per visit/service
    public decimal MaxLimit { get; set; } // Maximum annual limit
    
    public string? Exclusions { get; set; } // Text description of what's not covered
    public bool RequiresPreAuth { get; set; } // Flag for services needing prior approval
    public bool IsActive { get; set; } = true;
}

public class InsuranceClaim : BaseEntity
{
    public string ClaimNumber { get; set; } = string.Empty;
    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
    
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    
    public int InsuranceProviderId { get; set; }
    public InsuranceProvider InsuranceProvider { get; set; } = null!;
    
    public decimal ClaimAmount { get; set; }
    public decimal ApprovedAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Paid
    
    public DateTime? SubmissionDate { get; set; }
    public DateTime? StatusDate { get; set; }
    public string? RejectionReason { get; set; }
    public string? AuthCode { get; set; } // Pre-authorization code if applicable
}
