using HospitalERP.Application.DTOs;

namespace HospitalERP.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto);
    Task LogoutAsync(int userId);
    Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
}

public interface IPatientService
{
    Task<PagedResult<PatientDto>> GetAllAsync(PagedRequest request);
    Task<PatientDto?> GetByIdAsync(int id);
    Task<PatientDto> CreateAsync(CreatePatientDto dto, string createdBy);
    Task<PatientDto> UpdateAsync(int id, UpdatePatientDto dto, string updatedBy);
    Task DeleteAsync(int id);
    Task<IEnumerable<AppointmentDto>> GetPatientAppointmentsAsync(int patientId);
    Task<IEnumerable<InvoiceDto>> GetPatientInvoicesAsync(int patientId);
    Task<IEnumerable<PatientVitalDto>> GetPatientVitalsAsync(int patientId);
    Task<IEnumerable<PrescriptionDto>> GetPatientPrescriptionsAsync(int patientId);
    Task<IEnumerable<LabRequestDto>> GetPatientLabRequestsAsync(int patientId);
    Task<IEnumerable<RadiologyRequestDto>> GetPatientRadiologyRequestsAsync(int patientId);
}

public interface IDoctorService
{
    Task<PagedResult<DoctorDto>> GetAllAsync(PagedRequest request);
    Task<DoctorDto?> GetByIdAsync(int id);
    Task<DoctorDto> CreateAsync(CreateDoctorDto dto, string createdBy);
    Task<DoctorDto> UpdateAsync(int id, UpdateDoctorDto dto, string updatedBy);
    Task DeleteAsync(int id);
    Task<IEnumerable<AppointmentDto>> GetDoctorAppointmentsAsync(int doctorId, DateTime? date);
}

public interface IAppointmentService
{
    Task<PagedResult<AppointmentDto>> GetAllAsync(PagedRequest request, DateTime? date, int? doctorId, int? patientId, string? status);
    Task<AppointmentDto?> GetByIdAsync(int id);
    Task<AppointmentDto> CreateAsync(CreateAppointmentDto dto, string createdBy);
    Task<AppointmentDto> UpdateAsync(int id, UpdateAppointmentDto dto, string updatedBy);
    Task DeleteAsync(int id);
    Task<IEnumerable<AppointmentDto>> GetTodayAppointmentsAsync();
}

public interface IInvoiceService
{
    Task<PagedResult<InvoiceDto>> GetAllAsync(PagedRequest request, string? status, string? type);
    Task<InvoiceDto?> GetByIdAsync(int id);
    Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto, string createdBy);
    Task DeleteAsync(int id);
    Task<PaymentDto> RecordPaymentAsync(CreatePaymentDto dto, string createdBy);
    Task<IEnumerable<PaymentDto>> GetPaymentsAsync(int? invoiceId);
}

public interface IAccountingService
{
    Task<IEnumerable<AccountDto>> GetChartOfAccountsAsync();
    Task<AccountDto?> GetAccountByIdAsync(int id);
    Task<AccountDto> CreateAccountAsync(CreateAccountDto dto, string createdBy);
    Task<AccountDto> UpdateAccountAsync(int id, CreateAccountDto dto, string updatedBy);
    Task<PagedResult<JournalEntryDto>> GetJournalEntriesAsync(PagedRequest request, DateTime? from, DateTime? to);
    Task<JournalEntryDto?> GetJournalEntryByIdAsync(int id);
    Task<JournalEntryDto> CreateJournalEntryAsync(CreateJournalEntryDto dto, string createdBy);
    Task PostJournalEntryAsync(int id, string postedBy);
    Task<FinancialReportDto> GetFinancialReportAsync(DateTime from, DateTime to);
    Task<IEnumerable<AccountBalanceDto>> GetTrialBalanceAsync(DateTime asOf);
}

