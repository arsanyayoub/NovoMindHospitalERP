namespace HospitalERP.Application.DTOs;

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════
public record LoginDto(string Username, string Password);
public record RegisterDto(string Username, string Email, string Password, string FullName, string? PhoneNumber, int RoleId);
public record AuthResponseDto(string AccessToken, string RefreshToken, DateTime Expiry, int UserId, string Username, string FullName, string Role);
public record RefreshTokenDto(string RefreshToken);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);

// ═══════════════════════════════════════════════════════════════
//  USER
// ═══════════════════════════════════════════════════════════════
public record UserDto(int Id, string Username, string Email, string FullName, string? PhoneNumber, bool IsActive, string Role, DateTime CreatedDate);
public record CreateUserDto(string Username, string Email, string Password, string FullName, string? PhoneNumber, int RoleId);
public record UpdateUserDto(string Email, string FullName, string? PhoneNumber, bool IsActive, int RoleId);

// ═══════════════════════════════════════════════════════════════
//  PATIENT
// ═══════════════════════════════════════════════════════════════
public record PatientDto(
    int Id, string PatientCode, string FullName, string? NationalId,
    DateTime DateOfBirth, string Gender, string? BloodType,
    string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone,
    string? MedicalHistory, string? Allergies, bool IsActive, DateTime CreatedDate);

public record CreatePatientDto(
    string FullName, string? NationalId, DateTime DateOfBirth, string Gender,
    string? BloodType, string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone, string? MedicalHistory, string? Allergies);

public record UpdatePatientDto(
    string FullName, string? NationalId, DateTime DateOfBirth, string Gender,
    string? BloodType, string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone, string? MedicalHistory, string? Allergies, bool IsActive);

// ═══════════════════════════════════════════════════════════════
//  DOCTOR
// ═══════════════════════════════════════════════════════════════
public record DoctorDto(
    int Id, string DoctorCode, string FullName, string Specialization,
    string? SubSpecialization, string? PhoneNumber, string? Email,
    string? LicenseNumber, decimal ConsultationFee, string? WorkingDays,
    string? WorkingHours, bool IsActive, int? EmployeeId, DateTime CreatedDate);

public record CreateDoctorDto(
    string FullName, string Specialization, string? SubSpecialization,
    string? PhoneNumber, string? Email, string? LicenseNumber,
    decimal ConsultationFee, string? WorkingDays, string? WorkingHours, int? EmployeeId);

public record UpdateDoctorDto(
    string FullName, string Specialization, string? SubSpecialization,
    string? PhoneNumber, string? Email, string? LicenseNumber,
    decimal ConsultationFee, string? WorkingDays, string? WorkingHours, bool IsActive);

// ═══════════════════════════════════════════════════════════════
//  APPOINTMENT
// ═══════════════════════════════════════════════════════════════
public record AppointmentDto(
    int Id, string AppointmentCode, int PatientId, string PatientName,
    int DoctorId, string DoctorName, string Specialization,
    DateTime AppointmentDate, TimeSpan AppointmentTime, int DurationMinutes,
    string Status, string? Notes, string? Diagnosis, string? Prescription,
    decimal Fee, bool IsPaid, DateTime CreatedDate);

public record CreateAppointmentDto(
    int PatientId, int DoctorId, DateTime AppointmentDate,
    TimeSpan AppointmentTime, int DurationMinutes, string? Notes, decimal Fee);

public record UpdateAppointmentDto(
    DateTime AppointmentDate, TimeSpan AppointmentTime, int DurationMinutes,
    string Status, string? Notes, string? Diagnosis, string? Prescription, bool IsPaid);

// ═══════════════════════════════════════════════════════════════
//  INVOICE / PAYMENT
// ═══════════════════════════════════════════════════════════════
public record InvoiceDto(
    int Id, string InvoiceNumber, int? PatientId, string? PatientName,
    int? CustomerId, string? CustomerName, DateTime InvoiceDate, DateTime? DueDate,
    string InvoiceType, string Status, decimal SubTotal, decimal TaxAmount,
    decimal DiscountAmount, decimal TotalAmount, decimal PaidAmount, decimal BalanceDue,
    string? Notes, List<InvoiceItemDto> Items, DateTime CreatedDate);

public record InvoiceItemDto(
    int Id, int? ItemId, string? ItemName, string Description,
    decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount, decimal Total);

public record CreateInvoiceDto(
    int? PatientId, int? CustomerId, DateTime InvoiceDate, DateTime? DueDate,
    string InvoiceType, decimal TaxAmount, decimal DiscountAmount, string? Notes,
    List<CreateInvoiceItemDto> Items);

