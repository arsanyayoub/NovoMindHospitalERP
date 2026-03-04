using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class LabTest : BaseEntity
{
    public string TestCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string NormalRange { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}

public class LabRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled
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
}
