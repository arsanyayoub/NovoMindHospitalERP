using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

/// <summary>Hospital Ward (e.g. ICU, General, Maternity, Pediatrics)</summary>
public class Ward : BaseEntity
{
    public string WardCode { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public string WardNameAr { get; set; } = string.Empty;
    public string WardType { get; set; } = "General"; // General, ICU, CCU, Maternity, Pediatric, Surgical, Oncology
    public int FloorNumber { get; set; } = 1;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Room> Rooms { get; set; } = new List<Room>();
}

/// <summary>Room within a Ward</summary>
public class Room : BaseEntity
{
    public int WardId { get; set; }
    public Ward Ward { get; set; } = null!;
    public string RoomNumber { get; set; } = string.Empty;
    public string RoomType { get; set; } = "Standard"; // Standard, Private, Semi-Private, Isolation
    public int Capacity { get; set; } = 1; // Number of beds
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }

    public ICollection<Bed> Beds { get; set; } = new List<Bed>();
}

/// <summary>Individual Bed within a Room</summary>
public class Bed : BaseEntity
{
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public string BedNumber { get; set; } = string.Empty; // e.g. "A1", "B2"
    public string Status { get; set; } = "Available"; // Available, Occupied, Maintenance, Reserved

    public ICollection<BedAdmission> Admissions { get; set; } = new List<BedAdmission>();
}

/// <summary>Patient admission record for a specific bed</summary>
public class BedAdmission : BaseEntity
{
    public int BedId { get; set; }
    public Bed Bed { get; set; } = null!;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }

    public DateTime AdmissionDate { get; set; } = DateTime.UtcNow;
    public DateTime? DischargeDate { get; set; }
    public string AdmissionType { get; set; } = "Elective"; // Elective, Emergency, Transfer
    public string Status { get; set; } = "Active"; // Active, Discharged, Transferred
    public string? AdmissionReason { get; set; }
    public string? DischargeNotes { get; set; }
    public decimal? DailyRate { get; set; }
    public string? Notes { get; set; }
}
