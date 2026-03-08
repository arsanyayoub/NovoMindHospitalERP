using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== CSSD (Sterilization) =====
public class SterilizationBatch : BaseEntity
{
    [Required]
    public string BatchNumber { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = "Autoclave 01";
    public DateTime CycleStartTime { get; set; } = DateTime.UtcNow;
    public DateTime? CycleEndTime { get; set; }
    public double TemperatureC { get; set; }
    public double PressureBar { get; set; }
    public string Status { get; set; } = "InService"; // InService, Completed, Failed
    public string OperatorName { get; set; } = string.Empty;
    
    public ICollection<SterilizedItem> Items { get; set; } = new List<SterilizedItem>();
}

public class SterilizedItem : BaseEntity
{
    public int SterilizationBatchId { get; set; }
    public SterilizationBatch Batch { get; set; } = null!;
    
    public string ItemName { get; set; } = string.Empty; // e.g. "Major Ortho Set", "Dental Pack"
    public string ContainerId { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; } // Sterility expiry
    public bool IsBiologicalIndicatorPassed { get; set; } = true;
}

// ===== MORTUARY =====
public class DeceasedRecord : BaseEntity
{
    public int? PatientId { get; set; }
    public Patient? Patient { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty; // For unidentified or non-patients
    public DateTime DateOfDeath { get; set; }
    public string CauseOfDeath { get; set; } = string.Empty;
    public string? DeathCertificateNumber { get; set; }
    
    public string BodyStatus { get; set; } = "InMortuary"; // InMortuary, Released, Transferred
    public string ChamberNumber { get; set; } = string.Empty;
    
    public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ReleasedDate { get; set; }
    public string? ReleasedTo { get; set; }
    public string? ReleasedBy { get; set; }
    public string? Notes { get; set; }
}
