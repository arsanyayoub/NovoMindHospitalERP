using HospitalERP.Domain.Entities;
using HospitalERP.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Infrastructure.Data;

public class HospitalERPDbContext : DbContext
{
    public HospitalERPDbContext(DbContextOptions<HospitalERPDbContext> options) : base(options) { }

    // Hospital
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    // Accounting
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<JournalEntry> JournalEntries => Set<JournalEntry>();
    public DbSet<JournalEntryLine> JournalEntryLines => Set<JournalEntryLine>();

    // Inventory
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemBatch> ItemBatches => Set<ItemBatch>();
    public DbSet<ItemPackagingUnit> ItemPackagingUnits => Set<ItemPackagingUnit>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<WarehouseStock> WarehouseStocks => Set<WarehouseStock>();
    public DbSet<StockTransaction> StockTransactions => Set<StockTransaction>();
    public DbSet<MedicineInteraction> MedicineInteractions => Set<MedicineInteraction>();

    // Purchasing
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<PurchaseInvoice> PurchaseInvoices => Set<PurchaseInvoice>();
    public DbSet<PurchaseInvoiceItem> PurchaseInvoiceItems => Set<PurchaseInvoiceItem>();

    // Sales
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<SalesInvoice> SalesInvoices => Set<SalesInvoice>();
    public DbSet<SalesInvoiceItem> SalesInvoiceItems => Set<SalesInvoiceItem>();

    // HR
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Payroll> Payrolls => Set<Payroll>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();

    // Misc
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<MaintenanceTicket> MaintenanceTickets => Set<MaintenanceTicket>();
    public DbSet<Notification> Notifications => Set<Notification>();

    // Lab
    public DbSet<LabTest> LabTests => Set<LabTest>();
    public DbSet<LabRequest> LabRequests => Set<LabRequest>();
    public DbSet<LabResult> LabResults => Set<LabResult>();
    public DbSet<LabTestReferenceRange> LabTestReferenceRanges => Set<LabTestReferenceRange>();
    
    // Radiology
    public DbSet<RadiologyTest> RadiologyTests => Set<RadiologyTest>();
    public DbSet<RadiologyRequest> RadiologyRequests => Set<RadiologyRequest>();
    public DbSet<RadiologyResult> RadiologyResults => Set<RadiologyResult>();
    public DbSet<RadiologyTemplate> RadiologyTemplates => Set<RadiologyTemplate>();

    // Clinical & Pharmacy
    public DbSet<PatientVital> PatientVitals => Set<PatientVital>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<ClinicalEncounter> ClinicalEncounters => Set<ClinicalEncounter>();
    public DbSet<InpatientNursingAssessment> InpatientNursingAssessments => Set<InpatientNursingAssessment>();
    public DbSet<MedicationAdministration> MedicationAdministrations => Set<MedicationAdministration>();
    public DbSet<MedicineReturn> MedicineReturns => Set<MedicineReturn>();

    // Bed Management
    public DbSet<Ward> Wards => Set<Ward>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<BedAdmission> BedAdmissions => Set<BedAdmission>();

    // Messaging & Audit
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public DbSet<OperatingTheater> OperatingTheaters => Set<OperatingTheater>();
    public DbSet<ScheduledSurgery> ScheduledSurgeries => Set<ScheduledSurgery>();
    public DbSet<SurgeryResource> SurgeryResources => Set<SurgeryResource>();

    // Insurance & TPA
    public DbSet<InsuranceProvider> InsuranceProviders => Set<InsuranceProvider>();
    public DbSet<InsurancePlan> InsurancePlans => Set<InsurancePlan>();
    public DbSet<InsuranceClaim> InsuranceClaims => Set<InsuranceClaim>();

    // Blood Bank
    public DbSet<BloodDonor> BloodDonors => Set<BloodDonor>();
    public DbSet<BloodDonation> BloodDonations => Set<BloodDonation>();
    public DbSet<BloodStock> BloodStocks => Set<BloodStock>();
    public DbSet<BloodRequest> BloodRequests => Set<BloodRequest>();

