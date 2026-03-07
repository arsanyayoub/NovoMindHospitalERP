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

// ═══════════════════════════════════════════════════════════════
//  PATIENT
// ═══════════════════════════════════════════════════════════════
public record PatientDto(
    int Id, string PatientCode, string FullName, string? NationalId,
    DateTime DateOfBirth, string Gender, string? BloodType,
    string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone,
    string? MedicalHistory, string? Allergies, bool IsActive, 
    int? InsuranceProviderId, string? InsuranceProviderName, int? InsurancePlanId, string? InsurancePlanName,
    string? InsurancePolicyNumber, string? InsuranceCoverageType, decimal InsuranceBalance,
    DateTime CreatedDate);

public record CreatePatientDto(
    string FullName, string? NationalId, DateTime DateOfBirth, string Gender,
    string? BloodType, string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone, string? MedicalHistory, string? Allergies,
    int? InsuranceProviderId = null, int? InsurancePlanId = null, string? InsurancePolicyNumber = null, 
    string? InsuranceProviderNameManual = null, string? InsuranceCoverageType = null);

public record UpdatePatientDto(
    string FullName, string? NationalId, DateTime DateOfBirth, string Gender,
    string? BloodType, string? PhoneNumber, string? Email, string? Address,
    string? EmergencyContact, string? EmergencyPhone, string? MedicalHistory, string? Allergies, bool IsActive,
    int? InsuranceProviderId = null, int? InsurancePlanId = null, string? InsurancePolicyNumber = null,
    string? InsuranceProviderNameManual = null, string? InsuranceCoverageType = null);

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
    decimal DiscountAmount, decimal TotalAmount, decimal InsuranceShare, decimal PatientShare,
    decimal PaidAmount, decimal BalanceDue, string? Notes, List<InvoiceItemDto> Items, DateTime CreatedDate);

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
    string? Barcode, string? Description, bool IsActive, bool TrackBatches, 
    string? GenericName, string? Strength, string? DosageForm, bool IsNarcotic, bool RequiresRefrigeration,
    DateTime CreatedDate);

public record CreateItemDto(
    string ItemName, string ItemNameAr, string? Category, string? Unit,
    decimal SalePrice, decimal PurchasePrice, decimal TaxRate, string? Barcode,
    string? Description, bool TrackBatches = false,
    string? GenericName = null, string? Strength = null, string? DosageForm = null,
    bool IsNarcotic = false, bool RequiresRefrigeration = false);

public record MedicineInteractionDto(
    int Id, int ItemAId, string ItemAName, int ItemBId, string ItemBName,
    string Severity, string? InteractionDescription, string? Recommendation);

public record CreateMedicineInteractionDto(
    int ItemAId, int ItemBId, string Severity, string? InteractionDescription, string? Recommendation);

public record WarehouseDto(int Id, string WarehouseCode, string WarehouseName, string? Location, bool IsActive);
public record CreateWarehouseDto(string WarehouseName, string? Location);

public record WarehouseStockDto(
    int Id, int WarehouseId, string WarehouseName, int ItemId, string ItemName,
    decimal Quantity, decimal ReorderLevel, decimal MaxLevel, bool IsLowStock,
    decimal PurchasePrice = 0);

public record StockTransferDto(int FromWarehouseId, int ToWarehouseId, int ItemId, decimal Quantity, string? Notes);

// ─── Item Packaging Units (Box → Strip → Tablet) ──────────────
/// <summary>
/// Defines how a single item can be packaged at different levels.
/// e.g. Antal:  Box (barcode 6001234000001) contains 10 Strips (barcode 6001234000018),
///              each strip contains 10 Tablets (unit barcode 6001234000025).
/// </summary>
public record ItemPackagingUnitDto(
    int Id,
    int ItemId,
    string ItemName,
    string UnitName,       // e.g. "Box", "Strip", "Tablet"
    string UnitNameAr,     // e.g. "علبة", "شريط", "قرص"
    string Barcode,
    decimal UnitsPerPackage,   // e.g. Box has 10 strips, Strip has 10 tablets
    decimal BaseUnitQty,       // qty in base (smallest) units this package equals
    int SortOrder,
    bool IsBaseUnit,
    decimal SalePrice,
    decimal PurchasePrice
);