public interface IInventoryService
{
    Task<PagedResult<ItemDto>> GetItemsAsync(PagedRequest request);
    Task<ItemDto?> GetItemByIdAsync(int id);
    Task<ItemDto> CreateItemAsync(CreateItemDto dto, string createdBy);
    Task<ItemDto> UpdateItemAsync(int id, CreateItemDto dto, string updatedBy);
    Task DeleteItemAsync(int id);
    Task<IEnumerable<WarehouseDto>> GetWarehousesAsync();
    Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto, string createdBy);
    Task<IEnumerable<WarehouseStockDto>> GetStockAsync(int? warehouseId, int? itemId);
    Task<IEnumerable<WarehouseStockDto>> GetLowStockItemsAsync();
    Task TransferStockAsync(StockTransferDto dto, string createdBy);

    // Packaging Units
    Task<IEnumerable<ItemPackagingUnitDto>> GetItemPackagingUnitsAsync(int itemId);
    Task<ItemPackagingUnitDto> CreateItemPackagingUnitAsync(CreateItemPackagingUnitDto dto, string createdBy);
    Task DeleteItemPackagingUnitAsync(int id);

    // Batches
    Task<PagedResult<ItemBatchDto>> GetBatchesAsync(PagedRequest request, int? itemId, int? warehouseId, bool? excludeExpired, bool? excludeExhausted);
    Task<ItemBatchDto?> GetBatchByIdAsync(int id);
    Task<ItemBatchDto> CreateBatchAsync(CreateItemBatchDto dto, string createdBy);
    Task<ItemBatchDto> UpdateBatchAsync(int id, UpdateItemBatchDto dto, string updatedBy);
    Task DeleteBatchAsync(int id);
    Task<BatchScanResultDto> ScanBarcodeAsync(string barcode, int? warehouseId);

    // Reports
    Task<IEnumerable<StockTransactionDto>> GetStockTransactionsAsync(int? itemId, int? warehouseId, string? type, DateTime? from, DateTime? to);
}

public interface IPurchaseService
{
    Task<PagedResult<SupplierDto>> GetSuppliersAsync(PagedRequest request);
    Task<SupplierDto?> GetSupplierByIdAsync(int id);
    Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto, string createdBy);
    Task<SupplierDto> UpdateSupplierAsync(int id, CreateSupplierDto dto, string updatedBy);
    Task<PagedResult<PurchaseInvoiceDto>> GetPurchaseInvoicesAsync(PagedRequest request, string? status);
    Task<PurchaseInvoiceDto?> GetPurchaseInvoiceByIdAsync(int id);
    Task<PurchaseInvoiceDto> CreatePurchaseInvoiceAsync(CreatePurchaseInvoiceDto dto, string createdBy);
    Task PayPurchaseInvoiceAsync(int id, decimal amount, string paidBy);
}

public interface ISalesService
{
    Task<PagedResult<CustomerDto>> GetCustomersAsync(PagedRequest request);
    Task<CustomerDto?> GetCustomerByIdAsync(int id);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, string createdBy);
    Task<CustomerDto> UpdateCustomerAsync(int id, CreateCustomerDto dto, string updatedBy);
    Task<PagedResult<SalesInvoiceDto>> GetSalesInvoicesAsync(PagedRequest request, string? status);
    Task<SalesInvoiceDto?> GetSalesInvoiceByIdAsync(int id);
    Task<SalesInvoiceDto> CreateSalesInvoiceAsync(CreateSalesInvoiceDto dto, string createdBy);
    Task PaySalesInvoiceAsync(int id, decimal amount, string paidBy);
}

public interface IHRService
{
    Task<PagedResult<EmployeeDto>> GetEmployeesAsync(PagedRequest request);
    Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto, string createdBy);
    Task<EmployeeDto> UpdateEmployeeAsync(int id, CreateEmployeeDto dto, string updatedBy);
    Task DeleteEmployeeAsync(int id);
    Task<PagedResult<PayrollDto>> GetPayrollsAsync(PagedRequest request, int? year, int? month);
    Task<PayrollDto> GeneratePayrollAsync(CreatePayrollDto dto, string createdBy);
    Task ProcessPayrollPaymentAsync(int payrollId, string paidBy);
}

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
}

public interface IReportingService
{
    Task<PatientAnalyticsDto> GetPatientAnalyticsAsync(DateTime from, DateTime to);
    Task<AppointmentAnalyticsDto> GetAppointmentAnalyticsAsync(DateTime from, DateTime to);
    Task<LabAnalyticsDto> GetLabAnalyticsAsync(DateTime from, DateTime to);
    Task<RadiologyAnalyticsDto> GetRadiologyAnalyticsAsync(DateTime from, DateTime to);
    Task<PharmacyAnalyticsDto> GetPharmacyAnalyticsAsync(DateTime from, DateTime to);
    Task<InventoryAnalyticsDto> GetInventoryAnalyticsAsync();
    Task<HRAnalyticsDto> GetHRAnalyticsAsync(int year);
}

