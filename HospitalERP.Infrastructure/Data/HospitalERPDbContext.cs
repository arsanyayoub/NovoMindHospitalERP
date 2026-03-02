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

    // Misc
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Notification> Notifications => Set<Notification>();

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

        // ── Patient ───────────────────────────────────────────────────
        modelBuilder.Entity<Patient>(e =>
        {
            e.HasIndex(p => p.PatientCode).IsUnique();
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

        // ── Notification ──────────────────────────────────────────────
        modelBuilder.Entity<Notification>(e =>
        {
            e.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.SetNull);
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
    }
}
