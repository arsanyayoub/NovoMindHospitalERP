using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HospitalERP.Application.Services;

public class ReferralService : IReferralService
{
    private readonly IUnitOfWork _uow;

    public ReferralService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    // ===== FACILITIES =====
    public async Task<IEnumerable<ReferralFacilityDto>> GetFacilitiesAsync()
    {
        return await _uow.ReferralFacilities.Query()
            .Where(f => f.IsActive)
            .Select(f => new ReferralFacilityDto(f.Id, f.Name, f.Type, f.ContactPerson, f.Email, f.Phone, f.Address))
            .ToListAsync();
    }

    public async Task<ReferralFacilityDto> CreateFacilityAsync(CreateReferralFacilityDto dto)
    {
        var facility = new ReferralFacility
        {
            Name = dto.Name,
            Type = dto.Type,
            ContactPerson = dto.ContactPerson,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address
        };
        await _uow.ReferralFacilities.AddAsync(facility);
        await _uow.SaveChangesAsync();
        return new ReferralFacilityDto(facility.Id, facility.Name, facility.Type, facility.ContactPerson, facility.Email, facility.Phone, facility.Address);
    }

    // ===== REFERRALS =====
    public async Task<PagedResult<ExternalReferralDto>> GetReferralsAsync(PagedRequest request)
    {
        var query = _uow.ExternalReferrals.Query()
            .Include(r => r.Patient)
            .Include(r => r.Facility);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => new ExternalReferralDto(
                r.Id, r.PatientId, r.Patient.FullName, r.Patient.PatientCode, r.FacilityId, r.Facility.Name, r.ReferralType, r.Reason, r.Status, r.ReferralDate, r.ClinicalSummary, r.ExternalDoctorName
            )).ToListAsync();

        return new PagedResult<ExternalReferralDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<ExternalReferralDto> CreateReferralAsync(CreateExternalReferralDto dto, string userId)
    {
        var patient = await _uow.Patients.GetByIdAsync(dto.PatientId);
        var facility = await _uow.ReferralFacilities.GetByIdAsync(dto.FacilityId);
        if (patient == null || facility == null) throw new Exception("Patient or Facility not found");

        var referral = new ExternalReferral
        {
            PatientId = dto.PatientId,
            FacilityId = dto.FacilityId,
            ReferralType = dto.ReferralType,
            Reason = dto.Reason,
            ClinicalSummary = dto.ClinicalSummary,
            ExternalDoctorName = dto.ExternalDoctorName,
            Notes = dto.Notes,
            Status = "Pending",
            CreatedBy = userId
        };

        await _uow.ExternalReferrals.AddAsync(referral);
        await _uow.SaveChangesAsync();

        return new ExternalReferralDto(referral.Id, patient.Id, patient.FullName, patient.PatientCode, facility.Id, facility.Name, referral.ReferralType, referral.Reason, referral.Status, referral.ReferralDate, referral.ClinicalSummary, referral.ExternalDoctorName);
    }

    public async Task UpdateReferralStatusAsync(int referralId, string status)
    {
        var referral = await _uow.ExternalReferrals.GetByIdAsync(referralId);
        if (referral != null)
        {
            referral.Status = status;
            await _uow.SaveChangesAsync();
        }
    }

    // ===== HIE (Health Information Exchange) =====
    public async Task<string> ExportReferralDataAsync(HieExportDto dto)
    {
        var refData = await _uow.ExternalReferrals.Query()
            .Include(r => r.Patient)
            .Include(r => r.Facility)
            .FirstOrDefaultAsync(r => r.Id == dto.ReferralId);

        if (refData == null) throw new Exception("Referral not found");

        // Simulate FHIR Patient / DocumentReference bundle
        var fhirResource = new
        {
            resourceType = "Bundle",
            type = "document",
            timestamp = DateTime.UtcNow,
            entry = new object[]
            {
                new { resource = new { resourceType = "Patient", name = new[] { new { family = refData.Patient.FullName } }, identifier = new[] { new { value = refData.Patient.PatientCode } } } },
                new { resource = new { resourceType = "ReferralRequest", status = "active", intent = "order", patient = new { display = refData.Patient.FullName }, reasonCode = new[] { new { text = refData.Reason } } } }
            }
        };

        var payload = JsonSerializer.Serialize(fhirResource, new JsonSerializerOptions { WriteIndented = true });

        var transaction = new HieTransaction
        {
            ExternalReferralId = dto.ReferralId,
            TransactionType = "Export",
            DataStandard = dto.Standard,
            Payload = payload,
            Status = "Success"
        };

        await _uow.HieTransactions.AddAsync(transaction);
        await _uow.SaveChangesAsync();

        return payload;
    }

    public async Task<IEnumerable<HieTransactionDto>> GetExchangeHistoryAsync(int referralId)
    {
        return await _uow.HieTransactions.Query()
            .Where(t => t.ExternalReferralId == referralId)
            .OrderByDescending(t => t.CreatedDate)
            .Select(t => new HieTransactionDto(t.Id, t.TransactionType, t.DataStandard, t.CreatedDate, t.Status))
            .ToListAsync();
    }
}
