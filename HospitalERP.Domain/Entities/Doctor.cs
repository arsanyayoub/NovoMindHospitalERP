using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

public class Doctor : BaseEntity
{
    public string DoctorCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string? SubSpecialization { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? LicenseNumber { get; set; }
    public decimal ConsultationFee { get; set; }
    public string? WorkingDays { get; set; }
    public string? WorkingHours { get; set; }
    public bool IsActive { get; set; } = true;
    public int? EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
