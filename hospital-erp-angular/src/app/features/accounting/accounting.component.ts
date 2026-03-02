import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountingService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-accounting',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'ACCOUNTING' | translate }}</h1></div>
      <div class="flex gap-2">
        <button class="btn" [class.btn-primary]="tab==='accounts'" [class.btn-secondary]="tab!=='accounts'" (click)="tab='accounts'">{{ 'CHART_OF_ACCOUNTS' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='journal'" [class.btn-secondary]="tab!=='journal'" (click)="tab='journal';loadJournal()">{{ 'JOURNAL_ENTRIES' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='reports'" [class.btn-secondary]="tab!=='reports'" (click)="tab='reports';loadReport()">{{ 'FINANCIAL_REPORTS' | translate }}</button>
      </div>
    </div>

    <!-- Chart of Accounts -->
    <div *ngIf="tab==='accounts'">
      <div class="flex justify-between items-center mb-4">
        <h3>{{ 'CHART_OF_ACCOUNTS' | translate }}</h3>
        <button class="btn btn-primary btn-sm" (click)="showAccForm=true"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
      </div>
      <div class="card" style="padding:0">
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Code</th><th>Account Name</th><th>Arabic Name</th><th>Type</th><th>Balance</th></tr></thead>
            <tbody>
              <tr *ngFor="let a of accounts">
                <td><span class="badge badge-primary">{{ a.accountCode }}</span></td>
                <td class="font-semibold">{{ a.accountName }}</td>
                <td>{{ a.accountNameAr }}</td>
                <td><span class="badge badge-secondary">{{ a.accountType }}</span></td>
                <td [class.text-success]="a.balance>=0" [class.text-danger]="a.balance<0">{{ a.balance | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Journal Entries -->
    <div *ngIf="tab==='journal'">
      <div class="flex justify-between items-center mb-4">
        <h3>{{ 'JOURNAL_ENTRIES' | translate }}</h3>
        <button class="btn btn-primary btn-sm" (click)="showJeForm=true;initJeForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
      </div>
      <div class="card" style="padding:0">
        <div class="table-container">
          <table class="table">
            <thead><tr><th>#</th><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let je of journalEntries">
                <td><span class="badge badge-info">{{ je.entryNumber }}</span></td>
                <td>{{ je.entryDate | date:'mediumDate' }}</td>
                <td>{{ je.description }}</td>
                <td>{{ je.totalDebit | currency }}</td>
                <td>{{ je.totalCredit | currency }}</td>
                <td><span class="badge" [ngClass]="je.status==='Posted'?'badge-success':'badge-warning'">{{ je.status }}</span></td>
                <td><button *ngIf="je.status==='Draft'" class="btn btn-sm btn-success" (click)="postEntry(je.id)">Post</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Financial Report -->
    <div *ngIf="tab==='reports'">
      <div class="filter-bar mb-4">
        <div class="form-group"><label class="form-label">From</label><input class="form-control" type="date" [(ngModel)]="reportFrom" (change)="loadReport()"></div>
        <div class="form-group"><label class="form-label">To</label><input class="form-control" type="date" [(ngModel)]="reportTo" (change)="loadReport()"></div>
      </div>
      <div class="card-grid" *ngIf="report">
        <div class="stat-card"><div class="stat-icon success"><span class="material-icons-round">trending_up</span></div><div><div class="stat-value">{{ report.totalRevenue | currency }}</div><div class="stat-label">Total Revenue</div></div></div>
        <div class="stat-card"><div class="stat-icon danger"><span class="material-icons-round">trending_down</span></div><div><div class="stat-value">{{ report.totalExpenses | currency }}</div><div class="stat-label">Total Expenses</div></div></div>
        <div class="stat-card"><div class="stat-icon primary"><span class="material-icons-round">account_balance</span></div><div><div class="stat-value">{{ report.netIncome | currency }}</div><div class="stat-label">Net Income</div></div></div>
        <div class="stat-card"><div class="stat-icon accent"><span class="material-icons-round">savings</span></div><div><div class="stat-value">{{ report.totalAssets | currency }}</div><div class="stat-label">Total Assets</div></div></div>
      </div>
    </div>

    <!-- New Account Modal -->
    <div class="modal-overlay" *ngIf="showAccForm" (click)="showAccForm=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">New Account</h3><button class="btn btn-sm btn-secondary" (click)="showAccForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">Code *</label><input class="form-control" [(ngModel)]="accForm.accountCode"></div><div class="form-group"><label class="form-label">Type *</label><select class="form-control" [(ngModel)]="accForm.accountType"><option value="Asset">Asset</option><option value="Liability">Liability</option><option value="Equity">Equity</option><option value="Revenue">Revenue</option><option value="Expense">Expense</option></select></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Name (EN) *</label><input class="form-control" [(ngModel)]="accForm.accountName"></div><div class="form-group"><label class="form-label">Name (AR)</label><input class="form-control" [(ngModel)]="accForm.accountNameAr" dir="rtl"></div></div>
        <div class="form-group mt-4"><label class="form-label">Parent Account</label><select class="form-control" [(ngModel)]="accForm.parentAccountId"><option [ngValue]="null">— None —</option><option *ngFor="let a of accounts" [ngValue]="a.id">{{ a.accountCode }} — {{ a.accountName }}</option></select></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showAccForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveAccount()">{{ 'SAVE' | translate }}</button></div>
    </div></div>

    <!-- New Journal Entry Modal -->
    <div class="modal-overlay" *ngIf="showJeForm" (click)="showJeForm=false"><div class="modal modal-lg" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">New Journal Entry</h3><button class="btn btn-sm btn-secondary" (click)="showJeForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">Date</label><input class="form-control" type="date" [(ngModel)]="jeForm.entryDate"></div><div class="form-group"><label class="form-label">Reference</label><input class="form-control" [(ngModel)]="jeForm.reference"></div></div>
        <div class="form-group mt-4"><label class="form-label">Description</label><input class="form-control" [(ngModel)]="jeForm.description"></div>
        <h4 class="mt-4 mb-2">Lines</h4>
        <div *ngFor="let l of jeForm.lines; let i = index" class="form-row mt-2">
          <div class="form-group"><select class="form-control" [(ngModel)]="l.accountId"><option *ngFor="let a of accounts" [ngValue]="a.id">{{ a.accountCode }} — {{ a.accountName }}</option></select></div>
          <div class="form-group"><input class="form-control" type="number" [(ngModel)]="l.debitAmount" placeholder="Debit"></div>
          <div class="form-group"><input class="form-control" type="number" [(ngModel)]="l.creditAmount" placeholder="Credit"></div>
          <button class="btn btn-sm btn-danger" (click)="jeForm.lines.splice(i,1)"><span class="material-icons-round" style="font-size:16px">remove</span></button>
        </div>
        <button class="btn btn-sm btn-secondary mt-2" (click)="jeForm.lines.push({accountId:null,debitAmount:0,creditAmount:0})"><span class="material-icons-round" style="font-size:16px">add</span> Add Line</button>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showJeForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveJe()">{{ 'SAVE' | translate }}</button></div>
    </div></div>
  `
})
export class AccountingComponent implements OnInit {
    tab = 'accounts'; accounts: any[] = []; journalEntries: any[] = []; report: any = null;
    showAccForm = false; showJeForm = false; accForm: any = {}; jeForm: any = { lines: [] };
    reportFrom = ''; reportTo = '';
    constructor(private svc: AccountingService, private toast: ToastService) {
        const now = new Date(); this.reportFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]; this.reportTo = now.toISOString().split('T')[0];
    }
    ngOnInit() { this.loadAccounts(); }
    loadAccounts() { this.svc.getChartOfAccounts().subscribe(a => this.accounts = a); }
    loadJournal() { this.svc.getJournalEntries({}).subscribe(r => this.journalEntries = r.items); }
    loadReport() { this.svc.getFinancialReport(this.reportFrom, this.reportTo).subscribe(r => this.report = r); }
    saveAccount() { this.svc.createAccount(this.accForm).subscribe({ next: () => { this.toast.success('Saved'); this.showAccForm = false; this.loadAccounts(); }, error: () => this.toast.error('Error') }); }
    initJeForm() { this.jeForm = { entryDate: new Date().toISOString().split('T')[0], description: '', reference: '', lines: [{ accountId: null, debitAmount: 0, creditAmount: 0 }, { accountId: null, debitAmount: 0, creditAmount: 0 }] }; }
    saveJe() { this.svc.createJournalEntry(this.jeForm).subscribe({ next: () => { this.toast.success('Saved'); this.showJeForm = false; this.loadJournal(); }, error: (e: any) => this.toast.error(e.error?.message || 'Error') }); }
    postEntry(id: number) { this.svc.postJournalEntry(id).subscribe({ next: () => { this.toast.success('Posted'); this.loadJournal(); }, error: (e: any) => this.toast.error(e.error?.message || 'Error') }); }
}
