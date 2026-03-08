using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class QualityService : IQualityService
{
    private readonly IUnitOfWork _uow;

    public QualityService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PagedResult<ClinicalIncidentDto>> GetIncidentsAsync(PagedRequest request, string? severity = null)
    {
        IQueryable<ClinicalIncident> query = _uow.ClinicalIncidents.Query().Include(i => i.Patient);
        if (!string.IsNullOrEmpty(severity)) query = query.Where(i => i.Severity == severity);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(i => i.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new ClinicalIncidentDto(i.Id, i.Patient != null ? i.Patient.FullName : "System", i.IncidentType, i.Severity, i.Status, i.CreatedDate))
            .ToListAsync();

        return new PagedResult<ClinicalIncidentDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<ClinicalIncidentDto> ReportIncidentAsync(CreateClinicalIncidentDto dto, string userId)
    {
        var incident = new ClinicalIncident
        {
            PatientId = dto.PatientId,
            IncidentType = dto.IncidentType,
            Severity = dto.Severity,
            Description = dto.Description,
            ActionTaken = dto.ActionTaken,
            CreatedBy = userId
        };

        await _uow.ClinicalIncidents.AddAsync(incident);
        await _uow.SaveChangesAsync();

        var p = dto.PatientId.HasValue ? await _uow.Patients.GetByIdAsync(dto.PatientId.Value) : null;
        return new ClinicalIncidentDto(incident.Id, p?.FullName, incident.IncidentType, incident.Severity, incident.Status, incident.CreatedDate);
    }

    public async Task<PagedResult<PatientFeedbackDto>> GetFeedbackAsync(PagedRequest request)
    {
        IQueryable<PatientFeedback> query = _uow.PatientFeedbacks.Query().Include(f => f.Patient);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(f => f.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(f => new PatientFeedbackDto(f.Id, f.IsAnonymized ? "Anonymous" : f.Patient.FullName, f.Rating, f.Comments ?? "", f.Department, f.CreatedDate))
            .ToListAsync();

        return new PagedResult<PatientFeedbackDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PatientFeedbackDto> RecordFeedbackAsync(CreatePatientFeedbackDto dto, string userId)
    {
        var feedback = new PatientFeedback
        {
            PatientId = dto.PatientId,
            Rating = dto.Rating,
            Comments = dto.Comments,
            Department = dto.Department,
            IsAnonymized = dto.IsAnonymized,
            CreatedBy = userId
        };

        await _uow.PatientFeedbacks.AddAsync(feedback);
        await _uow.SaveChangesAsync();

        var p = await _uow.Patients.GetByIdAsync(dto.PatientId);
        return new PatientFeedbackDto(feedback.Id, dto.IsAnonymized ? "Anonymous" : (p?.FullName ?? ""), feedback.Rating, feedback.Comments ?? "", feedback.Department, feedback.CreatedDate);
    }
}
