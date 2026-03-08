using HospitalERP.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace HospitalERP.Domain.Entities;

// ===== SHIFT MANAGEMENT =====
public class WorkShift : BaseEntity
{
    [Required]
    public string ShiftName { get; set; } = string.Empty; // Morning, Evening, Night, OnCall
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string ColorCode { get; set; } = "#6366f1"; // For calendar UI
    public bool IsActive { get; set; } = true;
}

public class EmployeeRoster : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    
    public int WorkShiftId { get; set; }
    public WorkShift WorkShift { get; set; } = null!;
    
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public bool IsHoliday { get; set; } = false;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Absent, Swapped
}

// ===== LEAVE MANAGEMENT =====
public class LeaveRequest : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    
    public string LeaveType { get; set; } = string.Empty; // Annual, Sick, Maternity, Unpaid
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Cancelled
    
    public string? ApprovedBy { get; set; }
    public DateTime? ActionDate { get; set; }
    public string? Comments { get; set; }
}

public class EmployeeLeaveBalance : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    
    public int Year { get; set; }
    public string LeaveType { get; set; } = string.Empty;
    public int TotalEntitled { get; set; }
    public int Used { get; set; }
    public int Remaining => TotalEntitled - Used;
}
