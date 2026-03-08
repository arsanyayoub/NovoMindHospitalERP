using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class PhysiotherapyService : IPhysiotherapyService
{
    private readonly IUnitOfWork _uow;

    public PhysiotherapyService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PagedResult<RehabPlanDto>> GetRehabPlansAsync(PagedRequest request, string? status = null)
    {
        IQueryable<RehabPlan> query = _uow.RehabPlans.Query().Include(p => p.Patient);
        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new RehabPlanDto(p.Id, p.PatientId, p.Patient.FullName, p.Diagnosis, p.StartDate, p.Status))
            .ToListAsync();

        return new PagedResult<RehabPlanDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<RehabPlanDto> CreateRehabPlanAsync(CreateRehabPlanDto dto, string userId)
    {
        var plan = new RehabPlan
        {
            PatientId = dto.PatientId,
            AssignedPhysicianId = dto.AssignedPhysicianId,
            Diagnosis = dto.Diagnosis,
            ImprovementGoals = dto.ImprovementGoals,
            StartDate = dto.StartDate,
            EstimatedEndDate = dto.EstimatedEndDate,
            CreatedBy = userId
        };

        await _uow.RehabPlans.AddAsync(plan);
        await _uow.SaveChangesAsync();

        var p = await _uow.Patients.GetByIdAsync(dto.PatientId);
        return new RehabPlanDto(plan.Id, plan.PatientId, p?.FullName ?? "", plan.Diagnosis, plan.StartDate, plan.Status);
    }

    public async Task<IEnumerable<PhysiotherapySessionDto>> GetSessionsByPlanAsync(int planId)
    {
        return await _uow.PhysiotherapySessions.Query()
            .Where(s => s.RehabPlanId == planId)
            .Include(s => s.Therapist)
            .OrderByDescending(s => s.SessionDate)
            .Select(s => new PhysiotherapySessionDto(s.Id, s.RehabPlanId, s.SessionDate, s.Therapist.FullName, s.ProcedurePerformed, s.PainLevelAfter))
            .ToListAsync();
    }

    public async Task<PhysiotherapySessionDto> RecordSessionAsync(CreatePhysiotherapySessionDto dto, string userId)
    {
        var session = new PhysiotherapySession
        {
            RehabPlanId = dto.RehabPlanId,
            SessionDate = dto.SessionDate,
            TherapistId = dto.TherapistId,
            ProcedurePerformed = dto.ProcedurePerformed,
            ProgressNotes = dto.ProgressNotes,
            PainLevelBefore = dto.PainLevelBefore,
            PainLevelAfter = dto.PainLevelAfter,
            DurationMinutes = dto.DurationMinutes,
            CreatedBy = userId
        };

        await _uow.PhysiotherapySessions.AddAsync(session);
        await _uow.SaveChangesAsync();

        var t = await _uow.Employees.GetByIdAsync(dto.TherapistId);
        return new PhysiotherapySessionDto(session.Id, session.RehabPlanId, session.SessionDate, t?.FullName ?? "", session.ProcedurePerformed, session.PainLevelAfter);
    }
}
