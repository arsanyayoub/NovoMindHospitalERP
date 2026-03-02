import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountingService } from '../../core/services/api.services';
import { ExportService } from '../../core/services/export.service';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'REPORTS' | translate }}</h1>
        <p class="page-subtitle">Financial reports and analytics</p>
      </div>
    </div>

    <!-- Report Type Tabs -->
    <div class="tab-bar mb-4">
      <button class="tab-btn" [class.active]="tab==='financial'" (click)="tab='financial';loadFinancial()">
        <span class="material-icons-round">account_balance_wallet</span> Financial Report
      </button>
      <button class="tab-btn" [class.active]="tab==='trial'" (click)="tab='trial';loadTrial()">
        <span class="material-icons-round">balance</span> {{ 'TRIAL_BALANCE' | translate }}
      </button>
    </div>

    <!-- Date Filters -->
    <div class="card mb-4">
      <div class="filter-bar">
        <div class="form-group" style="flex:1;max-width:200px">
          <label class="form-label">{{ 'FROM' | translate }}</label>
          <input class="form-control" type="date" [(ngModel)]="from">
        </div>
        <div class="form-group" style="flex:1;max-width:200px">
          <label class="form-label">{{ 'TO' | translate }}</label>
          <input class="form-control" type="date" [(ngModel)]="to">
        </div>
        <div class="form-group" style="align-self:flex-end">
          <button class="btn btn-primary" (click)="load()" [disabled]="loading">
            <span class="material-icons-round">{{ loading ? 'hourglass_empty' : 'search' }}</span>
            {{ 'FILTER' | translate }}
          </button>
        </div>
        <div class="flex gap-2" style="margin-inline-start:auto;align-self:flex-end">
          <button class="btn btn-sm btn-secondary" (click)="exportReport()">
            <span class="material-icons-round">download</span> {{ 'EXPORT' | translate }}
          </button>
          <button class="btn btn-sm btn-secondary" (click)="printReport()">
            <span class="material-icons-round">print</span> {{ 'PRINT' | translate }}
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>

    <!-- Financial Report -->
    <div *ngIf="!loading && tab==='financial' && report" id="print-area">
      <!-- Summary Cards -->
      <div class="report-summary mb-4">
        <div class="summary-card success">
          <span class="material-icons-round">trending_up</span>
          <div>
            <div class="summary-value">{{ report.totalRevenue | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="summary-label">Total Revenue</div>
          </div>
        </div>
        <div class="summary-card danger">
          <span class="material-icons-round">trending_down</span>
          <div>
            <div class="summary-value">{{ report.totalExpenses | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="summary-label">Total Expenses</div>
          </div>
        </div>
        <div class="summary-card" [class.primary]="report.netIncome >= 0" [class.danger]="report.netIncome < 0">
          <span class="material-icons-round">account_balance</span>
          <div>
            <div class="summary-value">{{ report.netIncome | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="summary-label">Net Income</div>
          </div>
        </div>
        <div class="summary-card warning">
          <span class="material-icons-round">receipt_long</span>
          <div>
            <div class="summary-value">{{ report.totalPayables | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="summary-label">Total Payables</div>
          </div>
        </div>
      </div>

      <!-- Income Statement Table -->
      <div class="card">
        <h3 class="mb-4">Income Statement</h3>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead>
            <tbody>
              <tr>
                <td><span class="font-semibold text-success">Revenue</span></td>
                <td class="text-success font-semibold">{{ report.totalRevenue | currency }}</td>
                <td>100%</td>
              </tr>
              <tr>
                <td><span class="font-semibold text-danger">Expenses</span></td>
                <td class="text-danger font-semibold">{{ report.totalExpenses | currency }}</td>
                <td>{{ expensePct }}%</td>
              </tr>
              <tr style="border-top:2px solid var(--border)">
                <td><span class="font-bold">Net Income</span></td>
                <td [class.text-success]="report.netIncome>=0" [class.text-danger]="report.netIncome<0" class="font-bold">
                  {{ report.netIncome | currency }}
                </td>
                <td>{{ netPct }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Trial Balance -->
    <div *ngIf="!loading && tab==='trial' && trialBalance?.length" id="print-area">
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3>{{ 'TRIAL_BALANCE' | translate }} — {{ to | date:'mediumDate' }}</h3>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'ACCOUNT_CODE' | translate }}</th>
                <th>{{ 'ACCOUNT_NAME' | translate }}</th>
                <th>{{ 'ACCOUNT_TYPE' | translate }}</th>
                <th class="text-end">{{ 'DEBIT' | translate }}</th>
                <th class="text-end">{{ 'CREDIT' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of trialBalance">
                <td><span class="badge badge-secondary">{{ a.accountCode }}</span></td>
                <td class="font-semibold">{{ a.accountName }}</td>
                <td><span class="badge badge-info">{{ a.accountType }}</span></td>
                <td class="text-end font-semibold text-success">
                  {{ a.balance >= 0 ? (a.balance | currency) : '' }}
                </td>
                <td class="text-end font-semibold text-danger">
                  {{ a.balance < 0 ? ((-a.balance) | currency) : '' }}
                </td>
              </tr>
              <tr style="background:rgba(99,102,241,0.06);font-weight:700">
                <td colspan="3">Totals</td>
                <td class="text-end text-success">{{ totalDebit | currency }}</td>
                <td class="text-end text-danger">{{ totalCredit | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && ((tab==='financial' && !report) || (tab==='trial' && !trialBalance?.length))" class="empty-state card">
      <span class="material-icons-round empty-icon">analytics</span>
      <span class="empty-title">No Data</span>
      <span class="empty-text">Select a date range and click Filter to generate the report.</span>
    </div>
  `,
  styles: [`
    .tab-bar { display: flex; gap: 8px; flex-wrap: wrap; }
    .tab-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 12px; border: 1px solid var(--border);
      background: var(--bg-card); color: var(--text-secondary);
      font-family: var(--font-family); font-size: 0.875rem; font-weight: 600;
      cursor: pointer; transition: var(--transition);
    }
    .tab-btn:hover { border-color: var(--primary); color: var(--primary-light); }
    .tab-btn.active { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border-color: var(--primary); }

    .report-summary { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .summary-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
      padding: 20px; display: flex; align-items: center; gap: 16px;
      transition: var(--transition-slow);
    }
    .summary-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
    .summary-card .material-icons-round { font-size: 32px; }
    .summary-card.success { border-left: 3px solid var(--success); }
    .summary-card.success .material-icons-round { color: var(--success); }
    .summary-card.danger { border-left: 3px solid var(--danger); }
    .summary-card.danger .material-icons-round { color: var(--danger); }
    .summary-card.primary { border-left: 3px solid var(--primary); }
    .summary-card.primary .material-icons-round { color: var(--primary-light); }
    .summary-card.warning { border-left: 3px solid var(--warning); }
    .summary-card.warning .material-icons-round { color: var(--warning); }
    .summary-value { font-size: 1.4rem; font-weight: 800; }
    .summary-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
    .text-end { text-align: end; }
  `]
})
export class ReportsComponent implements OnInit {
  tab = 'financial';
  loading = false;
  from = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  to = new Date().toISOString().split('T')[0];
  report: any = null;
  trialBalance: any[] = [];
  get totalDebit() { return this.trialBalance.filter(a => a.balance >= 0).reduce((s, a) => s + a.balance, 0); }
  get totalCredit() { return this.trialBalance.filter(a => a.balance < 0).reduce((s, a) => s - a.balance, 0); }
  get expensePct(): string { return this.report?.totalRevenue ? ((this.report.totalExpenses / this.report.totalRevenue) * 100).toFixed(1) : '0'; }
  get netPct(): string { return this.report?.totalRevenue ? ((this.report.netIncome / this.report.totalRevenue) * 100).toFixed(1) : '0'; }

  constructor(
    private accounting: AccountingService,
    private exportSvc: ExportService,
    private toast: ToastService
  ) { }

  ngOnInit() { this.load(); }

  load() {
    if (this.tab === 'financial') this.loadFinancial();
    else this.loadTrial();
  }

  loadFinancial() {
    this.loading = true;
    this.accounting.getFinancialReport(this.from, this.to).subscribe({
      next: (r) => { this.report = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadTrial() {
    this.loading = true;
    this.accounting.getTrialBalance(this.to).subscribe({
      next: (r) => { this.trialBalance = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  exportReport() {
    if (this.tab === 'trial') {
      this.exportSvc.toCSV(this.trialBalance, `trial-balance-${this.to}`, [
        { key: 'accountCode', header: 'Account Code' },
        { key: 'accountName', header: 'Account Name' },
        { key: 'accountType', header: 'Type' },
        { key: 'balance', header: 'Balance' }
      ]);
    } else if (this.report) {
      this.exportSvc.toCSV([this.report], `financial-report-${this.from}-${this.to}`);
    }
  }

  printReport() { window.print(); }
}
