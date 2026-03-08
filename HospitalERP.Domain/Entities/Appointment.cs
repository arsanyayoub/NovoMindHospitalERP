using HospitalERP.Domain.Common;
using HospitalERP.Domain.Enums;

namespace HospitalERP.Domain.Entities;

public class Appointment : BaseEntity
{
    public string AppointmentCode { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? Notes { get; set; }
    public string? Diagnosis { get; set; }
    public string? Prescription { get; set; }
    public decimal Fee { get; set; }
    public bool IsPaid { get; set; } = false;

    // Telehealth
    public bool IsTelehealth { get; set; } = false;
    public string? MeetingLink { get; set; }
    public string? VirtualWaitingRoomStatus { get; set; } // Waiting, Directing, Finished
}
