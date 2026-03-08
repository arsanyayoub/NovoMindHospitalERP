import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'patients',
                loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent)
            },
            {
                path: 'patients/:id',
                loadComponent: () => import('./features/patients/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
            },
            {
                path: 'invoices',
                loadComponent: () => import('./features/invoices/invoices.component').then(m => m.InvoicesComponent)
            },
            {
                path: 'doctors',
                loadComponent: () => import('./features/doctors/doctors.component').then(m => m.DoctorsComponent)
            },
            {
                path: 'appointments',
                loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent)
            },
            {
                path: 'accounting',
                loadComponent: () => import('./features/accounting/accounting.component').then(m => m.AccountingComponent)
            },
            {
                path: 'inventory',
                loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent)
            },
            {
                path: 'purchases',
                loadComponent: () => import('./features/purchases/purchases.component').then(m => m.PurchasesComponent)
            },
            {
                path: 'sales',
                loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent)
            },
            {
                path: 'hr',
                loadComponent: () => import('./features/hr/hr.component').then(m => m.HrComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
            },
            {
                path: 'lab',
                loadComponent: () => import('./features/lab/lab.component').then(m => m.LabComponent)
            },
            {
                path: 'radiology',
                loadComponent: () => import('./features/radiology/radiology.component').then(m => m.RadiologyComponent)
            },
            {
                path: 'clinical',
                loadComponent: () => import('./features/clinical/clinical.component').then(m => m.ClinicalComponent)
            },
            {
                path: 'pharmacy',
                loadComponent: () => import('./features/pharmacy/pharmacy.component').then(m => m.PharmacyComponent)
            },
            {
                path: 'bed-management',
                loadComponent: () => import('./features/bed-management/bed-management.component').then(m => m.BedManagementComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'messaging',
                loadComponent: () => import('./features/messaging/messaging.component').then(m => m.MessagingComponent)
            },
            {
                path: 'emergency',
                loadComponent: () => import('./features/emergency/emergency.component').then(m => m.EmergencyComponent)
            },
            {
                path: 'emergency-physician',
                loadComponent: () => import('./features/emergency/physician-dashboard/physician-dashboard.component').then(m => m.EmergencyPhysicianDashboardComponent)
            },
            {
                path: 'emergency-chart/:id',
                loadComponent: () => import('./features/emergency/emergency-chart/emergency-chart.component').then(m => m.EmergencyChartComponent)
            },
            {
                path: 'audit-logs',
                loadComponent: () => import('./features/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
            },
            {
                path: 'inpatient-billing',
                loadComponent: () => import('./features/inpatient-billing/inpatient-billing.component').then(m => m.InpatientBillingComponent)
            },
            {
                path: 'inpatient-chart/:admissionId',
                loadComponent: () => import('./features/inpatient-chart/inpatient-chart.component').then(m => m.InpatientChartComponent)
            },
            {
                path: 'ot-management',
                loadComponent: () => import('./features/ot-management/ot-management.component').then(m => m.OTManagementComponent)
            },
            {
                path: 'insurance',
                loadComponent: () => import('./features/insurance/insurance.component').then(m => m.InsuranceComponent)
            },
            {
                path: 'assets',
                loadComponent: () => import('./features/assets/assets.component').then(m => m.AssetsComponent)
            },
            {
                path: 'blood-bank',
                loadComponent: () => import('./features/blood-bank/blood-bank.component').then(m => m.BloodBankComponent)
            },
            {
                path: 'maternity',
                loadComponent: () => import('./features/maternity/maternity.component').then(m => m.MaternityComponent)
            },
            {
                path: 'physiotherapy',
                loadComponent: () => import('./features/physiotherapy/physiotherapy.component').then(m => m.PhysiotherapyComponent)
            },
            {
                path: 'dental',
                loadComponent: () => import('./features/dental/dental.component').then(m => m.DentalComponent)
            },
            {
                path: 'fleet',
                loadComponent: () => import('./features/fleet/fleet.component').then(m => m.FleetComponent)
            },
            {
                path: 'dietary',
                loadComponent: () => import('./features/dietary/dietary.component').then(m => m.DietaryComponent)
            },
            {
                path: 'insights',
                loadComponent: () => import('./features/insights/insights.component').then(m => m.InsightsComponent)
            },
            {
                path: 'housekeeping',
                loadComponent: () => import('./features/housekeeping/housekeeping.component').then(m => m.HousekeepingComponent)
            },
            {
                path: 'quality',
                loadComponent: () => import('./features/quality/quality.component').then(m => m.QualityComponent)
            },
            {
                path: 'patient-portal',
                loadComponent: () => import('./features/patient-portal/patient-portal.component').then(m => m.PatientPortalComponent)
            },
            {
                path: 'cssd',
                loadComponent: () => import('./features/cssd/cssd.component').then(m => m.CssdComponent)
            },
            {
                path: 'mortuary',
                loadComponent: () => import('./features/mortuary/mortuary.component').then(m => m.MortuaryComponent)
            },
            {
                path: 'telehealth',
                loadComponent: () => import('./features/telehealth/telehealth.component').then(m => m.TelehealthComponent)
            },
            {
                path: 'hr-roster',
                loadComponent: () => import('./features/hr/roster.component').then(m => m.RosterComponent)
            },
            {
                path: 'hr-leave',
                loadComponent: () => import('./features/hr/leave-management.component').then(m => m.LeaveManagementComponent)
            },
            {
                path: 'referrals',
                loadComponent: () => import('./features/referrals/referral.component').then(m => m.ReferralComponent)
            }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];