    // Maternity & NICU
    public DbSet<PregnancyRecord> PregnancyRecords => Set<PregnancyRecord>();
    public DbSet<DeliveryRecord> DeliveryRecords => Set<DeliveryRecord>();
    public DbSet<NeonatalRecord> NeonatalRecords => Set<NeonatalRecord>();

    // Emergency
    public DbSet<EmergencyAdmission> EmergencyAdmissions => Set<EmergencyAdmission>();
    public DbSet<ERTriageVital> ERTriageVitals => Set<ERTriageVital>();

    // Phase 12: Specialized Units & Support
    public DbSet<RehabPlan> RehabPlans => Set<RehabPlan>();
    public DbSet<PhysiotherapySession> PhysiotherapySessions => Set<PhysiotherapySession>();
    public DbSet<RehabEquipment> RehabEquipments => Set<RehabEquipment>();
    public DbSet<DentalChart> DentalCharts => Set<DentalChart>();
    public DbSet<DentalProcedure> DentalProcedures => Set<DentalProcedure>();
    public DbSet<OrthodonticCase> OrthodonticCases => Set<OrthodonticCase>();
    public DbSet<Ambulance> Ambulances => Set<Ambulance>();
    public DbSet<AmbulanceDispatch> AmbulanceDispatches => Set<AmbulanceDispatch>();
    public DbSet<FleetMaintenance> FleetMaintenances => Set<FleetMaintenance>();
    public DbSet<DietPlan> DietPlans => Set<DietPlan>();
    public DbSet<MealOrder> MealOrders => Set<MealOrder>();
    public DbSet<KitchenStock> KitchenStocks => Set<KitchenStock>();

    // Phase 13: BI, Housekeeping & Quality
    public DbSet<HousekeepingTask> HousekeepingTasks => Set<HousekeepingTask>();
    public DbSet<LaundryRecord> LaundryRecords => Set<LaundryRecord>();
    public DbSet<ClinicalIncident> ClinicalIncidents => Set<ClinicalIncident>();
    public DbSet<PatientFeedback> PatientFeedbacks => Set<PatientFeedback>();

    // Phase 14: Support Services
    public DbSet<SterilizationBatch> SterilizationBatches => Set<SterilizationBatch>();
    public DbSet<SterilizedItem> SterilizedItems => Set<SterilizedItem>();
    public DbSet<DeceasedRecord> DeceasedRecords => Set<DeceasedRecord>();

    // Phase 15: HR Extended
    public DbSet<WorkShift> WorkShifts => Set<WorkShift>();
    public DbSet<EmployeeRoster> EmployeeRosters => Set<EmployeeRoster>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<EmployeeLeaveBalance> EmployeeLeaveBalances => Set<EmployeeLeaveBalance>();

    // Phase 16: HIE & Referrals
    public DbSet<ReferralFacility> ReferralFacilities => Set<ReferralFacility>();
    public DbSet<ExternalReferral> ExternalReferrals => Set<ExternalReferral>();
    public DbSet<HieTransaction> HieTransactions => Set<HieTransaction>();

    // Phase 18: Advanced Supply Chain & eMAR
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderItem> PurchaseOrderItems => Set<PurchaseOrderItem>();
    public DbSet<WardStockDispensation> WardStockDispensations => Set<WardStockDispensation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Global filters ──────────────────────────────────────────
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Patient>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Doctor>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Appointment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Invoice>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Payment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Account>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<JournalEntry>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Item>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ItemBatch>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ItemPackagingUnit>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Warehouse>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Supplier>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PurchaseInvoice>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Customer>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<SalesInvoice>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Employee>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Expense>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Asset>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<LabTest>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<LabRequest>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<LabResult>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<RadiologyTest>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<RadiologyRequest>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<RadiologyResult>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<LabTestReferenceRange>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<RadiologyTemplate>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PatientVital>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Prescription>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PrescriptionItem>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ClinicalEncounter>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<InpatientNursingAssessment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<MedicationAdministration>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Ward>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Room>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Bed>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<BedAdmission>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Message>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AuditLog>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<OperatingTheater>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ScheduledSurgery>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<SurgeryResource>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<InsuranceProvider>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<InsurancePlan>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<InsuranceClaim>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<EmergencyAdmission>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ERTriageVital>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<MaintenanceTicket>().HasQueryFilter(e => !e.IsDeleted);

