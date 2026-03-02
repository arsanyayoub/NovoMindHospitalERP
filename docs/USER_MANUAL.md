# NovoMind Hospital ERP — User Manual

> Version 2.0 | Last Updated: March 2026  
> Audience: Hospital staff — administrators, doctors, receptionists, accountants

---

## Table of Contents
1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [Patients](#3-patients)
4. [Doctors](#4-doctors)
5. [Appointments](#5-appointments)
6. [Invoices & Billing](#6-invoices--billing)
7. [Accounting](#7-accounting)
8. [Inventory](#8-inventory)
9. [Purchases](#9-purchases)
10. [Sales](#10-sales)
11. [Human Resources](#11-human-resources)
12. [Reports](#12-reports)
13. [Notifications](#13-notifications)
14. [Settings](#14-settings)
15. [Tips & Keyboard Shortcuts](#15-tips--keyboard-shortcuts)

---

## 1. Getting Started

### Logging In
1. Open your browser and navigate to the NovoMind URL (e.g., `http://localhost:4200`)
2. Enter your **username** and **password**
3. Click **Login**

> **First time?** Ask your system administrator to create your account. Admins can register users at the Login page.

### Navigating the System
The interface has two main areas:

- **Sidebar (left)** — main navigation menu. Items shown depend on your role.
- **Main area (center/right)** — the active page content.

### Language & Direction
Click the **translate icon** (🌐) in the top-right header to toggle between **English (LTR)** and **العربية (RTL)**. Your preference is saved automatically.

---

## 2. Dashboard

The Dashboard shows a real-time overview of hospital operations.

### Stat Cards (Top Row)
| Card | What It Shows |
|------|--------------|
| 👥 Total Patients | All registered active patients |
| 📅 Today's Appointments | Number of appointments scheduled for today |
| 💰 Monthly Revenue | Total revenue collected this calendar month |
| ⚠️ Low Stock Alerts | Inventory items below reorder level |

A second row of cards shows total doctors, total employees, pending invoices, and total all-time revenue.

### Revenue Chart
A monthly bar chart comparing **revenue** (purple bars) vs **expenses** (teal bars). Hover over bars to see exact values.

### Recent Activity
A feed of the latest system events — new appointments, payments received, etc.

### Today's Appointments List
A quick scrollable list showing today's scheduled appointments, including time, patient name, doctor, and status.

### Top Doctors Widget
Ranks doctors by number of appointments (all time), with gold/silver/bronze rank medals.

---

## 3. Patients

### Viewing Patients
1. Click **Patients** in the sidebar
2. The table shows all registered patients with their code, name, phone, gender, date of birth, and status
3. Use the **search bar** to filter by name or patient code

### Adding a Patient
1. Click **Add New** (top-right)
2. Fill in the form:
   - **Full Name** *(required)*
   - Phone, Email, National ID
   - Date of Birth, Gender
   - Blood Type, Emergency Contact
   - Allergies, Medical History (free text)
3. Click **Save**

> The system automatically generates a unique **Patient Code** (e.g., `PAT000001`).

### Editing a Patient
1. Click the ✏️ **Edit** button on any row
2. Modify the fields and click **Save**

### Viewing Patient History
1. Click the 🕘 **History** button (blue, left of Edit)
2. A modal opens with two tabs:
   - **Appointment History** — a timeline of all their visits: date, doctor, status, diagnosis, prescription
   - **Invoice History** — all their bills with totals, paid amounts, balance and status

### Deleting a Patient
1. Click the 🗑️ **Delete** button
2. Confirm the prompt

> Deleted records are soft-deleted and can be restored by an administrator.

### Patient Invoices (Billing Tab)
1. Click the **Patient Invoices (Billing)** tab at the top
2. View all patient invoices with their payment status
3. Click **New Bill** to create a hospital bill for a patient
4. Use the **Pay** 💳 button on unpaid invoices to record a payment

---

## 4. Doctors

### Viewing & Managing Doctors
- Similar to Patients — use Add New, Edit, and Delete
- Doctor fields: Full Name, Specialization, License Number, Phone, Email, Consultation Fee, Working Days, Notes

> Consultation fees are used as default appointment fees when booking.

---

## 5. Appointments

### Switching Views
At the top-right of the Appointments page, toggle between:
- **List View** 📋 — table with all appointments
- **Calendar View** 📅 — monthly grid calendar

### List View — Filtering
- Use the **search bar** to find by patient or doctor name
- Use the **Status** dropdown: All / Scheduled / Confirmed / Completed / Cancelled
- Use the **date picker** to filter by a specific date

### Calendar View
- Appointments appear as colored chips on the calendar grid
- Colors indicate status:
  - 🔵 Blue — Scheduled
  - 🟣 Purple — Confirmed
  - 🟢 Green — Completed
  - 🔴 Red — Cancelled
  - 🟡 Amber — In Progress
- Navigate months with **◀ ▶** arrows or click **Today**
- Click any day cell to filter the list view to that date

### Booking an Appointment
1. Click **Add New**
2. Select the **Patient** and **Doctor** from the dropdowns
3. Set **Date**, **Time**, and **Duration** (minutes)
4. Set the **Fee** (defaults to doctor's consultation fee)
5. Click **Save**

> An appointment is created with **Scheduled** status automatically.

### Updating an Appointment
1. Click ✏️ **Edit** on any row
2. When editing, extra fields appear: **Diagnosis**, **Prescription**, **Status**
3. Update status as the appointment progresses (Confirmed → In Progress → Completed)

### Exporting to CSV
Click **Export CSV** 📥 to download the current filtered list as a spreadsheet.

---

## 6. Invoices & Billing

### Viewing Invoices
- Filter by **Status** (Draft, Unpaid, Partially Paid, Paid, Cancelled) and/or **Type** (Patient, Customer)
- Status color coding:
  - Gray — Draft
  - Amber — Unpaid
  - Blue — Partially Paid
  - Green — Paid
  - Red — Cancelled

### Creating an Invoice
1. Click **Add New**
2. Choose **Type**: Patient or Customer
3. Select the patient or customer
4. Set **Invoice Date** and optional **Due Date**
5. Add line items — for each line:
   - Select an inventory item (or leave as "Custom Item")
   - Enter description, quantity, unit price, tax %, and discount
6. Review the **totals summary** on the right
7. Add optional notes
8. Click **Save**

### Recording a Payment
1. Find any invoice with an outstanding balance (Balance Due > 0)
2. Click the 💳 **Payment** button (blue)
3. Enter the payment amount (cannot exceed balance)
4. Choose **Payment Method**: Cash, Credit Card, Bank Transfer, or Cheque
5. Enter an optional **Reference Number**
6. Click **Record Payment**

> When the balance reaches zero, the invoice status automatically updates to **Paid**.

### Printing an Invoice
1. Click the 🖨️ **Print** button on any invoice row
2. A formatted print page opens in a new tab — choose your printer or save as PDF

### Exporting Invoices to CSV
Click **Export CSV** 📥 in the filter bar to download all visible invoices.

---

## 7. Accounting

> Available to: **Admin**, **Accountant**

### Chart of Accounts
- View all accounts organized by type (Asset, Liability, Equity, Revenue, Expense)
- Add new accounts with code, name, type, and description
- Toggle accounts active/inactive

### Journal Entries
- View all posted and draft journal entries
- Filter by date range
- Create entries: add debit/credit lines, ensure debits = credits
- Click **Post** to finalize a draft entry (posted entries cannot be edited)

### Financial Reports
- Select a **date range** (From / To) and click **Generate**
- View: Total Revenue, Total Expenses, Net Income, Gross Profit
- Additional views: Monthly breakdown chart

### Trial Balance
- Select an **as-of date** and click **Generate**
- Shows all accounts with their debit and credit balance totals

---

## 8. Inventory

> Available to: **Admin**, **Accountant**

### Items
- Manage products/supplies with: item code, name, category, unit, unit price, sale price, tax rate, reorder level
- Low-stock items show a warning badge; the dashboard shows a count of low-stock alerts

### Warehouses
- Add and manage multiple warehouse locations

### Stock Levels
- View current stock for each item across warehouses
- Filter by warehouse or item

### Stock Transfer
- Move stock between warehouses
- Select **From Warehouse**, **To Warehouse**, item, and quantity

---

## 9. Purchases

> Available to: **Admin**, **Accountant**

### Suppliers
- Manage vendor/supplier records: name, contact person, phone, email, tax number, payment terms

### Purchase Invoices
- Record purchases from suppliers with line items
- Track payment status
- Click **Pay** to record a payment against a purchase invoice

---

## 10. Sales

> Available to: **Admin**, **Accountant**

### Customers
- Manage external customers (organizations or individuals, separate from patients)

### Sales Invoices
- Create invoices for external customers
- Track and record payments

---

## 11. Human Resources

> Available to: **Admin** only

### Employees
- Manage all staff records: name, department, position, hire date, salary, allowances, contact info

### Payroll
- Filter by **Month** and **Year**
- Click **Generate Payroll** to create payroll records for all active employees
- Review and click **Process Payment** to finalize

---

## 12. Reports

The Reports section provides executive-level analytics:

- **Patient Analytics** — new patient registrations over time
- **Appointment Analytics** — appointment volumes, completion rates, cancellation rates
- **Revenue Analytics** — revenue and expenses by period
- **Doctor Performance** — appointments per doctor

Use the **date range filter** and click **Refresh** to update charts.

---

## 13. Notifications

### Notification Panel
Click the 🔔 **bell icon** in the top-right header to open the notifications panel.

You will see:
- A **red badge** showing unread count (shows `9+` if over 9)
- List of recent notifications with title, message, and timestamp
- Color-coded icons by type: 📅 Appointment, 💳 Payment, 🧾 Invoice, 📦 Stock

### Notification Types
| Type | When You Receive It |
|------|----------------------|
| Appointment Created | Any new appointment is booked |
| Payment Received | A payment is recorded |
| Invoice Created | A new invoice is generated |
| Low Stock Alert | An item falls below reorder level |

### Marking as Read
- Click any notification to mark it read
- Click **Mark All as Read** to clear the badge

---

## 14. Settings

Click **Settings** ⚙️ at the bottom of the sidebar.

### Profile Tab
- Update your **Full Name**, **Email**, and **Phone Number**
- Username cannot be changed
- Click **Save** to apply changes

### Change Password Tab
1. Enter your **Current Password**
2. Enter a **New Password** (watch the strength meter — aim for 'Strong')
3. Confirm the new password
4. Click **Change Password**

> Passwords must match exactly, and the new password cannot be the same as the current one.

### System Settings Tab
- **Language** — switch between English and Arabic; the page reloads to apply RTL/LTR
- **System Information** — view system versions and tech stack
- **Admin Tools** (Admin only) — clear local session cache

---

## 15. Tips & Keyboard Shortcuts

### General Tips
- All tables support **search filtering** — type in the search box and results filter instantly
- Click column headers to sort (where supported)
- Use **pagination** (◀ ▶) to navigate large datasets
- The sidebar can be **collapsed** using the ☰ menu button in the header — useful on smaller screens

### Common Workflows

**Register a new patient and book an appointment:**
1. Patients → Add New → fill details → Save
2. Appointments → Add New → select patient & doctor → Save

**Record a full visit:**
1. Appointments → Edit → set status to In Progress → add Diagnosis & Prescription → Save
2. Set status to Completed → Save
3. Patients → Invoices tab → New Bill → select patient → add service lines → Save

**Process end-of-month payroll:**
1. HR → Payroll tab → Select Month & Year → Generate Payroll
2. Review the payroll list → click Process Payment for each entry

**Print a patient invoice:**
1. Invoices → find the invoice → click 🖨️ Print
2. In the print dialog, choose your printer or "Save as PDF"

### Useful Facts
- **Auto-codes**: Patient Codes (`PAT000001`), Appointment Codes (`APT000001`), Invoice Numbers (`INV000001`), and Payment Numbers (`PAY000001`) are generated automatically — you never need to enter them manually.
- **Soft deletes**: Deleted records are hidden but not permanently removed. Contact your administrator to restore data.
- **Real-time**: Notifications arrive instantly without refreshing the page.
- **Session timeout**: Your session expires after 60 minutes of inactivity. You'll be redirected to the login page automatically.

---

*For technical support, contact your system administrator or refer to the [Technical Manual](TECHNICAL_MANUAL.md).*
