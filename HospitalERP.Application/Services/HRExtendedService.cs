using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class HRExtendedService : IHRExtendedService
{
    private readonly IUnitOfWork _uow;

    public HRExtendedService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    // ===== SHIFTS =====
    public async Task<IEnumerable<WorkShiftDto>> GetShiftsAsync()
    {
        return await _uow.WorkShifts.Query()
            .Where(s => s.IsActive)
            .Select(s => new WorkShiftDto(s.Id, s.ShiftName, s.StartTime, s.EndTime, s.ColorCode, s.IsActive))
            .ToListAsync();
    }

    public async Task<WorkShiftDto> CreateShiftAsync(CreateWorkShiftDto dto)
    {
        var shift = new WorkShift
        {
            ShiftName = dto.ShiftName,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            ColorCode = dto.ColorCode
        };
        await _uow.WorkShifts.AddAsync(shift);
        await _uow.SaveChangesAsync();
        return new WorkShiftDto(shift.Id, shift.ShiftName, shift.StartTime, shift.EndTime, shift.ColorCode, shift.IsActive);
    }

    // ===== ROSTER =====
    public async Task<IEnumerable<EmployeeRosterDto>> GetRosterAsync(DateTime start, DateTime end, int? departmentId = null)
    {
        var query = _uow.EmployeeRosters.Query()
            .Include(r => r.Employee)
            .Include(r => r.WorkShift)
            .Where(r => r.Date >= start && r.Date <= end);

        return await query.Select(r => new EmployeeRosterDto(
            r.Id, r.EmployeeId, r.Employee.FullName, r.WorkShiftId, r.WorkShift.ShiftName, r.Date, r.Status, r.WorkShift.ColorCode
        )).ToListAsync();
    }

    public async Task CreateRosterAsync(IEnumerable<CreateEmployeeRosterDto> dtos)
    {
        foreach (var dto in dtos)
        {
            var roster = new EmployeeRoster
            {
                EmployeeId = dto.EmployeeId,
                WorkShiftId = dto.WorkShiftId,
                Date = dto.Date,
                Notes = dto.Notes,
                Status = "Scheduled"
            };
            await _uow.EmployeeRosters.AddAsync(roster);
        }
        await _uow.SaveChangesAsync();
    }

    // ===== LEAVE =====
    public async Task<PagedResult<LeaveRequestDto>> GetLeaveRequestsAsync(PagedRequest request)
    {
        var query = _uow.LeaveRequests.Query().Include(r => r.Employee);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(r => new LeaveRequestDto(
                r.Id, r.EmployeeId, r.Employee.FullName, r.LeaveType, r.StartDate, r.EndDate, r.TotalDays, r.Reason, r.Status, r.Comments
            )).ToListAsync();

        return new PagedResult<LeaveRequestDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<LeaveRequestDto> SubmitLeaveRequestAsync(int employeeId, CreateLeaveRequestDto dto)
    {
        var employee = await _uow.Employees.GetByIdAsync(employeeId);
        if (employee == null) throw new Exception("Employee not found");

        var totalDays = (dto.EndDate - dto.StartDate).Days + 1;

        var request = new LeaveRequest
        {
            EmployeeId = employeeId,
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TotalDays = totalDays,
            Reason = dto.Reason,
            Status = "Pending"
        };

        await _uow.LeaveRequests.AddAsync(request);
        await _uow.SaveChangesAsync();

        return new LeaveRequestDto(request.Id, employeeId, employee.FullName, request.LeaveType, request.StartDate, request.EndDate, request.TotalDays, request.Reason, request.Status, null);
    }

    public async Task UpdateLeaveStatusAsync(int requestId, UpdateLeaveStatusDto dto, string reviewerId)
    {
        var request = await _uow.LeaveRequests.GetByIdAsync(requestId);
        if (request == null) return;

        request.Status = dto.Status;
        request.Comments = dto.Comments;
        request.ApprovedBy = reviewerId;
        request.ActionDate = DateTime.UtcNow;

        if (dto.Status == "Approved")
        {
            var balance = await _uow.EmployeeLeaveBalances.Query()
                .FirstOrDefaultAsync(b => b.EmployeeId == request.EmployeeId && b.LeaveType == request.LeaveType && b.Year == request.StartDate.Year);
            
            if (balance != null)
            {
                balance.Used += request.TotalDays;
            }
        }

        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<LeaveBalanceDto>> GetLeaveBalancesAsync(int employeeId)
    {
        return await _uow.EmployeeLeaveBalances.Query()
            .Where(b => b.EmployeeId == employeeId && b.Year == DateTime.UtcNow.Year)
            .Select(b => new LeaveBalanceDto(b.LeaveType, b.TotalEntitled, b.Used, b.Remaining))
            .ToListAsync();
    }
}
