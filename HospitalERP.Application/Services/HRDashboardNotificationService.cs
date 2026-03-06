using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
namespace HospitalERP.Application.Services;

public class HRService : IHRService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    public HRService(IUnitOfWork uow, IAuditLogService auditLog) 
    { 
        _uow = uow; 
        _auditLog = auditLog;
    }

    public async Task<PagedResult<EmployeeDto>> GetEmployeesAsync(PagedRequest request)
    {
        var query = _uow.Employees.Query();
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(e => e.FullName.Contains(request.Search) || e.EmployeeCode.Contains(request.Search) || e.Department.Contains(request.Search));
        var total = await query.CountAsync();
        var items = await query.OrderBy(e => e.FullName).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<EmployeeDto>(items.Select(ToDto), total, request.Page, request.PageSize);
    }

    public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id) { var e = await _uow.Employees.GetByIdAsync(id); return e is null ? null : ToDto(e); }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto, string createdBy)
    {
        var count = await _uow.Employees.CountAsync();
        var emp = new Employee
        {
            EmployeeCode = $"EMP{(count + 1):D4}", FullName = dto.FullName, NationalId = dto.NationalId,
            Department = dto.Department, Position = dto.Position, HireDate = dto.HireDate,
            BasicSalary = dto.BasicSalary, Allowances = dto.Allowances, Deductions = dto.Deductions,
            PhoneNumber = dto.PhoneNumber, Email = dto.Email, CreatedBy = createdBy
        };
        await _uow.Employees.AddAsync(emp); 
        await _uow.SaveChangesAsync(); 
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "Employee", emp.Id, $"Employee {emp.FullName} ({emp.EmployeeCode}) created.");
        return ToDto(emp);
    }

    public async Task<EmployeeDto> UpdateEmployeeAsync(int id, CreateEmployeeDto dto, string updatedBy)
    {
        var emp = await _uow.Employees.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        emp.FullName = dto.FullName; emp.NationalId = dto.NationalId; emp.Department = dto.Department;
        emp.Position = dto.Position; emp.HireDate = dto.HireDate; emp.BasicSalary = dto.BasicSalary;
        emp.Allowances = dto.Allowances; emp.Deductions = dto.Deductions;
        emp.PhoneNumber = dto.PhoneNumber; emp.Email = dto.Email; emp.UpdatedBy = updatedBy;
        _uow.Employees.Update(emp); 
        await _uow.SaveChangesAsync(); 
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "Employee", emp.Id, $"Employee {emp.FullName} updated.");
        return ToDto(emp);
    }

    public async Task DeleteEmployeeAsync(int id, string deletedBy)
    {
        var emp = await _uow.Employees.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        _uow.Employees.SoftDelete(emp); 
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(deletedBy, deletedBy, "Delete", "Employee", id, $"Employee {emp.FullName} soft-deleted.");
    }

    public async Task<PagedResult<PayrollDto>> GetPayrollsAsync(PagedRequest request, int? year, int? month)
    {
        var query = _uow.Payrolls.Query().Include(p => p.Employee);
        var filtered = query.AsQueryable();
        if (year.HasValue) filtered = filtered.Where(p => p.Year == year.Value);
        if (month.HasValue) filtered = filtered.Where(p => p.Month == month.Value);
        var total = await filtered.CountAsync();
        var items = await filtered.OrderByDescending(p => p.Year).ThenByDescending(p => p.Month).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<PayrollDto>(items.Select(ToPDto), total, request.Page, request.PageSize);
    }

    public async Task<PayrollDto> GeneratePayrollAsync(CreatePayrollDto dto, string createdBy)
    {
        var existing = await _uow.Payrolls.Query().AnyAsync(p => p.EmployeeId == dto.EmployeeId && p.Month == dto.Month && p.Year == dto.Year);
        if (existing) throw new InvalidOperationException("Payroll already generated for this employee/period.");
        var emp = await _uow.Employees.GetByIdAsync(dto.EmployeeId) ?? throw new KeyNotFoundException();
        var payroll = new Payroll
        {
            EmployeeId = dto.EmployeeId, Month = dto.Month, Year = dto.Year,
            BasicSalary = emp.BasicSalary, Allowances = emp.Allowances,
            Bonuses = dto.Bonuses, Deductions = emp.Deductions + dto.Deductions,
            NetSalary = emp.BasicSalary + emp.Allowances + dto.Bonuses - (emp.Deductions + dto.Deductions),
            Notes = dto.Notes, CreatedBy = createdBy
        };
        await _uow.Payrolls.AddAsync(payroll); 
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Generate Payroll", "Payroll", payroll.Id, $"Payroll generated for Employee ID {dto.EmployeeId} for {dto.Month}/{dto.Year}.");
        return ToPDto(payroll);
    }

    public async Task ProcessPayrollPaymentAsync(int payrollId, string paidBy)
    {
        var payroll = await _uow.Payrolls.GetByIdAsync(payrollId) ?? throw new KeyNotFoundException();
        payroll.Status = "Paid"; payroll.PaidDate = DateTime.UtcNow; payroll.UpdatedBy = paidBy;
        _uow.Payrolls.Update(payroll); 
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(paidBy, paidBy, "Process Payroll", "Payroll", payrollId, $"Payroll ID {payrollId} payment processed.");
    }

    public async Task<PagedResult<AttendanceRecordDto>> GetAttendanceRecordsAsync(PagedRequest request, int? employeeId, DateTime? fromDate, DateTime? toDate)
    {
        var query = _uow.AttendanceRecords.Query().Include(a => a.Employee).AsQueryable();
        if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId.Value);
        if (fromDate.HasValue) query = query.Where(a => a.Date >= fromDate.Value.Date);
        if (toDate.HasValue) query = query.Where(a => a.Date <= toDate.Value.Date);
        
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(a => a.Date).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<AttendanceRecordDto>(items.Select(ToADto), total, request.Page, request.PageSize);
    }
    
    public async Task<AttendanceRecordDto> RecordAttendanceAsync(CreateAttendanceRecordDto dto, string createdBy)
    {
        var existing = await _uow.AttendanceRecords.Query().FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date.Date == dto.Date.Date);
        if (existing != null) throw new InvalidOperationException("Attendance already recorded for this date");
        
        var record = new AttendanceRecord
        {
            EmployeeId = dto.EmployeeId,
            Date = dto.Date.Date,
            ClockIn = dto.ClockIn,
            ClockOut = dto.ClockOut,
            Status = dto.Status,
            Notes = dto.Notes,
            CreatedBy = createdBy
        };
        
        await _uow.AttendanceRecords.AddAsync(record);
        await _uow.SaveChangesAsync();
        
        var emp = await _uow.Employees.GetByIdAsync(dto.EmployeeId);
        record.Employee = emp!;
        
        return ToADto(record);
    }

    public async Task<AttendanceRecordDto> UpdateAttendanceAsync(int id, CreateAttendanceRecordDto dto, string updatedBy)
    {
        var record = await _uow.AttendanceRecords.Query().Include(a => a.Employee).FirstOrDefaultAsync(a => a.Id == id) ?? throw new KeyNotFoundException();
        
        record.ClockIn = dto.ClockIn;
        record.ClockOut = dto.ClockOut;
        record.Status = dto.Status;
        record.Notes = dto.Notes;
        record.UpdatedBy = updatedBy;
        
        _uow.AttendanceRecords.Update(record);
        await _uow.SaveChangesAsync();
        
        return ToADto(record);
    }

    private static EmployeeDto ToDto(Employee e) => new(e.Id, e.EmployeeCode, e.FullName, e.NationalId, e.Department, e.Position, e.HireDate, e.BasicSalary, e.Allowances, e.Deductions, e.PhoneNumber, e.Email, e.IsActive, e.CreatedDate);
    private static PayrollDto ToPDto(Payroll p) => new(p.Id, p.EmployeeId, p.Employee?.FullName ?? "", p.Month, p.Year, p.BasicSalary, p.Allowances, p.Bonuses, p.Deductions, p.NetSalary, p.Status, p.PaidDate);
    private static AttendanceRecordDto ToADto(AttendanceRecord a) => new(a.Id, a.EmployeeId, a.Employee?.FullName ?? "", a.Date, a.ClockIn, a.ClockOut, a.Status, a.Notes);
}

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _uow;
    public DashboardService(IUnitOfWork uow) => _uow = uow;

    public async Task<DashboardDto> GetDashboardAsync()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var yearStart = new DateTime(today.Year, 1, 1);

        var totalPatients = await _uow.Patients.CountAsync();
        var todayAppts = await _uow.Appointments.CountAsync(a => a.AppointmentDate.Date == today);
        var pendingAppts = await _uow.Appointments.CountAsync(a => (int)a.Status == 1 || (int)a.Status == 2);
        var totalDoctors = await _uow.Doctors.CountAsync();
        var totalEmployees = await _uow.Employees.CountAsync();
        var lowStock = await _uow.WarehouseStocks.CountAsync(ws => ws.Quantity <= ws.ReorderLevel);
        var pendingInvoices = await _uow.Invoices.CountAsync(i => (int)i.Status == 1);
        var expiryThreshold = today.AddDays(30);
        var expiringBatches = await _uow.ItemBatches.CountAsync(b => b.Status == "Active" && b.ExpiryDate > today && b.ExpiryDate <= expiryThreshold);

        var todayPayments = await _uow.Payments.Query().Where(p => p.PaymentDate.Date == today).SumAsync(p => p.Amount);
        var monthlyPayments = await _uow.Payments.Query().Where(p => p.PaymentDate >= monthStart).SumAsync(p => p.Amount);
        var totalRevenue = await _uow.Payments.Query().SumAsync(p => p.Amount);
        var outstanding = await _uow.Invoices.Query().SumAsync(i => i.TotalAmount - i.PaidAmount);

        var monthlyRevenues = new List<MonthlyRevenueDto>();
        for (int m = 1; m <= 12; m++)
        {
            var mStart = new DateTime(today.Year, m, 1);
            var mEnd = mStart.AddMonths(1);
            var rev = await _uow.Payments.Query().Where(p => p.PaymentDate >= mStart && p.PaymentDate < mEnd).SumAsync(p => p.Amount);
            var exp = await _uow.Expenses.Query().Where(e => e.ExpenseDate >= mStart && e.ExpenseDate < mEnd).SumAsync(e => e.Amount);
            monthlyRevenues.Add(new MonthlyRevenueDto(mStart.ToString("MMM"), rev, exp));
        }

        var recentAppts = await _uow.Appointments.Query().Include(a => a.Patient).OrderByDescending(a => a.CreatedDate).Take(5).Select(a => new RecentActivityDto("Appointment", $"{a.AppointmentCode} - {a.Patient.FullName}", a.CreatedDate)).ToListAsync();
        var recentPayments = await _uow.Payments.Query().OrderByDescending(p => p.CreatedDate).Take(5).Select(p => new RecentActivityDto("Payment", $"{p.PaymentNumber} - {p.Amount:C2}", p.CreatedDate)).ToListAsync();
        var activities = recentAppts.Concat(recentPayments).OrderByDescending(a => a.Date).Take(10).ToList();

        var todayApptsList = await _uow.Appointments.Query()
            .Include(a => a.Patient).Include(a => a.Doctor)
            .Where(a => a.AppointmentDate.Date == today)
            .OrderBy(a => a.AppointmentTime)
            .Take(10)
            .Select(a => new AppointmentDto(
                a.Id, a.AppointmentCode, a.PatientId, a.Patient.FullName,
                a.DoctorId, a.Doctor.FullName, a.Doctor.Specialization,
                a.AppointmentDate, a.AppointmentTime, a.DurationMinutes,
                a.Status.ToString(), a.Notes, a.Diagnosis, a.Prescription,
                a.Fee, a.IsPaid, a.CreatedDate))
            .ToListAsync();

        var topDoctors = await _uow.Appointments.Query()
            .Include(a => a.Doctor)
            .GroupBy(a => new { a.DoctorId, a.Doctor.FullName, a.Doctor.Specialization })
            .Select(g => new TopDoctorDto(g.Key.FullName, g.Key.Specialization, g.Count()))
            .OrderByDescending(d => d.AppointmentCount)
            .Take(5)
            .ToListAsync();

        var pendingPrescriptions = await _uow.Prescriptions.CountAsync(p => p.Status == "Pending" || p.Status == "Partially Dispensed");
        var pendingLab = await _uow.LabRequests.CountAsync(r => r.Status == "Pending" || r.Status == "Partial");
        var pendingRad = await _uow.RadiologyRequests.CountAsync(r => r.Status == "Pending");

        // New KPIs
        var pharmacyRevenue = await _uow.Prescriptions.Query()
            .Where(p => p.PrescriptionDate >= monthStart)
            .SelectMany(p => p.Items)
            .SumAsync(i => i.Quantity * (i.Item.SalePrice));

        var totalStockValue = await _uow.WarehouseStocks.Query()
            .SumAsync(ws => ws.Quantity * ws.Item.PurchasePrice);
        
        var totalBeds = await _uow.Beds.CountAsync();
        var occupiedBeds = await _uow.Beds.CountAsync(b => b.Status == "Occupied");

        return new DashboardDto(totalPatients, todayAppts, pendingAppts, todayPayments, monthlyPayments, totalRevenue, lowStock, pendingInvoices, outstanding, totalDoctors, totalEmployees, activities, monthlyRevenues, todayApptsList, topDoctors, expiringBatches, pendingPrescriptions, pendingLab, pendingRad, pharmacyRevenue, totalStockValue, totalBeds, occupiedBeds);
    }
}

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _uow;
    private readonly IAppNotificationService _notificationService;

    public NotificationService(IUnitOfWork uow, IAppNotificationService notificationService)
    {
        _uow = uow;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId)
    {
        var notifs = await _uow.Notifications.Query()
            .Where(n => n.UserId == userId || n.UserId == null)
            .OrderByDescending(n => n.CreatedDate).Take(50).ToListAsync();
        return notifs.Select(ToDto);
    }

    public async Task MarkAsReadAsync(int notificationId)
    {
        var n = await _uow.Notifications.GetByIdAsync(notificationId);
        if (n is not null) { n.IsRead = true; _uow.Notifications.Update(n); await _uow.SaveChangesAsync(); }
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var notifs = await _uow.Notifications.Query().Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
        foreach (var n in notifs) { n.IsRead = true; _uow.Notifications.Update(n); }
        await _uow.SaveChangesAsync();
    }

    public async Task CreateNotificationAsync(string title, string message, string type, int? userId = null, string? entityType = null, int? entityId = null)
    {
        var notif = new Notification 
        { 
            Title = title, 
            Message = message, 
            NotificationType = type, 
            UserId = userId, 
            EntityType = entityType, 
            EntityId = entityId, 
            CreatedBy = "system",
            CreatedDate = DateTime.UtcNow
        };
        await _uow.Notifications.AddAsync(notif);
        await _uow.SaveChangesAsync();

        // Real-time via SignalR
        var dto = ToDto(notif);
        if (userId.HasValue)
        {
            await _notificationService.SendMessageAsync(userId.Value, "ReceiveNotification", dto);
        }
        else
        {
            await _notificationService.SendToAllAsync("ReceiveNotification", dto);
        }
    }

    public async Task<int> GetUnreadCountAsync(int userId)
        => await _uow.Notifications.CountAsync(n => (n.UserId == userId || n.UserId == null) && !n.IsRead);

    public async Task CheckStockLevelAsync(int itemId, int warehouseId)
    {
        var stock = await _uow.WarehouseStocks.Query()
            .Include(x => x.Item)
            .Include(x => x.Warehouse)
            .FirstOrDefaultAsync(x => x.ItemId == itemId && x.WarehouseId == warehouseId);

        if (stock != null)
        {
            await _notificationService.SendToAllAsync("StockUpdated", new 
            { 
                itemName = stock.Item.ItemName,
                warehouseName = stock.Warehouse.WarehouseName,
                quantity = stock.Quantity,
                reorderLevel = stock.ReorderLevel
            });
            
            if (stock.Quantity <= stock.ReorderLevel)
            {
                await CreateNotificationAsync(
                    "Low Stock Alert", 
                    $"Item '{stock.Item.ItemName}' is low on stock ({stock.Quantity} remaining in {stock.Warehouse.WarehouseName}).", 
                    "Inventory", null, "Item", itemId);
            }
        }
    }

    private static NotificationDto ToDto(Notification n) => new(n.Id, n.Title, n.Message, n.NotificationType, n.IsRead, n.CreatedDate);
}
