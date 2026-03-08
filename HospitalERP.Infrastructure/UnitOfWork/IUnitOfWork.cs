using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.Data;
using HospitalERP.Infrastructure.Repositories;

namespace HospitalERP.Infrastructure.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Role> Roles { get; }
    IRepository<Patient> Patients { get; }
    IRepository<Doctor> Doctors { get; }
    IRepository<Appointment> Appointments { get; }
    IRepository<Invoice> Invoices { get; }
    IRepository<InvoiceItem> InvoiceItems { get; }
    IRepository<Payment> Payments { get; }
    IRepository<Account> Accounts { get; }
    IRepository<JournalEntry> JournalEntries { get; }
    IRepository<JournalEntryLine> JournalEntryLines { get; }
    IRepository<Item> Items { get; }
    IRepository<ItemBatch> ItemBatches { get; }
    IRepository<ItemPackagingUnit> ItemPackagingUnits { get; }
    IRepository<Warehouse> Warehouses { get; }
    IRepository<WarehouseStock> WarehouseStocks { get; }
    IRepository<StockTransaction> StockTransactions { get; }
    IRepository<Supplier> Suppliers { get; }
    IRepository<PurchaseInvoice> PurchaseInvoices { get; }
    IRepository<PurchaseInvoiceItem> PurchaseInvoiceItems { get; }
    IRepository<Customer> Customers { get; }
    IRepository<SalesInvoice> SalesInvoices { get; }
    IRepository<SalesInvoiceItem> SalesInvoiceItems { get; }
    IRepository<Employee> Employees { get; }
    IRepository<Payroll> Payrolls { get; }
    IRepository<AttendanceRecord> AttendanceRecords { get; }
    IRepository<Expense> Expenses { get; }
    IRepository<Asset> Assets { get; }
    IRepository<Notification> Notifications { get; }
    IRepository<LabTest> LabTests { get; }
    IRepository<LabRequest> LabRequests { get; }
    IRepository<LabResult> LabResults { get; }
    IRepository<LabTestReferenceRange> LabTestReferenceRanges { get; }
    IRepository<RadiologyTest> RadiologyTests { get; }
    IRepository<RadiologyRequest> RadiologyRequests { get; }
    IRepository<RadiologyResult> RadiologyResults { get; }
    IRepository<RadiologyTemplate> RadiologyTemplates { get; }
    IRepository<EmergencyAdmission> EmergencyAdmissions { get; }
    IRepository<ERTriageVital> ERTriageVitals { get; }
    
    // Clinical
    IRepository<PatientVital> PatientVitals { get; }
    IRepository<Prescription> Prescriptions { get; }
    IRepository<PrescriptionItem> PrescriptionItems { get; }
    IRepository<ClinicalEncounter> ClinicalEncounters { get; }
    IRepository<InpatientNursingAssessment> InpatientNursingAssessments { get; }
    IRepository<MedicationAdministration> MedicationAdministrations { get; }
    
    // Bed Management
    IRepository<Ward> Wards { get; }
    IRepository<Room> Rooms { get; }
    IRepository<Bed> Beds { get; }
    IRepository<BedAdmission> BedAdmissions { get; }
    
    // Messaging & Audit
    IRepository<Message> Messages { get; }
    IRepository<AuditLog> AuditLogs { get; }

    // Operating Theater
    IRepository<OperatingTheater> OperatingTheaters { get; }
    IRepository<ScheduledSurgery> ScheduledSurgeries { get; }
    IRepository<SurgeryResource> SurgeryResources { get; }
    IRepository<SurgeryChecklist> SurgeryChecklists { get; }
    IRepository<MedicineInteraction> MedicineInteractions { get; }
    IRepository<MedicineReturn> MedicineReturns { get; }

    // Insurance & TPA
    IRepository<InsuranceProvider> InsuranceProviders { get; }
    IRepository<InsurancePlan> InsurancePlans { get; }
    IRepository<InsuranceClaim> InsuranceClaims { get; }
    IRepository<MaintenanceTicket> MaintenanceTickets { get; }

    // Blood Bank
    IRepository<BloodDonor> BloodDonors { get; }
    IRepository<BloodDonation> BloodDonations { get; }
    IRepository<BloodStock> BloodStocks { get; }
    IRepository<BloodRequest> BloodRequests { get; }

    // Maternity & NICU
    IRepository<PregnancyRecord> PregnancyRecords { get; }
    IRepository<DeliveryRecord> DeliveryRecords { get; }
    IRepository<NeonatalRecord> NeonatalRecords { get; }

    // Phase 12: Specialized Units & Support
    IRepository<RehabPlan> RehabPlans { get; }
    IRepository<PhysiotherapySession> PhysiotherapySessions { get; }
    IRepository<RehabEquipment> RehabEquipments { get; }
    IRepository<DentalChart> DentalCharts { get; }
    IRepository<DentalProcedure> DentalProcedures { get; }
    IRepository<OrthodonticCase> OrthodonticCases { get; }
    IRepository<Ambulance> Ambulances { get; }
    IRepository<AmbulanceDispatch> AmbulanceDispatches { get; }
    IRepository<FleetMaintenance> FleetMaintenances { get; }
    IRepository<DietPlan> DietPlans { get; }
    IRepository<MealOrder> MealOrders { get; }
    IRepository<KitchenStock> KitchenStocks { get; }

    // Phase 13: BI, Housekeeping & Quality
    IRepository<HousekeepingTask> HousekeepingTasks { get; }
    IRepository<LaundryRecord> LaundryRecords { get; }
    IRepository<ClinicalIncident> ClinicalIncidents { get; }
    IRepository<PatientFeedback> PatientFeedbacks { get; }

    // Phase 14: Support Services
    IRepository<SterilizationBatch> SterilizationBatches { get; }
    IRepository<SterilizedItem> SterilizedItems { get; }
    IRepository<DeceasedRecord> DeceasedRecords { get; }

    // Phase 15: HR Extended
    IRepository<WorkShift> WorkShifts { get; }
    IRepository<EmployeeRoster> EmployeeRosters { get; }
    IRepository<LeaveRequest> LeaveRequests { get; }
    IRepository<EmployeeLeaveBalance> EmployeeLeaveBalances { get; }

    // Phase 16: HIE & Referrals
    IRepository<ReferralFacility> ReferralFacilities { get; }
    IRepository<ExternalReferral> ExternalReferrals { get; }
    IRepository<HieTransaction> HieTransactions { get; }

    // Phase 18: Advanced Supply Chain & eMAR
    IRepository<PurchaseOrder> PurchaseOrders { get; }
    IRepository<PurchaseOrderItem> PurchaseOrderItems { get; }
    IRepository<WardStockDispensation> WardStockDispensations { get; }

    Task<int> SaveChangesAsync();

}
