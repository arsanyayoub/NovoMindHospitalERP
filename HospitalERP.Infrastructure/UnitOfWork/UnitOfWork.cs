using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.Data;
using HospitalERP.Infrastructure.Repositories;

namespace HospitalERP.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly HospitalERPDbContext _context;

    public UnitOfWork(HospitalERPDbContext context)
    {
        _context = context;
        Users = new Repository<User>(context);
        Roles = new Repository<Role>(context);
        Patients = new Repository<Patient>(context);
        Doctors = new Repository<Doctor>(context);
        Appointments = new Repository<Appointment>(context);
        Invoices = new Repository<Invoice>(context);
        InvoiceItems = new Repository<InvoiceItem>(context);
        Payments = new Repository<Payment>(context);
        Accounts = new Repository<Account>(context);
        JournalEntries = new Repository<JournalEntry>(context);
        JournalEntryLines = new Repository<JournalEntryLine>(context);
        Items = new Repository<Item>(context);
        ItemBatches = new Repository<ItemBatch>(context);
        ItemPackagingUnits = new Repository<ItemPackagingUnit>(context);
        Warehouses = new Repository<Warehouse>(context);
        WarehouseStocks = new Repository<WarehouseStock>(context);
        StockTransactions = new Repository<StockTransaction>(context);
        Suppliers = new Repository<Supplier>(context);
        PurchaseInvoices = new Repository<PurchaseInvoice>(context);
        PurchaseInvoiceItems = new Repository<PurchaseInvoiceItem>(context);
        Customers = new Repository<Customer>(context);
        SalesInvoices = new Repository<SalesInvoice>(context);
        SalesInvoiceItems = new Repository<SalesInvoiceItem>(context);
        Employees = new Repository<Employee>(context);
        Payrolls = new Repository<Payroll>(context);
        Expenses = new Repository<Expense>(context);
        Assets = new Repository<Asset>(context);
        Notifications = new Repository<Notification>(context);
        LabTests = new Repository<LabTest>(context);
        LabRequests = new Repository<LabRequest>(context);
        LabResults = new Repository<LabResult>(context);
        RadiologyTests = new Repository<RadiologyTest>(context);
        RadiologyRequests = new Repository<RadiologyRequest>(context);
        RadiologyResults = new Repository<RadiologyResult>(context);
        PatientVitals = new Repository<PatientVital>(context);
        Prescriptions = new Repository<Prescription>(context);
        PrescriptionItems = new Repository<PrescriptionItem>(context);
        ClinicalEncounters = new Repository<ClinicalEncounter>(context);
        InpatientNursingAssessments = new Repository<InpatientNursingAssessment>(context);
        MedicationAdministrations = new Repository<MedicationAdministration>(context);
        Wards = new Repository<Ward>(context);
        Rooms = new Repository<Room>(context);
        Beds = new Repository<Bed>(context);
        BedAdmissions = new Repository<BedAdmission>(context);
        Messages = new Repository<Message>(context);
        AuditLogs = new Repository<AuditLog>(context);
        OperatingTheaters = new Repository<OperatingTheater>(context);
        ScheduledSurgeries = new Repository<ScheduledSurgery>(context);
        SurgeryResources = new Repository<SurgeryResource>(context);
    }

    public IRepository<User> Users { get; }
    public IRepository<Role> Roles { get; }
    public IRepository<Patient> Patients { get; }
    public IRepository<Doctor> Doctors { get; }
    public IRepository<Appointment> Appointments { get; }
    public IRepository<Invoice> Invoices { get; }
    public IRepository<InvoiceItem> InvoiceItems { get; }
    public IRepository<Payment> Payments { get; }
    public IRepository<Account> Accounts { get; }
    public IRepository<JournalEntry> JournalEntries { get; }
    public IRepository<JournalEntryLine> JournalEntryLines { get; }
    public IRepository<Item> Items { get; }
    public IRepository<ItemBatch> ItemBatches { get; }
    public IRepository<ItemPackagingUnit> ItemPackagingUnits { get; }
    public IRepository<Warehouse> Warehouses { get; }
    public IRepository<WarehouseStock> WarehouseStocks { get; }
    public IRepository<StockTransaction> StockTransactions { get; }
    public IRepository<Supplier> Suppliers { get; }
    public IRepository<PurchaseInvoice> PurchaseInvoices { get; }
    public IRepository<PurchaseInvoiceItem> PurchaseInvoiceItems { get; }
    public IRepository<Customer> Customers { get; }
    public IRepository<SalesInvoice> SalesInvoices { get; }
    public IRepository<SalesInvoiceItem> SalesInvoiceItems { get; }
    public IRepository<Employee> Employees { get; }
    public IRepository<Payroll> Payrolls { get; }
    public IRepository<Expense> Expenses { get; }
    public IRepository<Asset> Assets { get; }
    public IRepository<Notification> Notifications { get; }
    public IRepository<LabTest> LabTests { get; }
    public IRepository<LabRequest> LabRequests { get; }
    public IRepository<LabResult> LabResults { get; }
    public IRepository<RadiologyTest> RadiologyTests { get; }
    public IRepository<RadiologyRequest> RadiologyRequests { get; }
    public IRepository<RadiologyResult> RadiologyResults { get; }
    public IRepository<PatientVital> PatientVitals { get; }
    public IRepository<Prescription> Prescriptions { get; }
    public IRepository<PrescriptionItem> PrescriptionItems { get; }
    public IRepository<ClinicalEncounter> ClinicalEncounters { get; }
    public IRepository<InpatientNursingAssessment> InpatientNursingAssessments { get; }
    public IRepository<MedicationAdministration> MedicationAdministrations { get; }
    public IRepository<Ward> Wards { get; }
    public IRepository<Room> Rooms { get; }
    public IRepository<Bed> Beds { get; }
    public IRepository<BedAdmission> BedAdmissions { get; }
    public IRepository<Message> Messages { get; }
    public IRepository<AuditLog> AuditLogs { get; }
    public IRepository<OperatingTheater> OperatingTheaters { get; }
    public IRepository<ScheduledSurgery> ScheduledSurgeries { get; }
    public IRepository<SurgeryResource> SurgeryResources { get; }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
