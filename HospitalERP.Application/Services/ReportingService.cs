using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class ReportingService : IReportingService
{
    private readonly IUnitOfWork _uow;
    public ReportingService(IUnitOfWork uow) => _uow = uow;

    public async Task<PatientAnalyticsDto> GetPatientAnalyticsAsync(DateTime from, DateTime to)
    {
        var total = await _uow.Patients.CountAsync();
        
        // Month trend
        var trend = new List<MonthlyCountDto>();
        for (var d = from; d <= to; d = d.AddMonths(1))
        {
            var count = await _uow.Patients.CountAsync(p => p.CreatedDate >= d && p.CreatedDate < d.AddMonths(1));
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        // Gender breakdown
        var gender = await _uow.Patients.Query()
            .GroupBy(p => p.Gender)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToListAsync();

        // Age distribution
        var now = DateTime.UtcNow;
        var patients = await _uow.Patients.GetAllAsync();
        var ageGroups = patients.GroupBy(p => {
            var age = now.Year - p.DateOfBirth.Year;
            if (age < 12) return "Children";
            if (age < 20) return "Teens";
            if (age < 45) return "Adults";
            if (age < 65) return "Middle Age";
            return "Seniors";
        }).Select(g => new GroupCountDto(g.Key, g.Count())).ToList();

        return new PatientAnalyticsDto(total, trend, gender, ageGroups);
    }

    public async Task<AppointmentAnalyticsDto> GetAppointmentAnalyticsAsync(DateTime from, DateTime to)
    {
        var query = _uow.Appointments.Query().Where(a => a.AppointmentDate >= from && a.AppointmentDate <= to);
        var total = await query.CountAsync();

        // Status breakdown
        var status = await query.GroupBy(a => a.Status)
            .Select(g => new GroupCountDto(g.Key.ToString(), g.Count()))
            .ToListAsync();

        // Specialization breakdown
        var specs = await query.Include(a => a.Doctor)
            .GroupBy(a => a.Doctor.Specialization)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToListAsync();

        // Trend
        var trend = new List<MonthlyCountDto>();
        for (var d = from; d <= to; d = d.AddMonths(1))
        {
            var count = await query.CountAsync(a => a.AppointmentDate >= d && a.AppointmentDate < d.AddMonths(1));
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        return new AppointmentAnalyticsDto(total, status, specs, trend);
    }

    public async Task<LabAnalyticsDto> GetLabAnalyticsAsync(DateTime from, DateTime to)
    {
        var requests = await _uow.LabRequests.Query()
            .Include(r => r.Results).ThenInclude(res => res.LabTest)
            .Where(r => r.RequestDate >= from && r.RequestDate <= to)
            .ToListAsync();

        var totalTests = requests.Sum(r => r.Results.Count);
        var totalRevenue = requests.Sum(r => r.TotalAmount);

        // Category breakdown
        var categoryBreakdown = requests.SelectMany(r => r.Results)
            .GroupBy(res => res.LabTest?.Category ?? "Other")
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .OrderByDescending(x => x.Count)
            .ToList();

        // Monthly trend
        var trend = new List<MonthlyCountDto>();
        for (var d = new DateTime(from.Year, from.Month, 1); d <= to; d = d.AddMonths(1))
        {
            var count = requests.Where(r => r.RequestDate >= d && r.RequestDate < d.AddMonths(1))
                                .SelectMany(r => r.Results).Count();
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        return new LabAnalyticsDto(totalTests, totalRevenue, categoryBreakdown, trend);
    }

    public async Task<RadiologyAnalyticsDto> GetRadiologyAnalyticsAsync(DateTime from, DateTime to)
    {
        var requests = await _uow.RadiologyRequests.Query()
            .Include(r => r.Results).ThenInclude(res => res.RadiologyTest)
            .Where(r => r.RequestDate >= from && r.RequestDate <= to)
            .ToListAsync();

        var totalTests = requests.Sum(r => r.Results.Count);
        var totalRevenue = requests.Sum(r => r.TotalAmount);

        // Category breakdown
        var categoryBreakdown = requests.SelectMany(r => r.Results)
            .GroupBy(res => res.RadiologyTest?.Category ?? "Other")
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .OrderByDescending(x => x.Count)
            .ToList();

        // Monthly trend
        var trend = new List<MonthlyCountDto>();
        for (var d = new DateTime(from.Year, from.Month, 1); d <= to; d = d.AddMonths(1))
        {
            var count = requests.Where(r => r.RequestDate >= d && r.RequestDate < d.AddMonths(1))
                                .SelectMany(r => r.Results).Count();
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        return new RadiologyAnalyticsDto(totalTests, totalRevenue, categoryBreakdown, trend);
    }

    public async Task<PharmacyAnalyticsDto> GetPharmacyAnalyticsAsync(DateTime from, DateTime to)
    {
        var prescriptions = await _uow.Prescriptions.Query()
            .Include(p => p.Items).ThenInclude(i => i.Item)
            .Where(p => p.PrescriptionDate >= from && p.PrescriptionDate <= to)
            .ToListAsync();

        var totalRx = prescriptions.Count;
        // Approximation: sum of quantity * purchase price of medicines (since patient billing might be separate)
        // Or if we have actual dispense revenue, we'd use that. Let's assume inventory value for now or use a flat fee.
        // For simplicity in this demo, let's use quantity * 10 (simulated price) or check Item's SalePrice.
        var revenue = prescriptions.SelectMany(p => p.Items).Sum(i => i.Quantity * (i.Item?.SalePrice ?? 0));

        var topMedicines = prescriptions.SelectMany(p => p.Items)
            .GroupBy(i => i.Item?.ItemName ?? "Unknown")
            .Select(g => new GroupCountDto(g.Key, (int)g.Sum(x => x.Quantity)))
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToList();

        var trend = new List<MonthlyCountDto>();
        for (var d = new DateTime(from.Year, from.Month, 1); d <= to; d = d.AddMonths(1))
        {
            var count = prescriptions.Count(p => p.PrescriptionDate >= d && p.PrescriptionDate < d.AddMonths(1));
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        return new PharmacyAnalyticsDto(totalRx, revenue, topMedicines, trend);
    }

    public async Task<InventoryAnalyticsDto> GetInventoryAnalyticsAsync()
    {
        var totalItems = await _uow.Items.CountAsync();
        var stocks = await _uow.WarehouseStocks.Query().Include(s => s.Item).ToListAsync();
        var totalValue = stocks.Sum(s => s.Quantity * (s.Item?.PurchasePrice ?? 0));
        var lowStock = stocks.Count(s => s.Quantity <= s.ReorderLevel);

        var categories = stocks.GroupBy(s => s.Item?.Category ?? "Uncategorized")
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToList();

        return new InventoryAnalyticsDto(totalItems, totalValue, lowStock, categories);
    }

    public async Task<HRAnalyticsDto> GetHRAnalyticsAsync(int year)
    {
        var totalEmp = await _uow.Employees.CountAsync();
        var payrolls = await _uow.Payrolls.Query()
            .Where(p => p.Year == year)
            .ToListAsync();

        var monthlyPayroll = payrolls.Where(p => p.Month == DateTime.UtcNow.Month).Sum(p => p.NetSalary);

        var deptDist = await _uow.Employees.Query()
            .GroupBy(e => e.Department)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToListAsync();

        var trend = new List<MonthlyCountDto>();
        for (int m = 1; m <= 12; m++)
        {
            var monthName = new DateTime(year, m, 1).ToString("MMM");
            var count = (int)payrolls.Where(p => p.Month == m).Sum(p => p.NetSalary);
            trend.Add(new MonthlyCountDto(monthName, count));
        }

        return new HRAnalyticsDto(totalEmp, monthlyPayroll, deptDist, trend);
    }

    public async Task<BedAnalyticsDto> GetBedAnalyticsAsync(DateTime from, DateTime to)
    {
        var totalWards = await _uow.Wards.CountAsync();
        var totalRooms = await _uow.Rooms.CountAsync();
        var beds = await _uow.Beds.Query().Include(b => b.Room).ThenInclude(r => r.Ward).ToListAsync();
        
        var totalBeds = beds.Count;
        var occupiedBeds = beds.Count(b => b.Status == "Occupied");
        var maintenanceBeds = beds.Count(b => b.Status == "Maintenance");
        var rate = totalBeds > 0 ? (decimal)occupiedBeds / totalBeds * 100 : 0;

        var wardOccupancy = beds.Where(b => b.Status == "Occupied")
            .GroupBy(b => b.Room.Ward.WardName)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToList();

        var roomTypeOccupancy = beds.Where(b => b.Status == "Occupied")
            .GroupBy(b => b.Room.RoomType)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToList();

        var admissions = await _uow.BedAdmissions.Query()
            .Where(a => a.AdmissionDate >= from && a.AdmissionDate <= to)
            .ToListAsync();

        var admissionTrend = new List<MonthlyCountDto>();
        for (var d = new DateTime(from.Year, from.Month, 1); d <= to; d = d.AddMonths(1))
        {
            var count = admissions.Count(a => a.AdmissionDate >= d && a.AdmissionDate < d.AddMonths(1));
            admissionTrend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        return new BedAnalyticsDto(totalWards, totalRooms, totalBeds, occupiedBeds, maintenanceBeds, rate, wardOccupancy, roomTypeOccupancy, admissionTrend);
    }

    public async Task<OTAnalyticsDto> GetOTAnalyticsAsync(DateTime from, DateTime to)
    {
        var theaters = await _uow.OperatingTheaters.GetAllAsync();
        var surgeries = await _uow.ScheduledSurgeries.Query()
            .Include(s => s.OperatingTheater)
            .Where(s => s.ScheduledStartTime >= from && s.ScheduledStartTime <= to)
            .ToListAsync();

        var totalTheaters = theaters.Count();
        var totalSurgeries = surgeries.Count;

        // Utilization Calculation (Assuming 8 hours availability per day per OT)
        var totalDays = (to - from).Days + 1;
        if (totalDays <= 0) totalDays = 1;
        var availableHoursPerOT = totalDays * 8; 
        
        var theaterUtilization = new List<GroupValueDto>();
        foreach (var ot in theaters)
        {
            var otSurgeries = surgeries.Where(s => s.OperatingTheaterId == ot.Id).ToList();
            double occupiedHours = otSurgeries.Sum(s => (s.ScheduledEndTime - s.ScheduledStartTime).TotalHours);
            var utilRate = availableHoursPerOT > 0 ? (decimal)(occupiedHours / availableHoursPerOT) * 100 : 0;
            theaterUtilization.Add(new GroupValueDto(ot.Name, Math.Min(utilRate, 100)));
        }

        var overallUtilization = theaterUtilization.Any() ? theaterUtilization.Average(x => x.Value) : 0;

        var statusBreakdown = surgeries.GroupBy(s => s.Status)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToList();

        var priorityBreakdown = surgeries.GroupBy(s => s.Priority)
            .Select(g => new GroupCountDto(g.Key, g.Count()))
            .ToList();

        var trend = new List<MonthlyCountDto>();
        for (var d = new DateTime(from.Year, from.Month, 1); d <= to; d = d.AddMonths(1))
        {
            var count = surgeries.Count(s => s.ScheduledStartTime >= d && s.ScheduledStartTime < d.AddMonths(1));
            trend.Add(new MonthlyCountDto(d.ToString("MMM yyyy"), count));
        }

        // Resource Cost & Top Items
        var resources = await _uow.SurgeryResources.Query()
            .Include(r => r.Item)
            .Where(r => r.ConsumedDate >= from && r.ConsumedDate <= to)
            .ToListAsync();

        var totalCost = resources.Sum(r => r.Quantity * (r.Item?.PurchasePrice ?? 0));
        var topItems = resources.GroupBy(r => r.Item?.ItemName ?? "Unknown")
            .Select(g => new GroupCountDto(g.Key, (int)g.Sum(r => r.Quantity)))
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToList();

        return new OTAnalyticsDto(totalTheaters, totalSurgeries, overallUtilization, totalCost, theaterUtilization, statusBreakdown, priorityBreakdown, trend, topItems);
    }
}


