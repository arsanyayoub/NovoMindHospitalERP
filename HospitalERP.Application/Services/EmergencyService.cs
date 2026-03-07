using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class EmergencyService : IEmergencyService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    private readonly INotificationService _notif;
    private readonly IBedManagementService _bedService;

    public EmergencyService(IUnitOfWork uow, IAuditLogService auditLog, INotificationService notif, IBedManagementService bedService)
    {
        _uow = uow;
        _auditLog = auditLog;
        _notif = notif;
        _bedService = bedService;
    }

    public async Task<PagedResult<EmergencyAdmissionDto>> GetActiveAdmissionsAsync(PagedRequest request, int? doctorId = null)
    {
        var query = _uow.EmergencyAdmissions.Query()
            .Include(x => x.Patient)
            .Include(x => x.AssignedDoctor)
            .Where(x => x.Status != "Discharged" && x.Status != "Admitted" && x.Status != "Expired");

        if (doctorId.HasValue)
        {
            query = query.Where(x => x.AssignedDoctorId == doctorId.Value);
        }

        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(x => x.Patient.FullName.Contains(request.Search) || x.ChiefComplaint.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.TriageLevel)
                               .ThenBy(x => x.ArrivalTime)
                               .Skip((request.Page - 1) * request.PageSize)
                               .Take(request.PageSize)
                               .ToListAsync();

        return new PagedResult<EmergencyAdmissionDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<EmergencyAdmissionDto?> GetAdmissionByIdAsync(int id)
    {
        var admission = await _uow.EmergencyAdmissions.Query()
            .Include(x => x.Patient)
            .Include(x => x.AssignedDoctor)
            .FirstOrDefaultAsync(x => x.Id == id);
        return admission == null ? null : ToDto(admission);
    }

    public async Task<EmergencyAdmissionDto> RegisterEmergencyAsync(CreateEmergencyAdmissionDto dto, string createdBy)
    {
        int patientId;
        if (dto.PatientId.HasValue)
        {
            patientId = dto.PatientId.Value;
        }
        else
        {
            // Quick Registration
            var count = await _uow.Patients.CountAsync();
            var patient = new Patient
            {
                PatientCode = $"P{(count + 1):D5}",
                FullName = dto.PatientFullNameManual ?? "UNKNOWN EMERGENCY",
                PhoneNumber = dto.PatientPhoneNumber,
                Gender = dto.PatientGender ?? "Other",
                DateOfBirth = dto.PatientDOB ?? DateTime.Now.AddYears(-30),
                CreatedBy = createdBy,
                IsActive = true
            };
            await _uow.Patients.AddAsync(patient);
            await _uow.SaveChangesAsync();
            patientId = patient.Id;
        }

        var admission = new EmergencyAdmission
        {
            PatientId = patientId,
            ArrivalTime = DateTime.Now,
            ArrivalMode = dto.ArrivalMode,
            ChiefComplaint = dto.ChiefComplaint,
            ERBayNumber = dto.ERBayNumber,
            Status = "Arrived",
            CreatedBy = createdBy
        };

        await _uow.EmergencyAdmissions.AddAsync(admission);
        await _uow.SaveChangesAsync();

        await _auditLog.LogAsync(createdBy, createdBy, "Create", "EmergencyAdmission", admission.Id, $"Emergency admission for {admission.PatientId} created.");
        
        // Notify ER Staff
        await _notif.CreateNotificationAsync("ER_NEW_ARRIVAL", $"New ER Arrival: {dto.PatientFullNameManual ?? "Patient"}", "ER");

        return ToDto(await _uow.EmergencyAdmissions.Query().Include(x => x.Patient).FirstAsync(x => x.Id == admission.Id));
    }

    public async Task<EmergencyAdmissionDto> UpdateTriageAsync(int id, TriageUpdateDto dto, string updatedBy)
    {
        var admission = await _uow.EmergencyAdmissions.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        
        admission.TriageLevel = dto.TriageLevel;
        admission.TriageCategory = dto.TriageCategory;
        admission.TriageNotes = dto.TriageNotes;
        admission.TriageTime = DateTime.Now;
        admission.Status = "Triaged";
        admission.UpdatedBy = updatedBy;

        // Record Vitals if provided
        if (dto.Temp.HasValue || !string.IsNullOrEmpty(dto.BP))
        {
            var vitals = new ERTriageVital
            {
                EmergencyAdmissionId = id,
                Temperature = dto.Temp ?? 0,
                BloodPressure = dto.BP ?? "",
                HeartRate = dto.HR ?? 0,
                RespiratoryRate = dto.RR ?? 0,
                SpO2 = dto.SpO2 ?? 0,
                PainScale = dto.PainScale ?? "0",
                CreatedBy = updatedBy
            };
            await _uow.ERTriageVitals.AddAsync(vitals);
            admission.InitialVitalSigns = $"T:{vitals.Temperature}, BP:{vitals.BloodPressure}, HR:{vitals.HeartRate}, SpO2:{vitals.SpO2}";
        }

        _uow.EmergencyAdmissions.Update(admission);
        await _uow.SaveChangesAsync();

        if (dto.TriageLevel <= 2)
        {
            await _notif.CreateNotificationAsync("ER_CRITICAL_TRIAGE", $"CRITICAL TRIAGE: Level {dto.TriageLevel} - {admission.ChiefComplaint}", "ER");
        }

        return ToDto(await GetFullEntity(id));
    }

    public async Task<EmergencyAdmissionDto> AssignDoctorAsync(int id, int doctorId, string updatedBy)
    {
        var admission = await _uow.EmergencyAdmissions.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        admission.AssignedDoctorId = doctorId;
        admission.Status = "UnderTreatment";
        admission.UpdatedBy = updatedBy;

        _uow.EmergencyAdmissions.Update(admission);
        await _uow.SaveChangesAsync();

        return ToDto(await GetFullEntity(id));
    }

    public async Task<EmergencyAdmissionDto> UpdateStatusAsync(int id, string status, string? disposition, string? notes, string updatedBy)
    {
        var admission = await _uow.EmergencyAdmissions.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        admission.Status = status;
        if (!string.IsNullOrEmpty(disposition))
        {
            admission.Disposition = disposition;
            admission.DispositionTime = DateTime.Now;
        }
        if (!string.IsNullOrEmpty(notes)) admission.Notes = notes;
        admission.UpdatedBy = updatedBy;

        _uow.EmergencyAdmissions.Update(admission);
        await _uow.SaveChangesAsync();

        return ToDto(await GetFullEntity(id));
    }

    public async Task<IEnumerable<ERTriageVitalDto>> GetTriageVitalsAsync(int admissionId)
    {
        var vitals = await _uow.ERTriageVitals.Query()
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.RecordedAt)
            .ToListAsync();
        return vitals.Select(v => new ERTriageVitalDto(v.Id, v.EmergencyAdmissionId, v.Temperature, v.BloodPressure, v.HeartRate, v.RespiratoryRate, v.SpO2, v.PainScale, v.RecordedAt));
    }

    public async Task<EmergencyOccupancyDto> GetEROccupancyAsync()
    {
        var active = await _uow.EmergencyAdmissions.Query()
            .Where(x => x.Status != "Discharged" && x.Status != "Admitted" && x.Status != "Expired")
            .ToListAsync();

        return new EmergencyOccupancyDto(
            active.Count,
            active.Count(x => x.TriageLevel == 1),
            active.Count(x => x.TriageLevel == 2),
            active.Count(x => x.TriageLevel == 3),
            active.Count(x => x.TriageLevel == null) // Waiting for Triage
        );
    }

    public async Task<ERTreatmentSummaryDto> GetTreatmentSummaryAsync(int admissionId)
    {
        var labs = await _uow.LabRequests.Query()
            .Include(x => x.Patient).Include(x => x.Doctor)
            .Include(x => x.Results).ThenInclude(r => r.LabTest)
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();

        var rads = await _uow.RadiologyRequests.Query()
            .Include(x => x.Patient).Include(x => x.Doctor)
            .Include(x => x.Results).ThenInclude(r => r.RadiologyTest)
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();

        var prescriptions = await _uow.Prescriptions.Query()
            .Include(x => x.Patient).Include(x => x.Doctor)
            .Include(x => x.Items).ThenInclude(i => i.Item)
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();

        var vitals = await _uow.PatientVitals.Query()
            .Include(x => x.Patient)
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.RecordedDate)
            .ToListAsync();

        var encounters = await _uow.ClinicalEncounters.Query()
            .Include(x => x.Patient).Include(x => x.Doctor)
            .Where(x => x.EmergencyAdmissionId == admissionId)
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();

        return new ERTreatmentSummaryDto(
            admissionId,
            labs.Select(LabService.ToRDto).ToList(),
            rads.Select(RadiologyService.ToRDto).ToList(),
            prescriptions.Select(PharmacyService.ToDto).ToList(),
            vitals.Select(ClinicalService.ToDto).ToList(),
            encounters.Select(ClinicalService.ToDto).ToList()
        );
    }

    public async Task<EmergencyAdmissionDto> TransferToInpatientAsync(int id, TransferToInpatientDto dto, string updatedBy)
    {
        var admission = await _uow.EmergencyAdmissions.GetByIdAsync(id) ?? throw new KeyNotFoundException("Emergency Admission not found");
        if (admission.Status == "Discharged" || admission.Status == "Admitted")
        {
            throw new InvalidOperationException("Patient is already discharged or admitted.");
        }

        // Admit via BedManagementService
        var bedAdmitDto = new HospitalERP.Application.DTOs.BedManagement.AdmitPatientDto
        {
            PatientId = admission.PatientId,
            BedId = dto.BedId,
            DoctorId = dto.DoctorId ?? admission.AssignedDoctorId,
            AdmissionType = "Emergency Transfer",
            AdmissionReason = dto.AdmissionReason ?? "Transferred from Emergency Room",
            Notes = dto.Notes,
            EmergencyAdmissionId = admission.Id
        };

        var bedAdmission = await _bedService.AdmitPatientAsync(bedAdmitDto, updatedBy);

        // Update ER Admission Status
        admission.Status = "Admitted";
        admission.Disposition = "Admitted to Ward";
        admission.DispositionTime = DateTime.UtcNow;
        admission.InpatientAdmissionId = bedAdmission.Id;
        admission.UpdatedBy = updatedBy;
        admission.UpdatedDate = DateTime.UtcNow;

        _uow.EmergencyAdmissions.Update(admission);
        await _uow.SaveChangesAsync();

        await _auditLog.LogAsync(updatedBy, updatedBy, "Status Update", "EmergencyAdmission", admission.Id, "Transferred to Inpatient Ward");
        await _notif.CreateNotificationAsync("ER_TRANSFER", $"Patient {admission.Patient?.FullName} transferred from ER to Bed {bedAdmission.BedNumber}", "Ward");

        return ToDto(await GetFullEntity(id));
    }

    private async Task<EmergencyAdmission> GetFullEntity(int id)
    {
        return await _uow.EmergencyAdmissions.Query()
            .Include(x => x.Patient)
            .Include(x => x.AssignedDoctor)
            .FirstAsync(x => x.Id == id);
    }

    private EmergencyAdmissionDto ToDto(EmergencyAdmission x) => new EmergencyAdmissionDto(
        x.Id, x.PatientId, x.Patient?.PatientCode ?? "", x.Patient?.FullName ?? "Unknown", x.Patient?.Gender ?? "",
        x.Patient != null ? (DateTime.Now.Year - x.Patient.DateOfBirth.Year) : 0,
        x.ArrivalTime, x.ArrivalMode, x.ChiefComplaint,
        x.TriageLevel, x.TriageCategory, x.TriageTime, x.TriageNotes,
        x.AssignedDoctorId, x.AssignedDoctor?.FullName,
        x.ERBayNumber, x.Status, x.Disposition, x.Diagnosis, x.Notes,
        x.InpatientAdmissionId
    );
}
