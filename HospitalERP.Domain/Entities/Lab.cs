using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class LabTest : BaseEntity
{
    public string TestCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string NormalRange { get; set; } = string.Empty; // Default/Global fallback
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<LabTestReferenceRange> ReferenceRanges { get; set; } = new List<LabTestReferenceRange>();
}

public class LabTestReferenceRange : BaseEntity
{
    public int LabTestId { get; set; }
    public LabTest LabTest { get; set; } = null!;

    public string Gender { get; set; } = "All"; // Male, Female, All
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }

    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public decimal? CriticalLow { get; set; }
    public decimal? CriticalHigh { get; set; }

    public string? Description { get; set; } // e.g., "Fasting", "Post-prandial"
}

public class LabRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    
    /// <summary>Pending, Collected, AtLab, Processing, Completed, Cancelled</summary>
    public string Status { get; set; } = "Pending"; 
    public DateTime? CollectionDate { get; set; }
    public string? CollectedBy { get; set; }
    public DateTime? ReceivedAtLabDate { get; set; }

    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }
    public List<LabResult> Results { get; set; } = new();
}

public class LabResult : BaseEntity
{
    public int LabRequestId { get; set; }
    public LabRequest LabRequest { get; set; } = null!;
    public int LabTestId { get; set; }
    public LabTest LabTest { get; set; } = null!;
    public string? ResultValue { get; set; }
    public string? NormalRange { get; set; } // Snapshotted from LabTest
    public string? Unit { get; set; }        // Snapshotted from LabTest
    public DateTime? ResultDate { get; set; }
    public string? Remarks { get; set; }
    public string? PerformedBy { get; set; }
    public string? ResultFlag { get; set; } // Normal, Low, High, Critical
    public bool IsCritical { get; set; }
}
