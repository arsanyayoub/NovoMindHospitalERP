using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class BloodBankService : IBloodBankService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;

    public BloodBankService(IUnitOfWork uow, IAuditLogService auditLog)
    {
        _uow = uow;
        _auditLog = auditLog;
    }

    // ── Donors ──────────────────────────────────────────────────────
    public async Task<PagedResult<BloodDonorDto>> GetDonorsAsync(PagedRequest request, string? bloodGroup = null)
    {
        var query = _uow.BloodDonors.Query().AsQueryable();
        if (!string.IsNullOrEmpty(bloodGroup)) query = query.Where(d => d.BloodGroup == bloodGroup);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(d => d.FullName.Contains(request.Search) || d.DonorCode.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderBy(d => d.FullName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(d => ToDto(d))
            .ToListAsync();

        return new PagedResult<BloodDonorDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<BloodDonorDto?> GetDonorByIdAsync(int id)
    {
        var donor = await _uow.BloodDonors.GetByIdAsync(id);
        return donor == null ? null : ToDto(donor);
    }

    public async Task<BloodDonorDto> CreateDonorAsync(CreateBloodDonorDto dto, string userId)
    {
        var count = await _uow.BloodDonors.CountAsync();
        var donor = new BloodDonor
        {
            FullName = dto.FullName,
            DonorCode = $"DON-{(count + 1):D4}",
            BloodGroup = dto.BloodGroup,
            RhFactor = dto.RhFactor,
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            IsEligible = dto.IsEligible,
            EligibilityNotes = dto.EligibilityNotes,
            CreatedBy = userId
        };

        await _uow.BloodDonors.AddAsync(donor);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "BloodDonor", donor.Id, $"Registered donor {donor.FullName}");

        return ToDto(donor);
    }

    public async Task<BloodDonorDto> UpdateDonorAsync(int id, CreateBloodDonorDto dto, string userId)
    {
        var donor = await _uow.BloodDonors.GetByIdAsync(id) ?? throw new KeyNotFoundException("Donor not found");
        donor.FullName = dto.FullName;
        donor.BloodGroup = dto.BloodGroup;
        donor.RhFactor = dto.RhFactor;
        donor.DateOfBirth = dto.DateOfBirth;
        donor.Gender = dto.Gender;
        donor.PhoneNumber = dto.PhoneNumber;
        donor.Email = dto.Email;
        donor.Address = dto.Address;
        donor.IsEligible = dto.IsEligible;
        donor.EligibilityNotes = dto.EligibilityNotes;
        donor.UpdatedBy = userId;
        donor.UpdatedDate = DateTime.UtcNow;

        _uow.BloodDonors.Update(donor);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "BloodDonor", id, $"Updated donor {donor.FullName}");

        return ToDto(donor);
    }

    // ── Donations ────────────────────────────────────────────────────
    public async Task<PagedResult<BloodDonationDto>> GetDonationsAsync(PagedRequest request, int? donorId = null)
    {
        var query = _uow.BloodDonations.Query().Include(d => d.BloodDonor).AsQueryable();
        if (donorId.HasValue) query = query.Where(d => d.BloodDonorId == donorId);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(d => d.DonationDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(d => ToDto(d))
            .ToListAsync();

        return new PagedResult<BloodDonationDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<BloodDonationDto> RecordDonationAsync(CreateBloodDonationDto dto, string userId)
    {
        var donor = await _uow.BloodDonors.GetByIdAsync(dto.BloodDonorId) ?? throw new KeyNotFoundException("Donor not found");
        
        var donation = new BloodDonation
        {
            BloodDonorId = dto.BloodDonorId,
            DonationDate = DateTime.UtcNow,
            VolumeMl = dto.VolumeMl,
            ComponentType = dto.ComponentType,
            BagNumber = dto.BagNumber,
            ExpiryDate = dto.ExpiryDate,
            CollectedBy = dto.CollectedBy,
            CreatedBy = userId
        };

        var stock = new BloodStock
        {
            BagNumber = dto.BagNumber,
            BloodGroup = donor.BloodGroup,
            RhFactor = donor.RhFactor,
            ComponentType = dto.ComponentType,
            ExpiryDate = dto.ExpiryDate,
            VolumeMl = dto.VolumeMl,
            Status = "Available",
            StorageLocation = dto.StorageLocation,
            CreatedBy = userId
        };

        donor.LastDonationDate = DateTime.UtcNow;
        _uow.BloodDonors.Update(donor);
        
        await _uow.BloodDonations.AddAsync(donation);
        await _uow.BloodStocks.AddAsync(stock);
        await _uow.SaveChangesAsync();

        await _auditLog.LogAsync(userId, userId, "Create", "BloodDonation", donation.Id, $"Recorded donation {donation.BagNumber} for donor {donor.FullName}");

        return ToDto(donation);
    }

    // ── Stock ────────────────────────────────────────────────────────
    public async Task<PagedResult<BloodStockDto>> GetStockAsync(PagedRequest request, string? bloodGroup = null, string? component = null, string? status = null)
    {
        var query = _uow.BloodStocks.Query().Include(s => s.ReservedForPatient).AsQueryable();
        if (!string.IsNullOrEmpty(bloodGroup)) query = query.Where(s => s.BloodGroup == bloodGroup);
        if (!string.IsNullOrEmpty(component)) query = query.Where(s => s.ComponentType == component);
        if (!string.IsNullOrEmpty(status)) query = query.Where(s => s.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderBy(s => s.ExpiryDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(s => ToDto(s))
            .ToListAsync();

        return new PagedResult<BloodStockDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<BloodStockDto> UpdateStockStatusAsync(int id, string status, string? storageLocation, string userId)
    {
        var stock = await _uow.BloodStocks.GetByIdAsync(id) ?? throw new KeyNotFoundException("Stock item not found");
        stock.Status = status;
        if (storageLocation != null) stock.StorageLocation = storageLocation;
        stock.UpdatedBy = userId;
        stock.UpdatedDate = DateTime.UtcNow;

        _uow.BloodStocks.Update(stock);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "BloodStock", id, $"Updated stock {stock.BagNumber} status to {status}");

        return ToDto(stock);
    }

    // ── Requests ──────────────────────────────────────────────────────
    public async Task<PagedResult<BloodRequestDto>> GetRequestsAsync(PagedRequest request, string? status = null)
    {
        var query = _uow.BloodRequests.Query().Include(r => r.Patient).AsQueryable();
        if (!string.IsNullOrEmpty(status)) query = query.Where(r => r.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => ToDto(r))
            .ToListAsync();

        return new PagedResult<BloodRequestDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<BloodRequestDto> CreateRequestAsync(CreateBloodRequestDto dto, string userId)
    {
        var count = await _uow.BloodRequests.CountAsync();
        var br = new BloodRequest
        {
            RequestNumber = $"BR-{(count + 1):D4}",
            PatientId = dto.PatientId,
            BloodGroupRequired = dto.BloodGroupRequired,
            RhFactorRequired = dto.RhFactorRequired,
            ComponentType = dto.ComponentType,
            UnitsRequested = dto.UnitsRequested,
            Urgency = dto.Urgency,
            ClinicalIndication = dto.ClinicalIndication,
            RequiredDate = dto.RequiredDate,
            Status = "Pending",
            RequestedBy = userId,
            CreatedBy = userId
        };

        await _uow.BloodRequests.AddAsync(br);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "BloodRequest", br.Id, $"Created blood request {br.RequestNumber} for Patient {dto.PatientId}");

        var reload = await _uow.BloodRequests.Query().Include(r => r.Patient).FirstOrDefaultAsync(x => x.Id == br.Id);
        return ToDto(reload!);
    }

    public async Task<BloodRequestDto> UpdateRequestAsync(int id, string status, string userId)
    {
        var br = await _uow.BloodRequests.Query().Include(r => r.Patient).FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Request not found");
        br.Status = status;
        br.UpdatedBy = userId;
        br.UpdatedDate = DateTime.UtcNow;

        _uow.BloodRequests.Update(br);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "BloodRequest", id, $"Updated blood request {br.RequestNumber} status to {status}");

        return ToDto(br);
    }

    // ── Mapping ──────────────────────────────────────────────────────
    private static BloodDonorDto ToDto(BloodDonor d) => new(
        d.Id, d.FullName, d.DonorCode, d.BloodGroup, d.RhFactor, d.DateOfBirth, d.Gender, d.PhoneNumber, d.Email, d.Address, d.LastDonationDate, d.IsEligible, d.EligibilityNotes
    );

    private static BloodDonationDto ToDto(BloodDonation d) => new(
        d.Id, d.BloodDonorId, d.BloodDonor?.FullName ?? "N/A", d.BloodDonor?.DonorCode ?? "N/A", d.DonationDate, d.VolumeMl, d.ComponentType, d.BagNumber, d.ExpiryDate, d.CollectedBy
    );

    private static BloodStockDto ToDto(BloodStock s) => new(
        s.Id, s.BagNumber, s.BloodGroup, s.RhFactor, s.ComponentType, s.ExpiryDate, s.VolumeMl, s.Status, s.StorageLocation, s.ReservedForPatientId, s.ReservedForPatient?.FullName
    );

    private static BloodRequestDto ToDto(BloodRequest r) => new(
        r.Id, r.RequestNumber, r.PatientId, r.Patient?.FullName ?? "N/A", r.BloodGroupRequired, r.RhFactorRequired, r.ComponentType, r.UnitsRequested, r.Urgency, r.Status, r.ClinicalIndication, r.RequestedBy, r.RequiredDate, r.CreatedDate
    );
}