        // Phase 12 Global Filters
        modelBuilder.Entity<RehabPlan>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PhysiotherapySession>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<RehabEquipment>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<DentalChart>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<DentalProcedure>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<OrthodonticCase>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Ambulance>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AmbulanceDispatch>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<FleetMaintenance>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<DietPlan>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<MealOrder>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<KitchenStock>().HasQueryFilter(e => !e.IsDeleted);

        // Phase 13 Global Filters
        modelBuilder.Entity<HousekeepingTask>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<LaundryRecord>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ClinicalIncident>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PatientFeedback>().HasQueryFilter(e => !e.IsDeleted);

        // ── Decimal precision ────────────────────────────────────────
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }

        // ── User ─────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
            e.HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Messaging ───────────────────────────────────────────────
        modelBuilder.Entity<Message>(e =>
        {
            e.HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(m => m.Receiver).WithMany().HasForeignKey(m => m.ReceiverId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Patient ───────────────────────────────────────────────────
        modelBuilder.Entity<Patient>(e =>
        {
            e.HasIndex(p => p.PatientCode).IsUnique();
            e.HasOne(p => p.InsuranceProviderLink).WithMany().HasForeignKey(p => p.InsuranceProviderId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.InsurancePlan).WithMany().HasForeignKey(p => p.InsurancePlanId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Doctor ────────────────────────────────────────────────────
        modelBuilder.Entity<Doctor>(e =>
        {
            e.HasIndex(d => d.DoctorCode).IsUnique();
            e.HasOne(d => d.Employee).WithMany().HasForeignKey(d => d.EmployeeId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── Appointment ───────────────────────────────────────────────
        modelBuilder.Entity<Appointment>(e =>
        {
            e.HasOne(a => a.Patient).WithMany(p => p.Appointments).HasForeignKey(a => a.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(a => a.Doctor).WithMany(d => d.Appointments).HasForeignKey(a => a.DoctorId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Invoice ───────────────────────────────────────────────────
        modelBuilder.Entity<Invoice>(e =>
        {
            e.HasIndex(i => i.InvoiceNumber).IsUnique();
            e.HasOne(i => i.Patient).WithMany(p => p.Invoices).HasForeignKey(i => i.PatientId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(i => i.Customer).WithMany().HasForeignKey(i => i.CustomerId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<InvoiceItem>(e =>
        {
            e.HasOne(ii => ii.Invoice).WithMany(i => i.InvoiceItems).HasForeignKey(ii => ii.InvoiceId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ii => ii.Item).WithMany().HasForeignKey(ii => ii.ItemId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── Account ───────────────────────────────────────────────────
        modelBuilder.Entity<Account>(e =>
        {
            e.HasIndex(a => a.AccountCode).IsUnique();
            e.HasOne(a => a.ParentAccount).WithMany(a => a.ChildAccounts).HasForeignKey(a => a.ParentAccountId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<JournalEntryLine>(e =>
        {
            e.HasOne(l => l.JournalEntry).WithMany(je => je.Lines).HasForeignKey(l => l.JournalEntryId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(l => l.Account).WithMany(a => a.JournalEntryLines).HasForeignKey(l => l.AccountId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── WarehouseStock ────────────────────────────────────────────
        modelBuilder.Entity<WarehouseStock>(e =>
        {
            e.HasIndex(ws => new { ws.WarehouseId, ws.ItemId }).IsUnique();
            e.HasOne(ws => ws.Warehouse).WithMany(w => w.WarehouseStocks).HasForeignKey(ws => ws.WarehouseId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(ws => ws.Item).WithMany(i => i.WarehouseStocks).HasForeignKey(ws => ws.ItemId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── ItemBatch ────────────────────────────────────────────────
        modelBuilder.Entity<ItemBatch>(e =>
        {
            e.HasIndex(b => b.BatchNumber).IsUnique();
            e.HasIndex(b => b.Barcode).IsUnique(); // wait, some empty barcodes exist? 
            e.HasOne(b => b.Item).WithMany(i => i.Batches).HasForeignKey(b => b.ItemId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(b => b.Supplier).WithMany().HasForeignKey(b => b.SupplierId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(b => b.Warehouse).WithMany(w => w.Batches).HasForeignKey(b => b.WarehouseId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── ItemPackagingUnit ─────────────────────────────────────────
        modelBuilder.Entity<ItemPackagingUnit>(e =>
        {
            e.HasIndex(u => u.Barcode); // Might not be completely unique globally if empty? 
            e.HasOne(u => u.Item).WithMany().HasForeignKey(u => u.ItemId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Payroll ───────────────────────────────────────────────────
        modelBuilder.Entity<Payroll>(e =>
        {
            e.HasIndex(p => new { p.EmployeeId, p.Month, p.Year }).IsUnique();
            e.HasOne(p => p.Employee).WithMany(emp => emp.Payrolls).HasForeignKey(p => p.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Notification>(e =>
        {
            e.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.SetNull);
        });

        // ── Lab ───────────────────────────────────────────────────────
        modelBuilder.Entity<LabRequest>(e =>
        {
            e.HasIndex(r => r.RequestNumber).IsUnique();
            e.HasOne(r => r.Patient).WithMany().HasForeignKey(r => r.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Doctor).WithMany().HasForeignKey(r => r.DoctorId).OnDelete(DeleteBehavior.SetNull);
            e.HasMany(r => r.Results).WithOne(res => res.LabRequest).HasForeignKey(res => res.LabRequestId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<LabResult>(e =>
        {
            e.HasOne(res => res.LabTest).WithMany().HasForeignKey(res => res.LabTestId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<LabTest>(e =>
        {
            e.HasIndex(t => t.TestCode).IsUnique();
        });
        modelBuilder.Entity<LabTestReferenceRange>(e =>
        {
            e.HasOne(r => r.LabTest).WithMany(t => t.ReferenceRanges).HasForeignKey(r => r.LabTestId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Radiology ────────────────────────────────────────────────
        modelBuilder.Entity<RadiologyRequest>(e =>
        {
            e.HasIndex(r => r.RequestNumber).IsUnique();
            e.HasOne(r => r.Patient).WithMany().HasForeignKey(r => r.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Doctor).WithMany().HasForeignKey(r => r.DoctorId).OnDelete(DeleteBehavior.SetNull);
            e.HasMany(r => r.Results).WithOne(res => res.RadiologyRequest).HasForeignKey(res => res.RadiologyRequestId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<RadiologyResult>(e =>
        {
            e.HasOne(res => res.RadiologyTest).WithMany().HasForeignKey(res => res.RadiologyTestId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<RadiologyTest>(e =>
        {
            e.HasIndex(t => t.TestCode).IsUnique();
        });

        // ── Clinical & Pharmacy ───────────────────────────────────────
        modelBuilder.Entity<PatientVital>(e =>
        {
            e.HasOne(v => v.Patient).WithMany(p => p.Vitals).HasForeignKey(v => v.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(v => v.Appointment).WithMany().HasForeignKey(v => v.AppointmentId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(v => v.BedAdmission).WithMany().HasForeignKey(v => v.BedAdmissionId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<Prescription>(e =>
        {
            e.HasIndex(p => p.PrescriptionNumber).IsUnique();
            e.HasOne(p => p.Patient).WithMany(p => p.Prescriptions).HasForeignKey(p => p.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Doctor).WithMany().HasForeignKey(p => p.DoctorId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(p => p.BedAdmission).WithMany().HasForeignKey(p => p.BedAdmissionId).OnDelete(DeleteBehavior.SetNull);
            e.HasMany(p => p.Items).WithOne(pi => pi.Prescription).HasForeignKey(pi => pi.PrescriptionId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<MedicationAdministration>(e =>
        {
            e.HasOne(ma => ma.PrescriptionItem).WithMany().HasForeignKey(ma => ma.PrescriptionItemId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(ma => ma.BedAdmission).WithMany().HasForeignKey(ma => ma.BedAdmissionId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<MedicineReturn>(e =>
        {
            e.HasOne(mr => mr.PrescriptionItem).WithMany().HasForeignKey(mr => mr.PrescriptionItemId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<MedicineInteraction>(e =>
        {
            e.HasOne(i => i.ItemA).WithMany().HasForeignKey(i => i.ItemAId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(i => i.ItemB).WithMany().HasForeignKey(i => i.ItemBId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<PrescriptionItem>(e =>
        {
            e.HasOne(pi => pi.Item).WithMany().HasForeignKey(pi => pi.ItemId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<ClinicalEncounter>(e =>
        {
            e.HasOne(ce => ce.Patient).WithMany().HasForeignKey(ce => ce.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(ce => ce.Doctor).WithMany().HasForeignKey(ce => ce.DoctorId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(ce => ce.Appointment).WithMany().HasForeignKey(ce => ce.AppointmentId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(ce => ce.BedAdmission).WithMany().HasForeignKey(ce => ce.BedAdmissionId).OnDelete(DeleteBehavior.SetNull);
        });
        
        modelBuilder.Entity<InpatientNursingAssessment>(e =>
        {
            e.HasOne(na => na.BedAdmission).WithMany().HasForeignKey(na => na.BedAdmissionId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Bed Management ────────────────────────────────────────────
        modelBuilder.Entity<Ward>(e =>
        {
            e.HasIndex(w => w.WardCode).IsUnique();
        });
        modelBuilder.Entity<Room>(e =>
        {
            e.HasIndex(r => new { r.WardId, r.RoomNumber }).IsUnique();
            e.HasOne(r => r.Ward).WithMany(w => w.Rooms).HasForeignKey(r => r.WardId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Bed>(e =>
        {
            e.HasIndex(b => new { b.RoomId, b.BedNumber }).IsUnique();
            e.HasOne(b => b.Room).WithMany(r => r.Beds).HasForeignKey(b => b.RoomId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<BedAdmission>(e =>
        {
            e.HasOne(ba => ba.Bed).WithMany(b => b.Admissions).HasForeignKey(ba => ba.BedId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(ba => ba.Patient).WithMany().HasForeignKey(ba => ba.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(ba => ba.Doctor).WithMany().HasForeignKey(ba => ba.DoctorId).OnDelete(DeleteBehavior.SetNull);
        });
        
        modelBuilder.Entity<ScheduledSurgery>(e =>
        {
            e.HasOne(s => s.Patient).WithMany().HasForeignKey(s => s.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.LeadSurgeon).WithMany().HasForeignKey(s => s.LeadSurgeonId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.Anesthetist).WithMany().HasForeignKey(s => s.AnesthetistId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.OperatingTheater).WithMany().HasForeignKey(s => s.OperatingTheaterId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Insurance & TPA ──────────────────────────────────────────
        modelBuilder.Entity<InsuranceProvider>(e =>
        {
            e.HasMany(p => p.Plans).WithOne(pl => pl.InsuranceProvider).HasForeignKey(pl => pl.InsuranceProviderId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<InsuranceClaim>(e =>
        {
            e.HasIndex(c => c.ClaimNumber).IsUnique();
            e.HasOne(c => c.Invoice).WithMany().HasForeignKey(c => c.InvoiceId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(c => c.Patient).WithMany().HasForeignKey(c => c.PatientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(c => c.InsuranceProvider).WithMany().HasForeignKey(c => c.InsuranceProviderId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Blood Bank ──────────────────────────────────────────────
        modelBuilder.Entity<BloodDonation>(e =>
        {
            e.HasOne(d => d.BloodDonor).WithMany(dn => dn.Donations).HasForeignKey(d => d.BloodDonorId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.BloodStock).WithMany().HasForeignKey(d => d.BloodStockId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<BloodStock>(e =>
        {
            e.HasOne(s => s.ReservedForPatient).WithMany().HasForeignKey(s => s.ReservedForPatientId).OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<BloodRequest>(e =>
        {
            e.HasOne(r => r.Patient).WithMany().HasForeignKey(r => r.PatientId).OnDelete(DeleteBehavior.Restrict);
        });

        // ── Maternity ────────────────────────────────────────────────
        modelBuilder.Entity<PregnancyRecord>(e =>
        {
            e.HasOne(p => p.Patient).WithMany().HasForeignKey(p => p.PatientId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<DeliveryRecord>(e =>
        {
            e.HasOne(d => d.PregnancyRecord).WithMany(p => p.Deliveries).HasForeignKey(d => d.PregnancyRecordId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<NeonatalRecord>(e =>
        {
            e.HasOne(n => n.DeliveryRecord).WithMany(d => d.NeonatalRecords).HasForeignKey(n => n.DeliveryRecordId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(n => n.BabyPatient).WithMany().HasForeignKey(n => n.BabyPatientId).OnDelete(DeleteBehavior.NoAction);
        });

        // ── Seed Data ─────────────────────────────────────────────────
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "Administrator", CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new Role { Id = 2, Name = "Doctor", Description = "Doctor", CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new Role { Id = 3, Name = "Nurse", Description = "Nurse", CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new Role { Id = 4, Name = "Receptionist", Description = "Receptionist", CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new Role { Id = 5, Name = "Accountant", Description = "Accountant", CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" }
        );
        // Admin user password: Admin@123 (bcrypt hashed)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1, Username = "admin", Email = "admin@hospital.com",
                PasswordHash = "$2a$11$8K1p/a0dhrxSdiMLkBCl4.8Jj8Jjb3e2O0BYIWzNl8Ck9IuWc/Ea",
                FullName = "System Administrator", RoleId = 1,
                CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system"
            }
        );

        modelBuilder.Entity<LabTest>().HasData(
            new LabTest { Id = 1, TestCode = "LAB0001", Name = "Complete Blood Count (CBC)", NameAr = "صورة دم كاملة", Category = "Hematology", NormalRange = "4.5-11.0 x10^9/L", Unit = "x10^9/L", Price = 50, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new LabTest { Id = 2, TestCode = "LAB0002", Name = "Blood Glucose", NameAr = "سكر الدم", Category = "Biochemistry", NormalRange = "70-100 mg/dL", Unit = "mg/dL", Price = 30, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new LabTest { Id = 3, TestCode = "LAB0003", Name = "Kidney Function Test", NameAr = "وظائف كلى", Category = "Biochemistry", NormalRange = "0.7-1.3 mg/dL", Unit = "mg/dL", Price = 80, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new LabTest { Id = 4, TestCode = "LAB0004", Name = "Liver Function Test", NameAr = "وظائف كبد", Category = "Biochemistry", NormalRange = "Varies", Unit = "U/L", Price = 100, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new LabTest { Id = 5, TestCode = "LAB0005", Name = "Urinalysis", NameAr = "تحليل بول", Category = "Microbiology", NormalRange = "Negative", Unit = "N/A", Price = 25, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" }
        );

        modelBuilder.Entity<RadiologyTest>().HasData(
            new RadiologyTest { Id = 1, TestCode = "RAD0001", Name = "Chest X-Ray", NameAr = "أشعة سينية على الصدر", Category = "X-Ray", Price = 150, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new RadiologyTest { Id = 2, TestCode = "RAD0002", Name = "Brain MRI", NameAr = "رنين مغناطيسي على المخ", Category = "MRI", Price = 1200, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new RadiologyTest { Id = 3, TestCode = "RAD0003", Name = "Abdominal Ultrasound", NameAr = "أشعة تليفزيونية على البطن", Category = "Ultrasound", Price = 300, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" },
            new RadiologyTest { Id = 4, TestCode = "RAD0004", Name = "CT Abdomen", NameAr = "أشعة مقطعية على البطن", Category = "CT Scan", Price = 800, CreatedDate = new DateTime(2024, 1, 1), CreatedBy = "system" }
        );
    }
}
