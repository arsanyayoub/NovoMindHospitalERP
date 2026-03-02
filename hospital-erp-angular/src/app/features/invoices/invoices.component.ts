import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceService, PatientService, SalesService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'INVOICES' | translate }}</h1></div>
      <button class="btn btn-primary" (click)="openForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
    </div>
    
    <div class="filter-bar mb-4">
      <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadData()"></div>
      <select class="form-control" style="width:auto;" [(ngModel)]="statusFilter" (change)="loadData()">
        <option value="">All Status</option>
        <option value="Draft">Draft</option>
        <option value="Unpaid">Unpaid</option>
        <option value="PartiallyPaid">Partially Paid</option>
        <option value="Paid">Paid</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <select class="form-control" style="width:auto;" [(ngModel)]="typeFilter" (change)="loadData()">
        <option value="">All Types</option>
        <option value="Patient">Patient</option>
        <option value="Customer">Customer</option>
      </select>
    </div>
    
    <div class="card" style="padding:0;">
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'INVOICE_NUM' | translate }}</th>
              <th>Client</th>
              <th>Type</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>{{ 'STATUS' | translate }}</th>
              <th>{{ 'ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invoices">
              <td><span class="badge badge-info">{{ inv.invoiceNumber }}</span></td>
              <td class="font-semibold">{{ inv.patientName || inv.customerName }}</td>
              <td>{{ inv.invoiceType }}</td>
              <td>{{ inv.invoiceDate | date:'mediumDate' }}</td>
              <td>{{ inv.totalAmount | currency }}</td>
              <td class="text-success">{{ inv.paidAmount | currency }}</td>
              <td class="text-danger">{{ inv.balanceDue | currency }}</td>
              <td><span class="badge" [ngClass]="getStatusClass(inv.status)">{{ inv.status | translate }}</span></td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-sm btn-primary" *ngIf="inv.balanceDue > 0" (click)="openPaymentForm(inv)" title="Record Payment">
                    <span class="material-icons-round" style="font-size:16px">payments</span>
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="deleteInvoice(inv)">
                    <span class="material-icons-round" style="font-size:16px">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="invoices.length === 0"><td colspan="9"><div class="empty-state"><span class="material-icons-round empty-icon">receipt_long</span><span class="empty-title">{{ 'NO_DATA' | translate }}</span></div></td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" *ngIf="totalPages > 1"><span class="pagination-info">Page {{ page }} of {{ totalPages }}</span><div class="pagination-buttons"><button class="page-btn" (click)="page=page-1;loadData()" [disabled]="page<=1"><span class="material-icons-round">chevron_left</span></button><button class="page-btn" (click)="page=page+1;loadData()" [disabled]="page>=totalPages"><span class="material-icons-round">chevron_right</span></button></div></div>
    </div>

    <!-- Invoice Form Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal modal-xl" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ 'ADD_NEW_INVOICE' | translate }}</h3>
          <button class="btn btn-sm btn-secondary" (click)="showForm=false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Type *</label>
              <select class="form-control" [(ngModel)]="form.invoiceType" (change)="form.patientId=null; form.customerId=null;">
                <option value="Patient">Patient</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            <div class="form-group" *ngIf="form.invoiceType === 'Patient'">
              <label class="form-label">{{ 'PATIENT' | translate }} *</label>
              <select class="form-control" [(ngModel)]="form.patientId">
                <option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
              </select>
            </div>
            <div class="form-group" *ngIf="form.invoiceType === 'Customer'">
              <label class="form-label">{{ 'CUSTOMER' | translate }} *</label>
              <select class="form-control" [(ngModel)]="form.customerId">
                <option *ngFor="let c of customersList" [value]="c.id">{{ c.customerName }}</option>
              </select>
            </div>
          </div>
          <div class="form-row mt-4">
            <div class="form-group"><label class="form-label">Date *</label><input class="form-control" type="date" [(ngModel)]="form.invoiceDate"></div>
            <div class="form-group"><label class="form-label">Due Date</label><input class="form-control" type="date" [(ngModel)]="form.dueDate"></div>
          </div>
          
          <div class="mt-4">
            <h4 class="font-semibold mb-2">Items</h4>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th style="width:100px">Qty</th>
                    <th style="width:120px">Price</th>
                    <th style="width:100px">Tax (%)</th>
                    <th style="width:100px">Disc</th>
                    <th style="width:120px">Total</th>
                    <th style="width:50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of form.items; let i = index">
                    <td>
                      <select class="form-control form-control-sm" [(ngModel)]="item.itemId" (change)="onItemChange(item)">
                        <option [ngValue]="null">Custom Item</option>
                        <option *ngFor="let invItem of itemsList" [value]="invItem.id">{{ invItem.itemName }}</option>
                      </select>
                    </td>
                    <td><input class="form-control form-control-sm" [(ngModel)]="item.description"></td>
                    <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.quantity" (ngModelChange)="calculateFormTotals()"></td>
                    <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.unitPrice" (ngModelChange)="calculateFormTotals()"></td>
                    <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.taxRate" (ngModelChange)="calculateFormTotals()"></td>
                    <td><input class="form-control form-control-sm" type="number" [(ngModel)]="item.discount" (ngModelChange)="calculateFormTotals()"></td>
                    <td class="font-semibold">{{ ((item.quantity * item.unitPrice) - item.discount) * (1 + item.taxRate/100) | currency }}</td>
                    <td>
                      <button class="btn-icon text-danger" (click)="removeItem(i)"><span class="material-icons-round" style="font-size:18px">close</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-sm btn-secondary mt-2" (click)="addItem()">+ Add Item</button>
            </div>
          </div>
          
          <div class="flex mt-4" style="justify-content: flex-end;">
             <div style="width: 300px;">
                <div class="flex mb-2" style="justify-content: space-between;"><span>Subtotal:</span><span class="font-semibold">{{ calculation.subTotal | currency }}</span></div>
                <div class="flex mb-2" style="justify-content: space-between;"><span>Total Tax:</span><span class="font-semibold">{{ calculation.taxTotal | currency }}</span></div>
                <div class="flex mb-2" style="justify-content: space-between;"><span>Total Discount:</span><span class="font-semibold text-danger">-{{ calculation.discountTotal | currency }}</span></div>
                <div class="flex mb-2 border-t pt-2 mt-2" style="justify-content: space-between;"><span class="font-semibold text-lg">Total Amount:</span><span class="font-semibold text-lg text-primary">{{ calculation.grandTotal | currency }}</span></div>
             </div>
          </div>

          <div class="form-group mt-4"><label class="form-label">{{ 'NOTES' | translate }}</label><textarea class="form-control" [(ngModel)]="form.notes" rows="2"></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" (click)="showForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="save()" [disabled]="saving || !isValid()"><span class="spinner spinner-sm" *ngIf="saving"></span> {{ 'SAVE' | translate }}</button></div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal-overlay" *ngIf="showPaymentForm" (click)="showPaymentForm=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Record Payment</h3>
          <button class="btn btn-sm btn-secondary" (click)="showPaymentForm=false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
             <div class="text-sm text-muted">Invoice Balance Due</div>
             <div class="text-2xl font-semibold text-danger">{{ paymentForm.maxAmount | currency }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Payment Amount *</label>
            <input class="form-control" type="number" [(ngModel)]="paymentForm.amount" max="{{ paymentForm.maxAmount }}">
          </div>
          <div class="form-group mt-4">
            <label class="form-label">Payment Method *</label>
            <select class="form-control" [(ngModel)]="paymentForm.paymentMethod">
               <option value="Cash">Cash</option>
               <option value="Credit Card">Credit Card</option>
               <option value="Bank Transfer">Bank Transfer</option>
               <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div class="form-group mt-4">
             <label class="form-label">Reference Number</label>
             <input class="form-control" [(ngModel)]="paymentForm.referenceNumber">
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" (click)="showPaymentForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-success" (click)="savePayment()" [disabled]="savingPayment || paymentForm.amount <= 0 || paymentForm.amount > paymentForm.maxAmount"><span class="spinner spinner-sm" *ngIf="savingPayment"></span> Record Payment</button></div>
      </div>
    </div>
  `
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = []; loading = true; search = ''; statusFilter = ''; typeFilter = '';
  page = 1; totalPages = 1; showForm = false; saving = false;
  form: any = {};
  showPaymentForm = false; savingPayment = false; paymentForm: any = {};

  patientsList: any[] = []; customersList: any[] = []; itemsList: any[] = [];
  calculation = { subTotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 };

  constructor(
    private svc: InvoiceService,
    private patientSvc: PatientService,
    private salesSvc: SalesService,
    private inventorySvc: InventoryService,
    private toast: ToastService
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
      const lineGross = i.quantity * i.unitPrice;
      const lineDisc = i.discount || 0;
      const lineNet = lineGross - lineDisc;
      const lineTax = lineNet * (i.taxRate / 100);
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
        this.toast.success('Invoice created');
        this.showForm = false;
        this.saving = false;
        this.loadData();
      },
      error: () => { this.toast.error('Error creating invoice'); this.saving = false; }
    });
  }

  deleteInvoice(inv: any) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.svc.delete(inv.id).subscribe({
        next: () => { this.toast.success('Deleted successfully'); this.loadData(); },
        error: () => this.toast.error('Could not delete invoice')
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
        this.toast.success('Payment recorded');
        this.showPaymentForm = false;
        this.savingPayment = false;
        this.loadData();
      },
      error: () => { this.toast.error('Error recording payment'); this.savingPayment = false; }
    });
  }

  getStatusClass(s: string): string {
    switch (s) {
      case 'Draft': return 'badge-secondary';
      case 'Unpaid': return 'badge-warning';
      case 'PartiallyPaid': return 'badge-info';
      case 'Paid': return 'badge-success';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}
