# NovoMind Hospital ERP — Technical Manual

> Version 2.0 | Last Updated: March 2026  
> Audience: Backend developers, DevOps, system architects

---

## Table of Contents
1. [Solution Architecture](#1-solution-architecture)
2. [Domain Model](#2-domain-model)
3. [Backend — ASP.NET Core 8 API](#3-backend--aspnet-core-8-api)
4. [Database & EF Core](#4-database--ef-core)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Real-Time Notifications (SignalR)](#6-real-time-notifications-signalr)
7. [Frontend — Angular 17](#7-frontend--angular-17)
8. [API Reference](#8-api-reference)
9. [Deployment](#9-deployment)
10. [Configuration Reference](#10-configuration-reference)

---

## 1. Solution Architecture

The solution follows a **Clean Architecture** approach with four layers:

```
┌─────────────────────────────────────────────────────────────┐
│  HospitalERP.Domain        (Entities, Enums, Base Classes)  │
├─────────────────────────────────────────────────────────────┤
│  HospitalERP.Application   (Services, DTOs, Interfaces)     │
├─────────────────────────────────────────────────────────────┤
│  HospitalERP.Infrastructure (DbContext, Repositories, UoW)  │
├─────────────────────────────────────────────────────────────┤
│  HospitalERP.API           (Controllers, Hubs, Middleware)  │
└─────────────────────────────────────────────────────────────┘
```

**Dependency flow:** API → Application → Domain (Infrastructure implements Application interfaces)

### Key Design Patterns
- **Repository + Unit of Work** — all data access goes through `IRepository<T>` and `IUnitOfWork`
- **DTO projection** — entities never leave the Application layer; DTOs are returned from services
- **Service layer** — one service per domain aggregate (`PatientService`, `InvoiceService`, etc.)
- **Soft delete** — all entities extend `BaseEntity` which has `IsDeleted` flag; physical deletes never occur

---

## 2. Domain Model

### Base Entity
All entities inherit from `BaseEntity`:
```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedDate { get; set; }
}
```

### Key Entities & Relationships

```
Patient ──< Appointment >── Doctor
Patient ──< Invoice >── InvoiceItem ──> InventoryItem
Invoice ──< Payment
Employee ──< Payroll
Account ──< JournalEntry >── JournalEntryLine >── Account
Warehouse >── StockLevel ──< InventoryItem
InventoryItem ──< StockTransfer
Notification (user or broadcast)
User (identity) ──> Role
```

### Enums
| Enum | Values |
|------|--------|
| `AppointmentStatus` | Scheduled, Confirmed, InProgress, Completed, Cancelled |
| `InvoiceStatus` | Draft, Unpaid, PartiallyPaid, Paid, Cancelled |
| `InvoiceType` | Patient, Customer, Hospital |
| `PaymentMethod` | Cash, CreditCard, BankTransfer, Cheque |
| `AccountType` | Asset, Liability, Equity, Revenue, Expense |
| `Gender` | Male, Female |

---

## 3. Backend — ASP.NET Core 8 API

### Project Structure (`HospitalERP.API`)
```
Controllers/
├── AuthController.cs           # Login, Register, RefreshToken, ChangePassword
├── HospitalControllers.cs      # Patients, Doctors, Appointments
├── InvoiceController.cs        # Invoices, Payments
├── AccountingController.cs     # Accounts, Journal Entries, Reports
├── InventoryController.cs      # Items, Warehouses, Stock, Transfers
├── PurchaseController.cs       # Suppliers, Purchase Invoices
├── SalesController.cs          # Customers, Sales Invoices
├── HRController.cs             # Employees, Payrolls
├── LabController.cs            # Tests, Requests, Results
├── RadiologyController.cs      # Imaging, Reports, Results
├── ClinicalController.cs       # Patient Vitals
├── PharmacyController.cs       # Prescriptions, Dispensing
├── DashboardController.cs      # Aggregated dashboard stats
├── NotificationController.cs   # User notifications
└── ReportsController.cs        # Analytics & reporting
Hubs/
└── NotificationHub.cs          # SignalR hub
Middleware/
└── (global exception handler)
```

### Service Registration (`Program.cs`)
```csharp
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<ILabService, LabService>();
builder.Services.AddScoped<IRadiologyService, RadiologyService>();
builder.Services.AddScoped<IClinicalService, ClinicalService>();
builder.Services.AddScoped<IPharmacyService, PharmacyService>();
// ... (analogous for all services)
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSignalR();
```

### Paging
All list endpoints return `PagedResult<T>`:
```csharp
public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages,
    bool HasPrevious,
    bool HasNext
);
```
Query parameters: `?page=1&pageSize=20&search=john&sortBy=name&sortDescending=false`

---

## 4. Database & EF Core

### Connection String (appsettings.json)
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=HospitalERP;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### Applying Migrations
```bash
# From solution root
dotnet ef migrations add <MigrationName> \
  --project HospitalERP.Infrastructure \
  --startup-project HospitalERP.API

dotnet ef database update \
  --project HospitalERP.Infrastructure \
  --startup-project HospitalERP.API
```

### DbContext — `HospitalDbContext`
Located in `HospitalERP.Infrastructure/Data/HospitalDbContext.cs`

Key configurations:
- Global soft-delete filter: `.HasQueryFilter(e => !e.IsDeleted)` on all `BaseEntity` DbSets
- `SaveChangesAsync` override: auto-sets `CreatedDate`, `UpdatedDate`, `IsDeleted`

### Repository Pattern
```csharp
public interface IRepository<T> where T : BaseEntity
{
    IQueryable<T> Query();
    Task<T?> GetByIdAsync(int id);
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void SoftDelete(T entity);
    Task<int> CountAsync();
}
```

### Unit of Work
```csharp
public interface IUnitOfWork
{
    IRepository<Patient> Patients { get; }
    IRepository<Doctor> Doctors { get; }
    IRepository<Appointment> Appointments { get; }
    IRepository<Invoice> Invoices { get; }
    IRepository<Payment> Payments { get; }
    // ... all domain repositories
    Task<int> SaveChangesAsync();
}
```

---

## 5. Authentication & Authorization

### JWT Configuration
```json
"Jwt": {
  "Key": "minimum-32-character-secret-key-here",
  "Issuer": "HospitalERP",
  "Audience": "HospitalERP",
  "ExpiryMinutes": 60,
  "RefreshTokenExpiryDays": 7
}
```

### Token Flow
1. `POST /api/auth/login` → returns `accessToken` + `refreshToken` + `expiry`
2. Frontend stores in `localStorage` as `auth_user` JSON object
3. `JwtInterceptor` adds `Authorization: Bearer <token>` to every HTTP request
4. On 401, `JwtInterceptor` attempts refresh via `POST /api/auth/refresh-token`
5. `POST /api/auth/logout` — backend invalidates refresh token

### Roles
Roles are stored in the `AspNetRoles` table. JWT claims include `role` claim.

Available roles: `Admin`, `Doctor`, `Nurse`, `Receptionist`, `Accountant`

### Endpoint Authorization
```csharp
[Authorize]                                          // Any authenticated user
[Authorize(Roles = "Admin")]                         // Admin only
[Authorize(Roles = "Admin,Accountant")]              // Admin or Accountant
```

### Password Change
```
POST /api/auth/change-password
Body: { "currentPassword": "...", "newPassword": "..." }
```

---

## 6. Real-Time Notifications (SignalR)

### Hub
```
wss://<host>/hubs/notifications
```
Hub class: `NotificationHub` — requires JWT authentication.

### Server → Client Events
| Event | Payload | Trigger |
|-------|---------|---------|
| `ReceiveNotification` | `NotificationDto` | New appointment, payment, low-stock, invoice |
| `ReceiveUnreadCount` | `number` | On connect or after marking read |

### Client → Server Methods
_(invoked from `NotificationService.ts`)_
- Hub auto-connects on shell initialization
- `GET /api/notifications` — load paginated notifications
- `POST /api/notifications/{id}/read` — mark one as read
- `POST /api/notifications/mark-all-read` — mark all as read
- `GET /api/notifications/unread-count` — badge count

### Notification Types
`AppointmentCreated`, `AppointmentUpdated`, `PaymentReceived`, `InvoiceCreated`, `LowStock`

---

## 7. Frontend — Angular 17

### Key Architecture Decisions
- **Standalone components** — zero NgModule files; each component uses `imports: []` in decorator
- **Route-level lazy loading** — each feature component is lazy-loaded via `loadComponent`
- **Signal-less** — standard RxJS `BehaviorSubject`/`Observable` pattern throughout
- **No state library** — local component state + service BehaviorSubjects

### Core Services

| Service | Purpose |
|---------|---------|
| `AuthService` | JWT login/logout/refresh, `currentUser$` observable |
| `NotificationService` | SignalR connection + HTTP notification CRUD |
| `LanguageService` | ngx-translate init, toggle EN/AR, RTL direction |
| `ToastService` | Global toast queue (success/error/info) |
| `ExportService` | `toCSV(data, filename, columns)` — browser download |
| `api.services.ts` | One class per domain: `PatientService`, `DoctorService`, etc. |

### Internationalization
- Translation files: `src/assets/i18n/en.json` and `ar.json`
- 191 keys covering all UI text
- Language toggle in header and Settings page
- `localStorage.lang` persisted across sessions
- RTL enabled via `document.documentElement.setAttribute('dir', 'rtl')`

### JWT Interceptor
`src/app/core/interceptors/jwt.interceptor.ts`
- Attaches Bearer token to all API calls
- Handles 401 → refresh → retry flow

### Auth Guard
`src/app/core/guards/auth.guard.ts`
- Redirects unauthenticated users to `/auth/login`

### Routing (`app.routes.ts`)
```typescript
{ path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('...') }
// All feature routes are lazy-loaded and guarded
```

---

## 8. API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with username + password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| POST | `/api/auth/change-password` | Change own password |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Paged list |
| POST | `/api/patients` | Create patient |
| GET | `/api/patients/{id}` | Get patient by ID |
| PUT | `/api/patients/{id}` | Update patient |
| DELETE | `/api/patients/{id}` | Soft-delete patient |
| GET | `/api/patients/{id}/appointments` | Patient's appointment history |
| GET | `/api/patients/{id}/invoices` | Patient's invoice history |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Paged list (filters: status, date, doctorId, patientId) |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/{id}` | Get by ID |
| PUT | `/api/appointments/{id}` | Update appointment |
| DELETE | `/api/appointments/{id}` | Soft-delete |
| GET | `/api/appointments/today` | Today's appointments list |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Paged list (filters: status, type) |
| POST | `/api/invoices` | Create invoice with line items |
| GET | `/api/invoices/{id}` | Get full invoice with items |
| DELETE | `/api/invoices/{id}` | Soft-delete |
| POST | `/api/invoices/payment` | Record payment |
| GET | `/api/invoices/{id}/payments` | Get payments for invoice |

### Dashboard
```
GET /api/dashboard
```
Returns:
```json
{
  "totalPatients": 120,
  "todayAppointments": 8,
  "monthlyRevenue": 45000,
  "totalRevenue": 320000,
  "totalDoctors": 12,
  "totalEmployees": 45,
  "pendingInvoices": 3,
  "lowStockItems": 2,
  "monthlyRevenues": [{ "month": "Jan", "revenue": 12000, "expenses": 8000 }],
  "recentActivities": [{ "type": "Appointment", "description": "...", "date": "..." }],
  "todayAppointmentsList": [...],
  "topDoctors": [{ "doctorName": "Dr. Smith", "specialization": "Cardiology", "appointmentCount": 24 }]
}
```

---

## 9. Deployment

### Docker Deployment (Recommended)

The project ships with a production-ready `docker-compose.yml` that orchestrates three services:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `hospital_db` | SQL Server 2022 | 1433 | Database |
| `hospital_api` | .NET 8 (multi-stage) | 8080 | Backend API |
| `hospital_frontend` | Node 18 → Nginx | 80 | Angular SPA + reverse proxy |

```bash
# Launch entire stack from solution root
docker-compose up --build -d

# View logs
docker-compose logs -f api

# Tear down (keep data)
docker-compose down

# Tear down (remove SQL volume)
docker-compose down -v
```

#### Nginx Reverse Proxy
The frontend container includes an `nginx.conf` that:
- Serves the Angular SPA with `try_files $uri $uri/ /index.html` for client-side routing
- Proxies `/api/*` → `http://api:8080/api/`
- Proxies `/hubs/*` → `http://api:8080/hubs/` with WebSocket upgrade headers

### Production Build (Manual)

**Backend:**
```bash
dotnet publish HospitalERP.API -c Release -o ./publish
```
Run with: `dotnet HospitalERP.API.dll` (set env vars for secrets)

**Frontend:**
```bash
cd hospital-erp-angular
npm run build
# Output in dist/hospital-erp-angular/browser/
```
Serve the `dist/` folder with any static server (nginx, IIS, Vercel, etc.)

### Health Check
```
GET /health → 200 OK "Healthy"
```
Use this endpoint for Docker health checks, load balancer probes, or uptime monitoring.

### Global Exception Middleware
All unhandled exceptions are caught by `GlobalExceptionMiddleware` and returned as:
```json
{
  "status": 500,
  "error": "InternalServerError",
  "message": "An unexpected error occurred.",
  "timestamp": "2026-03-04T08:00:00Z"
}
```
Specific exception types map to proper HTTP codes:
| Exception | HTTP Status |
|-----------|-------------|
| `KeyNotFoundException` | 404 Not Found |
| `UnauthorizedAccessException` | 403 Forbidden |
| `ArgumentException` | 400 Bad Request |
| `InvalidOperationException` | 409 Conflict |
| All others | 500 Internal Server Error |

### Demo Data Seeder
On first startup (when no Employees exist), `DemoDataSeeder` automatically populates:
- 10 employees, 5 doctors, 10 patients
- 13 chart-of-accounts entries
- 3 warehouses, 8 inventory items with stock levels
- 2 suppliers, 2 customers
- 15 appointments with matching invoices and payments

This runs idempotently — it only seeds once.

### IIS Deployment (Windows)
1. Install [.NET 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
2. Publish API → point IIS site to publish folder
3. Build Angular → copy `dist/` to a second IIS site or same site under `/app`
4. Configure CORS in `appsettings.Production.json` with the frontend origin

### Environment Variables (Production)
Never store secrets in `appsettings.json` in production. Use:
- **Windows**: IIS App Pool environment variables or Windows Secrets Manager
- **Linux/Docker**: `ASPNETCORE_ENVIRONMENT=Production` + environment variables in `docker-compose.yml`
- Connection string override: `ConnectionStrings__DefaultConnection=Server=...`

---

## 10. Configuration Reference

### `appsettings.json` Full Schema
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "..."
  },
  "Jwt": {
    "Key": "...",
    "Issuer": "HospitalERP",
    "Audience": "HospitalERP",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200", "https://yourproductiondomain.com"]
  },
  "Logging": {
    "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" }
  }
}
```

### Angular `environment.ts`
```typescript
export const environment = {
  production: false,            // Set to true for prod build
  apiUrl: 'https://localhost:7001/api'
};
```
