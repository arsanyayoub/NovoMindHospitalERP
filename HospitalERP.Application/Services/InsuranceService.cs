using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class InsuranceService : IInsuranceService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;

    public InsuranceService(IUnitOfWork uow, IAuditLogService auditLog)
    {
        _uow = uow;
        _auditLog = auditLog;
    }

    // ── Providers ───────────────────────────────────────────────────
    public async Task<IEnumerable<InsuranceProviderDto>> GetProvidersAsync()
    {
        var providers = await _uow.InsuranceProviders.Query()
            .Include(p => p.Plans)
            .ToListAsync();
        return providers.Select(ToDto);
    }

    public async Task<InsuranceProviderDto?> GetProviderByIdAsync(int id)
    {
        var p = await _uow.InsuranceProviders.Query()
            .Include(p => p.Plans)
            .FirstOrDefaultAsync(x => x.Id == id);
        return p == null ? null : ToDto(p);
    }

    public async Task<InsuranceProviderDto> CreateProviderAsync(CreateInsuranceProviderDto dto, string userId)
    {
        var provider = new InsuranceProvider
        {
            Name = dto.Name,
            ContactPerson = dto.ContactPerson,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            TPA = dto.TPA,
            IsActive = dto.IsActive,
            CreatedBy = userId
        };

        await _uow.InsuranceProviders.AddAsync(provider);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "InsuranceProvider", provider.Id, $"Created provider {provider.Name}");

        return ToDto(provider);
    }

    public async Task<InsuranceProviderDto> UpdateProviderAsync(int id, CreateInsuranceProviderDto dto, string userId)
    {
        var p = await _uow.InsuranceProviders.GetByIdAsync(id) ?? throw new KeyNotFoundException("Provider not found");
        p.Name = dto.Name;
        p.ContactPerson = dto.ContactPerson;
        p.Email = dto.Email;
        p.PhoneNumber = dto.PhoneNumber;
        p.Address = dto.Address;
        p.TPA = dto.TPA;
        p.IsActive = dto.IsActive;
        p.UpdatedBy = userId;
        p.UpdatedDate = DateTime.UtcNow;

        _uow.InsuranceProviders.Update(p);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "InsuranceProvider", id, $"Updated provider {p.Name}");

        return (await GetProviderByIdAsync(id))!;
    }

    // ── Plans ────────────────────────────────────────────────────────
    public async Task<IEnumerable<InsurancePlanDto>> GetPlansAsync(int? providerId)
    {
        var query = _uow.InsurancePlans.Query().Include(p => p.InsuranceProvider);
        if (providerId.HasValue) query = (Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<InsurancePlan, InsuranceProvider>)query.Where(p => p.InsuranceProviderId == providerId);
        
        var plans = await query.ToListAsync();
        return plans.Select(ToPDto);
    }

    public async Task<InsurancePlanDto> CreatePlanAsync(CreateInsurancePlanDto dto, string userId)
    {
        var plan = new InsurancePlan
        {
            InsuranceProviderId = dto.InsuranceProviderId,
            PlanName = dto.PlanName,
            PlanCode = dto.PlanCode,
            CoveragePercentage = dto.CoveragePercentage,
            CoPayAmount = dto.CoPayAmount,
            MaxLimit = dto.MaxLimit,
            Exclusions = dto.Exclusions,
            RequiresPreAuth = dto.RequiresPreAuth,
            IsActive = dto.IsActive,
            CreatedBy = userId
        };

        await _uow.InsurancePlans.AddAsync(plan);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Create", "InsurancePlan", plan.Id, $"Created plan {plan.PlanName} for provider ID {plan.InsuranceProviderId}");

        var reload = await _uow.InsurancePlans.Query().Include(p => p.InsuranceProvider).FirstOrDefaultAsync(x => x.Id == plan.Id);
        return ToPDto(reload!);
    }

    public async Task<InsurancePlanDto> UpdatePlanAsync(int id, CreateInsurancePlanDto dto, string userId)
    {
        var p = await _uow.InsurancePlans.GetByIdAsync(id) ?? throw new KeyNotFoundException("Plan not found");
        p.PlanName = dto.PlanName;
        p.PlanCode = dto.PlanCode;
        p.CoveragePercentage = dto.CoveragePercentage;
        p.CoPayAmount = dto.CoPayAmount;
        p.MaxLimit = dto.MaxLimit;
        p.Exclusions = dto.Exclusions;
        p.RequiresPreAuth = dto.RequiresPreAuth;
        p.IsActive = dto.IsActive;
        p.UpdatedBy = userId;
        p.UpdatedDate = DateTime.UtcNow;

        _uow.InsurancePlans.Update(p);
        await _uow.SaveChangesAsync();
        
        var reload = await _uow.InsurancePlans.Query().Include(px => px.InsuranceProvider).FirstOrDefaultAsync(x => x.Id == id);
        return ToPDto(reload!);
    }

    // ── Claims ───────────────────────────────────────────────────────
    public async Task<PagedResult<InsuranceClaimDto>> GetClaimsAsync(PagedRequest request, string? status)
    {
        var query = _uow.InsuranceClaims.Query()
            .Include(c => c.Invoice)
            .Include(c => c.Patient)
            .Include(c => c.InsuranceProvider)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status)) query = query.Where(c => c.Status == status);
        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(c => c.ClaimNumber.Contains(request.Search) || c.Patient.FullName.Contains(request.Search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedResult<InsuranceClaimDto>(items.Select(ToCDto), total, request.Page, request.PageSize);
    }

    public async Task<InsuranceClaimDto> CreateClaimAsync(CreateInsuranceClaimDto dto, string userId)
    {
        var count = await _uow.InsuranceClaims.CountAsync();
        var claim = new InsuranceClaim
        {
            ClaimNumber = $"CLM{(count + 1):D6}",
            InvoiceId = dto.InvoiceId,
            PatientId = dto.PatientId,
            InsuranceProviderId = dto.InsuranceProviderId,
            ClaimAmount = dto.ClaimAmount,
            AuthCode = dto.AuthCode,
            Status = "Pending",
            SubmissionDate = DateTime.UtcNow,
            CreatedBy = userId
        };

        await _uow.InsuranceClaims.AddAsync(claim);
        await _uow.SaveChangesAsync();
        
        await _auditLog.LogAsync(userId, userId, "Create", "InsuranceClaim", claim.Id, $"Generated claim {claim.ClaimNumber} for Invoice {dto.InvoiceId}");

        var reload = await _uow.InsuranceClaims.Query()
            .Include(c => c.Invoice).Include(c => c.Patient).Include(c => c.InsuranceProvider)
            .FirstOrDefaultAsync(x => x.Id == claim.Id);
        return ToCDto(reload!);
    }

    public async Task<InsuranceClaimDto> UpdateClaimStatusAsync(int id, UpdateClaimStatusDto dto, string userId)
    {
        var claim = await _uow.InsuranceClaims.Query()
            .Include(c => c.Invoice)
            .Include(c => c.InsuranceProvider)
            .FirstOrDefaultAsync(c => c.Id == id) ?? throw new KeyNotFoundException("Claim not found");

        var oldStatus = claim.Status;
        claim.Status = dto.Status;
        claim.ApprovedAmount = dto.ApprovedAmount;
        claim.RejectionReason = dto.RejectionReason;
        claim.StatusDate = DateTime.UtcNow;
        claim.UpdatedBy = userId;
        claim.UpdatedDate = DateTime.UtcNow;

        _uow.InsuranceClaims.Update(claim);

        // Auto-record payment if claim is approved/paid
        if ((dto.Status == "Approved" || dto.Status == "Paid") && oldStatus != "Approved" && oldStatus != "Paid")
        {
            if (claim.Invoice != null && claim.ApprovedAmount > 0)
            {
                var count = await _uow.Payments.CountAsync();
                var payment = new Payment
                {
                    PaymentNumber = $"PAY-INS{(count + 1):D6}",
                    InvoiceId = claim.InvoiceId,
                    PatientId = claim.PatientId,
                    Amount = claim.ApprovedAmount,
                    PaymentDate = DateTime.UtcNow,
                    PaymentMethod = PaymentMethod.BankTransfer,
                    ReferenceNumber = claim.ClaimNumber,
                    Notes = $"Insurance Settlement - {claim.InsuranceProvider?.Name ?? "TPA"}",
                    CreatedBy = userId
                };
                
                claim.Invoice.PaidAmount += claim.ApprovedAmount;
                claim.Invoice.Status = claim.Invoice.PaidAmount >= claim.Invoice.TotalAmount ? HospitalERP.Domain.Enums.InvoiceStatus.Paid : HospitalERP.Domain.Enums.InvoiceStatus.PartiallyPaid;
                
                await _uow.Payments.AddAsync(payment);
                _uow.Invoices.Update(claim.Invoice);
            }
        }

        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(userId, userId, "Update", "InsuranceClaim", id, $"Claim {claim.ClaimNumber} status updated to {dto.Status}");

        var reload = await _uow.InsuranceClaims.Query()
            .Include(c => c.Invoice).Include(c => c.Patient).Include(c => c.InsuranceProvider)
            .FirstOrDefaultAsync(x => x.Id == id);
        return ToCDto(reload!);
    }

    // ── Mapping ──────────────────────────────────────────────────────
    private static InsuranceProviderDto ToDto(InsuranceProvider p) => new(p.Id, p.Name, p.ContactPerson, p.Email, p.PhoneNumber, p.Address, p.TPA, p.IsActive, p.Plans?.Select(ToPDto).ToList() ?? new());
    private static InsurancePlanDto ToPDto(InsurancePlan p) => new(p.Id, p.InsuranceProviderId, p.InsuranceProvider?.Name, p.PlanName, p.PlanCode, p.CoveragePercentage, p.CoPayAmount, p.MaxLimit, p.Exclusions, p.RequiresPreAuth, p.IsActive);
    private static InsuranceClaimDto ToCDto(InsuranceClaim c) => new(c.Id, c.ClaimNumber, c.InvoiceId, c.Invoice?.InvoiceNumber ?? "N/A", c.PatientId, c.Patient?.FullName ?? "N/A", c.InsuranceProviderId, c.InsuranceProvider?.Name ?? "N/A", c.ClaimAmount, c.ApprovedAmount, c.Status, c.SubmissionDate, c.StatusDate, c.RejectionReason, c.AuthCode);
}
