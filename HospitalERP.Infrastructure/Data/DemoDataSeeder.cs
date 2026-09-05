using System.Data;
using HospitalERP.Domain.Entities;
using HospitalERP.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalERP.Infrastructure.Data;

/// <summary>
/// Seeds comprehensive demo data for all modules so new installations
/// have a fully populated system ready for demonstrations.
/// Runs once; uses a sentinel check on the Employees table to avoid re-seeding.
/// The seed rows assign explicit primary keys (1..n) so foreign-key wiring is
/// deterministic; therefore every save that touches an IDENTITY column must be
/// bracketed with <c>SET IDENTITY_INSERT &lt;table&gt; ON/OFF</c> on the SAME
/// open session, otherwise SQL Server rejects the values (error 544).
/// </summary>
public static class DemoDataSeeder
{
    private static readonly DateTime _base = new(2025, 1, 1);
    private const string SYS = "system";

    public static async Task SeedAsync(HospitalERPDbContext db, ILogger? logger = null)
    {
        // Guard: only seed if no employees exist (roles + admin user come from model builder)
        if (await db.Employees.AnyAsync()) return;

        logger?.LogInformation("Seeding demo data …");

        // Keep one connection open for the whole seeding run so the
        // IDENTITY_INSERT session setting and the inserts share it.
        var conn = db.Database.GetDbConnection();
        if (conn.State != ConnectionState.Open)
            await conn.OpenAsync();
        try
        {
            await SeedBodyAsync(db, logger);
        }
        finally
        {
            await conn.CloseAsync();
        }
    }

