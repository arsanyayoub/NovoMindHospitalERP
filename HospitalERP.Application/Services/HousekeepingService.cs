using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class HousekeepingService : IHousekeepingService
{
    private readonly IUnitOfWork _uow;

    public HousekeepingService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PagedResult<HousekeepingTaskDto>> GetTasksAsync(PagedRequest request, string? status = null)
    {
        IQueryable<HousekeepingTask> query = _uow.HousekeepingTasks.Query()
            .Include(t => t.Bed)
            .ThenInclude(b => b.Room);
            
        if (!string.IsNullOrEmpty(status)) query = query.Where(t => t.Status == status);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(t => t.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new HousekeepingTaskDto(
                t.Id, 
                t.BedId, 
                t.Bed != null ? t.Bed.Room.RoomNumber + "-" + t.Bed.BedNumber : "Public Area",
                t.TaskType,
                t.Status,
                t.AssignedStaffId, // Would join with Employee for name in real app
                t.CompletionTime))
            .ToListAsync();

        return new PagedResult<HousekeepingTaskDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<HousekeepingTaskDto> CreateTaskAsync(CreateHousekeepingTaskDto dto, string userId)
    {
        var task = new HousekeepingTask
        {
            BedId = dto.BedId,
            RoomId = dto.RoomId,
            TaskType = dto.TaskType,
            AssignedStaffId = dto.AssignedStaffId,
            Remarks = dto.Remarks,
            CreatedBy = userId
        };

        if (dto.BedId.HasValue)
        {
            var bed = await _uow.Beds.GetByIdAsync(dto.BedId.Value);
            if (bed != null) bed.Status = "Cleaning";
        }

        await _uow.HousekeepingTasks.AddAsync(task);
        await _uow.SaveChangesAsync();

        return new HousekeepingTaskDto(task.Id, task.BedId, null, task.TaskType, task.Status, task.AssignedStaffId, null);
    }

    public async Task UpdateTaskStatusAsync(int id, string status, string userId)
    {
        var task = await _uow.HousekeepingTasks.Query().Include(t => t.Bed).FirstOrDefaultAsync(t => t.Id == id);
        if (task != null)
        {
            task.Status = status;
            task.UpdatedBy = userId;
            task.UpdatedDate = DateTime.UtcNow;

            if (status == "Completed")
            {
                task.CompletionTime = DateTime.UtcNow;
                if (task.Bed != null) task.Bed.Status = "Available";
            }
            
            _uow.HousekeepingTasks.Update(task);
            await _uow.SaveChangesAsync();
        }
    }
}
