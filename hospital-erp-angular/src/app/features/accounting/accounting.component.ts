import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountingService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .acc-tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); }
    .acc-tab-btn { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .acc-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    
    .je-line-edit { background: rgba(var(--card-bg-rgb), 0.3); border: 1.5px solid var(--border); border-radius: 16px; padding: 16px; margin-bottom: 12px; transition: 0.2s; }
    .je-line-edit:hover { border-color: var(--primary); }
    
    .balance-card { border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 8px; position: relative; overflow: hidden; }
    .balance-card::after { content: ''; position: absolute; right: -20px; bottom: -20px; font-family: 'Material Icons Round'; font-size: 80px; opacity: 0.1; }
    .card-revenue::after { content: 'trending_up'; }
    .card-expense::after { content: 'trending_down'; }
    .card-net::after { content: 'account_balance'; }
    .card-assets::after { content: 'savings'; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'FINANCIAL_ACCOUNTING' | translate }}</h1>
        <p class="page-subtitle">{{ 'ACCOUNTING_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button *ngIf="tab==='accounts'" class="btn btn-primary px-4 shadow-primary" (click)="showAccForm=true">
          <span class="material-icons-round mr-1">account_tree</span> {{ 'NEW_ACCOUNT' | translate }}
        </button>
        <button *ngIf="tab==='journal'" class="btn btn-primary px-4 shadow-primary" (click)="showJeForm=true;initJeForm()">
          <span class="material-icons-round mr-1">history_edu</span> {{ 'NEW_ENTRY' | translate }}
        </button>
      </div>
    </div>

    <div class="acc-tab-nav animate-in">
       <button class="acc-tab-btn" [class.active]="tab==='accounts'" (click)="tab='accounts';loadAccounts()">
          <span class="material-icons-round">account_tree</span> {{ 'CHART_OF_ACCOUNTS' | translate }}
       </button>
       <button class="acc-tab-btn" [class.active]="tab==='journal'" (click)="tab='journal';loadJournal()">
          <span class="material-icons-round">book</span> {{ 'GENERAL_JOURNAL' | translate }}
       </button>
       <button class="acc-tab-btn" [class.active]="tab==='reports'" (click)="tab='reports';loadReport()">
          <span class="material-icons-round">summarize</span> {{ 'FINANCIAL_STATEMENTS' | translate }}
       </button>
    </div>

    <!-- ACCOUNTS LIST -->
    <div *ngIf="tab==='accounts'" class="animate-in">
       <div class="card p-0 overflow-hidden">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'CODE' | translate }}</th>
                      <th>{{ 'ACCOUNT_NAME' | translate }}</th>
                      <th>{{ 'ACCOUNT_TYPE' | translate }}</th>
                      <th class="text-end">{{ 'CURRENT_BALANCE' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let a of accounts" class="hover-row">
                      <td><span class="badge badge-secondary font-mono">{{ a.accountCode }}</span></td>
                      <td>
                         <div class="font-bold text-lg">{{ a.accountName }}</div>
                         <div class="text-[0.65rem] font-black uppercase text-primary opacity-60">{{ a.accountNameAr }}</div>
                      </td>
                      <td><span class="badge badge-info uppercase text-xs font-black">{{ a.accountType | translate }}</span></td>
                      <td class="text-end font-black text-lg" [class.text-success]="a.balance >= 0" [class.text-danger]="a.balance < 0">
                         {{ a.balance | currency }}
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- JOURNAL ENTRIES -->
    <div *ngIf="tab==='journal'" class="animate-in">
       <div class="card p-0 overflow-hidden">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'REF' | translate }} #</th>
                      <th>{{ 'DATE' | translate }}</th>
                      <th>{{ 'PARTICULARS' | translate }}</th>
                      <th class="text-end text-primary">{{ 'DEBIT' | translate }}</th>
                      <th class="text-end text-danger">{{ 'CREDIT' | translate }}</th>
                      <th class="text-center">{{ 'STATUS' | translate }}</th>
                      <th class="text-end">{{ 'ACTIONS' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let je of journalEntries" class="hover-row">
                      <td><span class="badge badge-primary font-mono">{{ je.entryNumber }}</span></td>
                      <td class="text-sm font-semibold">{{ je.entryDate | date:'mediumDate' }}</td>
                      <td>
                         <div class="font-bold">{{ je.description }}</div>
                         <div class="text-[0.65rem] font-black uppercase text-muted">Ref: {{ je.reference || 'N/A' }}</div>
                      </td>
                      <td class="text-end font-black text-primary">{{ je.totalDebit | currency }}</td>
                      <td class="text-end font-black text-danger">{{ je.totalCredit | currency }}</td>
                      <td class="text-center">
                         <span class="badge uppercase tracking-widest text-[0.6rem]" [ngClass]="je.status==='Posted'?'badge-success':'badge-warning'">
                            {{ je.status | translate }}
                         </span>
                      </td>
                      <td class="text-end">
                         <div class="flex justify-end gap-1">
                            <button *ngIf="je.status==='Draft'" class="btn btn-icon btn-xs text-success" (click)="postEntry(je.id)" [title]="'POST_TO_LEDGER' | translate">
                               <span class="material-icons-round">send</span>
                            </button>
                            <button class="btn btn-icon btn-xs text-primary"><span class="material-icons-round">print</span></button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- FINANCIAL REPORTS -->
    <div *ngIf="tab==='reports'" class="animate-in">
       <div class="flex gap-4 mb-8 bg-glass p-4 rounded-3xl border border-primary border-opacity-10 items-end">
          <div class="form-group mb-0">
             <label class="form-label text-[0.65rem] font-black uppercase tracking-widest opacity-60">{{ 'REPORT_PERIOD' | translate }}</label>
             <div class="flex gap-2">
                <input class="form-control rounded-xl h-11" type="date" [(ngModel)]="reportFrom">
                <input class="form-control rounded-xl h-11" type="date" [(ngModel)]="reportTo">
             </div>
          </div>
          <button class="btn btn-secondary h-11 px-6 rounded-xl font-bold flex items-center gap-2" (click)="loadReport()">
             <span class="material-icons-round">sync</span> {{ 'REGENERATE' | translate }}
          </button>
       </div>

       <div class="grid grid-cols-4 gap-6 mb-10" *ngIf="report">
          <div class="balance-card glass-success card-revenue">
             <div class="text-[0.6rem] font-black uppercase tracking-widest text-success opacity-70">{{ 'TOTAL_REVENUE' | translate }}</div>
             <div class="text-3xl font-black text-success">{{ report.totalRevenue | currency }}</div>
          </div>
          <div class="balance-card glass-danger card-expense">
             <div class="text-[0.6rem] font-black uppercase tracking-widest text-danger opacity-70">{{ 'TOTAL_EXPENSES' | translate }}</div>
             <div class="text-3xl font-black text-danger">{{ report.totalExpenses | currency }}</div>
          </div>
          <div class="balance-card glass-primary card-net">
             <div class="text-[0.6rem] font-black uppercase tracking-widest text-primary opacity-70">{{ 'NET_SURPLUS_DEFICIT' | translate }}</div>
             <div class="text-3xl font-black text-primary">{{ report.netIncome | currency }}</div>
          </div>
          <div class="balance-card glass-accent card-assets">
             <div class="text-[0.6rem] font-black uppercase tracking-widest text-accent opacity-70">{{ 'VALUATION_ASSETS' | translate }}</div>
             <div class="text-3xl font-black text-accent">{{ report.totalAssets | currency }}</div>
          </div>
       </div>

       <div class="grid grid-cols-2 gap-8">
          <div class="card p-0 overflow-hidden">
             <div class="p-4 bg-glass border-bottom"><h3 class="font-black text-lg">{{ 'INCOME_STATEMENT_SUMMARY' | translate }}</h3></div>
             <div class="p-6">
                <!-- Add simple summary charts or detailed rows here if needed -->
                <div class="p-10 text-center opacity-30 italic font-bold uppercase tracking-widest text-xs">{{ 'DETAILED_REPORT_COMING_SOON' | translate }}</div>
             </div>
          </div>
          <div class="card p-0 overflow-hidden">
             <div class="p-4 bg-glass border-bottom"><h3 class="font-black text-lg">{{ 'BALANCE_SHEET_PREVIEW' | translate }}</h3></div>
             <div class="p-6">
                <div class="p-10 text-center opacity-30 italic font-bold uppercase tracking-widest text-xs">{{ 'DETAILED_REPORT_COMING_SOON' | translate }}</div>
             </div>
          </div>
       </div>
    </div>

    <!-- NEW JOURNAL ENTRY MODAL -->
    <div class="modal-overlay" *ngIf="showJeForm" (click)="showJeForm=false">
       <div class="modal modal-xl animate-in" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'RECORD_GENERAL_ENTRY' | translate }}</h3>
             <button (click)="showJeForm=false" class="btn-close">×</button>
          </div>
          <div class="modal-body">
             <div class="grid grid-cols-3 gap-6 mb-8 p-6 bg-glass border rounded-3xl">
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'ENTRY_DATE' | translate }}</label>
                   <input class="form-control h-12" type="date" [(ngModel)]="jeForm.entryDate">
                </div>
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'REF_PARTICULARS' | translate }}</label>
                   <input class="form-control h-12" [(ngModel)]="jeForm.reference">
                </div>
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'NARRATION' | translate }}</label>
                   <input class="form-control h-12" [(ngModel)]="jeForm.description">
                </div>
             </div>

             <h4 class="font-black text-lg mb-4 flex justify-between items-center">
                <span class="flex items-center gap-2"><span class="material-icons-round text-primary">account_balance_wallet</span> {{ 'DOUBLE_ENTRY_LINES' | translate }}</span>
                <span class="text-xs font-black p-1 px-3 rounded-lg" [ngClass]="getTotalDebit() === getTotalCredit() ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'">
                   {{ 'UNBALANCED_REMAINING' | translate }}: {{ (getTotalDebit() - getTotalCredit()) | currency }}
                </span>
             </h4>

             <div class="max-h-[400px] overflow-y-auto mb-6 pr-2">
                <div *ngFor="let l of jeForm.lines; let i = index" class="je-line-edit animate-in">
                   <div class="grid grid-cols-12 gap-4 items-end">
                      <div class="col-span-6">
                         <label class="text-[0.6rem] font-black uppercase tracking-widest text-muted block mb-1">{{ 'GL_ACCOUNT' | translate }}</label>
                         <select class="form-control rounded-xl font-bold" [(ngModel)]="l.accountId">
                            <option *ngFor="let a of accounts" [ngValue]="a.id">{{ a.accountCode }} — {{ a.accountName }}</option>
                         </select>
                      </div>
                      <div class="col-span-2">
                         <label class="text-[0.6rem] font-black uppercase tracking-widest text-primary block mb-1">{{ 'DEBIT' | translate }}</label>
                         <input class="form-control rounded-xl text-end font-black text-primary" type="number" [(ngModel)]="l.debitAmount">
                      </div>
                      <div class="col-span-2">
                         <label class="text-[0.6rem] font-black uppercase tracking-widest text-danger block mb-1">{{ 'CREDIT' | translate }}</label>
                         <input class="form-control rounded-xl text-end font-black text-danger" type="number" [(ngModel)]="l.creditAmount">
                      </div>
                      <div class="col-span-2 text-right">
                         <button class="btn btn-icon btn-xs text-danger" (click)="jeForm.lines.splice(i,1)"><span class="material-icons-round">remove_circle_outline</span></button>
                      </div>
                   </div>
                </div>
             </div>

             <button class="btn btn-secondary btn-sm mb-8 font-bold" (click)="jeForm.lines.push({accountId:null,debitAmount:0,creditAmount:0})">
                + {{ 'ADD_DOUBLE_ENTRY_LINE' | translate }}
             </button>
          </div>
          <div class="modal-footer flex justify-between bg-glass">
             <div class="flex gap-10">
                <div>
                   <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest">{{ 'TOTAL_DEBIT_POOL' | translate }}</div>
                   <div class="text-2xl font-black text-primary">{{ getTotalDebit() | currency }}</div>
                </div>
                <div>
                   <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest">{{ 'TOTAL_CREDIT_POOL' | translate }}</div>
                   <div class="text-2xl font-black text-danger">{{ getTotalCredit() | currency }}</div>
                </div>
             </div>
             <div class="flex gap-3">
                <button class="btn btn-secondary px-8 rounded-xl font-bold" (click)="showJeForm=false">{{ 'CANCEL' | translate }}</button>
                <button class="btn btn-primary px-10 rounded-xl font-black shadow-primary" (click)="saveJe()" [disabled]="getTotalDebit() !== getTotalCredit() || getTotalDebit() === 0">
                   {{ 'SAVE_POSTED_ENTRY' | translate }}
                </button>
             </div>
          </div>
       </div>
    </div>

    <!-- ACCOUNT MODAL -->
    <div class="modal-overlay" *ngIf="showAccForm" (click)="showAccForm=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:450px">
          <div class="modal-header"><h3 class="modal-title font-black uppercase tracking-tighter">{{ 'DEFINE_GL_ACCOUNT' | translate }}</h3><button (click)="showAccForm=false" class="btn-close">×</button></div>
          <div class="modal-body">
             <div class="grid grid-cols-2 gap-4">
                <div class="form-group"><label class="form-label font-black text-xs uppercase">{{ 'ACCOUNT_CODE' | translate }}*</label><input class="form-control font-mono font-bold" [(ngModel)]="accForm.accountCode"></div>
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'HEAD_TYPE' | translate }}*</label>
                   <select class="form-control font-bold" [(ngModel)]="accForm.accountType">
                      <option value="Asset">Asset</option>
                      <option value="Liability">Liability</option>
                      <option value="Equity">Equity</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Expense">Expense</option>
                   </select>
                </div>
                <div class="form-group col-span-2"><label class="form-label font-black text-xs uppercase">{{ 'DISPLAY_NAME_EN' | translate }}</label><input class="form-control" [(ngModel)]="accForm.accountName"></div>
                <div class="form-group col-span-2"><label class="form-label font-black text-xs uppercase">{{ 'DISPLAY_NAME_AR' | translate }}</label><input class="form-control text-right" [(ngModel)]="accForm.accountNameAr" dir="rtl"></div>
             </div>
          </div>
          <div class="modal-footer flex-col border-0">
             <button class="btn btn-primary w-full h-14 rounded-2xl shadow-primary font-black uppercase tracking-widest" (click)="saveAccount()">{{ 'CREATE_ACCOUNT' | translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class AccountingComponent implements OnInit {
  tab = 'accounts';
  accounts: any[] = [];
  journalEntries: any[] = [];
  report: any = null;
  showAccForm = false;
  showJeForm = false;
  accForm: any = {};
  jeForm: any = { lines: [] };
  reportFrom = '';
  reportTo = '';

  constructor(
    private svc: AccountingService,
    private toast: ToastService,
    private translate: TranslateService
  ) {
    const now = new Date();
    this.reportFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    this.reportTo = now.toISOString().split('T')[0];
  }

  ngOnInit() { this.loadAccounts(); }

  loadAccounts() { this.svc.getChartOfAccounts().subscribe(a => this.accounts = a); }
  loadJournal() { this.svc.getJournalEntries({}).subscribe(r => this.journalEntries = r.items); }
  loadReport() { this.svc.getFinancialReport(this.reportFrom, this.reportTo).subscribe(r => this.report = r); }

  saveAccount() {
    this.svc.createAccount(this.accForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showAccForm = false;
        this.loadAccounts();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  initJeForm() {
    this.jeForm = {
      entryDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: [
        { accountId: null, debitAmount: 0, creditAmount: 0 },
        { accountId: null, debitAmount: 0, creditAmount: 0 }
      ]
    };
  }

  getTotalDebit() {
    return this.jeForm.lines.reduce((sum: number, l: any) => sum + (l.debitAmount || 0), 0);
  }

  getTotalCredit() {
    return this.jeForm.lines.reduce((sum: number, l: any) => sum + (l.creditAmount || 0), 0);
  }

  saveJe() {
    if (this.getTotalDebit() !== this.getTotalCredit()) {
      this.toast.error(this.translate.instant('UNBALANCED_ENTRY'));
      return;
    }
    this.svc.createJournalEntry(this.jeForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showJeForm = false;
        this.loadJournal();
      },
      error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }

  postEntry(id: number) {
    this.svc.postJournalEntry(id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.loadJournal();
      },
      error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }
}