public record CreateInvoiceItemDto(
    int? ItemId, string Description, decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount);

public record PaymentDto(
    int Id, string PaymentNumber, int? InvoiceId, int? PatientId, string? PatientName,
    decimal Amount, DateTime PaymentDate, string PaymentMethod, string? ReferenceNumber, string? Notes);

public record CreatePaymentDto(
    int? InvoiceId, int? PatientId, decimal Amount, string PaymentMethod, string? ReferenceNumber, string? Notes);

// ═══════════════════════════════════════════════════════════════
//  ACCOUNTING
// ═══════════════════════════════════════════════════════════════
public record AccountDto(
    int Id, string AccountCode, string AccountName, string AccountNameAr,
    string AccountType, int? ParentAccountId, string? ParentAccountName,
    decimal Balance, bool IsActive, string? Description);

public record CreateAccountDto(
    string AccountCode, string AccountName, string AccountNameAr,
    string AccountType, int? ParentAccountId, string? Description);

public record JournalEntryDto(
    int Id, string EntryNumber, DateTime EntryDate, string Description,
    string? Reference, string Status, decimal TotalDebit, decimal TotalCredit,
    List<JournalEntryLineDto> Lines, DateTime CreatedDate);

public record JournalEntryLineDto(int AccountId, string AccountName, decimal DebitAmount, decimal CreditAmount, string? Description);

public record CreateJournalEntryDto(
    DateTime EntryDate, string Description, string? Reference,
    List<CreateJournalEntryLineDto> Lines);

public record CreateJournalEntryLineDto(int AccountId, decimal DebitAmount, decimal CreditAmount, string? Description);

public record FinancialReportDto(
    decimal TotalRevenue, decimal TotalExpenses, decimal NetIncome,
    decimal TotalAssets, decimal TotalLiabilities, decimal TotalEquity,
    List<AccountBalanceDto> IncomeAccounts, List<AccountBalanceDto> ExpenseAccounts);

public record AccountBalanceDto(string AccountCode, string AccountName, decimal Balance);

// ═══════════════════════════════════════════════════════════════
//  INVENTORY
// ═══════════════════════════════════════════════════════════════
public record ItemDto(
    int Id, string ItemCode, string ItemName, string ItemNameAr, string? Category,
    string? Unit, decimal SalePrice, decimal PurchasePrice, decimal TaxRate,
    string? Barcode, string? Description, bool IsActive, DateTime CreatedDate);

public record CreateItemDto(
    string ItemName, string ItemNameAr, string? Category, string? Unit,
    decimal SalePrice, decimal PurchasePrice, decimal TaxRate, string? Barcode, string? Description);

public record WarehouseDto(int Id, string WarehouseCode, string WarehouseName, string? Location, bool IsActive);
public record CreateWarehouseDto(string WarehouseName, string? Location);

public record WarehouseStockDto(
    int Id, int WarehouseId, string WarehouseName, int ItemId, string ItemName,
    decimal Quantity, decimal ReorderLevel, decimal MaxLevel, bool IsLowStock);

public record StockTransferDto(int FromWarehouseId, int ToWarehouseId, int ItemId, decimal Quantity, string? Notes);

// ═══════════════════════════════════════════════════════════════
//  PURCHASING
// ═══════════════════════════════════════════════════════════════
public record SupplierDto(
    int Id, string SupplierCode, string SupplierName, string? ContactPerson,
    string? PhoneNumber, string? Email, string? Address, string? TaxNumber,
    decimal Balance, bool IsActive, DateTime CreatedDate);

public record CreateSupplierDto(
    string SupplierName, string? ContactPerson, string? PhoneNumber,
    string? Email, string? Address, string? TaxNumber);

public record PurchaseInvoiceDto(
    int Id, string InvoiceNumber, int SupplierId, string SupplierName,
    DateTime InvoiceDate, DateTime? DueDate, string Status,
    decimal SubTotal, decimal TaxAmount, decimal DiscountAmount,
    decimal TotalAmount, decimal PaidAmount, string? Notes,
    List<PurchaseInvoiceItemDto> Items, DateTime CreatedDate);

public record PurchaseInvoiceItemDto(int ItemId, string ItemName, int WarehouseId, string WarehouseName, decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount, decimal Total);

public record CreatePurchaseInvoiceDto(
    int SupplierId, DateTime InvoiceDate, DateTime? DueDate,
    decimal DiscountAmount, string? Notes,
    List<CreatePurchaseInvoiceItemDto> Items);