    /// <summary>Ensures identity inserts are toggled around <paramref name="act"/>.</summary>
    private static async Task InsertWithIdentityAsync(HospitalERPDbContext db, string table, Func<Task> act)
    {
        await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT [{table}] ON;");
        try { await act(); }
        finally { await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT [{table}] OFF;"); }
    }

    private static async Task SeedBodyAsync(HospitalERPDbContext db, ILogger? logger)
    {
        // Helper that inserts an "id-assigned" table in a single save.
        Task Save(string table, Action load) => InsertWithIdentityAsync(db, table, async () =>
        {
            load();
            await db.SaveChangesAsync();
        });

        // ── Employees ───────────────────────────────────────────────
        await Save("Employees", () => db.Employees.AddRange(
            Emp(1, "EMP001", "Dr. Ahmed Khaled", "Medical", "Senior Consultant", 25000, 3000, 500),
            Emp(2, "EMP002", "Dr. Sarah Mohamed", "Medical", "Specialist", 22000, 2500, 400),
            Emp(3, "EMP003", "Dr. Omar Youssef", "Medical", "General Practitioner", 18000, 2000, 300),
            Emp(4, "EMP004", "Dr. Fatima Hassan", "Medical", "Surgeon", 30000, 4000, 600),
            Emp(5, "EMP005", "Dr. Yasser Abdelrahman", "Medical", "Radiologist", 24000, 3000, 500),
            Emp(6, "EMP006", "Nurse Layla Ibrahim", "Nursing", "Head Nurse", 12000, 1500, 200),
            Emp(7, "EMP007", "Nurse Rania Mahmoud", "Nursing", "Staff Nurse", 8000, 1000, 150),
            Emp(8, "EMP008", "Amr Soliman", "Finance", "Accountant", 10000, 1000, 200),
            Emp(9, "EMP009", "Heba Nabil", "Reception", "Senior Receptionist", 7000, 800, 100),
            Emp(10, "EMP010", "Tech. Karim Tawfik", "Lab", "Lab Technician", 9000, 1000, 150)));

        // ── Doctors ─────────────────────────────────────────────────
        await Save("Doctors", () => db.Doctors.AddRange(
            Doc(1, "DOC001", "Ahmed Khaled", "Cardiology", 200, 1),
            Doc(2, "DOC002", "Sarah Mohamed", "Dermatology", 180, 2),
            Doc(3, "DOC003", "Omar Youssef", "General Medicine", 120, 3),
            Doc(4, "DOC004", "Fatima Hassan", "Orthopedic Surgery", 300, 4),
            Doc(5, "DOC005", "Yasser Abdelrahman", "Radiology", 250, 5)));

        // ── Patients ────────────────────────────────────────────────
        await Save("Patients", () => db.Patients.AddRange(
            Pat(1,  "PT0001", "Mahmoud Ali",        "Male",   "1985-06-15", "A+"),
            Pat(2,  "PT0002", "Nadia Hassan",       "Female", "1990-03-22", "B+"),
            Pat(3,  "PT0003", "Tariq Salem",        "Male",   "1978-11-08", "O-"),
            Pat(4,  "PT0004", "Mona Adel",          "Female", "1995-07-19", "AB+"),
            Pat(5,  "PT0005", "Khaled Mansour",     "Male",   "1968-02-04", "A-"),
            Pat(6,  "PT0006", "Dina Samir",         "Female", "2001-09-30", "B-"),
            Pat(7,  "PT0007", "Hussein Farag",      "Male",   "1956-12-25", "O+"),
            Pat(8,  "PT0008", "Salma Youssef",      "Female", "1988-01-11", "A+"),
            Pat(9,  "PT0009", "Ali Mostafa",        "Male",   "2010-05-20", "B+"),
            Pat(10, "PT0010", "Yasmin Fathy",       "Female", "1999-08-14", "O+")));

        // ── Accounts (Chart of Accounts) ────────────────────────────
        await Save("Accounts", () => db.Accounts.AddRange(
            Acct(1, "1000", "Cash", "النقدية", AccountType.Asset, null),
            Acct(2, "1100", "Accounts Receivable", "ذمم مدينة", AccountType.Asset, null),
            Acct(3, "1200", "Inventory", "المخزون", AccountType.Asset, null),
            Acct(4, "2000", "Accounts Payable", "ذمم دائنة", AccountType.Liability, null),
            Acct(5, "2100", "Salaries Payable", "رواتب مستحقة", AccountType.Liability, null),
            Acct(6, "3000", "Owner Equity", "حقوق الملكية", AccountType.Equity, null),
            Acct(7, "4000", "Consultation Revenue", "إيرادات الكشف", AccountType.Revenue, null),
            Acct(8, "4100", "Lab Revenue", "إيرادات المعمل", AccountType.Revenue, null),
            Acct(9, "4200", "Pharmacy Revenue", "إيرادات الصيدلية", AccountType.Revenue, null),
            Acct(10, "4300", "Radiology Revenue", "إيرادات الأشعة", AccountType.Revenue, null),
            Acct(11, "5000", "Salaries Expense", "مصروفات مرتبات", AccountType.Expense, null),
            Acct(12, "5100", "Supplies Expense", "مصروفات مستلزمات", AccountType.Expense, null),
            Acct(13, "5200", "Utilities Expense", "مصروفات مرافق", AccountType.Expense, null)));

        // ── Warehouses ──────────────────────────────────────────────
        await Save("Warehouses", () => db.Warehouses.AddRange(
            new() { Id = 1, WarehouseCode = "WH01", WarehouseName = "Main Pharmacy Store", Location = "Building A – Ground Floor", CreatedBy = SYS, CreatedDate = _base },
            new() { Id = 2, WarehouseCode = "WH02", WarehouseName = "Lab Supplies Store", Location = "Building B – Basement", CreatedBy = SYS, CreatedDate = _base },
            new() { Id = 3, WarehouseCode = "WH03", WarehouseName = "Surgical Store", Location = "Building A – Floor 2", CreatedBy = SYS, CreatedDate = _base }));

        // ── Inventory Items ─────────────────────────────────────────
        await Save("Items", () => db.Items.AddRange(
            Itm(1, "ITM001", "Paracetamol 500mg", "باراسيتامول", "Medication", 5, 3, 0, true),
            Itm(2, "ITM002", "Amoxicillin 250mg", "أموكسيسيللين", "Medication", 12, 8, 0, true),
            Itm(3, "ITM003", "Surgical Gloves (Box)", "قفازات جراحية", "Supplies", 25, 18, 14, false),
            Itm(4, "ITM004", "Syringe 5ml (Box 100)", "سرنجات", "Supplies", 45, 35, 14, false),
            Itm(5, "ITM005", "Ibuprofen 400mg", "ايبوبروفين", "Medication", 8, 5, 0, true),
            Itm(6, "ITM006", "Antiseptic Solution 500ml", "محلول مطهر", "Supplies", 15, 10, 14, false),
            Itm(7, "ITM007", "Bandage Roll", "رباط ضاغط", "Supplies", 3, 2, 0, false),
            Itm(8, "ITM008", "Blood Glucose Strips", "شرائط سكر", "Lab Supplies", 30, 22, 14, true)));

        // ── Warehouse Stock ─────────────────────────────────────────
        await Save("WarehouseStocks", () => db.WarehouseStocks.AddRange(
            WS(1, 1, 1, 500, 50, 1000), WS(2, 1, 2, 300, 30, 600), WS(3, 1, 3, 200, 20, 500),
            WS(4, 1, 4, 150, 15, 400), WS(5, 1, 5, 400, 40, 800), WS(6, 1, 6, 100, 10, 300),
            WS(7, 1, 7, 600, 50, 1000), WS(8, 2, 8, 250, 25, 500)));

        // ── Suppliers ───────────────────────────────────────────────
        await Save("Suppliers", () => db.Suppliers.AddRange(
            new Supplier { Id = 1, SupplierCode = "SUP001", SupplierName = "PharmaCo Egypt", ContactPerson = "Mr. Fawzy", PhoneNumber = "0122-555-1001", Email = "sales@pharmaco.eg", Address = "Cairo, Egypt", TaxNumber = "TAX-001", CreatedBy = SYS, CreatedDate = _base },
            new Supplier { Id = 2, SupplierCode = "SUP002", SupplierName = "MedSupply Int'l", ContactPerson = "Ms. Rana", PhoneNumber = "0100-555-2002", Email = "info@medsupply.com", Address = "Alexandria, Egypt", TaxNumber = "TAX-002", CreatedBy = SYS, CreatedDate = _base }));

        // ── Customers ───────────────────────────────────────────────
        await Save("Customers", () => db.Customers.AddRange(
            new Customer { Id = 1, CustomerCode = "CUS001", CustomerName = "National Insurance Co.", ContactPerson = "Mr. Wagdy", PhoneNumber = "0111-555-3001", Email = "billing@natins.eg", CreatedBy = SYS, CreatedDate = _base },
            new Customer { Id = 2, CustomerCode = "CUS002", CustomerName = "Family Corp Medical", ContactPerson = "Ms. Hala", PhoneNumber = "0101-555-4002", Email = "medical@familycorp.com", CreatedBy = SYS, CreatedDate = _base }));

        // ── Appointments (across several months) ────────────────────
        // ── Insurance & TPA: providers, plans, patient linkage ───────
        await Save("InsuranceProviders", () => db.InsuranceProviders.AddRange(
            new() { Id = 1, Name = "AXA Egypt", ContactPerson = "Sara Samir", Email = "claims@axa.eg", PhoneNumber = "16292", Address = "Nile City Towers", TPA = "AXA-TPA", CreatedBy = SYS, CreatedDate = _base },
            new() { Id = 2, Name = "Bupa Global", ContactPerson = "John Doe", Email = "intl@bupa.com", PhoneNumber = "0800 001", TPA = "BUPA-INTL", CreatedBy = SYS, CreatedDate = _base }));

        db.InsurancePlans.AddRange(
            new() { InsuranceProviderId = 1, PlanName = "Gold Plus", PlanCode = "AXA-G+", CoveragePercentage = 90, CoPayAmount = 100, MaxLimit = 500000, RequiresPreAuth = true, CreatedBy = SYS, CreatedDate = _base },
            new() { InsuranceProviderId = 1, PlanName = "Silver Standard", PlanCode = "AXA-SS", CoveragePercentage = 80, CoPayAmount = 50, MaxLimit = 200000, RequiresPreAuth = false, CreatedBy = SYS, CreatedDate = _base },
            new() { InsuranceProviderId = 2, PlanName = "Elite Global", PlanCode = "BUPA-EL", CoveragePercentage = 100, CoPayAmount = 0, MaxLimit = 1000000, RequiresPreAuth = true, CreatedBy = SYS, CreatedDate = _base });
        await db.SaveChangesAsync();

        var goldPlan = await db.InsurancePlans.FirstAsync(p => p.PlanCode == "AXA-G+");
        var elitePlan = await db.InsurancePlans.FirstAsync(p => p.PlanCode == "BUPA-EL");
        var pa = await db.Patients.FindAsync(1);
        if (pa is not null) { pa.InsuranceProviderId = 1; pa.InsurancePlanId = goldPlan.Id; pa.InsurancePolicyNumber = "POL-00123456"; }
        var pb = await db.Patients.FindAsync(2);
        if (pb is not null) { pb.InsuranceProviderId = 2; pb.InsurancePlanId = elitePlan.Id; pb.InsurancePolicyNumber = "BUPA-9876543"; }
        await db.SaveChangesAsync();

        var planByPatient = new Dictionary<int, InsurancePlan>();
        planByPatient[1] = goldPlan;
        planByPatient[2] = elitePlan;

        int apptId = 1;
        var appts = new List<Appointment>();
        for (int month = 1; month <= 3; month++)
        {
            for (int day = 1; day <= 5; day++)
            {
                var dt = new DateTime(2025, month, day * 5); // 5th, 10th, 15th, 20th, 25th
                if (dt > DateTime.UtcNow) break;
                int patIdx = ((apptId - 1) % 10) + 1;
                int docIdx = ((apptId - 1) % 5) + 1;
                var status = (month < 3 ? AppointmentStatus.Completed : AppointmentStatus.Scheduled);
                decimal fee = docIdx switch { 1 => 200, 2 => 180, 3 => 120, 4 => 300, _ => 250 };
                appts.Add(new Appointment
                {
                    Id = apptId, AppointmentCode = $"APT{apptId:D5}", PatientId = patIdx, DoctorId = docIdx,
                    AppointmentDate = dt, AppointmentTime = new TimeSpan(9 + day, 0, 0),
                    DurationMinutes = 30, Status = status, Fee = fee,
                    Notes = $"Follow-up visit #{apptId}", IsPaid = status == AppointmentStatus.Completed,
                    CreatedBy = SYS, CreatedDate = dt
                });
                apptId++;
            }
        }
        await Save("Appointments", () => db.Appointments.AddRange(appts));

        // ── Invoices, payments & claims: BRD split (patient share vs insurer share) ──
        int invId = 1;
        int payId = 1;
        int claimSeq = 0;
        var records = new List<(Invoice Inv, Payment? Pay, InsuranceClaim? Claim)>();
        foreach (var a in appts.Where(x => x.Status == AppointmentStatus.Completed))
        {
            InsurancePlan? plan = planByPatient.TryGetValue(a.PatientId, out var pl) ? pl : null;
            var (pShare, iShare) = ComputeShares(plan, a.Fee);

            var inv = new Invoice
            {
                Id = invId, InvoiceNumber = $"INV{invId:D5}", PatientId = a.PatientId,
                InvoiceDate = a.AppointmentDate, DueDate = a.AppointmentDate.AddDays(30),
                SubTotal = a.Fee, TaxAmount = 0, DiscountAmount = 0, TotalAmount = a.Fee,
                InsuranceShare = iShare, PatientShare = pShare, PaidAmount = pShare,
                Status = pShare >= a.Fee ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid,
                InvoiceType = InvoiceType.Hospital,
                Notes = plan is null
                    ? $"Consultation - {a.AppointmentCode}"
                    : $"Consultation {a.AppointmentCode}: patient {pShare:C} / insurer {iShare:C} ({plan.PlanCode})",
                CreatedBy = SYS, CreatedDate = a.AppointmentDate
            };
            Payment? pay = pShare > 0 ? new Payment
            {
                Id = payId, PaymentNumber = $"PAY{payId:D5}", InvoiceId = invId, Amount = pShare,
                PaymentDate = a.AppointmentDate, PaymentMethod = PaymentMethod.Cash,
                ReferenceNumber = $"REF{payId:D5}", Notes = "Patient share paid", CreatedBy = SYS, CreatedDate = a.AppointmentDate
            } : null;
            if (pay is not null) payId++;

            InsuranceClaim? claim = null;
            if (plan is not null && iShare > 0)
                claim = new InsuranceClaim
                {
                    ClaimNumber = $"CLM{(++claimSeq):D6}", InvoiceId = invId, PatientId = a.PatientId,
                    InsuranceProviderId = plan.InsuranceProviderId, ClaimAmount = iShare,
                    Status = "Submitted", SubmissionDate = a.AppointmentDate,
                    CreatedBy = SYS, CreatedDate = a.AppointmentDate
                };

            records.Add((inv, pay, claim));
            invId++;
        }

        db.Invoices.AddRange(records.Select(r => r.Inv));
        await InsertWithIdentityAsync(db, "Invoices", async () => { await db.SaveChangesAsync(); });

        db.Payments.AddRange(records.Where(r => r.Pay is not null).Select(r => r.Pay!));
        await InsertWithIdentityAsync(db, "Payments", async () => { await db.SaveChangesAsync(); });

        var claimsToSave = records.Where(r => r.Claim is not null).Select(r => r.Claim!).ToList();
        if (claimsToSave.Count > 0)
        {
            db.InsuranceClaims.AddRange(claimsToSave);
            await db.SaveChangesAsync();
        }
        logger?.LogInformation("Seeded {Total} invoices and {Claims} insurance claims (BRD patient/insurer split applied).", records.Count, claimsToSave.Count);

        // ── Operating Theaters ──────────────────────────────────────
        await Save("OperatingTheaters", () => db.OperatingTheaters.AddRange(
            new() { Id = 1, Name = "OT 1 (General Surgery)", Location = "Floor 2, Wing A", Status = "Available", CreatedBy = SYS, CreatedDate = _base },
            new() { Id = 2, Name = "OT 2 (Orthopedic)", Location = "Floor 2, Wing A", Status = "Available", CreatedBy = SYS, CreatedDate = _base },
            new() { Id = 3, Name = "OT 3 (Emergency)", Location = "Floor 1, ER", Status = "Available", CreatedBy = SYS, CreatedDate = _base }));

        // ── Scheduled Surgeries ──────────────────────────────────────
        db.ScheduledSurgeries.AddRange(
            new() { PatientId = 1, LeadSurgeonId = 4, AnesthetistId = 1, OperatingTheaterId = 1, ProcedureName = "Laparoscopic Cholecystectomy", ScheduledStartTime = DateTime.UtcNow.AddHours(2), ScheduledEndTime = DateTime.UtcNow.AddHours(4), Priority = "Routine", Status = "Scheduled", PreOpDiagnosis = "Chronic Cholecystitis", CreatedBy = SYS, CreatedDate = _base },
            new() { PatientId = 3, LeadSurgeonId = 4, AnesthetistId = 2, OperatingTheaterId = 2, ProcedureName = "Total Knee Replacement", ScheduledStartTime = DateTime.UtcNow.AddHours(5), ScheduledEndTime = DateTime.UtcNow.AddHours(8), Priority = "Urgent", Status = "Scheduled", PreOpDiagnosis = "Severe Osteoarthritis", CreatedBy = SYS, CreatedDate = _base });
        await db.SaveChangesAsync();

        logger?.LogInformation("Demo data seeded: {Patients} patients, {Doctors} doctors, {Appts} appointments, {Items} items, {Theaters} theaters.",
            10, 5, appts.Count, 8, 3);

    }

    // ── Helper factories ────────────────────────────────────────────
    private static Employee Emp(int id, string code, string name, string dept, string pos, decimal salary, decimal allow, decimal ded) =>
        new() { Id = id, EmployeeCode = code, FullName = name, Department = dept, Position = pos, HireDate = _base, BasicSalary = salary, Allowances = allow, Deductions = ded, CreatedBy = SYS, CreatedDate = _base };

    private static Doctor Doc(int id, string code, string name, string spec, decimal fee, int empId) =>
        new() { Id = id, DoctorCode = code, FullName = name, Specialization = spec, ConsultationFee = fee, EmployeeId = empId, WorkingDays = "Sun,Mon,Tue,Wed,Thu", WorkingHours = "09:00-17:00", CreatedBy = SYS, CreatedDate = _base };

    private static Patient Pat(int id, string code, string name, string gender, string dob, string blood) =>
        new() { Id = id, PatientCode = code, FullName = name, Gender = gender, DateOfBirth = DateTime.Parse(dob), BloodType = blood, PhoneNumber = $"010{id:D8}", Email = $"{name.ToLower().Replace(' ', '.')}@mail.com", CreatedBy = SYS, CreatedDate = _base };

    private static Account Acct(int id, string code, string name, string nameAr, AccountType type, int? parentId) =>
        new() { Id = id, AccountCode = code, AccountName = name, AccountNameAr = nameAr, AccountType = type, ParentAccountId = parentId, CreatedBy = SYS, CreatedDate = _base };

    private static Item Itm(int id, string code, string name, string nameAr, string cat, decimal sale, decimal purch, decimal tax, bool batch) =>
        new() { Id = id, ItemCode = code, ItemName = name, ItemNameAr = nameAr, Category = cat, Unit = "Piece", SalePrice = sale, PurchasePrice = purch, TaxRate = tax, TrackBatches = batch, CreatedBy = SYS, CreatedDate = _base };

    private static WarehouseStock WS(int id, int whId, int itemId, decimal qty, decimal reorder, decimal max) =>
        new() { Id = id, WarehouseId = whId, ItemId = itemId, Quantity = qty, ReorderLevel = reorder, MaxLevel = max, CreatedBy = SYS, CreatedDate = _base };

    // BRD: gross is split into insurer share (per coverage %) + patient share
    // (remaining percentage + fixed co-pay), capped by the plan's annual limit.
    private static (decimal PatientShare, decimal InsurerShare) ComputeShares(InsurancePlan? plan, decimal gross)
    {
        if (plan is null || !plan.IsActive || gross <= 0) return (gross, 0m);

        var pct = Math.Clamp(plan.CoveragePercentage, 0m, 100m) / 100m;
        var patient = plan.CoPayAmount + gross * (1m - pct);
        if (patient > gross) patient = gross;
        var insurer = gross - patient;
        if (insurer > plan.MaxLimit) { patient += insurer - plan.MaxLimit; insurer = plan.MaxLimit; }

        return (decimal.Round(Math.Max(0m, patient), 2), decimal.Round(Math.Max(0m, insurer), 2));
    }
}
