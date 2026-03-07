using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class BloodDonor : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string DonorCode { get; set; } = string.Empty; // e.g., DON-001
    public string BloodGroup { get; set; } = string.Empty; // A, B, AB, O
    public string RhFactor { get; set; } = string.Empty; // +, -
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public DateTime? LastDonationDate { get; set; }
    public bool IsEligible { get; set; } = true;
    public string? EligibilityNotes { get; set; }
    
    public ICollection<BloodDonation> Donations { get; set; } = new List<BloodDonation>();
}

public class BloodDonation : BaseEntity
{
    public int BloodDonorId { get; set; }
    public BloodDonor BloodDonor { get; set; } = null!;
    
    public DateTime DonationDate { get; set; } = DateTime.UtcNow;
    public decimal VolumeMl { get; set; }
    public string ComponentType { get; set; } = "Whole Blood"; // Whole Blood, Plasma, Platelets, Packed RBCs
    public string BagNumber { get; set; } = string.Empty; // Unique sticker ID
    public DateTime ExpiryDate { get; set; }
    public string TemperatureAtCollection { get; set; } = string.Empty;
    public string CollectedBy { get; set; } = string.Empty;
    
    public int? BloodStockId { get; set; }
    public BloodStock? BloodStock { get; set; }
}

public class BloodStock : BaseEntity
{
    public string BagNumber { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string RhFactor { get; set; } = string.Empty;
    public string ComponentType { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public decimal VolumeMl { get; set; }
    public string Status { get; set; } = "Available"; // Available, Reserved, Transfused, Expired, Quarantined
    public string? StorageLocation { get; set; } // e.g., Fridge 1, Shelf A
    
    public int? ReservedForPatientId { get; set; }
    public Patient? ReservedForPatient { get; set; }
}

public class BloodRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty; // BR-0001
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    
    public string BloodGroupRequired { get; set; } = string.Empty;
    public string RhFactorRequired { get; set; } = string.Empty;
    public string ComponentType { get; set; } = string.Empty;
    public int UnitsRequested { get; set; }
    public string Urgency { get; set; } = "Normal"; // Normal, Urgent, Emergency (Stat)
    public string Status { get; set; } = "Pending"; // Pending, PartiallyFulfilled, Fulfilled, Cancelled
    public string? ClinicalIndication { get; set; }
    public string RequestedBy { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
}
