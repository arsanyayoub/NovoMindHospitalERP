import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InvoiceService, PatientService, SalesService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .inv-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 18px; transition: 0.2s; overflow: hidden; }
    .inv-card:hover { border-color: var(--primary); transform: translateY(-3px); }
    
    .pricing-summary { background: rgba(var(--primary-rgb), 0.05); border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; }
    .pricing-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 700; color: var(--text-secondary); }
    .pricing-total { border-top: 2px solid var(--border); padding-top: 16px; margin-top: 16px; font-size: 1.25rem; color: var(--primary); }

    .status-badge { p: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-paid { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-unpaid { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .status-partial { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .status-draft { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'BILLING_INVOICES' | translate }}</h1>
        <p class="page-subtitle">{{ 'INVOICE_MANAGEMENT_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-secondary px-4" (click)="exportCsv()">
          <span class="material-icons-round mr-1">download</span> {{ 'EXPORT' | translate }}
        </button>
        <button class="btn btn-primary px-4 shadow-primary" (click)="openForm()">
          <span class="material-icons-round mr-1">post_add</span> {{ 'NEW_INVOICE' | translate }}
        </button>
      </div>
    </div>

    <div class="filter-bar gray-glass p-3 rounded-2xl mb-6 flex gap-3 animate-in">
       <div class="search-bar flex-grow" style="max-width:350px">
          <span class="material-icons-round search-icon">search</span>
          <input class="form-control" [placeholder]="'SEARCH_BY_NUM_OR_CLIENT' | translate" [(ngModel)]="search" (input)="loadData()">
       </div>
       <select class="form-control" style="width:160px" [(ngModel)]="statusFilter" (change)="loadData()">
          <option value="">{{ 'ALL_STATUSES' | translate }}</option>
          <option value="Paid">{{ 'PAID' | translate }}</option>
          <option value="Unpaid">{{ 'UNPAID' | translate }}</option>
          <option value="PartiallyPaid">{{ 'PARTIAL' | translate }}</option>
       </select>
       <select class="form-control" style="width:160px" [(ngModel)]="typeFilter" (change)="loadData()">
          <option value="">{{ 'ALL_TYPES' | translate }}</option>
          <option value="Patient">{{ 'PATIENT_INVOICE' | translate }}</option>
          <option value="Customer">{{ 'CUSTOMER_INVOICE' | translate }}</option>
       </select>
    </div>

    <div class="card p-0 overflow-hidden animate-in">
       <div *ngIf="loading" class="flex items-center justify-center p-20 grayscale opacity-50"><span class="spinner"></span></div>
       <div class="table-container" *ngIf="!loading">
          <table class="table">
             <thead>
                <tr>
                   <th># {{ 'INVOICE' | translate }}</th>
                   <th>{{ 'CLIENT' | translate }}</th>
                   <th>{{ 'DATE' | translate }}</th>
                   <th class="text-end">{{ 'TOTAL' | translate }}</th>
                   <th class="text-end">{{ 'PAID' | translate }}</th>
                   <th class="text-end">{{ 'BALANCE' | translate }}</th>
                   <th>{{ 'STATUS' | translate }}</th>
                   <th class="text-end">{{ 'ACTIONS' | translate }}</th>
                </tr>
             </thead>
             <tbody>
                <tr *ngFor="let inv of invoices" class="hover-row">
                   <td><span class="badge badge-secondary font-mono">{{ inv.invoiceNumber }}</span></td>
                   <td>
                      <div class="font-bold">{{ inv.patientName || inv.customerName }}</div>
                      <div class="text-[0.6rem] font-black uppercase text-primary opacity-60">{{ inv.invoiceType | translate }}</div>
                   </td>
                   <td class="text-sm font-semibold">{{ inv.invoiceDate | date:'mediumDate' }}</td>
                   <td class="text-end font-bold">{{ inv.totalAmount | currency }}</td>
                   <td class="text-end text-success font-bold">{{ inv.paidAmount | currency }}</td>
                   <td class="text-end text-danger font-black">{{ inv.balanceDue | currency }}</td>
                   <td>
                      <span class="status-badge" [ngClass]="'status-' + inv.status.toLowerCase().replace('lypaid','-partial')">
                         {{ inv.status | translate }}
                      </span>
                   </td>
                   <td class="text-end">
                      <div class="flex justify-end gap-1">
                         <button class="btn btn-icon btn-xs text-primary" (click)="downloadPdf(inv)" [title]="'DOWNLOAD_PDF' | translate">
                           <span class="material-icons-round">picture_as_pdf</span>
                         </button>
                         <button class="btn btn-icon btn-xs text-success" *ngIf="inv.balanceDue > 0" (click)="openPaymentForm(inv)" [title]="'RECORD_PAYMENT' | translate">
                           <span class="material-icons-round">payments</span>
                         </button>
                         <button class="btn btn-icon btn-xs text-danger" (click)="deleteInvoice(inv)">
                           <span class="material-icons-round">delete_outline</span>
                         </button>
                      </div>
                   </td>
                </tr>
                <tr *ngIf="!invoices.length"><td colspan="8" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-10 mb-2">receipt_long</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
             </tbody>
          </table>
       </div>
    </div>

    <!-- NEW INVOICE MODAL -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
       <div class="modal modal-xl animate-in" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <h3 class="modal-title font-black">{{ 'CREATE_NEW_INVOICE' | translate }}</h3>
             <button (click)="showForm=false" class="btn-close">×</button>
          </div>
          <div class="modal-body">
             <div class="grid grid-cols-3 gap-6 mb-8 p-6 bg-glass border rounded-3xl">
                <div class="form-group">
                   <label class="form-label font-bold uppercase text-xs">{{ 'INVOICE_TYPE' | translate }}*</label>
                   <select class="form-control h-12" [(ngModel)]="form.invoiceType">
                      <option value="Patient">{{ 'PATIENT_BILLING' | translate }}</option>
                      <option value="Customer">{{ 'GENERAL_SALES' | translate }}</option>
                   </select>
                </div>
                <div class="form-group">
                   <label class="form-label font-bold uppercase text-xs">{{ 'SELECT_CLIENT' | translate }}*</label>
                   <select *ngIf="form.invoiceType === 'Patient'" class="form-control h-12" [(ngModel)]="form.patientId">
                      <option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
                   </select>
                   <select *ngIf="form.invoiceType === 'Customer'" class="form-control h-12" [(ngModel)]="form.customerId">
                      <option *ngFor="let c of customersList" [value]="c.id">{{ c.customerName }}</option>
                   </select>
                </div>
                <div class="form-group">
                   <label class="form-label font-bold uppercase text-xs">{{ 'INVOICE_DATE' | translate }}</label>
                   <input class="form-control h-12" type="date" [(ngModel)]="form.invoiceDate">
                </div>
             </div>

             <div class="mb-6 flex justify-between items-center">
                <h4 class="font-black text-lg flex items-center gap-2"><span class="material-icons-round text-primary">list_alt</span> {{ 'BILLING_ITEMS' | translate }}</h4>
                <button class="btn btn-secondary btn-sm font-bold" (click)="addItem()">+ {{ 'ADD_LINE_ITEM' | translate }}</button>
             </div>

             <div class="table-container border rounded-2xl mb-8">
                <table class="table table-sm">
                   <thead class="bg-glass">
                      <tr>
                         <th style="width:240px">{{ 'ITEM_SERVICE' | translate }}</th>
                         <th>{{ 'DESCRIPTION' | translate }}</th>
                         <th style="width:80px">{{ 'QTY' | translate }}</th>
                         <th style="width:120px">{{ 'UNIT_PRICE' | translate }}</th>
                         <th style="width:80px">{{ 'TAX' | translate }}%</th>
                         <th style="width:100px">{{ 'DISCOUNT' | translate }}</th>
                         <th style="width:120px" class="text-end">{{ 'TOTAL' | translate }}</th>
                         <th style="width:50px"></th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr *ngFor="let item of form.items; let i = index" class="animate-in">
                         <td>
                            <select class="form-control form-control-sm" [(ngModel)]="item.itemId" (change)="onItemChange(item)">
                               <option [ngValue]="null">[{{ 'CUSTOM_ITEM' | translate }}]</option>
                               <option *ngFor="let invItem of itemsList" [value]="invItem.id">{{ invItem.itemName }}</option>
                            </select>
                         </td>
                         <td><input class="form-control form-control-sm" [(ngModel)]="item.description"></td>
                         <td><input class="form-control form-control-sm font-bold text-center" type="number" [(ngModel)]="item.quantity" (ngModelChange)="calculateFormTotals()"></td>
                         <td><input class="form-control form-control-sm font-bold" type="number" [(ngModel)]="item.unitPrice" (ngModelChange)="calculateFormTotals()"></td>
                         <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.taxRate" (ngModelChange)="calculateFormTotals()"></td>
                         <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.discount" (ngModelChange)="calculateFormTotals()"></td>
                         <td class="text-end font-black text-primary">{{ ((item.quantity * item.unitPrice) - item.discount) * (1 + item.taxRate/100) | currency }}</td>
                         <td><button class="btn btn-icon btn-xs text-danger" (click)="removeItem(i)"><span class="material-icons-round">delete_outline</span></button></td>
                      </tr>
                   </tbody>
                </table>
             </div>

             <div class="grid grid-cols-2 gap-10">
                <div class="form-group">
                   <label class="form-label font-bold uppercase text-xs">{{ 'REMARKS_NOTES' | translate }}</label>
                   <textarea class="form-control" [(ngModel)]="form.notes" rows="6" placeholder="Payment instructions, clinical notes ref..."></textarea>
                </div>
                <div class="pricing-summary">
                   <div class="pricing-row"><span>{{ 'SUBTOTAL' | translate }}</span><span>{{ calculation.subTotal | currency }}</span></div>
                   <div class="pricing-row text-danger"><span>{{ 'TOTAL_DISCOUNTS' | translate }}</span><span>-{{ calculation.discountTotal | currency }}</span></div>
                   <div class="pricing-row text-info"><span>{{ 'ESTIMATED_TAXES' | translate }}</span><span>+{{ calculation.taxTotal | currency }}</span></div>
                   <div class="pricing-total font-black flex justify-between">
                      <span class="uppercase tracking-widest">{{ 'GRAND_TOTAL' | translate }}</span>
                      <span>{{ calculation.grandTotal | currency }}</span>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer">
             <button class="btn btn-secondary px-8 rounded-xl" (click)="showForm=false">{{ 'CANCEL' | translate }}</button>
             <button class="btn btn-primary px-10 rounded-xl shadow-primary font-black" (click)="save()" [disabled]="saving || !isValid()">
                <span class="material-icons-round mr-2">check_circle</span> {{ 'FINALIZE_INVOICE' | translate }}
             </button>
          </div>
       </div>
    </div>

    <!-- PAYMENT MODAL -->
    <div class="modal-overlay" *ngIf="showPaymentForm" (click)="showPaymentForm=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:450px">
          <div class="modal-header border-0 pb-0">
             <h3 class="modal-title font-black">{{ 'RECEIVE_PAYMENT' | translate }}</h3>
             <button (click)="showPaymentForm=false" class="btn-close">×</button>
          </div>
          <div class="modal-body">
             <div class="p-6 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-3xl mb-6 text-center">
                <div class="text-xs font-bold text-success uppercase tracking-widest mb-1">{{ 'DUE_FOR_SETTLEMENT' | translate }}</div>
                <div class="text-3xl font-black text-success">{{ paymentForm.maxAmount | currency }}</div>
             </div>

             <div class="form-group mb-4">
                <label class="form-label font-bold text-xs uppercase">{{ 'PAYMENT_AMOUNT' | translate }}*</label>
                <input class="form-control text-2xl font-black h-16 text-center text-success" type="number" [(ngModel)]="paymentForm.amount">
             </div>

             <div class="form-group mb-4">
                <label class="form-label font-bold text-xs uppercase">{{ 'PAYMENT_METHOD' | translate }}*</label>
                <select class="form-control font-bold" [(ngModel)]="paymentForm.paymentMethod">
                   <option value="Cash">{{ 'CASH' | translate }}</option>
                   <option value="Credit Card">{{ 'CREDIT_CARD' | translate }}</option>
                   <option value="Bank Transfer">{{ 'BANK_TRANSFER' | translate }}</option>
                </select>
             </div>

             <div class="form-group">
                <label class="form-label font-bold text-xs uppercase">{{ 'REFERENCE_CODE' | translate }}</label>
                <input class="form-control" [(ngModel)]="paymentForm.referenceNumber" placeholder="TXN-XXXXXX">
             </div>
          </div>
          <div class="modal-footer flex-col border-0 pt-0">
             <button class="btn btn-success w-full h-14 shadow-success font-black text-lg rounded-2xl" (click)="savePayment()" [disabled]="savingPayment || paymentForm.amount <= 0">
                {{ 'CONFIRM_PAYMENT' | translate }}
             </button>
          </div>
       </div>
    </div>
  `
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  typeFilter = '';
  page = 1;
  totalPages = 1;
  showForm = false;
  saving = false;
  form: any = {};
  showPaymentForm = false;
  savingPayment = false;
  paymentForm: any = {};

  patientsList: any[] = [];
  customersList: any[] = [];
  itemsList: any[] = [];
  calculation = { subTotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 };

  constructor(
    private svc: InvoiceService,
    private patientSvc: PatientService,
    private salesSvc: SalesService,
    private inventorySvc: InventoryService,
    private toast: ToastService,
    private translate: TranslateService,
    private exportSvc: ExportService
  ) { }

  ngOnInit() { this.loadData(); this.loadLookups(); }

  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }, this.statusFilter, this.typeFilter).subscribe({
      next: r => { this.invoices = r.items; this.totalPages = r.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadLookups() {
    this.patientSvc.getAll({ pageSize: 500 }).subscribe(r => this.patientsList = r.items);
    this.salesSvc.getCustomers({ pageSize: 500 }).subscribe(r => this.customersList = r.items);
    this.inventorySvc.getItems({ pageSize: 500 }).subscribe(r => this.itemsList = r.items);
  }

  openForm() {
    this.form = {
      invoiceType: 'Patient', invoiceDate: new Date().toISOString().split('T')[0], dueDate: '',
      patientId: null, customerId: null, items: [], notes: ''
    };
    this.addItem();
    this.calculateFormTotals();
    this.showForm = true;
  }

  addItem() {
    this.form.items.push({ itemId: null, description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 });
  }

  removeItem(i: number) {
    this.form.items.splice(i, 1);
    this.calculateFormTotals();
  }

  onItemChange(itemRef: any) {
    if (itemRef.itemId) {
      const found = this.itemsList.find(x => x.id === itemRef.itemId);
      if (found) {
        itemRef.description = found.itemName;
        itemRef.unitPrice = found.salePrice;
        itemRef.taxRate = found.taxRate;
        this.calculateFormTotals();
      }
    }
  }

  calculateFormTotals() {
    let sub = 0; let tax = 0; let disc = 0;
    this.form.items.forEach((i: any) => {
      const lineGross = (i.quantity || 0) * (i.unitPrice || 0);
      const lineDisc = i.discount || 0;
      const lineNet = lineGross - lineDisc;
      const lineTax = lineNet * ((i.taxRate || 0) / 100);
      sub += lineGross;
      disc += lineDisc;
      tax += lineTax;
    });
    this.calculation = {
      subTotal: sub,
      discountTotal: disc,
      taxTotal: tax,
      grandTotal: sub - disc + tax
    };
  }

  isValid() {
    if (this.form.invoiceType === 'Patient' && !this.form.patientId) return false;
    if (this.form.invoiceType === 'Customer' && !this.form.customerId) return false;
    if (!this.form.invoiceDate || this.form.items.length === 0) return false;
    return true;
  }

  save() {
    if (!this.isValid()) return;
    this.saving = true;
    const data = {
      ...this.form,
      taxAmount: this.calculation.taxTotal,
      discountAmount: this.calculation.discountTotal
    };

    this.svc.create(data).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showForm = false;
        this.saving = false;
        this.loadData();
      },
      error: () => { this.toast.error(this.translate.instant('ERROR_OCCURRED')); this.saving = false; }
    });
  }

  deleteInvoice(inv: any) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.svc.delete(inv.id).subscribe({
        next: () => { this.toast.success(this.translate.instant('SUCCESS_DELETE')); this.loadData(); },
        error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
    }
  }

  openPaymentForm(inv: any) {
    this.paymentForm = {
      invoiceId: inv.id,
      patientId: inv.patientId,
      amount: inv.balanceDue,
      maxAmount: inv.balanceDue,
      paymentMethod: 'Cash',
      referenceNumber: ''
    };
    this.showPaymentForm = true;
  }

  savePayment() {
    this.savingPayment = true;
    this.svc.recordPayment(this.paymentForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showPaymentForm = false;
        this.savingPayment = false;
        this.loadData();
      },
      error: () => { this.toast.error(this.translate.instant('ERROR_OCCURRED')); this.savingPayment = false; }
    });
  }

  downloadPdf(inv: any) {
    this.svc.downloadPdf(inv.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${inv.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  exportCsv() {
    this.exportSvc.toCSV(this.invoices, 'invoices', [
      { key: 'invoiceNumber', header: 'Invoice #' },
      { key: 'patientName', header: 'Patient' },
      { key: 'customerName', header: 'Customer' },
      { key: 'invoiceType', header: 'Type' },
      { key: 'invoiceDate', header: 'Date' },
      { key: 'totalAmount', header: 'Total' },
      { key: 'paidAmount', header: 'Paid' },
      { key: 'balanceDue', header: 'Balance' },
      { key: 'status', header: 'Status' }
    ]);
  }
}
