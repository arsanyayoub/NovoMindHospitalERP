using HospitalERP.Domain.Common;

namespace HospitalERP.Domain.Entities;

// ===== HR =====
public class Employee : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? NationalId { get; set; }
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Allowances { get; set; }
    public decimal Deductions { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Payroll> Payrolls { get; set; } = new List<Payroll>();
    public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
}

public class AttendanceRecord : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    public DateTime Date { get; set; }
    public DateTime? ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public string Status { get; set; } = "Present"; // Present, Absent, Half-Day, Late
    public string? Notes { get; set; }
}

public class Payroll : BaseEntity
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Allowances { get; set; }
    public decimal Bonuses { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetSalary { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Paid
    public DateTime? PaidDate { get; set; }
    public string? Notes { get; set; }
}

// ===== EXPENSES =====
public class Expense : BaseEntity
{
    public string ExpenseNumber { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime ExpenseDate { get; set; } = DateTime.UtcNow;
    public string? Vendor { get; set; }
    public string? Receipt { get; set; }
    public bool IsApproved { get; set; } = false;
    public string? Notes { get; set; }
}

// ===== ASSETS =====
public class Asset : BaseEntity
{
    public string AssetCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal PurchaseCost { get; set; }
    public DateTime PurchaseDate { get; set; }
    public decimal DepreciationRate { get; set; }
    public decimal CurrentValue { get; set; }
    public string? Location { get; set; }
    public string Status { get; set; } = "Active";
    public string? Notes { get; set; }
}

// ===== NOTIFICATIONS =====
public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
}
