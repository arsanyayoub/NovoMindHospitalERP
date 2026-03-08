using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class DentalService : IDentalService
{
    private readonly IUnitOfWork _uow;

    public DentalService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<DentalChartDto?> GetChartByPatientAsync(int patientId)
    {
        var chart = await _uow.DentalCharts.Query()
            .Include(c => c.Patient)
            .FirstOrDefaultAsync(c => c.PatientId == patientId);

        if (chart == null) return null;

        return new DentalChartDto(chart.Id, chart.PatientId, chart.Patient.FullName, chart.TeethStatusJson);
    }

    public async Task<DentalChartDto> CreateChartAsync(CreateDentalChartDto dto, string userId)
    {
        var chart = new DentalChart
        {
            PatientId = dto.PatientId,
            TeethStatusJson = dto.TeethStatusJson,
            OverallNotes = dto.OverallNotes,
            CreatedBy = userId
        };

        await _uow.DentalCharts.AddAsync(chart);
        await _uow.SaveChangesAsync();

        var p = await _uow.Patients.GetByIdAsync(dto.PatientId);
        return new DentalChartDto(chart.Id, chart.PatientId, p?.FullName ?? "", chart.TeethStatusJson);
    }

    public async Task<IEnumerable<DentalProcedureDto>> GetProceduresByChartAsync(int chartId)
    {
        return await _uow.DentalProcedures.Query()
            .Where(p => p.DentalChartId == chartId)
            .Include(p => p.Dentist)
            .OrderByDescending(p => p.ProcedureDate)
            .Select(p => new DentalProcedureDto(p.Id, p.ToothNumber, p.ProcedureType, p.Cost, p.ProcedureDate, p.Dentist.FullName))
            .ToListAsync();
    }

    public async Task<DentalProcedureDto> RecordProcedureAsync(CreateDentalProcedureDto dto, string userId)
    {
        var proc = new DentalProcedure
        {
            DentalChartId = dto.DentalChartId,
            ToothNumber = dto.ToothNumber,
            ProcedureType = dto.ProcedureType,
            Surfaces = dto.Surfaces,
            Cost = dto.Cost,
            ProcedureDate = dto.ProcedureDate,
            DentistId = dto.DentistId,
            ClinicNotes = dto.ClinicNotes,
            CreatedBy = userId
        };

        await _uow.DentalProcedures.AddAsync(proc);
        await _uow.SaveChangesAsync();

        var d = await _uow.Doctors.GetByIdAsync(dto.DentistId);
        return new DentalProcedureDto(proc.Id, proc.ToothNumber, proc.ProcedureType, proc.Cost, proc.ProcedureDate, d?.FullName ?? "");
    }

    public async Task<PagedResult<OrthodonticCaseDto>> GetOrthodonticCasesAsync(PagedRequest request)
    {
        var query = _uow.OrthodonticCases.Query().Include(c => c.Patient);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new OrthodonticCaseDto(c.Id, c.Patient.FullName, c.CaseType, c.StartDate, c.Status))
            .ToListAsync();

        return new PagedResult<OrthodonticCaseDto>(items, total, request.Page, request.PageSize);
    }
}
