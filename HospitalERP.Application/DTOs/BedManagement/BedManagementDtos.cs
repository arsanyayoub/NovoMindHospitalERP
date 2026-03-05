using System.ComponentModel.DataAnnotations;

namespace HospitalERP.Application.DTOs.BedManagement;

public class WardDto
{
    public int Id { get; set; }
    public string WardCode { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public string WardNameAr { get; set; } = string.Empty;
    public string WardType { get; set; } = string.Empty;
    public int FloorNumber { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int TotalRooms { get; set; }
    public int TotalBeds { get; set; }
    public int OccupiedBeds { get; set; }
}

public class RoomDto
{
    public int Id { get; set; }
    public int WardId { get; set; }
    public string WardName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public string? Notes { get; set; }
    public int OccupiedBeds { get; set; }
}

public class BedDto
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int WardId { get; set; }
    public string WardName { get; set; } = string.Empty;
    public string BedNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Available, Occupied, Maintenance, Reserved
    
    // Current Admission basic info if occupied
    public int? CurrentAdmissionId { get; set; }
    public string? PatientName { get; set; }
    public string? PatientCode { get; set; }
}

public class BedAdmissionDto
{
    public int Id { get; set; }
    public int BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string PatientCode { get; set; } = string.Empty;
    
    public int? DoctorId { get; set; }
    public string? DoctorName { get; set; }
    
    public DateTime AdmissionDate { get; set; }
    public DateTime? DischargeDate { get; set; }
    public string AdmissionType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdmissionReason { get; set; }
    public string? DischargeNotes { get; set; }
    public decimal? DailyRate { get; set; }
    public string? Notes { get; set; }
}

public class CreateWardDto
{
    [Required] public string WardCode { get; set; } = string.Empty;
    [Required] public string WardName { get; set; } = string.Empty;
    [Required] public string WardNameAr { get; set; } = string.Empty;
    [Required] public string WardType { get; set; } = "General";
    public int FloorNumber { get; set; } = 1;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateRoomDto
{
    [Required] public int WardId { get; set; }
    [Required] public string RoomNumber { get; set; } = string.Empty;
    [Required] public string RoomType { get; set; } = "Standard";
    [Range(1, 100)] public int Capacity { get; set; } = 1;
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }
}

public class CreateBedDto
{
    [Required] public int RoomId { get; set; }
    [Required] public string BedNumber { get; set; } = string.Empty;
    [Required] public string Status { get; set; } = "Available";
}

public class AdmitPatientDto
{
    [Required] public int BedId { get; set; }
    [Required] public int PatientId { get; set; }
    public int? DoctorId { get; set; }
    [Required] public string AdmissionType { get; set; } = "Elective";
    public string? AdmissionReason { get; set; }
    public decimal? DailyRate { get; set; }
    public string? Notes { get; set; }
}

public class DischargePatientDto
{
    public string? DischargeNotes { get; set; }
}