public record CreateItemPackagingUnitDto(
    int ItemId,
    string UnitName,
    string UnitNameAr,
    string? Barcode,
    decimal UnitsPerPackage,
    decimal BaseUnitQty,
    int SortOrder,
    bool IsBaseUnit,
    decimal SalePrice,
    decimal PurchasePrice
);

// ─── Item Batches (Lot / Expiry Tracking) ─────────────────────
public record ItemBatchDto(
    int Id,
    int ItemId,
    string ItemName,
    string ItemCode,
    int? SupplierId,
    string? SupplierName,
    int? WarehouseId,
    string? WarehouseName,
    string BatchNumber,
    string Barcode,
    DateTime ManufactureDate,
    DateTime ExpiryDate,
    decimal QuantityReceived,
    decimal QuantityRemaining,
    decimal UnitCost,
    string Status,
    string? LotNumber,
    string? Notes,
    DateTime ReceivedDate,
    int DaysUntilExpiry,
    bool IsExpired,
    bool IsExpiringSoon        // within 30 days
);

public record CreateItemBatchDto(
    int ItemId,
    int? SupplierId,
    int? WarehouseId,
    DateTime ManufactureDate,
    DateTime ExpiryDate,
    decimal QuantityReceived,
    decimal UnitCost,
    string? LotNumber,
    string? Notes
);

public record UpdateItemBatchDto(
    int? WarehouseId,
    decimal QuantityRemaining,
    string Status,
    string? Notes
);

/// <summary>Returned when a barcode is scanned at purchase/sale point.</summary>
public record BatchScanResultDto(
    bool Found,
    ItemBatchDto? Batch,
    ItemPackagingUnitDto? PackagingUnit,
    string? Message
);

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

public record AttendanceRecordDto(
    int Id, int EmployeeId, string EmployeeName, DateTime Date, DateTime? ClockIn, DateTime? ClockOut, 
    string Status, string? Notes);

public record CreateAttendanceRecordDto(
    int EmployeeId, DateTime Date, DateTime? ClockIn, DateTime? ClockOut, string Status, string? Notes);
public record CreatePayrollDto(int EmployeeId, int Month, int Year, decimal Bonuses, decimal Deductions, string? Notes);

// ═══════════════════════════════════════════════════════════════
//  EXPENSES / ASSETS
// ═══════════════════════════════════════════════════════════════
public record ExpenseDto(int Id, string ExpenseNumber, string Description, string Category, decimal Amount, DateTime ExpenseDate, string? Vendor, bool IsApproved, string? Notes);
public record CreateExpenseDto(string Description, string Category, decimal Amount, DateTime ExpenseDate, string? Vendor, string? Notes);


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
    List<MonthlyRevenueDto> MonthlyRevenues,
    List<AppointmentDto>? TodayAppointmentsList,
    List<TopDoctorDto>? TopDoctors,
    int ExpiringBatchesCount,
    int PendingPrescriptions = 0,
    int PendingLabRequests = 0,
    int PendingRadiologyRequests = 0,
    decimal PharmacyMonthlyRevenue = 0,
    decimal TotalStockValue = 0,
    int TotalBeds = 0,
    int OccupiedBeds = 0);

public record RecentActivityDto(string Type, string Description, DateTime Date);
public record MonthlyRevenueDto(string Month, decimal Revenue, decimal Expenses);
public record TopDoctorDto(string DoctorName, string Specialization, int AppointmentCount);

public record PatientAnalyticsDto(
    int TotalPatients,
    List<MonthlyCountDto> NewPatientsTrend,
    List<GroupCountDto> GenderBreakdown,
    List<GroupCountDto> AgeDistribution
);

public record AppointmentAnalyticsDto(int TotalAppointments, List<GroupCountDto> StatusBreakdown, List<GroupCountDto> SpecializationBreakdown, List<MonthlyCountDto> AppointmentsTrend);