public interface ILabService
{
    Task<PagedResult<LabTestDto>> GetTestsAsync(PagedRequest request);
    Task<LabTestDto?> GetTestByIdAsync(int id);
    Task<LabTestDto> CreateTestAsync(CreateLabTestDto dto, string createdBy);
    Task<LabTestDto> UpdateTestAsync(int id, CreateLabTestDto dto, string updatedBy);
    Task DeleteTestAsync(int id);

    Task<PagedResult<LabRequestDto>> GetRequestsAsync(PagedRequest request, string? status);
    Task<LabRequestDto?> GetRequestByIdAsync(int id);
    Task<LabRequestDto> CreateRequestAsync(CreateLabRequestDto dto, string createdBy);
    Task<LabRequestDto> UpdateResultAsync(int resultId, UpdateLabResultDto dto, string updatedBy);
    Task CompleteRequestAsync(int requestId, string updatedBy);
}

public interface IRadiologyService
{
    Task<PagedResult<RadiologyTestDto>> GetTestsAsync(PagedRequest request);
    Task<RadiologyTestDto?> GetTestByIdAsync(int id);
    Task<RadiologyTestDto> CreateTestAsync(CreateRadiologyTestDto dto, string createdBy);
    Task<RadiologyTestDto> UpdateTestAsync(int id, CreateRadiologyTestDto dto, string updatedBy);
    Task DeleteTestAsync(int id);

    Task<PagedResult<RadiologyRequestDto>> GetRequestsAsync(PagedRequest request, string? status);
    Task<RadiologyRequestDto?> GetRequestByIdAsync(int id);
    Task<RadiologyRequestDto> CreateRequestAsync(CreateRadiologyRequestDto dto, string createdBy);
    Task<RadiologyRequestDto> UpdateResultAsync(int resultId, UpdateRadiologyResultDto dto, string updatedBy);
    Task CompleteRequestAsync(int requestId, string updatedBy);
}

public interface IClinicalService
{
    Task<PagedResult<PatientVitalDto>> GetVitalsAsync(PagedRequest request, int? patientId);
    Task<PatientVitalDto> CreateVitalAsync(CreatePatientVitalDto dto, string recordedBy);
    Task DeleteVitalAsync(int id);

    // Encounters
    Task<PagedResult<ClinicalEncounterDto>> GetEncountersAsync(PagedRequest request, int? patientId, int? doctorId);
    Task<ClinicalEncounterDto?> GetEncounterByIdAsync(int id);
    Task<ClinicalEncounterDto> CreateEncounterAsync(CreateClinicalEncounterDto dto, string createdBy);
    Task<ClinicalEncounterDto> UpdateEncounterAsync(int id, CreateClinicalEncounterDto dto, string updatedBy);
    Task DeleteEncounterAsync(int id);
}

public interface IPharmacyService
{
    Task<PagedResult<PrescriptionDto>> GetPrescriptionsAsync(PagedRequest request, string? status);
    Task<PrescriptionDto?> GetPrescriptionByIdAsync(int id);
    Task<PrescriptionDto> CreatePrescriptionAsync(CreatePrescriptionDto dto, string createdBy);
    Task CancelPrescriptionAsync(int id, string updatedBy);
    
    // Dispensing
    Task DispenseItemAsync(int prescriptionItemId, DispenseItemDto dto, string dispensedBy);
    Task<List<PrescriptionItemDto>> GetPendingDispensingAsync(int? patientId);
}

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId);
    Task MarkAsReadAsync(int notificationId);
    Task MarkAllAsReadAsync(int userId);
    Task CreateNotificationAsync(string title, string message, string type, int? userId = null, string? entityType = null, int? entityId = null);
    Task<int> GetUnreadCountAsync(int userId);
}

public interface IPdfService
{
    Task<byte[]> GenerateInvoicePdfAsync(int invoiceId);
}

public interface IUserService
{
    Task<PagedResult<UserDto>> GetUsersAsync(PagedRequest request);
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<UserDto> CreateUserAsync(CreateUserDto dto, string createdBy);
    Task<UserDto> UpdateUserAsync(int id, UpdateUserDto dto, string updatedBy);
    Task ToggleUserStatusAsync(int id, string updatedBy);
    Task<IEnumerable<RoleDto>> GetRolesAsync();
}
