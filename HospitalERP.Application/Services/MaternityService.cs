using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class MaternityService : IMaternityService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;

    public MaternityService(IUnitOfWork uow, IAuditLogService auditLog)
    {
        _uow = uow;
        _auditLog = auditLog;
    }

    public async Task<PagedResult<PregnancyRecordDto>> GetPregnanciesAsync(PagedRequest request, string? status = null)
    {
        var query = _uow.PregnancyRecords.Query().Include(p => p.Patient).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.EDD)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => ToDto(p))
            .ToListAsync();

        return new PagedResult<PregnancyRecordDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PregnancyRecordDto> CreatePregnancyAsync(CreatePregnancyRecordDto dto, string userId)
    {
        var record = new PregnancyRecord
        {
            PatientId = dto.PatientId,
            LMP = dto.LMP,
            EDD = dto.EDD,
            Gravidity = dto.Gravidity,
            Parity = dto.Parity,
            BloodGroup = dto.BloodGroup,
            RiskFactors = dto.RiskFactors,
            Status = "Active",
            CreatedBy = userId
        };

        await _uow.PregnancyRecords.AddAsync(record);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "PregnancyRecord", record.Id, $"Started pregnancy tracking for Patient {dto.PatientId}");

        var reload = await _uow.PregnancyRecords.Query().Include(p => p.Patient).FirstOrDefaultAsync(x => x.Id == record.Id);
        return ToDto(reload!);
    }

    public async Task<DeliveryRecordDto> RecordDeliveryAsync(CreateDeliveryRecordDto dto, string userId)
    {
        var delivery = new DeliveryRecord
        {
            PregnancyRecordId = dto.PregnancyRecordId,
            DeliveryDateTime = dto.DeliveryDateTime,
            ModeOfDelivery = dto.ModeOfDelivery,
            Complications = dto.Complications,
            AttendingDoctor = dto.AttendingDoctor,
            CreatedBy = userId
        };

        var pregnancy = await _uow.PregnancyRecords.GetByIdAsync(dto.PregnancyRecordId) ?? throw new KeyNotFoundException("Pregnancy record not found");
        pregnancy.Status = "Delivered";
        _uow.PregnancyRecords.Update(pregnancy);

        await _uow.DeliveryRecords.AddAsync(delivery);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "DeliveryRecord", delivery.Id, $"Recorded delivery for Pregnancy {dto.PregnancyRecordId}");

        return ToDto(delivery);
    }

    public async Task<IEnumerable<DeliveryRecordDto>> GetDeliveriesByPregnancyAsync(int pregnancyId)
    {
        return await _uow.DeliveryRecords.Query()
            .Where(d => d.PregnancyRecordId == pregnancyId)
            .Include(d => d.NeonatalRecords)
            .ThenInclude(n => n.BabyPatient)
            .Select(d => ToDto(d))
            .ToListAsync();
    }

    public async Task<NeonatalRecordDto> RecordBirthAsync(CreateNeonatalRecordDto dto, string userId)
    {
        // 1. Create a Patient record for the baby
        var babyPatient = new Patient
        {
            FullName = dto.FullName,
            PatientCode = "BABY-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
            Gender = dto.Gender,
            DateOfBirth = DateTime.UtcNow,
            CreatedBy = userId
        };
        await _uow.Patients.AddAsync(babyPatient);
        await _uow.SaveChangesAsync();

        // 2. Create the Neonatal record
        var neonatal = new NeonatalRecord
        {
            DeliveryRecordId = dto.DeliveryRecordId,
            BabyPatientId = babyPatient.Id,
            BirthWeight = dto.BirthWeight,
            Apgar1Min = dto.Apgar1Min,
            Apgar5Min = dto.Apgar5Min,
            Gender = dto.Gender,
            HealthStatus = dto.HealthStatus,
            CreatedBy = userId
        };

        await _uow.NeonatalRecords.AddAsync(neonatal);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "NeonatalRecord", neonatal.Id, $"Recorded birth of {dto.FullName}");

        var reload = await _uow.NeonatalRecords.Query().Include(n => n.BabyPatient).FirstOrDefaultAsync(x => x.Id == neonatal.Id);
        return ToDto(reload!);
    }

    public async Task<PagedResult<NeonatalRecordDto>> GetNeonatalRecordsAsync(PagedRequest request, string? gender = null)
    {
        var query = _uow.NeonatalRecords.Query().Include(n => n.BabyPatient).AsQueryable();
        if (!string.IsNullOrEmpty(gender)) query = query.Where(n => n.Gender == gender);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(n => n.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(n => ToDto(n))
            .ToListAsync();

        return new PagedResult<NeonatalRecordDto>(items, total, request.Page, request.PageSize);
    }

    private static PregnancyRecordDto ToDto(PregnancyRecord p) => new(
        p.Id, p.PatientId, p.Patient?.FullName ?? "N/A", p.LMP, p.EDD, p.Gravidity, p.Parity, p.BloodGroup, p.RiskFactors, p.Status
    );

    private static DeliveryRecordDto ToDto(DeliveryRecord d) => new(
        d.Id, d.PregnancyRecordId, d.DeliveryDateTime, d.ModeOfDelivery, d.Complications, d.AttendingDoctor, 
        d.NeonatalRecords.Select(n => ToDto(n)).ToList()
    );

    private static NeonatalRecordDto ToDto(NeonatalRecord n) => new(
        n.Id, n.DeliveryRecordId, n.BabyPatientId, n.BabyPatient?.FullName ?? "N/A", n.BirthWeight, n.Apgar1Min, n.Apgar5Min, n.Gender, n.HealthStatus
    );
}