public record LabAnalyticsDto(int TotalTests, decimal TotalRevenue, List<GroupCountDto> CategoryBreakdown, List<MonthlyCountDto> TestsTrend);
public record RadiologyAnalyticsDto(int TotalTests, decimal TotalRevenue, List<GroupCountDto> CategoryBreakdown, List<MonthlyCountDto> TestsTrend);

public record MonthlyCountDto(string Month, int Count);
public record GroupCountDto(string GroupName, int Count);

public record PharmacyAnalyticsDto(int TotalPrescriptions, decimal TotalRevenue, List<GroupCountDto> TopMedicines, List<MonthlyCountDto> RxTrend);
public record InventoryAnalyticsDto(int TotalItems, decimal TotalValue, int LowStockItems, List<GroupCountDto> CategoryDistribution);
public record HRAnalyticsDto(int TotalEmployees, decimal MonthlyPayroll, List<GroupCountDto> DepartmentDistribution, List<MonthlyCountDto> PayrollTrend);

public record BedAnalyticsDto(
    int TotalWards,
    int TotalRooms,
    int TotalBeds,
    int OccupiedBeds,
    int MaintenanceBeds,
    decimal OccupancyRate,
    List<GroupCountDto> WardOccupancy,
    List<GroupCountDto> RoomTypeOccupancy,
    List<MonthlyCountDto> AdmissionTrend
);

public record OTAnalyticsDto(
    int TotalTheaters,
    int TotalSurgeries,
    decimal UtilizationRate,
    decimal TotalResourceCost,
    List<GroupValueDto> TheaterUtilization,
    List<GroupCountDto> StatusBreakdown,
    List<GroupCountDto> PriorityBreakdown,
    List<MonthlyCountDto> SurgeryTrend,
    List<GroupCountDto> TopConsumedItems
);


public record GroupValueDto(string GroupName, decimal Value);


// ═══════════════════════════════════════════════════════════════
//  STOCK TRANSACTIONS (INVENTORY REPORTS)
// ═══════════════════════════════════════════════════════════════
public record StockTransactionDto(
    int Id, int ItemId, string ItemName, string ItemCode,
    int WarehouseId, string WarehouseName,
    string TransactionType,   // IN, OUT, TRANSFER
    decimal Quantity, decimal UnitCost,
    string? Reference, string? Notes,
    string? BatchNumber,
    DateTime TransactionDate, string CreatedBy);

// ═══════════════════════════════════════════════════════════════
//  LAB
// ═══════════════════════════════════════════════════════════════
public record LabTestDto(int Id, string TestCode, string Name, string NameAr, string Category, string NormalRange, string Unit, decimal Price, bool IsActive, List<LabTestReferenceRangeDto> ReferenceRanges);
public record CreateLabTestDto(string Name, string NameAr, string Category, string NormalRange, string Unit, decimal Price);

public record LabTestReferenceRangeDto(int Id, int LabTestId, string Gender, int? MinAge, int? MaxAge, decimal? MinValue, decimal? MaxValue, decimal? CriticalLow, decimal? CriticalHigh, string? Description);
public record CreateLabTestReferenceRangeDto(int LabTestId, string Gender, int? MinAge, int? MaxAge, decimal? MinValue, decimal? MaxValue, decimal? CriticalLow, decimal? CriticalHigh, string? Description);

public record LabRequestDto(int Id, string RequestNumber, int PatientId, string PatientName, int? DoctorId, string? DoctorName, DateTime RequestDate, string Status, DateTime? CollectionDate, string? CollectedBy, DateTime? ReceivedAtLabDate, decimal TotalAmount, string? Notes, List<LabResultDto> Results);
public record CreateLabRequestDto(int PatientId, int? DoctorId, DateTime RequestDate, string? Notes, List<int> TestIds);

public record LabResultDto(int Id, int LabRequestId, int LabTestId, string TestName, string? ResultValue, string? NormalRange, string? Unit, DateTime? ResultDate, string? Remarks, string? PerformedBy, string? ResultFlag, bool IsCritical);
public record UpdateLabResultDto(string? ResultValue, string? Remarks, string? PerformedBy, string? ResultFlag, bool IsCritical = false);

