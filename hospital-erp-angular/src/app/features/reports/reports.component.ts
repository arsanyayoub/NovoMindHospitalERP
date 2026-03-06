import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountingService, ReportingService, SystemService } from '../../core/services/api.services';
import { ExportService } from '../../core/services/export.service';
import { ToastService } from '../../core/services/language.service';

@Component({
   selector: 'app-reports',
   standalone: true,
   imports: [CommonModule, FormsModule, TranslateModule],
   styles: [`
    .report-tabs { display: flex; gap: 8px; background: rgba(0,0,0,0.15); padding: 6px; border-radius: 16px; margin-bottom: 24px; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; border: 1px solid var(--border); }
    .report-tabs::-webkit-scrollbar { display: none; }
    .report-tab-btn { padding: 10px 18px; border-radius: 12px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .report-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    
    .rep-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .rep-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: 0.2s; position: relative; overflow: hidden; }
    .rep-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    .rep-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }
    
    .rep-chart-box { height: 180px; display: flex; align-items: flex-end; gap: 10px; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin: 20px 0; }
    .rep-bar { flex: 1; background: linear-gradient(180deg, var(--primary-light), var(--primary)); border-radius: 6px 6px 0 0; min-height: 4px; transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
    .rep-bar:hover { filter: brightness(1.2); cursor: pointer; }
    .rep-bar::after { content: attr(data-label); position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: 800; color: var(--text-muted); white-space: nowrap; }

    @media print { .page-header, .report-tabs, .filter-section { display: none !important; } .card, .rep-card { border: 1px solid #ddd !important; box-shadow: none !important; } }
  `],
   template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'BUSINESS_INTELLIGENCE' | translate }}</h1>
        <p class="page-subtitle">{{ 'REPORT_CENTER_DESC' | translate }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary px-4 border-primary border-opacity-20" (click)="exportReport()">
          <span class="material-icons-round mr-1">file_download</span> {{ 'EXPORT' | translate }}
        </button>
        <button class="btn btn-primary px-4 shadow-primary" (click)="printReport()">
          <span class="material-icons-round mr-1">print</span> {{ 'PRINT_REPORT' | translate }}
        </button>
      </div>
    </div>

    <div class="report-tabs animate-in">
      <button class="report-tab-btn" [class.active]="tab==='financial'" (click)="loadFinancial()">
        <span class="material-icons-round">account_balance_wallet</span> {{ 'FINANCIAL' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='trial'" (click)="loadTrial()">
        <span class="material-icons-round">balance</span> {{ 'TRIAL_BALANCE' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='patient_stats'" (click)="loadPatients()">
        <span class="material-icons-round">groups</span> {{ 'PATIENTS' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='appt_stats'" (click)="loadAppointments()">
        <span class="material-icons-round">event_note</span> {{ 'APPOINTMENTS' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='lab_stats'" (click)="loadLab()">
        <span class="material-icons-round">biotech</span> {{ 'LAB_TESTS' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='rx_stats'" (click)="loadPharmacy()">
        <span class="material-icons-round">medication</span> {{ 'PHARMACY' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='inv_stats'" (click)="loadInventory()">
        <span class="material-icons-round">inventory_2</span> {{ 'INVENTORY' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='hr_stats'" (click)="loadHR()">
        <span class="material-icons-round">badge</span> {{ 'HUMAN_RESOURCES' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='bed_stats'" (click)="loadBeds()">
        <span class="material-icons-round">hotel</span> {{ 'BEDS' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='ot_stats'" (click)="loadOT()">
        <span class="material-icons-round">meeting_room</span> {{ 'OT_REPORTS' | translate }}
      </button>
      <button class="report-tab-btn" [class.active]="tab==='audit'" (click)="loadAudit()">
        <span class="material-icons-round">history</span> {{ ('AUDIT_LOGS' | translate) || 'Audit Logs' }}
      </button>

    </div>

    <!-- FILTERS -->
    <div class="filter-section card p-6 mb-8 gray-glass animate-in">
       <div class="flex items-center gap-6">
          <div class="form-group mb-0">
             <label class="form-label font-black text-[0.6rem] uppercase tracking-widest">{{ 'START_DATE'|translate }}</label>
             <input class="form-control h-12 rounded-xl" type="date" [(ngModel)]="from">
          </div>
          <div class="form-group mb-0">
             <label class="form-label font-black text-[0.6rem] uppercase tracking-widest">{{ 'END_DATE'|translate }}</label>
             <input class="form-control h-12 rounded-xl" type="date" [(ngModel)]="to">
          </div>
          <button class="btn btn-primary h-12 px-8 rounded-xl font-black shadow-primary flex items-center gap-2 mt-auto" [disabled]="loading" (click)="load()">
             <span class="material-icons-round" [class.animate-spin]="loading">{{ loading ? 'sync' : 'analytics' }}</span>
             {{ (loading ? 'PROCESSING_DATA' : 'GENERATE_REPORT') | translate }}
          </button>
       </div>
    </div>

    <div *ngIf="loading" class="flex flex-col items-center justify-center p-20 grayscale opacity-40"><span class="spinner mb-4" style="width:40px;height:40px"></span><h3 class="font-black uppercase tracking-widest text-xs">{{ 'CRUNCHING_NUMBERS' | translate }}</h3></div>

    <div *ngIf="!loading" id="report-content" class="animate-in">
       <!-- FINANCIAL STATS -->
       <div *ngIf="tab==='financial' && report">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-success">
                <div class="rep-icon bg-success bg-opacity-10 text-success"><span class="material-icons-round">payments</span></div>
                <div class="text-[0.65rem] font-black uppercase text-success tracking-widest">{{ 'TOTAL_REVENUE' | translate }}</div>
                <div class="text-3xl font-black text-success">{{ report.totalRevenue | currency }}</div>
             </div>
             <div class="rep-card glass-danger">
                <div class="rep-icon bg-danger bg-opacity-10 text-danger"><span class="material-icons-round">receipt_long</span></div>
                <div class="text-[0.65rem] font-black uppercase text-danger tracking-widest">{{ 'TOTAL_EXPENSES' | translate }}</div>
                <div class="text-3xl font-black text-danger">{{ report.totalExpenses | currency }}</div>
             </div>
             <div class="rep-card" [ngClass]="report.netIncome >=0 ? 'glass-primary' : 'glass-danger'">
                <div class="rep-icon" [ngClass]="report.netIncome >=0 ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'">
                   <span class="material-icons-round">account_balance</span>
                </div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest opacity-70">{{ 'NET_OPERATING_INCOME' | translate }}</div>
                <div class="text-3xl font-black" [class.text-primary]="report.netIncome>=0" [class.text-danger]="report.netIncome<0">{{ report.netIncome | currency }}</div>
             </div>
          </div>
          
          <div class="card p-0 overflow-hidden shadow-2xl">
             <div class="p-6 bg-glass border-bottom"><h3 class="font-black text-xl uppercase tracking-tighter">{{ 'INCOME_STATEMENT' | translate }}</h3></div>
             <table class="table">
                <thead class="bg-glass"><tr><th>{{ 'FINANCIAL_CATEGORY'|translate }}</th><th class="text-end">{{ 'AMOUNT'|translate }}</th><th class="text-end">{{ 'RATIO'|translate }}</th></tr></thead>
                <tbody>
                   <tr class="font-bold text-lg"><td class="text-success uppercase tracking-widest text-xs">{{ 'OPERATING_REVENUE'|translate }}</td><td class="text-end text-success font-black">{{ report.totalRevenue | currency }}</td><td class="text-end opacity-40">100%</td></tr>
                   <tr class="font-bold text-lg"><td class="text-danger uppercase tracking-widest text-xs">{{ 'OPERATING_EXPENSES'|translate }}</td><td class="text-end text-danger font-black">{{ report.totalExpenses | currency }}</td><td class="text-end opacity-40">{{ expensePct }}%</td></tr>
                   <tr class="bg-glass h-16"><td class="font-black text-xl">{{ 'NET_BALANCE'|translate }}</td><td class="text-end font-black text-2xl" [class.text-primary]="report.netIncome>=0" [class.text-danger]="report.netIncome<0">{{ report.netIncome | currency }}</td><td class="text-end font-black" [class.text-primary]="report.netIncome>=0">{{ netPct }}%</td></tr>
                </tbody>
             </table>
          </div>
       </div>

       <!-- TRIAL BALANCE -->
       <div *ngIf="tab==='trial' && trialBalance?.length">
          <div class="card p-0 overflow-hidden shadow-2xl">
             <div class="p-6 bg-glass border-bottom flex justify-between items-center">
                <h3 class="font-black text-xl uppercase tracking-tighter">{{ 'TRIAL_BALANCE_DRAFT' | translate }}</h3>
                <span class="badge badge-secondary font-mono">{{ to | date:'mediumDate' }}</span>
             </div>
             <table class="table">
                <thead class="bg-glass"><tr><th>{{ 'CODE'|translate }}</th><th>{{ 'ACCOUNT_TITLE'|translate }}</th><th class="text-end">{{ 'DEBIT_BAL'|translate }}</th><th class="text-end">{{ 'CREDIT_BAL'|translate }}</th></tr></thead>
                <tbody>
                   <tr *ngFor="let a of trialBalance" class="hover-row">
                      <td><span class="badge badge-secondary font-mono">{{ a.accountCode }}</span></td>
                      <td class="font-bold">{{ a.accountName }}</td>
                      <td class="text-end font-black text-primary">{{ (a.balance >= 0 ? a.balance : 0) | currency }}</td>
                      <td class="text-end font-black text-danger">{{ (a.balance < 0 ? -a.balance : 0) | currency }}</td>
                   </tr>
                </tbody>
                <tfoot class="bg-glass h-16 border-t-2">
                   <tr class="font-black text-lg">
                      <td colspan="2" class="text-right">{{ 'CONSOLIDATED_TOTALS' | translate }}</td>
                      <td class="text-end text-primary text-xl">{{ totalDebit | currency }}</td>
                      <td class="text-end text-danger text-xl">{{ totalCredit | currency }}</td>
                   </tr>
                </tfoot>
             </table>
          </div>
       </div>

       <!-- PATIENT ANALYTICS -->
       <div *ngIf="tab==='patient_stats' && patientData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">person_add</span></div>
                <div class="text-[0.65rem] font-black uppercase text-primary tracking-widest">{{ 'TOTAL_PATIENT_RECORDS'|translate }}</div>
                <div class="text-4xl font-black text-primary">{{ patientData.totalPatients }}</div>
             </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">trending_up</span> {{ 'NEW_REGISTRATIONS_TREND' | translate }}</h3>
                <div class="rep-chart-box">
                   <div *ngFor="let m of patientData.newPatientsTrend" class="rep-bar" 
                        [style.height.%]="getBarHeight(m.count, patientData.newPatientsTrend)" 
                        [attr.data-label]="m.month">
                   </div>
                </div>
             </div>
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-accent">pie_chart</span> {{ 'DEMOGRAPHIC_MIX' | translate }}</h3>
                <div class="flex flex-col gap-6">
                   <div *ngFor="let g of patientData.genderBreakdown" class="flex flex-col gap-2">
                      <div class="flex justify-between font-bold text-xs"><span>{{ g.groupName | translate }}</span><span>{{ g.count }}</span></div>
                      <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(g.count/patientData.totalPatients)*100"></div></div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <!-- APPOINTMENT ANALYTICS -->
       <div *ngIf="tab==='appt_stats' && apptData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">event_available</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest">{{ 'TOTAL_APPOINTMENTS'|translate }}</div>
                <div class="text-3xl font-black">{{ apptData.totalAppointments }}</div>
             </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">insights</span> {{ 'APPOINTMENT_TREND' | translate }}</h3>
                <div class="rep-chart-box">
                   <div *ngFor="let m of apptData.appointmentsTrend" class="rep-bar" 
                        [style.height.%]="getBarHeight(m.count, apptData.appointmentsTrend)" 
                        [attr.data-label]="m.month">
                   </div>
                </div>
             </div>
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-success">donut_large</span> {{ 'STATUS_DISTRIBUTION' | translate }}</h3>
                <div class="flex flex-col gap-6">
                   <div *ngFor="let g of apptData.statusBreakdown" class="flex flex-col gap-2">
                      <div class="flex justify-between font-bold text-xs"><span>{{ g.groupName | translate }}</span><span>{{ g.count }}</span></div>
                      <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(g.count/apptData.totalAppointments)*100"></div></div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <!-- LAB ANALYTICS -->
       <div *ngIf="tab==='lab_stats' && labData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">biotech</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-primary">{{ 'TOTAL_TESTS'|translate }}</div>
                <div class="text-3xl font-black text-primary">{{ labData.totalTests }}</div>
             </div>
             <div class="rep-card glass-success">
                <div class="rep-icon"><span class="material-icons-round">monetization_on</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-success">{{ 'LAB_REVENUE'|translate }}</div>
                <div class="text-3xl font-black text-success">{{ labData.totalRevenue | currency }}</div>
             </div>
          </div>
          <div class="card">
             <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-accent">leaderboard</span> {{ 'TEST_CATEGORY_DISTRIBUTION' | translate }}</h3>
             <div class="grid grid-cols-3 gap-6">
                <div *ngFor="let g of labData.categoryBreakdown" class="p-4 bg-glass border rounded-2xl">
                   <div class="text-[0.6rem] font-black uppercase text-muted mb-1">{{ g.groupName | translate }}</div>
                   <div class="text-2xl font-black">{{ g.count }}</div>
                </div>
             </div>
          </div>
       </div>

       <!-- PHARMACY ANALYTICS -->
       <div *ngIf="tab==='rx_stats' && rxData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-success">
                <div class="rep-icon"><span class="material-icons-round">medical_services</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-success">{{ 'TOTAL_DISPENSED'|translate }}</div>
                <div class="text-3xl font-black text-success">{{ rxData.totalPrescriptions }}</div>
             </div>
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">monetization_on</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-primary">{{ 'DRUG_SALES_REVENUE'|translate }}</div>
                <div class="text-3xl font-black text-primary">{{ rxData.totalRevenue | currency }}</div>
             </div>
          </div>
          <div class="card">
             <h3 class="font-black text-lg mb-4">{{ 'TOP_MOVING_MEDICINES' | translate }}</h3>
             <div class="grid grid-cols-2 gap-4">
                <div *ngFor="let m of rxData.topMedicines" class="p-4 bg-glass border rounded-2xl flex justify-between items-center animate-in">
                   <div><div class="font-bold">{{ m.groupName }}</div><div class="text-[0.6rem] font-black text-primary uppercase">{{ 'INVENTORY_ID'|translate }}: {{ m.id || 'N/A' }}</div></div>
                   <div class="text-2xl font-black text-primary">{{ m.count }}</div>
                </div>
             </div>
          </div>
       </div>

       <!-- INVENTORY ANALYTICS -->
       <div *ngIf="tab==='inv_stats' && invData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">inventory</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-primary">{{ 'TOTAL_VALUATION'|translate }}</div>
                <div class="text-3xl font-black text-primary">{{ invData.totalValue | currency }}</div>
             </div>
             <div class="rep-card glass-warning">
                <div class="rep-icon"><span class="material-icons-round">notification_important</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-warning">{{ 'REORDER_ALERTS'|translate }}</div>
                <div class="text-3xl font-black text-warning">{{ invData.lowStockItems }}</div>
             </div>
          </div>
          <div class="card">
             <h3 class="font-black text-lg mb-4">{{ 'STOCK_BY_CATEGORY' | translate }}</h3>
             <div class="flex flex-col gap-4">
                <div *ngFor="let g of invData.categoryDistribution" class="flex flex-col gap-1">
                   <div class="flex justify-between text-xs font-bold"><span>{{ g.groupName | translate }}</span><span>{{ g.count }} items</span></div>
                   <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(g.count/invData.totalItems)*100"></div></div>
                </div>
             </div>
          </div>
       </div>

       <!-- HR ANALYTICS -->
       <div *ngIf="tab==='hr_stats' && hrData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">badge</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-primary">{{ 'TOTAL_EMPLOYEES'|translate }}</div>
                <div class="text-3xl font-black text-primary">{{ hrData.totalEmployees }}</div>
             </div>
             <div class="rep-card glass-success">
                <div class="rep-icon"><span class="material-icons-round">payments</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-success">{{ 'MONTHLY_PAYROLL'|translate }}</div>
                <div class="text-3xl font-black text-success">{{ hrData.monthlyPayroll | currency }}</div>
             </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
             <div class="card">
                <h3 class="font-black text-lg mb-6">{{ 'DEPARTMENT_DISTRIBUTION' | translate }}</h3>
                <div class="flex flex-col gap-6">
                   <div *ngFor="let g of hrData.departmentDistribution" class="flex flex-col gap-2">
                      <div class="flex justify-between font-bold text-xs"><span>{{ g.groupName }}</span><span>{{ g.count }}</span></div>
                      <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(g.count/hrData.totalEmployees)*100"></div></div>
                   </div>
                </div>
             </div>
             <div class="card">
                <h3 class="font-black text-lg mb-6">{{ 'PAYROLL_TREND' | translate }}</h3>
                <div class="rep-chart-box">
                   <div *ngFor="let m of hrData.payrollTrend" class="rep-bar" 
                        [style.height.%]="getBarHeight(m.count, hrData.payrollTrend)" 
                        [attr.data-label]="m.month">
                   </div>
                </div>
             </div>
          </div>
       </div>

      <!-- BED ANALYTICS -->
      <div *ngIf="tab==='bed_stats' && bedData">
         <div class="rep-summary-grid mb-8">
            <div class="rep-card glass-primary">
               <div class="rep-icon"><span class="material-icons-round">hotel</span></div>
               <div class="text-[0.65rem] font-black uppercase tracking-widest">{{ 'TOTAL_BEDS' | translate }}</div>
               <div class="text-3xl font-black">{{ bedData.totalBeds }}</div>
            </div>
            <div class="rep-card glass-warning">
               <div class="rep-icon"><span class="material-icons-round">person_outline</span></div>
               <div class="text-[0.65rem] font-black uppercase tracking-widest text-warning">{{ 'OCCUPIED_BEDS' | translate }}</div>
               <div class="text-3xl font-black text-warning">{{ bedData.occupiedBeds }}</div>
            </div>
            <div class="rep-card glass-info">
               <div class="rep-icon"><span class="material-icons-round">percentage</span></div>
               <div class="text-[0.65rem] font-black uppercase tracking-widest text-info">{{ 'OCCUPANCY_RATE' | translate }}</div>
               <div class="text-3xl font-black text-info">{{ bedData.occupancyRate.toFixed(1) }}%</div>
            </div>
            <div class="rep-card glass-secondary">
               <div class="rep-icon"><span class="material-icons-round">build</span></div>
               <div class="text-[0.65rem] font-black uppercase tracking-widest text-secondary">{{ 'MAINTENANCE_BEDS' | translate }}</div>
               <div class="text-3xl font-black text-secondary">{{ bedData.maintenanceBeds }}</div>
            </div>
         </div>
         <div class="grid grid-cols-2 gap-8 mb-8">
            <div class="card">
               <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">analytics</span> {{ 'ADMISSION_TREND' | translate }}</h3>
               <div class="rep-chart-box">
                  <div *ngFor="let m of bedData.admissionTrend" class="rep-bar" 
                       [style.height.%]="getBarHeight(m.count, bedData.admissionTrend)" 
                       [attr.data-label]="m.month">
                  </div>
               </div>
            </div>
            <div class="card">
               <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-accent">pie_chart</span> {{ 'WARD_OCCUPANCY' | translate }}</h3>
               <div class="flex flex-col gap-6">
                  <div *ngFor="let g of bedData.wardOccupancy" class="flex flex-col gap-2">
                     <div class="flex justify-between font-bold text-xs"><span>{{ g.groupName }}</span><span>{{ g.count }}</span></div>
                     <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(g.count/bedData.occupiedBeds)*100"></div></div>
                  </div>
                  <div *ngIf="!bedData.wardOccupancy?.length" class="text-center text-muted italic text-sm py-10">{{ 'NO_OCCUPIED_BEDS' | translate }}</div>
               </div>
            </div>
         </div>
         <div class="card">
            <h3 class="font-black text-lg mb-4">{{ 'ROOM_TYPE_DISTRIBUTION' | translate }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div *ngFor="let g of bedData.roomTypeOccupancy" class="p-4 bg-glass border rounded-2xl animate-in">
                  <div class="text-[0.6rem] font-black uppercase text-muted mb-1">{{ g.groupName | translate }}</div>
                  <div class="text-2xl font-black text-primary">{{ g.count }}</div>
               </div>
            </div>
         </div>
      </div>

       <!-- OT ANALYTICS -->
       <div *ngIf="tab==='ot_stats' && otData">
          <div class="rep-summary-grid mb-8">
             <div class="rep-card glass-primary">
                <div class="rep-icon"><span class="material-icons-round">meeting_room</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-primary">{{ 'TOTAL_THEATERS' | translate }}</div>
                <div class="text-3xl font-black text-primary">{{ otData.totalTheaters }}</div>
             </div>
             <div class="rep-card glass-success">
                <div class="rep-icon"><span class="material-icons-round">calendar_today</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-success">{{ 'TOTAL_SURGERIES_IN_PERIOD' | translate }}</div>
                <div class="text-3xl font-black text-success">{{ otData.totalSurgeries }}</div>
             </div>
             <div class="rep-card glass-info">
                <div class="rep-icon"><span class="material-icons-round">speed</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-info">{{ 'SURGICAL_UTILIZATION' | translate }}</div>
                <div class="text-3xl font-black text-info">{{ otData.utilizationRate.toFixed(1) }}%</div>
             </div>
             <div class="rep-card glass-accent">
                <div class="rep-icon"><span class="material-icons-round">monetization_on</span></div>
                <div class="text-[0.65rem] font-black uppercase tracking-widest text-accent">{{ ('RESOURCE_EXPENDITURE' | translate) || 'Resource Expenditure' }}</div>
                <div class="text-3xl font-black text-accent">\${{ otData.totalResourceCost.toLocaleString() }}</div>
             </div>
          </div>
          
          <div class="grid grid-cols-2 gap-8 mb-8">
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">analytics</span> {{ 'SURGERY_VOLUME_TREND' | translate }}</h3>
                <div class="rep-chart-box">
                   <div *ngFor="let m of otData.surgeryTrend" class="rep-bar" 
                        [style.height.%]="getBarHeight(m.count, otData.surgeryTrend)" 
                        [attr.data-label]="m.month">
                   </div>
                </div>
             </div>
             <div class="card">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-accent">pie_chart</span> {{ 'UTILIZATION_BY_THEATER' | translate }}</h3>
                <div class="flex flex-col gap-6">
                   <div *ngFor="let g of otData.theaterUtilization" class="flex flex-col gap-2">
                      <div class="flex justify-between font-bold text-xs"><span>{{ g.groupName }}</span><span>{{ g.value.toFixed(1) }}%</span></div>
                      <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="g.value"></div></div>
                   </div>
                </div>
             </div>
          </div>

          <div class="grid grid-cols-3 gap-8 mb-8">
             <div class="card">
                <h3 class="font-black text-lg mb-6">{{ 'STATUS_BREAKDOWN' | translate }}</h3>
                <div class="flex flex-col gap-4">
                   <div *ngFor="let g of otData.statusBreakdown" class="flex justify-between items-center p-3 bg-glass border rounded-xl">
                      <span class="font-bold">{{ g.groupName | translate }}</span>
                      <span class="badge badge-primary">{{ g.count }}</span>
                   </div>
                </div>
             </div>
             <div class="card">
                <h3 class="font-black text-lg mb-6">{{ 'PRIORITY_BREAKDOWN' | translate }}</h3>
                <div class="flex flex-col gap-4">
                   <div *ngFor="let g of otData.priorityBreakdown" class="flex justify-between items-center p-3 bg-glass border rounded-xl">
                      <span class="font-bold">{{ g.groupName | translate }}</span>
                      <span class="badge badge-accent">{{ g.count }}</span>
                   </div>
                </div>
             </div>
             <div class="card bg-glass border-primary/20">
                <h3 class="font-black text-lg mb-6 flex items-center gap-2 text-primary"><span class="material-icons-round">inventory_2</span> {{ ('TOP_CONSUMED_ITEMS' | translate) || 'Top Consumed Items' }}</h3>
                <div class="flex flex-col gap-3">
                   <div *ngFor="let i of otData.topConsumedItems" class="flex justify-between items-end p-2 border-b border-dashed border-primary/10">
                      <div>
                        <div class="text-xs font-black uppercase text-muted">{{ i.groupName }}</div>
                        <div class="text-xs font-bold">{{ 'QUANTITY' | translate }}: {{ i.count }}</div>
                      </div>
                      <span class="material-icons-round text-primary/30 text-lg">trending_up</span>
                   </div>
             
                   <div *ngIf="otData.topConsumedItems.length === 0" class="text-center py-10 text-muted italic text-xs">No records found</div>
                </div>
             </div>
          </div>
       </div>

       <!-- Audit Tab -->
       <div *ngIf="tab==='audit'">
          <div class="card mb-8">
             <div class="flex justify-between items-center mb-6">
                <h3 class="font-black text-lg flex items-center gap-2"><span class="material-icons-round text-primary">history</span> {{ ('SYSTEM_AUDIT_TRAIL' | translate) || 'System Audit Trail' }}</h3>
                <div class="flex gap-4">
                   <input type="text" class="form-control" [placeholder]="'SEARCH_LOGS' | translate" [(ngModel)]="logFilter" (input)="loadAuditLogs()">
                </div>
             </div>
             
             <div class="table-container">
                <table class="table hoverable">
                   <thead>
                      <tr>
                         <th>{{ 'TIMESTAMP' | translate }}</th>
                         <th>{{ 'USER' | translate }}</th>
                         <th>{{ 'ACTION' | translate }}</th>
                         <th>{{ 'ENTITY' | translate }}</th>
                         <th>{{ 'DETAILS' | translate }}</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr *ngFor="let l of auditLogs">
                         <td class="text-xs text-muted">{{ l.timestamp | date:'medium' }}</td>
                         <td>
                            <div class="flex items-center gap-2">
                               <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{{ l.username[0] }}</div>
                               <span class="font-bold text-sm">{{ l.username }}</span>
                            </div>
                         </td>
                         <td><span class="badge badge-outline text-[0.6rem] uppercase tracking-tighter">{{ l.action }}</span></td>
                         <td><span class="text-xs font-black">{{ l.entityName }} #{{ l.entityId }}</span></td>
                         <td class="max-w-[300px] truncate text-xs italic">{{ l.changes }}</td>
                      </tr>
                      <tr *ngIf="auditLogs.length === 0">
                         <td colspan="5" class="text-center py-20 italic opacity-50">No activity logs found</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
       </div>




       <div *ngIf="tabIsEmpty()" class="p-20 text-center card bg-glass grayscale opacity-30">
          <span class="material-icons-round text-6xl mb-4">analytics</span>
          <h3 class="font-black uppercase tracking-widest">{{ 'NO_DATA_GENERATED' | translate }}</h3>
          <p class="text-sm font-semibold">{{ 'CHOOSE_DATES_TO_START' | translate }}</p>
       </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
   tab = 'financial';
   loading = false;
   from = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
   to = new Date().toISOString().split('T')[0];

   patientData: any = null;
   apptData: any = null;
   labData: any = null;
   radData: any = null;
   rxData: any = null;
   invData: any = null;
   hrData: any = null;
   bedData: any = null;
   otData: any = null;
   report: any = null;
   trialBalance: any[] = [];
   auditLogs: any[] = [];
   logFilter = '';

   constructor(
      private accounting: AccountingService,
      private reportsSvc: ReportingService,
      private systemSvc: SystemService,
      private exportSvc: ExportService,
      private translate: TranslateService,
      private toast: ToastService
   ) { }


   ngOnInit() { this.load(); }

   // ── Tab-switching helpers called from template ──────────────
   loadFinancial() { this.tab = 'financial'; this.load(); }
   loadTrial() { this.tab = 'trial'; this.load(); }
   loadPatients() { this.tab = 'patient_stats'; this.load(); }
   loadAppointments() { this.tab = 'appt_stats'; this.load(); }
   loadLab() { this.tab = 'lab_stats'; this.load(); }
   loadPharmacy() { this.tab = 'rx_stats'; this.load(); }
   loadInventory() { this.tab = 'inv_stats'; this.load(); }
   loadHR() { this.tab = 'hr_stats'; this.load(); }
   loadBeds() { this.tab = 'bed_stats'; this.load(); }
   loadOT() { this.tab = 'ot_stats'; this.load(); }
   loadAudit() { this.tab = 'audit'; this.loadAuditLogs(); }

   loadAuditLogs() {
      this.loading = true;
      this.systemSvc.getAuditLogs(1, 100, this.logFilter).subscribe({
         next: (res) => {
            this.auditLogs = res.items;
            this.loading = false;
         },
         error: () => this.loading = false
      });
   }



   load() {
      this.loading = true;
      const obs = this.getObservable();
      if (!obs) { this.loading = false; return; }

      obs.subscribe({
         next: (r: any) => {
            if (this.tab === 'financial') this.report = r;
            else if (this.tab === 'trial') this.trialBalance = r;
            else if (this.tab === 'patient_stats') this.patientData = r;
            else if (this.tab === 'appt_stats') this.apptData = r;
            else if (this.tab === 'lab_stats') this.labData = r;
            else if (this.tab === 'rx_stats') this.rxData = r;
            else if (this.tab === 'inv_stats') this.invData = r;
            else if (this.tab === 'hr_stats') this.hrData = r;
            else if (this.tab === 'bed_stats') this.bedData = r;
            else if (this.tab === 'ot_stats') this.otData = r;
            this.loading = false;
         },
         error: () => { this.loading = false; this.toast.error(this.translate.instant('ERROR_REFRESHING')); }
      });
   }

   private getObservable() {
      switch (this.tab) {
         case 'financial': return this.accounting.getFinancialReport(this.from, this.to);
         case 'trial': return this.accounting.getTrialBalance(this.to);
         case 'patient_stats': return this.reportsSvc.getPatients(this.from, this.to);
         case 'appt_stats': return this.reportsSvc.getAppointments(this.from, this.to);
         case 'lab_stats': return this.reportsSvc.getLab(this.from, this.to);
         case 'rx_stats': return this.reportsSvc.getPharmacy(this.from, this.to);
         case 'inv_stats': return this.reportsSvc.getInventory();
         case 'hr_stats': return this.reportsSvc.getHR(new Date(this.to).getFullYear());
         case 'bed_stats': return this.reportsSvc.getBeds(this.from, this.to);
         case 'ot_stats': return this.reportsSvc.getOT(this.from, this.to);
         default: return null;
      }
   }

   get expensePct(): string { return this.report?.totalRevenue ? ((this.report.totalExpenses / this.report.totalRevenue) * 100).toFixed(1) : '0'; }
   get netPct(): string { return this.report?.totalRevenue ? ((this.report.netIncome / this.report.totalRevenue) * 100).toFixed(1) : '0'; }
   get totalDebit() { return this.trialBalance.filter(a => a.balance >= 0).reduce((s, a) => s + a.balance, 0); }
   get totalCredit() { return this.trialBalance.filter(a => a.balance < 0).reduce((s, a) => s - a.balance, 0); }

   getBarHeight(val: number, trend: any[]): number {
      if (!trend?.length) return 4;
      const max = Math.max(1, ...trend.map(i => i.count));
      return Math.max(4, (val / max) * 100);
   }

   tabIsEmpty(): boolean {
      if (this.tab === 'financial') return !this.report;
      if (this.tab === 'trial') return !this.trialBalance?.length;
      if (this.tab === 'patient_stats') return !this.patientData;
      if (this.tab === 'appt_stats') return !this.apptData;
      if (this.tab === 'lab_stats') return !this.labData;
      if (this.tab === 'rx_stats') return !this.rxData;
      if (this.tab === 'inv_stats') return !this.invData;
      if (this.tab === 'hr_stats') return !this.hrData;
      if (this.tab === 'bed_stats') return !this.bedData;
      if (this.tab === 'ot_stats') return !this.otData;
      return true;
   }

   exportReport() {
      this.toast.info(this.translate.instant('EXTRACTING_CSV'));
      // Simplified export logic for the AI demonstration
      const data = this.tab === 'trial' ? this.trialBalance : (this.report ? [this.report] : []);
      this.exportSvc.toCSV(data, `report-${this.tab}-${this.to}`);
   }

   printReport() { window.print(); }
}
