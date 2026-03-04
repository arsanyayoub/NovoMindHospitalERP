using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class ClinicalService : IClinicalService
{
    private readonly IUnitOfWork _uow;
    public ClinicalService(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<PatientVitalDto>> GetVitalsAsync(PagedRequest request, int? patientId)
    {
        var query = _uow.PatientVitals.Query()
            .Include(v => v.Patient)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(v => v.PatientId == patientId);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(v => v.Patient.FullName.Contains(request.Search) || v.Patient.PatientCode.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(v => v.RecordedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => new PatientVitalDto(
                v.Id, v.PatientId, v.Patient.FullName, v.AppointmentId, v.RecordedDate, v.RecordedBy,
                v.Temperature, v.BloodPressureSystolic, v.BloodPressureDiastolic, v.HeartRate, v.RespiratoryRate, v.SpO2,
                v.WeightKg, v.HeightCm, v.BMI, v.PainScale, v.Notes
            )).ToListAsync();

        return new PagedResult<PatientVitalDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PatientVitalDto> CreateVitalAsync(CreatePatientVitalDto dto, string recordedBy)
    {
        var patient = await _uow.Patients.GetByIdAsync(dto.PatientId) ?? throw new Exception("Patient not found");
        
        decimal? bmi = null;
        if (dto.WeightKg.HasValue && dto.HeightCm.HasValue && dto.HeightCm > 0)
        {
            var heightInMeters = dto.HeightCm.Value / 100;
            bmi = Math.Round(dto.WeightKg.Value / (heightInMeters * heightInMeters), 1);
        }

        var vital = new PatientVital
        {
            PatientId = dto.PatientId,
            AppointmentId = dto.AppointmentId,
            RecordedBy = recordedBy,
            Temperature = dto.Temperature,
            BloodPressureSystolic = dto.BloodPressureSystolic,
            BloodPressureDiastolic = dto.BloodPressureDiastolic,
            HeartRate = dto.HeartRate,
            RespiratoryRate = dto.RespiratoryRate,
            SpO2 = dto.SpO2,
            WeightKg = dto.WeightKg,
            HeightCm = dto.HeightCm,
            BMI = bmi,
            PainScale = dto.PainScale,
            Notes = dto.Notes
        };

        await _uow.PatientVitals.AddAsync(vital);
        await _uow.SaveChangesAsync();

        return ToDto(vital);
    }

    public async Task DeleteVitalAsync(int id)
    {
        var vital = await _uow.PatientVitals.GetByIdAsync(id) ?? throw new Exception("Vital record not found");
        vital.IsDeleted = true;
        await _uow.SaveChangesAsync();
    }

    public async Task<PagedResult<ClinicalEncounterDto>> GetEncountersAsync(PagedRequest request, int? patientId, int? doctorId)
    {
        var query = _uow.ClinicalEncounters.Query()
            .Include(e => e.Patient)
            .Include(e => e.Doctor)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(e => e.PatientId == patientId);
        if (doctorId.HasValue) query = query.Where(e => e.DoctorId == doctorId);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(e => e.Patient.FullName.Contains(request.Search) || e.Doctor.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(e => e.EncounterDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => ToDto(e))
            .ToListAsync();

        return new PagedResult<ClinicalEncounterDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<ClinicalEncounterDto?> GetEncounterByIdAsync(int id)
    {
        var e = await _uow.ClinicalEncounters.Query()
            .Include(e => e.Patient)
            .Include(e => e.Doctor)
            .FirstOrDefaultAsync(e => e.Id == id);
        return e == null ? null : ToDto(e);
    }

    public async Task<ClinicalEncounterDto> CreateEncounterAsync(CreateClinicalEncounterDto dto, string createdBy)
    {
        var encounter = new ClinicalEncounter
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentId = dto.AppointmentId,
            EncounterDate = DateTime.UtcNow,
            ChiefComplaint = dto.ChiefComplaint,
            Subjective = dto.Subjective,
            Objective = dto.Objective,
            Assessment = dto.Assessment,
            Plan = dto.Plan,
            InternalNotes = dto.InternalNotes,
            IsFinalized = dto.IsFinalized,
            CreatedBy = createdBy
        };

        await _uow.ClinicalEncounters.AddAsync(encounter);
        await _uow.SaveChangesAsync();

        return ToDto(encounter);
    }

    public async Task<ClinicalEncounterDto> UpdateEncounterAsync(int id, CreateClinicalEncounterDto dto, string updatedBy)
    {
        var encounter = await _uow.ClinicalEncounters.GetByIdAsync(id) ?? throw new Exception("Encounter not found");
        if (encounter.IsFinalized) throw new Exception("Cannot update a finalized encounter");

        encounter.ChiefComplaint = dto.ChiefComplaint;
        encounter.Subjective = dto.Subjective;
        encounter.Objective = dto.Objective;
        encounter.Assessment = dto.Assessment;
        encounter.Plan = dto.Plan;
        encounter.InternalNotes = dto.InternalNotes;
        encounter.IsFinalized = dto.IsFinalized;
        encounter.UpdatedBy = updatedBy;

        _uow.ClinicalEncounters.Update(encounter);
        await _uow.SaveChangesAsync();

        return ToDto(encounter);
    }

    public async Task DeleteEncounterAsync(int id)
    {
        var encounter = await _uow.ClinicalEncounters.GetByIdAsync(id) ?? throw new Exception("Encounter not found");
        encounter.IsDeleted = true;
        await _uow.SaveChangesAsync();
    }

    internal static PatientVitalDto ToDto(PatientVital v) => new(
        v.Id, v.PatientId, v.Patient?.FullName ?? "N/A", v.AppointmentId, v.RecordedDate, v.RecordedBy,
        v.Temperature, v.BloodPressureSystolic, v.BloodPressureDiastolic, v.HeartRate, v.RespiratoryRate, v.SpO2,
        v.WeightKg, v.HeightCm, v.BMI, v.PainScale, v.Notes
    );

    internal static ClinicalEncounterDto ToDto(ClinicalEncounter e) => new(
        e.Id, e.PatientId, e.Patient?.FullName ?? "N/A", e.DoctorId, e.Doctor?.FullName,
        e.AppointmentId, e.EncounterDate, e.ChiefComplaint, e.Subjective, e.Objective,
        e.Assessment, e.Plan, e.InternalNotes, e.IsFinalized, e.CreatedDate
    );
}