// ═══════════════════════════════════════════════════════════════
//  RADIOLOGY
// ═══════════════════════════════════════════════════════════════
public record RadiologyTestDto(int Id, string TestCode, string Name, string NameAr, string Category, string? PreparationInstructions, decimal Price, bool IsActive);
public record CreateRadiologyTestDto(string Name, string NameAr, string Category, string? PreparationInstructions, decimal Price);

public record RadiologyRequestDto(int Id, string RequestNumber, int PatientId, string PatientName, int? DoctorId, string? DoctorName, DateTime RequestDate, string Status, decimal TotalAmount, string? Notes, List<RadiologyResultDto> Results);
public record CreateRadiologyRequestDto(int PatientId, int? DoctorId, DateTime RequestDate, string? Notes, List<int> TestIds);

public record RadiologyResultDto(int Id, int RadiologyRequestId, int RadiologyTestId, string TestName, string? Findings, string? Impression, string? ImageUrl, DateTime? ResultDate, string? PerformedBy, string? RadiologistName, int? RadiologyTemplateId);
public record UpdateRadiologyResultDto(string? Findings, string? Impression, string? ImageUrl, string? PerformedBy, string? RadiologistName, int? RadiologyTemplateId = null);

public record RadiologyTemplateDto(int Id, string Name, string Category, string EnglishTemplate, string ArabicTemplate, bool IsActive);
public record CreateRadiologyTemplateDto(string Name, string Category, string EnglishTemplate, string ArabicTemplate);

// ═══════════════════════════════════════════════════════════════
//  CLINICAL & PHARMACY
// ═══════════════════════════════════════════════════════════════
public record PatientVitalDto(int Id, int PatientId, string PatientName, int? AppointmentId, int? BedAdmissionId, DateTime RecordedDate, string RecordedBy, 
    decimal? Temperature, int? BloodPressureSystolic, int? BloodPressureDiastolic, int? HeartRate, int? RespiratoryRate, int? SpO2, 
    decimal? WeightKg, decimal? HeightCm, decimal? BMI, string? PainScale, string? Notes);

public record CreatePatientVitalDto(int PatientId, int? AppointmentId, int? BedAdmissionId, decimal? Temperature, int? BloodPressureSystolic, int? BloodPressureDiastolic, 
    int? HeartRate, int? RespiratoryRate, int? SpO2, decimal? WeightKg, decimal? HeightCm, string? PainScale, string? Notes);

public record InpatientNursingAssessmentDto(int Id, int BedAdmissionId, DateTime AssessmentDate, string RecordedBy, string Shift,
    string? Neurological, string? Respiratory, string? Cardiovascular, string? Gastrointestinal, string? Genitourinary,
    string? Musculoskeletal, string? SkinIntegumentary, string? Psychological, string? NursingNotes, string? PlanOfCare);

public record CreateInpatientNursingAssessmentDto(int BedAdmissionId, string Shift,
    string? Neurological, string? Respiratory, string? Cardiovascular, string? Gastrointestinal, string? Genitourinary,
    string? Musculoskeletal, string? SkinIntegumentary, string? Psychological, string? NursingNotes, string? PlanOfCare);

public record PrescriptionDto(int Id, string PrescriptionNumber, int PatientId, string PatientName, int? DoctorId, string? DoctorName, 
    int? AppointmentId, int? BedAdmissionId, DateTime PrescriptionDate, string Status, string? Notes, List<PrescriptionItemDto> Items);

public record CreatePrescriptionDto(int PatientId, int? DoctorId, int? AppointmentId, int? BedAdmissionId, string? Notes, List<CreatePrescriptionItemDto> Items);

public record MedicationAdministrationDto(int Id, int PrescriptionItemId, string MedicineName, int BedAdmissionId, DateTime AdministeredDate, 
    string AdministeredBy, string Status, string? Dose, string? Notes, bool IsDispensed = false, DateTime? DispensedDate = null, string? DispensedBy = null);

public record CreateMedicationAdministrationDto(int PrescriptionItemId, int BedAdmissionId, string Status, string? Dose, string? Notes);

