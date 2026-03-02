using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Domain.Enums;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IUnitOfWork _uow;
    public DoctorService(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<DoctorDto>> GetAllAsync(PagedRequest request)
    {
        var query = _uow.Doctors.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(d =>
                d.FullName.Contains(request.Search) ||
                d.Specialization.Contains(request.Search) ||
                d.DoctorCode.Contains(request.Search));
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(d => d.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .Select(d => ToDto(d)).ToListAsync();
        return new PagedResult<DoctorDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<DoctorDto?> GetByIdAsync(int id)
    {
        var d = await _uow.Doctors.GetByIdAsync(id);
        return d is null ? null : ToDto(d);
    }

    public async Task<DoctorDto> CreateAsync(CreateDoctorDto dto, string createdBy)
    {
        var count = await _uow.Doctors.CountAsync();
        var doctor = new Doctor
        {
            DoctorCode = $"DR{(count + 1):D4}",
            FullName = dto.FullName,
            Specialization = dto.Specialization,
            SubSpecialization = dto.SubSpecialization,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            LicenseNumber = dto.LicenseNumber,
            ConsultationFee = dto.ConsultationFee,
            WorkingDays = dto.WorkingDays,
            WorkingHours = dto.WorkingHours,
            EmployeeId = dto.EmployeeId,
            CreatedBy = createdBy
        };
        await _uow.Doctors.AddAsync(doctor);
        await _uow.SaveChangesAsync();
        return ToDto(doctor);
    }

    public async Task<DoctorDto> UpdateAsync(int id, UpdateDoctorDto dto, string updatedBy)
    {
        var doctor = await _uow.Doctors.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Doctor {id} not found.");
        doctor.FullName = dto.FullName;
        doctor.Specialization = dto.Specialization;
        doctor.SubSpecialization = dto.SubSpecialization;
        doctor.PhoneNumber = dto.PhoneNumber;
        doctor.Email = dto.Email;
        doctor.LicenseNumber = dto.LicenseNumber;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.WorkingDays = dto.WorkingDays;
        doctor.WorkingHours = dto.WorkingHours;
        doctor.IsActive = dto.IsActive;
        doctor.UpdatedBy = updatedBy;
        _uow.Doctors.Update(doctor);
        await _uow.SaveChangesAsync();
        return ToDto(doctor);
    }

    public async Task DeleteAsync(int id)
    {
        var doctor = await _uow.Doctors.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Doctor {id} not found.");
        _uow.Doctors.SoftDelete(doctor);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetDoctorAppointmentsAsync(int doctorId, DateTime? date)
    {
        var query = _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .Where(a => a.DoctorId == doctorId);
        if (date.HasValue)
            query = query.Where(a => a.AppointmentDate.Date == date.Value.Date);
        var appts = await query.OrderBy(a => a.AppointmentDate).ThenBy(a => a.AppointmentTime).ToListAsync();
        return appts.Select(AppointmentService.ToDto);
    }

    internal static DoctorDto ToDto(Doctor d) => new(
        d.Id, d.DoctorCode, d.FullName, d.Specialization, d.SubSpecialization,
        d.PhoneNumber, d.Email, d.LicenseNumber, d.ConsultationFee,
        d.WorkingDays, d.WorkingHours, d.IsActive, d.EmployeeId, d.CreatedDate);
}

public class AppointmentService : IAppointmentService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notificationService;

    public AppointmentService(IUnitOfWork uow, INotificationService notificationService)
    {
        _uow = uow;
        _notificationService = notificationService;
    }

    public async Task<PagedResult<AppointmentDto>> GetAllAsync(PagedRequest request, DateTime? date, int? doctorId, int? patientId, string? status)
    {
        IQueryable<Appointment> query = _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor);
        if (date.HasValue) query = query.Where(a => a.AppointmentDate.Date == date.Value.Date);
        if (doctorId.HasValue) query = query.Where(a => a.DoctorId == doctorId.Value);
        if (patientId.HasValue) query = query.Where(a => a.PatientId == patientId.Value);
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AppointmentStatus>(status, out var s))
            query = query.Where(a => a.Status == s);
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(a => a.Patient.FullName.Contains(request.Search) || a.Doctor.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.AppointmentDate)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
            .ToListAsync();
        return new PagedResult<AppointmentDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<AppointmentDto?> GetByIdAsync(int id)
    {
        var a = await _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);
        return a is null ? null : ToDto(a);
    }

    public async Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto, string createdBy)
    {
        var count = await _uow.Appointments.CountAsync();
        var appt = new Appointment
        {
            AppointmentCode = $"APT{(count + 1):D6}",
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = dto.AppointmentDate,
            AppointmentTime = dto.AppointmentTime,
            DurationMinutes = dto.DurationMinutes,
            Notes = dto.Notes,
            Fee = dto.Fee,
            CreatedBy = createdBy
        };
        await _uow.Appointments.AddAsync(appt);
        await _uow.SaveChangesAsync();

        var apptFull = await _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == appt.Id);

        await _notificationService.CreateNotificationAsync(
            "New Appointment",
            $"Appointment {appt.AppointmentCode} created for {apptFull?.Patient?.FullName} with Dr. {apptFull?.Doctor?.FullName}.",
            "AppointmentCreated", entityType: "Appointment", entityId: appt.Id);

        return ToDto(apptFull!);
    }

    public async Task<AppointmentDto> UpdateAsync(int id, UpdateAppointmentDto dto, string updatedBy)
    {
        var appt = await _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id)
            ?? throw new KeyNotFoundException($"Appointment {id} not found.");
        appt.AppointmentDate = dto.AppointmentDate;
        appt.AppointmentTime = dto.AppointmentTime;
        appt.DurationMinutes = dto.DurationMinutes;
        if (Enum.TryParse<AppointmentStatus>(dto.Status, out var s)) appt.Status = s;
        appt.Notes = dto.Notes;
        appt.Diagnosis = dto.Diagnosis;
        appt.Prescription = dto.Prescription;
        appt.IsPaid = dto.IsPaid;
        appt.UpdatedBy = updatedBy;
        _uow.Appointments.Update(appt);
        await _uow.SaveChangesAsync();
        return ToDto(appt);
    }

    public async Task DeleteAsync(int id)
    {
        var appt = await _uow.Appointments.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Appointment {id} not found.");
        _uow.Appointments.SoftDelete(appt);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetTodayAppointmentsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var appts = await _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .Where(a => a.AppointmentDate.Date == today)
            .OrderBy(a => a.AppointmentTime)
            .ToListAsync();
        return appts.Select(ToDto);
    }

    internal static AppointmentDto ToDto(Appointment a) => new(
        a.Id, a.AppointmentCode, a.PatientId, a.Patient?.FullName ?? "",
        a.DoctorId, a.Doctor?.FullName ?? "", a.Doctor?.Specialization ?? "",
        a.AppointmentDate, a.AppointmentTime, a.DurationMinutes,
        a.Status.ToString(), a.Notes, a.Diagnosis, a.Prescription,
        a.Fee, a.IsPaid, a.CreatedDate);
}
