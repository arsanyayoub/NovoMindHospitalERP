using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class PatientPortalService : IPatientPortalService
{
    private readonly IUnitOfWork _uow;
    private readonly IPdfService _pdf;

    public PatientPortalService(IUnitOfWork uow, IPdfService pdf)
    {
        _uow = uow;
        _pdf = pdf;
    }

    public async Task<PatientProfileDto> GetProfileAsync(int patientId)
    {
        var p = await _uow.Patients.GetByIdAsync(patientId);
        if (p == null) throw new Exception("Patient not found");
        
        return new PatientProfileDto(p.Id, p.PatientCode, p.FullName, p.Email ?? "", p.PhoneNumber ?? "", p.DateOfBirth, p.Gender);
    }

    public async Task<IEnumerable<AppointmentDto>> GetAppointmentHistoryAsync(int patientId)
    {
        var apps = await _uow.Appointments.Query()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();
            
        return apps.Select(a => new AppointmentDto(
            a.Id, a.AppointmentCode, a.PatientId, a.Patient.FullName,
            a.DoctorId, a.Doctor.FullName, a.Doctor.Specialization,
            a.AppointmentDate, a.AppointmentTime, a.DurationMinutes,
            a.Status.ToString(), a.Notes, a.Diagnosis, a.Prescription,
            a.Fee, a.IsPaid, a.CreatedDate));
    }

    public async Task<byte[]> ExportClinicalSummaryAsync(int patientId)
    {
        return await _pdf.GenerateEmrPdfAsync(patientId);
    }
}