public record OperatingTheaterDto(int Id, string Name, string? Location, string Status);
public record CreateOperatingTheaterDto(string Name, string? Location, string Status);

public record ScheduledSurgeryDto(int Id, int PatientId, string PatientName, int LeadSurgeonId, string LeadSurgeonName, 
    int? AnesthetistId, string? AnesthetistName, int OperatingTheaterId, string OperatingTheaterName, int? BedAdmissionId,
    string ProcedureName, DateTime ScheduledStartTime, DateTime ScheduledEndTime, string Priority, string Status, 
    string? PreOpDiagnosis, string? PostOpDiagnosis, string? Notes, int? InvoiceId = null, decimal? TotalCost = null, 
    List<SurgeryResourceDto>? Resources = null, List<SurgeryChecklistDto>? Checklists = null);

public record SurgeryResourceDto(int Id, int ScheduledSurgeryId, int ItemId, string ItemName, decimal Quantity, string? BatchNumber, string? Notes, DateTime ConsumedDate);
public record CreateSurgeryResourceDto(int ItemId, decimal Quantity, string? BatchNumber, string? Notes);

public record SurgeryChecklistDto(
    int Id, int ScheduledSurgeryId, string Stage,
    bool PatientIdentityConfirmed, bool SiteMarked, bool ConsentChecked,
    bool AnesthesiaSafetyCheckDone, bool PulseOximeterOn, bool AllergyChecked, bool AirwayRiskAssessed,
    bool TeamMembersIntroduced, bool AnticipatedBloodLossChecked, bool AntibioticProphylaxisGiven,
    bool InstrumentCountConfirmed, bool SpecimenLabeled, bool EquipmentIssuesAddressed,
    string? CompletedBy, DateTime CreatedDate);

public record CreateSurgeryChecklistDto(
    string Stage,
    bool PatientIdentityConfirmed, bool SiteMarked, bool ConsentChecked,
    bool AnesthesiaSafetyCheckDone, bool PulseOximeterOn, bool AllergyChecked, bool AirwayRiskAssessed,
    bool TeamMembersIntroduced, bool AnticipatedBloodLossChecked, bool AntibioticProphylaxisGiven,
    bool InstrumentCountConfirmed, bool SpecimenLabeled, bool EquipmentIssuesAddressed);

public record MedicineReturnDto(
    int Id, int PrescriptionItemId, string MedicineName, decimal QuantityReturned,
    string Reason, string HandledBy, DateTime ReturnDate, string Status, string? Notes);

public record CreateMedicineReturnDto(
    int PrescriptionItemId, decimal QuantityReturned, string Reason, string? Notes);


public record CreateScheduledSurgeryDto(int PatientId, int LeadSurgeonId, int? AnesthetistId, int OperatingTheaterId, 
    string ProcedureName, DateTime ScheduledStartTime, DateTime ScheduledEndTime, string Priority, 
    string? PreOpDiagnosis, string? Notes, int? BedAdmissionId = null);

public record PrescriptionItemDto(int Id, int PrescriptionId, int ItemId, string ItemName, string Dosage, string Frequency, string Duration, decimal Quantity, string? Instructions, bool IsDispensed, DateTime? DispensedDate, string? DispensedBy, string? PatientName = null, string? PrescriptionNumber = null);

public record CreatePrescriptionItemDto(int ItemId, string Dosage, string Frequency, string Duration, decimal Quantity, string? Instructions);

public record DispenseItemDto(int? ItemBatchId, decimal Quantity);

public record PharmacyDashboardDto(
    int PendingPrescriptions,
    int ExpiringSoonCount,
    int LowStockCount,
    List<PrescriptionDto> RecentPrescriptions,
    List<ItemBatchDto> ExpiringBatches,
    List<WarehouseStockDto> LowStockMedications);

public record ClinicalEncounterDto(int Id, int PatientId, string PatientName, int? DoctorId, string? DoctorName, 
    int? AppointmentId, DateTime EncounterDate, string? ChiefComplaint, string? Subjective, string? Objective, 
    string? Assessment, string? Plan, string? InternalNotes, bool IsFinalized, DateTime CreatedDate);

