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
    IRepository<Expense> Expenses { get; }
    IRepository<Asset> Assets { get; }
    IRepository<Notification> Notifications { get; }
    Task<int> SaveChangesAsync();
}
