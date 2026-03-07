using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class ClinicalService : IClinicalService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    public ClinicalService(IUnitOfWork uow, IAuditLogService auditLog) 
    { 
        _uow = uow; 
        _auditLog = auditLog;
    }

    public async Task<PagedResult<PatientVitalDto>> GetVitalsAsync(PagedRequest request, int? patientId, int? admissionId = null)
    {
        var query = _uow.PatientVitals.Query()
            .Include(v => v.Patient)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(v => v.PatientId == patientId);
        if (admissionId.HasValue) query = query.Where(v => v.BedAdmissionId == admissionId);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(v => v.Patient.FullName.Contains(request.Search) || v.Patient.PatientCode.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(v => v.RecordedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => new PatientVitalDto(
                v.Id, v.PatientId, v.Patient.FullName, v.AppointmentId, v.BedAdmissionId, v.RecordedDate, v.RecordedBy,
                v.Temperature, v.BloodPressureSystolic, v.BloodPressureDiastolic, v.HeartRate, v.RespiratoryRate, v.SpO2,
                v.WeightKg, v.HeightCm, v.BMI, v.PainScale, v.Notes, v.EmergencyAdmissionId
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
            BedAdmissionId = dto.BedAdmissionId,
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
            Notes = dto.Notes,
            EmergencyAdmissionId = dto.EmergencyAdmissionId
        };

        await _uow.PatientVitals.AddAsync(vital);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(recordedBy, recordedBy, "Create", "PatientVital", vital.Id, $"Vitals recorded for Patient ID {vital.PatientId}.");

        return ToDto(vital);
    }

    public async Task DeleteVitalAsync(int id, string deletedBy)
    {
        var vital = await _uow.PatientVitals.GetByIdAsync(id) ?? throw new Exception("Vital record not found");
        vital.IsDeleted = true;
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(deletedBy, deletedBy, "Delete", "PatientVital", id, $"Vital record for Patient ID {vital.PatientId} deleted.");
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
            CreatedBy = createdBy,
            EmergencyAdmissionId = dto.EmergencyAdmissionId
        };

        await _uow.ClinicalEncounters.AddAsync(encounter);

        if (encounter.IsFinalized && encounter.AppointmentId.HasValue)
        {
            var appt = await _uow.Appointments.GetByIdAsync(encounter.AppointmentId.Value);
            if (appt != null)
            {
                appt.Status = HospitalERP.Domain.Enums.AppointmentStatus.Completed;
                _uow.Appointments.Update(appt);
            }
        }

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "ClinicalEncounter", encounter.Id, $"Clinical Encounter created for Patient ID {encounter.PatientId}.");

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

        if (encounter.IsFinalized && encounter.AppointmentId.HasValue)
        {
            var appt = await _uow.Appointments.GetByIdAsync(encounter.AppointmentId.Value);
            if (appt != null)
            {
                appt.Status = HospitalERP.Domain.Enums.AppointmentStatus.Completed;
                _uow.Appointments.Update(appt);
            }
        }

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "ClinicalEncounter", encounter.Id, $"Clinical Encounter for Patient ID {encounter.PatientId} updated.");

        return ToDto(encounter);
    }

    public async Task DeleteEncounterAsync(int id, string deletedBy)
    {
        var encounter = await _uow.ClinicalEncounters.GetByIdAsync(id) ?? throw new Exception("Encounter not found");
        encounter.IsDeleted = true;
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(deletedBy, deletedBy, "Delete", "ClinicalEncounter", id, $"Clinical Encounter for Patient ID {encounter.PatientId} deleted.");
    }

    public async Task<IEnumerable<InpatientNursingAssessmentDto>> GetNursingAssessmentsAsync(int admissionId)
    {
        var assessments = await _uow.InpatientNursingAssessments.Query()
            .Where(a => a.BedAdmissionId == admissionId)
            .OrderByDescending(a => a.AssessmentDate)
            .ToListAsync();
        
        return assessments.Select(ToDto);
    }

    public async Task<InpatientNursingAssessmentDto> CreateNursingAssessmentAsync(CreateInpatientNursingAssessmentDto dto, string recordedBy)
    {
        var assessment = new InpatientNursingAssessment
        {
            BedAdmissionId = dto.BedAdmissionId,
            AssessmentDate = DateTime.UtcNow,
            RecordedBy = recordedBy,
            Shift = dto.Shift,
            Neurological = dto.Neurological,
            Respiratory = dto.Respiratory,
            Cardiovascular = dto.Cardiovascular,
            Gastrointestinal = dto.Gastrointestinal,
            Genitourinary = dto.Genitourinary,
            Musculoskeletal = dto.Musculoskeletal,
            SkinIntegumentary = dto.SkinIntegumentary,
            Psychological = dto.Psychological,
            NursingNotes = dto.NursingNotes,
            PlanOfCare = dto.PlanOfCare
        };

        await _uow.InpatientNursingAssessments.AddAsync(assessment);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(recordedBy, recordedBy, "Create", "InpatientNursingAssessment", assessment.Id, $"Nursing assessment recorded for Admission ID {dto.BedAdmissionId}.");

        return ToDto(assessment);
    }

    internal static PatientVitalDto ToDto(PatientVital v) => new(
        v.Id, v.PatientId, v.Patient?.FullName ?? "N/A", v.AppointmentId, v.BedAdmissionId, v.RecordedDate, v.RecordedBy,
        v.Temperature, v.BloodPressureSystolic, v.BloodPressureDiastolic, v.HeartRate, v.RespiratoryRate, v.SpO2,
        v.WeightKg, v.HeightCm, v.BMI, v.PainScale, v.Notes, v.EmergencyAdmissionId
    );

    internal static InpatientNursingAssessmentDto ToDto(InpatientNursingAssessment a) => new(
        a.Id, a.BedAdmissionId, a.AssessmentDate, a.RecordedBy, a.Shift,
        a.Neurological, a.Respiratory, a.Cardiovascular, a.Gastrointestinal, a.Genitourinary,
        a.Musculoskeletal, a.SkinIntegumentary, a.Psychological, a.NursingNotes, a.PlanOfCare
    );

    internal static ClinicalEncounterDto ToDto(ClinicalEncounter e) => new(
        e.Id, e.PatientId, e.Patient?.FullName ?? "N/A", e.DoctorId, e.Doctor?.FullName,
        e.AppointmentId, e.EncounterDate, e.ChiefComplaint, e.Subjective, e.Objective,
        e.Assessment, e.Plan, e.InternalNotes, e.IsFinalized, e.CreatedDate, e.EmergencyAdmissionId
    );
}