public record CreateClinicalEncounterDto(int PatientId, int? DoctorId, int? AppointmentId, string? ChiefComplaint, 
    string? Subjective, string? Objective, string? Assessment, string? Plan, string? InternalNotes, bool IsFinalized = false);

// ═══════════════════════════════════════════════════════════════
//  INSURANCE & TPA MANAGEMENT
// ═══════════════════════════════════════════════════════════════
public record InsuranceProviderDto(int Id, string Name, string? ContactPerson, string? Email, string? PhoneNumber, string? Address, string? TPA, bool IsActive, List<InsurancePlanDto> Plans);
public record CreateInsuranceProviderDto(string Name, string? ContactPerson, string? Email, string? PhoneNumber, string? Address, string? TPA, bool IsActive = true);

public record InsurancePlanDto(int Id, int InsuranceProviderId, string? ProviderName, string PlanName, string PlanCode, decimal CoveragePercentage, decimal CoPayAmount, decimal MaxLimit, string? Exclusions, bool RequiresPreAuth, bool IsActive);
public record CreateInsurancePlanDto(int InsuranceProviderId, string PlanName, string PlanCode, decimal CoveragePercentage, decimal CoPayAmount, decimal MaxLimit, string? Exclusions, bool RequiresPreAuth, bool IsActive = true);

public record InsuranceClaimDto(int Id, string ClaimNumber, int InvoiceId, string InvoiceNumber, int PatientId, string PatientName, int InsuranceProviderId, string ProviderName, decimal ClaimAmount, decimal ApprovedAmount, string Status, DateTime? SubmissionDate, DateTime? StatusDate, string? RejectionReason, string? AuthCode);
public record CreateInsuranceClaimDto(int InvoiceId, int PatientId, int InsuranceProviderId, decimal ClaimAmount, string? AuthCode = null);
public record UpdateClaimStatusDto(string Status, decimal ApprovedAmount, string? RejectionReason = null);

// ═══════════════════════════════════════════════════════════════
//  USER & ROLE MANAGEMENT
// ═══════════════════════════════════════════════════════════════
public record UserDto(int Id, string Username, string Email, string FullName, string? PhoneNumber, int RoleId, string? RoleName, bool IsActive, DateTime CreatedDate);
public record CreateUserDto(string Username, string Email, string Password, string FullName, string? PhoneNumber, int RoleId, bool IsActive = true);
public record UpdateUserDto(string Email, string FullName, string? PhoneNumber, int RoleId, bool IsActive);
public record RoleDto(int Id, string Name, string? Description);

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

// ═══════════════════════════════════════════════════════════════
//  FIXED ASSETS & MAINTENANCE
// ═══════════════════════════════════════════════════════════════
public record AssetDto(int Id, string AssetCode, string AssetName, string? Manufacturer, string? ModelNumber, string? SerialNumber, string Category, decimal PurchaseCost, DateTime PurchaseDate, DateTime? WarrantyExpiryDate, decimal DepreciationRate, decimal CurrentValue, string? Location, string Status, bool IsBioMedical, int? MaintenanceIntervalDays, DateTime? LastMaintenanceDate, DateTime? NextMaintenanceDate, string? Notes);
public record CreateAssetDto(string AssetName, string? Manufacturer, string? ModelNumber, string? SerialNumber, string Category, decimal PurchaseCost, DateTime PurchaseDate, DateTime? WarrantyExpiryDate, decimal DepreciationRate, string? Location, bool IsBioMedical, int? MaintenanceIntervalDays, string? Notes);

public record MaintenanceTicketDto(int Id, int AssetId, string AssetName, string TicketNumber, string Type, string Priority, string Description, string Status, DateTime ReportedDate, DateTime? CompletedDate, string? ReportedBy, string? TechnicianName, decimal? Cost, string? Resolution, string? Notes);
public record CreateMaintenanceTicketDto(int AssetId, string Type, string Priority, string Description, string? ReportedBy, string? TechnicianName, decimal? Cost, string? Notes);
public record UpdateMaintenanceTicketDto(string Status, DateTime? CompletedDate, string? TechnicianName, decimal? Cost, string? Resolution, string? Notes);