public record CreatePurchaseInvoiceItemDto(int ItemId, int WarehouseId, decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount);

// ═══════════════════════════════════════════════════════════════
//  SALES
// ═══════════════════════════════════════════════════════════════
public record CustomerDto(
    int Id, string CustomerCode, string CustomerName, string? ContactPerson,
    string? PhoneNumber, string? Email, string? Address, string? TaxNumber,
    decimal Balance, bool IsActive, DateTime CreatedDate);

public record CreateCustomerDto(
    string CustomerName, string? ContactPerson, string? PhoneNumber,
    string? Email, string? Address, string? TaxNumber);

public record SalesInvoiceDto(
    int Id, string InvoiceNumber, int CustomerId, string CustomerName,
    DateTime InvoiceDate, DateTime? DueDate, string Status,
    decimal SubTotal, decimal TaxAmount, decimal DiscountAmount,
    decimal TotalAmount, decimal PaidAmount, string? Notes,
    List<SalesInvoiceItemDto> Items, DateTime CreatedDate);

public record SalesInvoiceItemDto(int ItemId, string ItemName, int WarehouseId, string WarehouseName, decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount, decimal Total);

public record CreateSalesInvoiceDto(
    int CustomerId, DateTime InvoiceDate, DateTime? DueDate,
    decimal DiscountAmount, string? Notes,
    List<CreateSalesInvoiceItemDto> Items);

public record CreateSalesInvoiceItemDto(int ItemId, int WarehouseId, decimal Quantity, decimal UnitPrice, decimal TaxRate, decimal Discount);

// ═══════════════════════════════════════════════════════════════
//  HR
// ═══════════════════════════════════════════════════════════════
public record EmployeeDto(
    int Id, string EmployeeCode, string FullName, string? NationalId,
    string Department, string Position, DateTime HireDate,
    decimal BasicSalary, decimal Allowances, decimal Deductions,
    string? PhoneNumber, string? Email, bool IsActive, DateTime CreatedDate);

public record CreateEmployeeDto(
    string FullName, string? NationalId, string Department, string Position,
    DateTime HireDate, decimal BasicSalary, decimal Allowances, decimal Deductions,
    string? PhoneNumber, string? Email);

public record PayrollDto(
    int Id, int EmployeeId, string EmployeeName, int Month, int Year,
    decimal BasicSalary, decimal Allowances, decimal Bonuses,
    decimal Deductions, decimal NetSalary, string Status, DateTime? PaidDate);

public record CreatePayrollDto(int EmployeeId, int Month, int Year, decimal Bonuses, decimal Deductions, string? Notes);

// ═══════════════════════════════════════════════════════════════
//  EXPENSES / ASSETS
// ═══════════════════════════════════════════════════════════════
public record ExpenseDto(int Id, string ExpenseNumber, string Description, string Category, decimal Amount, DateTime ExpenseDate, string? Vendor, bool IsApproved, string? Notes);
public record CreateExpenseDto(string Description, string Category, decimal Amount, DateTime ExpenseDate, string? Vendor, string? Notes);

public record AssetDto(int Id, string AssetCode, string AssetName, string Category, decimal PurchaseCost, DateTime PurchaseDate, decimal DepreciationRate, decimal CurrentValue, string? Location, string Status);
public record CreateAssetDto(string AssetName, string Category, decimal PurchaseCost, DateTime PurchaseDate, decimal DepreciationRate, string? Location);

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATION
// ═══════════════════════════════════════════════════════════════
public record NotificationDto(int Id, string Title, string Message, string NotificationType, bool IsRead, DateTime CreatedDate);

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
public record DashboardDto(
    int TotalPatients, int TodayAppointments, int PendingAppointments,
    decimal TodayRevenue, decimal MonthlyRevenue, decimal TotalRevenue,
    int LowStockItems, int PendingInvoices, decimal OutstandingPayments,
    int TotalDoctors, int TotalEmployees,
    List<RecentActivityDto> RecentActivities,
    List<MonthlyRevenueDto> MonthlyRevenues);

public record RecentActivityDto(string Type, string Description, DateTime Date);
public record MonthlyRevenueDto(string Month, decimal Revenue, decimal Expenses);

// ═══════════════════════════════════════════════════════════════
//  PAGINATION
// ═══════════════════════════════════════════════════════════════
public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

public record PagedRequest(int Page = 1, int PageSize = 20, string? Search = null, string? SortBy = null, bool SortDescending = false);
