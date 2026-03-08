using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class FleetService : IFleetService
{
    private readonly IUnitOfWork _uow;

    public FleetService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<AmbulanceDto>> GetAmbulancesAsync()
    {
        return await _uow.Ambulances.Query()
            .Select(a => new AmbulanceDto(a.Id, a.VehicleNumber, a.Model, a.Type, a.Status, a.CurrentLocation))
            .ToListAsync();
    }

    public async Task<AmbulanceDto> CreateAmbulanceAsync(CreateAmbulanceDto dto, string userId)
    {
        var amb = new Ambulance
        {
            VehicleNumber = dto.VehicleNumber,
            Model = dto.Model,
            Type = dto.Type,
            PrimaryDriverId = dto.PrimaryDriverId,
            CreatedBy = userId
        };

        await _uow.Ambulances.AddAsync(amb);
        await _uow.SaveChangesAsync();

        return new AmbulanceDto(amb.Id, amb.VehicleNumber, amb.Model, amb.Type, amb.Status, amb.CurrentLocation);
    }

    public async Task UpdateAmbulanceStatusAsync(int id, string status, string userId)
    {
        var amb = await _uow.Ambulances.GetByIdAsync(id);
        if (amb != null)
        {
            amb.Status = status;
            amb.UpdatedBy = userId;
            amb.UpdatedDate = DateTime.UtcNow;
            _uow.Ambulances.Update(amb);
            await _uow.SaveChangesAsync();
        }
    }

    public async Task<AmbulanceDispatchDto> DispatchAmbulanceAsync(CreateAmbulanceDispatchDto dto, string userId)
    {
        var dispatch = new AmbulanceDispatch
        {
            AmbulanceId = dto.AmbulanceId,
            EmergencyAdmissionId = dto.EmergencyAdmissionId,
            CallSource = dto.CallSource,
            PickupLocation = dto.PickupLocation,
            DestinationLocation = dto.DestinationLocation,
            DispatchTime = dto.DispatchTime,
            CreatedBy = userId
        };

        await _uow.AmbulanceDispatches.AddAsync(dispatch);
        
        var amb = await _uow.Ambulances.GetByIdAsync(dto.AmbulanceId);
        if (amb != null) amb.Status = "Dispatched";

        await _uow.SaveChangesAsync();

        return new AmbulanceDispatchDto(dispatch.Id, amb?.VehicleNumber ?? "", dispatch.PickupLocation, dispatch.DispatchTime, "Dispatched");
    }

    public async Task<PagedResult<AmbulanceDispatchDto>> GetDispatchesAsync(PagedRequest request)
    {
        var query = _uow.AmbulanceDispatches.Query().Include(d => d.Ambulance);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(d => d.DispatchTime)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(d => new AmbulanceDispatchDto(d.Id, d.Ambulance.VehicleNumber, d.PickupLocation, d.DispatchTime, "Active"))
            .ToListAsync();

        return new PagedResult<AmbulanceDispatchDto>(items, total, request.Page, request.PageSize);
    }
}
