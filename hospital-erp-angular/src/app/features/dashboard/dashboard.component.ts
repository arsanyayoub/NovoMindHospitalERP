import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from '../../core/services/api.services';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>

    <div *ngIf="!loading" class="animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ 'DASHBOARD' | translate }}</h1>
          <p class="page-subtitle">{{ today | date:'fullDate' }}</p>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary"><span class="material-icons-round">personal_injury</span></div>
          <div>
            <div class="stat-value">{{ data?.totalPatients || 0 }}</div>
            <div class="stat-label">{{ 'TOTAL_PATIENTS' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon accent"><span class="material-icons-round">calendar_month</span></div>
          <div>
            <div class="stat-value">{{ data?.todayAppointments || 0 }}</div>
            <div class="stat-label">{{ 'TODAY_APPOINTMENTS' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success"><span class="material-icons-round">payments</span></div>
          <div>
            <div class="stat-value">{{ data?.monthlyRevenue | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="stat-label">{{ 'MONTHLY_REVENUE' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning"><span class="material-icons-round">inventory</span></div>
          <div>
            <div class="stat-value">{{ data?.lowStockItems || 0 }}</div>
            <div class="stat-label">{{ 'LOW_STOCK_ITEMS' | translate }}</div>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <div class="stats-grid mt-4">
        <div class="stat-card">
          <div class="stat-icon primary"><span class="material-icons-round">medical_services</span></div>
          <div>
            <div class="stat-value">{{ data?.totalDoctors || 0 }}</div>
            <div class="stat-label">{{ 'DOCTORS' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon accent"><span class="material-icons-round">people</span></div>
          <div>
            <div class="stat-value">{{ data?.totalEmployees || 0 }}</div>
            <div class="stat-label">{{ 'EMPLOYEES' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon danger"><span class="material-icons-round">pending_actions</span></div>
          <div>
            <div class="stat-value">{{ data?.pendingInvoices || 0 }}</div>
            <div class="stat-label">{{ 'PENDING' | translate }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success"><span class="material-icons-round">account_balance_wallet</span></div>
          <div>
            <div class="stat-value">{{ data?.totalRevenue | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="stat-label">{{ 'TOTAL' | translate }}</div>
          </div>
        </div>
      </div>

      <!-- Charts & Activities -->
      <div class="dashboard-grid mt-6">
        <!-- Revenue Chart -->
        <div class="card">
          <h3 class="mb-4">{{ 'MONTHLY_REVENUE' | translate }}</h3>
          <div class="chart-container">
            <div class="chart-bars">
              <div *ngFor="let m of data?.monthlyRevenues" class="chart-bar-group">
                <div class="bar-wrapper">
                  <div class="bar revenue" [style.height.%]="getBarHeight(m.revenue)" title="Revenue: {{m.revenue | currency}}"></div>
                  <div class="bar expenses" [style.height.%]="getBarHeight(m.expenses)" title="Expenses: {{m.expenses | currency}}"></div>
                </div>
                <span class="bar-label">{{ m.month }}</span>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot revenue"></span> Revenue</span>
              <span class="legend-item"><span class="legend-dot expenses"></span> Expenses</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h3 class="mb-4">{{ 'RECENT_ACTIVITY' | translate }}</h3>
          <div class="activity-list">
            <div *ngFor="let a of data?.recentActivities" class="activity-item">
              <div class="activity-icon" [ngClass]="a.type.toLowerCase()">
                <span class="material-icons-round">
                  {{ a.type === 'Appointment' ? 'event' : 'payment' }}
                </span>
              </div>
              <div class="activity-content">
                <div class="activity-desc">{{ a.description }}</div>
                <div class="activity-time">{{ a.date | date:'short' }}</div>
              </div>
            </div>
            <div class="empty-state" *ngIf="!data?.recentActivities?.length">
              <span class="material-icons-round empty-icon">history</span>
              <span class="empty-text">No recent activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .dashboard-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
    @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

    .chart-container { padding: 8px 0; }
    .chart-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 200px; gap: 6px; padding-bottom: 28px; position: relative; }
    .chart-bar-group { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; }
    .bar-wrapper { flex: 1; display: flex; align-items: flex-end; gap: 3px; width: 100%; justify-content: center; }
    .bar { width: 14px; border-radius: 4px 4px 0 0; transition: height 0.8s cubic-bezier(0.34,1.56,0.64,1); min-height: 4px; cursor: pointer; }
    .bar.revenue { background: linear-gradient(180deg, var(--primary-light), var(--primary)); }
    .bar.expenses { background: linear-gradient(180deg, var(--accent), var(--accent-dark)); }
    .bar:hover { opacity: 0.8; transform: scaleY(1.02); }
    .bar-label { font-size: 0.65rem; color: var(--text-muted); margin-top: 6px; }
    .chart-legend { display: flex; justify-content: center; gap: 20px; margin-top: 12px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-secondary); }
    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend-dot.revenue { background: var(--primary); }
    .legend-dot.expenses { background: var(--accent); }

    .activity-list { display: flex; flex-direction: column; gap: 2px; }
    .activity-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; transition: background 0.15s; }
    .activity-item:hover { background: rgba(255,255,255,0.03); }
    .activity-icon {
      width: 38px; height: 38px; border-radius: 10px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;
    }
    .activity-icon.appointment { background: rgba(59,130,246,0.12); color: var(--info); }
    .activity-icon.payment { background: rgba(16,185,129,0.12); color: var(--success); }
    .activity-icon span { font-size: 18px; }
    .activity-desc { font-size: 0.85rem; color: var(--text-primary); }
    .activity-time { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
  `]
})
export class DashboardComponent implements OnInit {
    data: any = null;
    loading = true;
    today = new Date();
    maxRevenue = 1;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.dashboardService.get().subscribe({
            next: (data) => {
                this.data = data;
                this.maxRevenue = Math.max(1, ...data.monthlyRevenues.map((m: any) => Math.max(m.revenue, m.expenses)));
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    getBarHeight(value: number): number {
        return Math.max(3, (value / this.maxRevenue) * 90);
    }
}
