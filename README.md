# NovoMind Hospital ERP

> A fully-featured, modern Hospital Enterprise Resource Planning system built with **.NET 8** (backend) and **Angular 17** (frontend), featuring real-time notifications, role-based access control, bilingual UI (English / Arabic with RTL support), and a beautiful dark-mode interface.

---

## Table of Contents
- [Overview](#overview)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Role-Based Access](#role-based-access)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

**NovoMind** is an all-in-one hospital management platform that covers every aspect of hospital operations:

| Module | Key Features |
|--------|-------------|
| 🏥 Patients | Registration, medical history, patient invoices, history timeline |
| 👨‍⚕️ Doctors | Profile management, specializations, appointment scheduling |
| 📅 Appointments | List & calendar views, status tracking (Scheduled → Completed), CSV export |
| 🧾 Invoices | Patient & customer billing, payment recording, PDF print, CSV export |
| 📊 Accounting | Chart of accounts, journal entries, trial balance, financial reports |
| 📦 Inventory | Items, warehouses, stock levels, low-stock alerts, stock transfers |
| 🛒 Purchases | Suppliers, purchase invoices, payment tracking |
| 💰 Sales | Customers, sales invoices, payment tracking |
| 👥 HR | Employees, payroll generation and processing |
| 📈 Reports | Revenue, patient, appointment analytics |
| 🔔 Notifications | Real-time SignalR push notifications with unread badge |
| ⚙️ Settings | Profile editor, password change, language toggle |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular 17 Frontend                      │
│  (Standalone Components · ngx-translate · SignalR Client)   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / WebSocket (SignalR)
┌──────────────────────────▼──────────────────────────────────┐
│                   ASP.NET Core 8 API                        │
│         (JWT Auth · Controllers · SignalR Hub)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│               Application Layer (CQRS-like)                 │
│            Services · Interfaces · DTOs · AutoMapper        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│         Infrastructure Layer (EF Core · Repository)         │
│              SQL Server · Unit of Work Pattern              │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

**Backend**
- .NET 8 / ASP.NET Core 8
- Entity Framework Core 8 (Code-First, SQL Server)
- ASP.NET Core SignalR (real-time notifications)
- JWT Bearer Authentication + Refresh Tokens
- Repository + Unit of Work pattern

**Frontend**
- Angular 17 (Standalone Components, no NgModules)
- `@ngx-translate/core` — i18n (English + Arabic/RTL)
- Angular Signals / RxJS
- Material Icons Round
- Google Fonts — Outfit

---

## Modules

### Patient Management
- CRUD with medical history fields (blood type, allergies, emergency contact)
- Medical history modal: appointment timeline + invoice history per patient

### Appointments
- Table view and calendar view (month grid, color-coded by status)
- Status: Scheduled → Confirmed → In Progress → Completed / Cancelled
- Diagnosis & prescription fields per appointment

### Invoices & Billing
- Patient invoices and customer invoices
- Line-item billing with tax, discount, qty
- Record payments (partial or full)
- **Print to PDF** — opens a formatted print-ready page
- CSV export

### Accounting
- Full double-entry chart of accounts
- Journal entries with debit/credit lines
- Trial balance and financial reports

### Inventory
- Items with categories, units, reorder levels
- Multiple warehouses, stock tracking, stock transfers
- Low-stock alerts on the dashboard

### HR & Payroll
- Employee records with department, position, salary
- Monthly payroll generation and payment processing

### Real-Time Notifications
- SignalR push notifications for: new appointments, payments, low-stock, invoices
- Notification panel with unread count badge
- Mark-all-as-read support

---

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm
- [SQL Server](https://www.microsoft.com/sql-server) (Express or Developer)
- [Angular CLI 17+](https://angular.io/cli): `npm install -g @angular/cli`

### Backend Setup

```bash
# 1. Navigate to the solution root
cd "ERP Hospital NEw"

# 2. Restore NuGet packages
dotnet restore

# 3. Update the connection string in HospitalERP.API/appsettings.json
#    "ConnectionStrings": { "DefaultConnection": "Server=.;Database=HospitalERP;Trusted_Connection=True;" }

# 4. Apply EF Core migrations
dotnet ef database update --project HospitalERP.Infrastructure --startup-project HospitalERP.API

# 5. Run the API
dotnet run --project HospitalERP.API
# API will be available at https://localhost:7001
```

### Frontend Setup

```bash
# 1. Navigate to the Angular project
cd hospital-erp-angular

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# App will be available at http://localhost:4200
```

> **Default credentials** — registered via the `/auth/register` endpoint. First user gets Admin role.

---

## Environment Variables

**Backend** — `HospitalERP.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HospitalERP;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "your-secret-key-at-least-32-characters",
    "Issuer": "HospitalERP",
    "Audience": "HospitalERP"
  }
}
```

**Frontend** — `hospital-erp-angular/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

---

## Project Structure

```
ERP Hospital NEw/
├── HospitalERP.sln
├── HospitalERP.API/                # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Hubs/                       # SignalR NotificationHub
│   └── Program.cs
├── HospitalERP.Application/        # Business Logic Layer
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
├── HospitalERP.Domain/             # Domain Entities & Enums
│   ├── Entities/
│   └── Enums/
├── HospitalERP.Infrastructure/     # Data Access Layer
│   ├── Data/                       # DbContext
│   ├── Migrations/
│   ├── Repositories/
│   └── UnitOfWork/
└── hospital-erp-angular/           # Angular 17 Frontend
    └── src/app/
        ├── core/
        │   ├── guards/             # Auth guard
        │   ├── interceptors/       # JWT interceptor
        │   └── services/           # API, Auth, Export, Notification, Language
        ├── features/               # Feature modules (standalone components)
        │   ├── dashboard/
        │   ├── patients/
        │   ├── doctors/
        │   ├── appointments/
        │   ├── invoices/
        │   ├── accounting/
        │   ├── inventory/
        │   ├── purchases/
        │   ├── sales/
        │   ├── hr/
        │   ├── reports/
        │   └── settings/
        └── layout/shell/           # App shell (sidebar + header)
```

---

## Role-Based Access

| Role | Dashboard | Patients | Doctors | Appts | Invoices | Accounting | Inventory | Purchases | Sales | HR |
|------|:---------:|:--------:|:-------:|:-----:|:--------:|:----------:|:---------:|:---------:|:-----:|:--:|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Accountant | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Doctor | ✅ | ✅ | ✅ | ✅ | — | — | — | — | — | — |
| Receptionist | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | — | — |
| Nurse | ✅ | ✅ | ✅ | ✅ | — | — | — | — | — | — |

Sidebar items are hidden automatically based on JWT role claims. Route guards prevent unauthorized direct URL access.

---

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file — project overview and quick start |
| [docs/TECHNICAL_MANUAL.md](docs/TECHNICAL_MANUAL.md) | Architecture, API reference, backend patterns |
| [docs/USER_MANUAL.md](docs/USER_MANUAL.md) | End-user guide for all features |

---

## License

This project is proprietary and confidential. All rights reserved © 2026 NovoMind.
