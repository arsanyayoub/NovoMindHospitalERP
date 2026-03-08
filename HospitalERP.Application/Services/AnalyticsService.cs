using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUnitOfWork _uow;

    public AnalyticsService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<DashboardStatsDto> GetExecutiveDashboardAsync()
    {
        var totalPatients = await _uow.Patients.CountAsync();
        var today = DateTime.UtcNow.Date;
        var todayAppointments = await _uow.Appointments.Query()
            .CountAsync(a => a.AppointmentDate.Date == today);
            
        var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
        var monthlyRevenue = await _uow.Payments.Query()
            .Where(p => p.PaymentDate >= firstDayOfMonth)
            .SumAsync(p => p.Amount);
            
        var totalRevenue = await _uow.Payments.Query().SumAsync(p => p.Amount);
        var totalDoctors = await _uow.Doctors.CountAsync();
        var totalEmployees = await _uow.Employees.CountAsync();
        var pendingInvoices = await _uow.Invoices.Query().CountAsync(i => i.Status == HospitalERP.Domain.Enums.InvoiceStatus.Pending);
        var lowStockItems = await _uow.WarehouseStocks.Query().CountAsync(s => s.Quantity <= s.ReorderLevel);

        // Performance Trend (last 6 months)
        var performance = new List<MonthlyRevenueDto>();
        for (int i = 5; i >= 0; i--)
        {
            var monthDate = today.AddMonths(-i);
            var mStart = new DateTime(monthDate.Year, monthDate.Month, 1);
            var mEnd = mStart.AddMonths(1);
            
            var rev = await _uow.Payments.Query()
                .Where(p => p.PaymentDate >= mStart && p.PaymentDate < mEnd)
                .SumAsync(p => p.Amount);
                
            var exp = await _uow.Expenses.Query()
                .Where(e => e.ExpenseDate >= mStart && e.ExpenseDate < mEnd)
                .SumAsync(e => e.Amount);
                
            performance.Add(new MonthlyRevenueDto(mStart.ToString("MMM"), rev, exp));
        }

        // Recent Activity
        var recentPatients = await _uow.Patients.Query()
            .OrderByDescending(p => p.CreatedDate)
            .Take(5)
            .Select(p => new RecentActivityDto("Patient", $"New patient registered: {p.FullName}", p.CreatedDate))
            .ToListAsync();

        var occupancy = await GetWardOccupancyAsync();

    // Clinical KPIs
    var admissions = await _uow.BedAdmissions.Query()
        .Where(a => a.DischargeDate != null)
        .ToListAsync();

    double alos = 0;
    double mortality = 0;
    if (admissions.Any())
    {
        alos = admissions.Average(a => (a.DischargeDate!.Value - a.AdmissionDate).TotalDays);
        mortality = (double)admissions.Count(a => a.DischargeReason == "Dead") / admissions.Count * 100;
    }

    var readmissionCount = await _uow.BedAdmissions.Query()
        .GroupBy(a => a.PatientId)
        .Where(g => g.Count() > 1)
        .CountAsync();
    var totalPatientsWithAdmissions = await _uow.BedAdmissions.Query()
        .Select(a => a.PatientId)
        .Distinct()
        .CountAsync();
    double readmissionRate = totalPatientsWithAdmissions > 0 ? (double)readmissionCount / totalPatientsWithAdmissions * 100 : 0;

    var clinicalKpis = new ClinicalKpisDto(Math.Round(alos, 1), Math.Round(readmissionRate, 1), Math.Round(mortality, 1));

        return new DashboardStatsDto(
            totalPatients,
            todayAppointments,
            monthlyRevenue,
            totalRevenue,
            totalDoctors,
            totalEmployees,
            pendingInvoices,
            lowStockItems,
            performance,
            recentPatients,
            new List<AppointmentDto>(), // Simplified
            new List<DoctorKpiDto>(), // Simplified
            occupancy,
            clinicalKpis
        );
    }

    public async Task<IEnumerable<WardOccupancyDto>> GetWardOccupancyAsync()
    {
        var wards = await _uow.Wards.Query()
            .Include(w => w.Rooms)
            .ThenInclude(r => r.Beds)
            .ToListAsync();
            
        return wards.Select(w => {
            var totalBeds = w.Rooms.SelectMany(r => r.Beds).Count();
            var occupiedBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => b.Status == "Occupied");
            var pct = totalBeds > 0 ? (double)occupiedBeds / totalBeds * 100 : 0;
            return new WardOccupancyDto(w.WardName, totalBeds, occupiedBeds, Math.Round(pct, 1));
        });
    }
}
