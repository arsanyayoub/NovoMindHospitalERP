using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class PatientService : IPatientService
{
    private readonly IUnitOfWork _uow;
    private readonly INotificationService _notificationService;

    public PatientService(IUnitOfWork uow, INotificationService notificationService)
    {
        _uow = uow;
        _notificationService = notificationService;
    }

    public async Task<PagedResult<PatientDto>> GetAllAsync(PagedRequest request)
    {
        var query = _uow.Patients.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(p =>
                p.FullName.Contains(request.Search) ||
                p.PatientCode.Contains(request.Search) ||
                (p.PhoneNumber != null && p.PhoneNumber.Contains(request.Search)));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => ToDto(p))
            .ToListAsync();

        return new PagedResult<PatientDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PatientDto?> GetByIdAsync(int id)
    {
        var p = await _uow.Patients.GetByIdAsync(id);
        return p is null ? null : ToDto(p);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto dto, string createdBy)
    {
        var count = await _uow.Patients.CountAsync();
        var patient = new Patient
        {
            PatientCode = $"P{(count + 1):D5}",
            FullName = dto.FullName,
            NationalId = dto.NationalId,
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            BloodType = dto.BloodType,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            EmergencyContact = dto.EmergencyContact,
            EmergencyPhone = dto.EmergencyPhone,
            MedicalHistory = dto.MedicalHistory,
            Allergies = dto.Allergies,
            InsuranceProvider = dto.InsuranceProvider,
            InsurancePolicyNumber = dto.InsurancePolicyNumber,
            InsuranceCoverage = dto.InsuranceCoverage,
            CreatedBy = createdBy
        };
        await _uow.Patients.AddAsync(patient);
        await _uow.SaveChangesAsync();
        await _notificationService.CreateNotificationAsync(
            "New Patient Registered",
            $"Patient {patient.FullName} ({patient.PatientCode}) has been registered.",
            "PatientCreated", entityType: "Patient", entityId: patient.Id);
        return ToDto(patient);
    }

    public async Task<PatientDto> UpdateAsync(int id, UpdatePatientDto dto, string updatedBy)
    {
        var patient = await _uow.Patients.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Patient {id} not found.");
        patient.FullName = dto.FullName;
        patient.NationalId = dto.NationalId;
        patient.DateOfBirth = dto.DateOfBirth;
        patient.Gender = dto.Gender;
        patient.BloodType = dto.BloodType;
        patient.PhoneNumber = dto.PhoneNumber;
        patient.Email = dto.Email;
        patient.Address = dto.Address;
        patient.EmergencyContact = dto.EmergencyContact;
        patient.EmergencyPhone = dto.EmergencyPhone;
        patient.MedicalHistory = dto.MedicalHistory;
        patient.Allergies = dto.Allergies;
        patient.IsActive = dto.IsActive;
        patient.InsuranceProvider = dto.InsuranceProvider;
        patient.InsurancePolicyNumber = dto.InsurancePolicyNumber;
        patient.InsuranceCoverage = dto.InsuranceCoverage;
        patient.UpdatedBy = updatedBy;
        _uow.Patients.Update(patient);
        await _uow.SaveChangesAsync();
        return ToDto(patient);
    }

    public async Task DeleteAsync(int id)
    {
        var patient = await _uow.Patients.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Patient {id} not found.");
        _uow.Patients.SoftDelete(patient);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetPatientAppointmentsAsync(int patientId)
    {
        var appts = await _uow.Appointments.Query()
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();
        return appts.Select(AppointmentService.ToDto);
    }

    public async Task<IEnumerable<InvoiceDto>> GetPatientInvoicesAsync(int patientId)
    {
        var invoices = await _uow.Invoices.Query()
            .Include(i => i.Patient)
            .Include(i => i.InvoiceItems).ThenInclude(ii => ii.Item)
            .Where(i => i.PatientId == patientId)
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();
        return invoices.Select(InvoiceService.ToDto);
    }

    public async Task<IEnumerable<PatientVitalDto>> GetPatientVitalsAsync(int patientId)
    {
        var vitals = await _uow.PatientVitals.Query()
            .Include(v => v.Patient)
            .Where(v => v.PatientId == patientId)
            .OrderByDescending(v => v.RecordedDate)
            .ToListAsync();
        return vitals.Select(ClinicalService.ToDto);
    }

    public async Task<IEnumerable<PrescriptionDto>> GetPatientPrescriptionsAsync(int patientId)
    {
        var prescriptions = await _uow.Prescriptions.Query()
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Items).ThenInclude(pi => pi.Item)
            .Where(p => p.PatientId == patientId)
            .OrderByDescending(p => p.PrescriptionDate)
            .ToListAsync();
        return prescriptions.Select(PharmacyService.ToDto);
    }

    public async Task<IEnumerable<LabRequestDto>> GetPatientLabRequestsAsync(int patientId)
    {
        var requests = await _uow.LabRequests.Query()
            .Include(r => r.Patient)
            .Include(r => r.Doctor)
            .Include(r => r.Results).ThenInclude(res => res.LabTest)
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RequestDate)
            .ToListAsync();
        return requests.Select(LabService.ToRDto);
    }

    public async Task<IEnumerable<RadiologyRequestDto>> GetPatientRadiologyRequestsAsync(int patientId)
    {
        var requests = await _uow.RadiologyRequests.Query()
            .Include(r => r.Patient)
            .Include(r => r.Doctor)
            .Include(r => r.Results).ThenInclude(res => res.RadiologyTest)
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.RequestDate)
            .ToListAsync();
        return requests.Select(RadiologyService.ToRDto);
    }

    internal static PatientDto ToDto(Patient p) => new(
        p.Id, p.PatientCode, p.FullName, p.NationalId, p.DateOfBirth, p.Gender,
        p.BloodType, p.PhoneNumber, p.Email, p.Address, p.EmergencyContact,
        p.EmergencyPhone, p.MedicalHistory, p.Allergies, p.IsActive,
        p.InsuranceProvider, p.InsurancePolicyNumber, p.InsuranceCoverage, p.InsuranceBalance,
        p.CreatedDate);
}
