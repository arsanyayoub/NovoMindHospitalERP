import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../core/services/api.services';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, TranslateModule],
   styles: [`
    .stats-wrapper { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .dash-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 24px; }
    @media (max-width: 1200px) { .dash-grid { grid-template-columns: 1fr; } }

    .stat-card { padding: 20px; border-radius: 20px; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.2); }
    .stat-card .stat-icon { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .stat-card .stat-value { font-size: 1.8rem; font-weight: 900; line-height: 1; margin-bottom: 4px; }
    .stat-card .stat-label { font-size: 0.7rem; font-weight: 800; opacity: 0.8; letter-spacing: 0.05em; }

    .chart-box { height: 260px; display: flex; align-items: flex-end; justify-content: space-around; padding-bottom: 40px; position: relative; border-bottom: 1px solid var(--border); }
    .chart-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; position: relative; }
    .bar-pair { display: flex; align-items: flex-end; gap: 4px; height: 100%; width: 100%; justify-content: center; }
    .bar-item { width: 16px; border-radius: 6px 6px 0 0; transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; min-height: 4px; }
    .bar-rev { background: linear-gradient(180deg, var(--primary-light), var(--primary)); box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .bar-exp { background: linear-gradient(180deg, #f87171, #ef4444); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
    .bar-date { position: absolute; bottom: -30px; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }

    .activity-row { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; transition: 0.2s; }
    .activity-row:hover { background: rgba(var(--primary-rgb), 0.05); }
    .act-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    
    .clinical-indicator { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); }
    .clinical-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    
    .ranking-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 16px; transition: 0.2s; background: rgba(255,255,255,0.02); border: 1px solid transparent; }
    .ranking-item:hover { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.03); }
    .rank-num { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; background: var(--bg-sidebar); border: 2px solid var(--border); }
    .rank-1 { border-color: #fbbf24; color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
    .rank-2 { border-color: #9ca3af; color: #9ca3af; background: rgba(156, 163, 175, 0.1); }
    .rank-3 { border-color: #d97706; color: #d97706; background: rgba(217, 119, 6, 0.1); }
  `],
   template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'HOSPITAL_DASHBOARD' | translate }}</h1>
        <p class="page-subtitle text-primary font-bold">{{ today | date:'EEEE, d MMMM yyyy' }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-icon" (click)="refresh()"><span class="material-icons-round">refresh</span></button>
      </div>
    </div>

    <div *ngIf="loading" class="flex flex-col items-center justify-center p-20 gray-glass rounded-3xl">
      <span class="spinner mb-4" style="width:40px;height:40px"></span>
      <span class="font-black text-muted uppercase tracking-widest">{{ 'LOADING_ANALYTICS' | translate }}</span>
    </div>

    <div *ngIf="!loading" class="animate-in">
      <!-- MAIN STATS -->
      <div class="stats-wrapper">
        <div class="stat-card glass-primary">
          <div class="stat-icon primary shadow-primary"><span class="material-icons-round">personal_injury</span></div>
          <div class="stat-value">{{ data?.totalPatients || 0 }}</div>
          <div class="stat-label uppercase">{{ 'TOTAL_PATIENTS' | translate }}</div>
        </div>
        <div class="stat-card glass-accent">
          <div class="stat-icon accent shadow-accent"><span class="material-icons-round">calendar_month</span></div>
          <div class="stat-value">{{ data?.todayAppointments || 0 }}</div>
          <div class="stat-label uppercase">{{ 'TODAY_APPOINTMENTS' | translate }}</div>
        </div>
        <div class="stat-card glass-success">
          <div class="stat-icon success shadow-success"><span class="material-icons-round">payments</span></div>
          <div class="stat-value">{{ data?.monthlyRevenue | currency }}</div>
          <div class="stat-label uppercase">{{ 'MONTHLY_REVENUE' | translate }}</div>
        </div>
        <div class="stat-card glass-warning">
          <div class="stat-icon warning shadow-warning"><span class="material-icons-round">inventory_2</span></div>
          <div class="stat-value">{{ data?.lowStockItems || 0 }}</div>
          <div class="stat-label uppercase">{{ 'LOW_STOCK_ALERTS' | translate }}</div>
        </div>
        <div class="stat-card glass-danger" *ngIf="data?.expiringBatchesCount > 0">
           <div class="stat-icon danger shadow-danger"><span class="material-icons-round">history_toggle_off</span></div>
           <div class="stat-value">{{ data?.expiringBatchesCount }}</div>
           <div class="stat-label uppercase">{{ 'EXPIRING_BATCHES' | translate }}</div>
        </div>
        <div class="stat-card glass-secondary">
           <div class="stat-icon secondary shadow-secondary"><span class="material-icons-round">groups</span></div>
           <div class="stat-value">{{ (data?.totalDoctors + data?.totalEmployees) || 0 }}</div>
           <div class="stat-label uppercase">{{ 'TOTAL_STAFF' | translate }}</div>
        </div>
        <!-- BED OCCUPANCY -->
        <div class="stat-card glass-info" style="background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.2);">
           <div class="stat-icon" style="background: #0ea5e9; color: white; box-shadow: 0 8px 16px rgba(14, 165, 233, 0.3);"><span class="material-icons-round">hotel</span></div>
           <div class="stat-value">{{ data?.occupiedBeds || 0 }}/{{ data?.totalBeds || 0 }}</div>
           <div class="stat-label uppercase">{{ ('BED_OCCUPANCY' | translate) || 'Bed Occupancy' }}</div>
           <div class="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-2 overflow-hidden">
              <div class="h-full bg-info" [style.width.%]="(data?.occupiedBeds / data?.totalBeds) * 100 || 0" style="background: #0ea5e9;"></div>
           </div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="flex flex-col gap-6">
          <!-- FINANCIAL CHART -->
          <div class="card p-6">
            <div class="flex justify-between items-center mb-8">
               <h3 class="font-black text-xl flex items-center gap-2"><span class="material-icons-round text-primary">analytics</span> {{ 'FINANCIAL_PERFORMANCE' | translate }}</h3>
               <div class="flex gap-4">
                  <div class="flex items-center gap-2 text-xs font-bold"><span class="w-3 h-3 rounded bg-primary"></span> {{ 'REVENUE' | translate }}</div>
                  <div class="flex items-center gap-2 text-xs font-bold"><span class="w-3 h-3 rounded bg-danger"></span> {{ 'EXPENSES' | translate }}</div>
               </div>
            </div>
            <div class="chart-box">
               <div *ngFor="let m of data?.monthlyRevenues" class="chart-col">
                  <div class="bar-pair">
                     <div class="bar-item bar-rev" [style.height.%]="getBarHeight(m.revenue)" [title]="m.revenue | currency"></div>
                     <div class="bar-item bar-exp" [style.height.%]="getBarHeight(m.expenses)" [title]="m.expenses | currency"></div>
                  </div>
                  <span class="bar-date">{{ m.month | translate }}</span>
               </div>
            </div>
          </div>

          <!-- CLINICAL OVERVIEW -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div class="clinical-indicator">
                <div class="clinical-icon primary bg-opacity-10 text-primary"><span class="material-icons-round">biotech</span></div>
                <div>
                   <div class="text-xl font-black">{{ data?.pendingLabRequests || 0 }}</div>
                   <div class="text-[0.6rem] font-bold text-muted uppercase tracking-widest">{{ 'PENDING_LAB' | translate }}</div>
                </div>
             </div>
             <div class="clinical-indicator">
                <div class="clinical-icon accent bg-opacity-10 text-accent"><span class="material-icons-round">medication</span></div>
                <div>
                   <div class="text-xl font-black">{{ data?.pendingPrescriptions || 0 }}</div>
                   <div class="text-[0.6rem] font-bold text-muted uppercase tracking-widest">{{ 'PENDING_RX' | translate }}</div>
                </div>
             </div>
             <div class="clinical-indicator">
                <div class="clinical-icon warning bg-opacity-10 text-warning"><span class="material-icons-round">settings_overscan</span></div>
                <div>
                   <div class="text-xl font-black">{{ data?.pendingRadiologyRequests || 0 }}</div>
                   <div class="text-[0.6rem] font-bold text-muted uppercase tracking-widest">{{ 'PENDING_RAD' | translate }}</div>
                </div>
             </div>
          </div>

          <!-- RECENT ACTIVITY -->
          <div class="card p-0 overflow-hidden">
            <div class="p-4 border-bottom bg-glass flex items-center justify-between">
               <h3 class="font-black text-lg flex items-center gap-2"><span class="material-icons-round text-accent">history</span> {{ 'RECENT_ACTIVITY' | translate }}</h3>
               <button class="btn btn-xs btn-secondary uppercase font-bold">{{ 'VIEW_ALL' | translate }}</button>
            </div>
            <div class="p-2">
              <div *ngFor="let a of data?.recentActivities" class="activity-row">
                 <div class="act-icon" [ngClass]="a.type === 'Appointment' ? 'primary bg-opacity-10' : 'success bg-opacity-10'">
                    <span class="material-icons-round">{{ a.type === 'Appointment' ? 'event' : 'receipt_long' }}</span>
                 </div>
                 <div class="flex-grow">
                    <div class="font-bold text-sm">{{ a.description }}</div>
                    <div class="text-xs text-muted">{{ a.date | date:'medium' }}</div>
                 </div>
                 <div class="text-xs font-black uppercase tracking-widest text-muted">{{ a.type | translate }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SIDEBAR DATA -->
        <div class="flex flex-col gap-6">
           <!-- RECOGNITION / TOP DOCTORS -->
           <div class="card p-0 overflow-hidden shadow-xl border-primary border-opacity-10">
              <div class="p-4 bg-primary bg-opacity-5 border-bottom flex justify-between items-center">
                 <h3 class="font-black text-lg flex items-center gap-2"><span class="material-icons-round text-primary">military_tech</span> {{ 'TOP_DOCTORS' | translate }}</h3>
                 <span class="badge badge-primary">{{ data?.totalDoctors || 0 }} {{ 'TOTAL' | translate }}</span>
              </div>
              <div class="p-3 ranking-list">
                 <div *ngFor="let d of data?.topDoctors; let i = index" class="ranking-item">
                    <div class="rank-num" [ngClass]="'rank-' + (i+1)">{{ i + 1 }}</div>
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-lg shadow-md">
                       {{ d.doctorName?.charAt(0) }}
                    </div>
                    <div class="flex-grow">
                       <div class="font-black text-sm">Dr. {{ d.doctorName }}</div>
                       <div class="text-[0.65rem] font-bold text-primary uppercase">{{ d.specialization | translate }}</div>
                    </div>
                    <div class="text-right">
                       <div class="font-black text-lg text-primary">{{ d.appointmentCount }}</div>
                       <div class="text-[0.6rem] font-bold text-muted uppercase">{{ 'APPOINTMENTS' | translate }}</div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- TODAY'S SCHEDULE -->
           <div class="card p-0 overflow-hidden">
              <div class="p-4 border-bottom bg-glass flex items-center justify-between">
                 <div class="flex items-center gap-2">
                    <span class="material-icons-round text-warning">today</span>
                    <h3 class="font-black text-lg">{{ 'TODAY_SCHEDULE' | translate }}</h3>
                 </div>
                 <span class="badge badge-warning">{{ data?.todayAppointments || 0 }}</span>
              </div>
              <div class="p-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                 <div *ngFor="let a of data?.todayAppointmentsList" class="flex items-center gap-4 p-3 hover:bg-white hover:bg-opacity-5 rounded-xl transition-all">
                    <div class="font-black text-sm text-primary font-mono bg-primary bg-opacity-10 p-1 px-2 rounded-lg">{{ a.appointmentTime?.substring(0,5) }}</div>
                    <div class="flex-grow">
                       <div class="font-bold text-sm">{{ a.patientName }}</div>
                       <div class="text-xs text-muted">Dr. {{ a.doctorName }}</div>
                    </div>
                    <span class="text-[0.6rem] font-black p-1 px-2 rounded-md uppercase tracking-tighter" 
                          [ngClass]="a.status === 'Completed' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'">
                       {{ a.status | translate }}
                    </span>
                 </div>
                 <div *ngIf="!data?.todayAppointmentsList?.length" class="p-10 text-center text-muted italic text-sm">{{ 'NO_APPOINTMENTS_TODAY' | translate }}</div>
              </div>
           </div>

           <!-- INVENTORY STATS -->
           <div class="card p-6 glass-accent">
              <h3 class="font-black text-sm mb-4 uppercase tracking-widest opacity-80 flex items-center gap-2">
                 <span class="material-icons-round">inventory_2</span> {{ 'INVENTORY_OVERVIEW' | translate }}
              </h3>
              <div class="flex justify-between items-end">
                 <div>
                    <div class="text-2xl font-black">{{ data?.totalStockValue | currency }}</div>
                    <div class="text-[0.65rem] font-bold uppercase">{{ 'TOTAL_VALUATION' | translate }}</div>
                 </div>
                 <div class="text-right">
                    <div class="text-xl font-black text-danger">{{ data?.lowStockItems || 0 }}</div>
                    <div class="text-[0.65rem] font-bold uppercase">{{ 'REORDER_ALERTS' | translate }}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
   data: any = null;
   loading = true;
   today = new Date();
   maxRevenue = 1;

   constructor(
      private dashboardService: DashboardService,
      private translate: TranslateService
   ) { }

   ngOnInit() {
      this.refresh();
   }

   refresh() {
      this.loading = true;
      this.dashboardService.get().subscribe({
         next: (data) => {
            this.data = data;
            const allValues = data.monthlyRevenues.flatMap((m: any) => [m.revenue, m.expenses]);
            this.maxRevenue = Math.max(1, ...allValues);
            this.loading = false;
         },
         error: () => { this.loading = false; }
      });
   }

   getBarHeight(val: number): number {
      if (!this.data?.monthlyRevenues?.length) return 4;
      const max = Math.max(1, ...this.data.monthlyRevenues.map((m: any) => Math.max(m.revenue, m.expenses)));
      return Math.max(4, (val / max) * 100);
   }
}
