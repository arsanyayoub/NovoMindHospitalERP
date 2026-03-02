import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SalesService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'SALES' | translate }}</h1></div>
      <div class="flex gap-2">
        <button class="btn" [class.btn-primary]="tab==='customers'" [class.btn-secondary]="tab!=='customers'" (click)="tab='customers'">{{ 'CUSTOMERS' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='invoices'" [class.btn-secondary]="tab!=='invoices'" (click)="tab='invoices';loadInvoices()">{{ 'SALES_INVOICES' | translate }}</button>
      </div>
    </div>

    <!-- Customers Tab -->
    <div *ngIf="tab==='customers'">
      <div class="flex justify-between items-center mb-4">
        <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadCustomers()"></div>
        <button class="btn btn-primary btn-sm" (click)="openCustomerForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
      </div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Code</th><th>Name</th><th>Contact</th><th>Phone</th><th>Balance</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let c of customers">
          <td><span class="badge badge-primary">{{ c.customerCode }}</span></td>
          <td class="font-semibold">{{ c.customerName }}</td>
          <td>{{ c.contactPerson }}</td>
          <td>{{ c.phoneNumber }}</td>
          <td [class.text-danger]="c.balance>0" [class.text-success]="c.balance<=0">{{ c.balance | currency }}</td>
          <td><button class="btn btn-sm btn-secondary" (click)="editCust(c)"><span class="material-icons-round" style="font-size:16px">edit</span></button></td>
        </tr></tbody>
      </table></div></div>
    </div>

    <!-- Sales Invoices Tab -->
    <div *ngIf="tab==='invoices'">
      <div class="flex justify-between items-center mb-4">
        <div class="filter-bar">
          <select class="form-control" style="min-width:160px" [(ngModel)]="invoiceFilter" (change)="loadInvoices()">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="PartiallyPaid">Partially Paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <button class="btn btn-primary btn-sm" (click)="openInvoiceForm()"><span class="material-icons-round">add</span> New Invoice</button>
      </div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Invoice #</th><th>Customer</th><th>Date</th><th>Due Date</th><th>Total</th><th>Paid</th><th>Remaining</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let i of invoices">
          <td><span class="badge badge-info">{{ i.invoiceNumber }}</span></td>
          <td class="font-semibold">{{ i.customerName }}</td>
          <td>{{ i.invoiceDate | date:'mediumDate' }}</td>
          <td>{{ i.dueDate | date:'mediumDate' }}</td>
          <td>{{ i.totalAmount | currency }}</td>
          <td class="text-success">{{ i.paidAmount | currency }}</td>
          <td [class.text-danger]="(i.totalAmount - i.paidAmount)>0">{{ (i.totalAmount - i.paidAmount) | currency }}</td>
          <td><span class="badge" [ngClass]="i.status==='Paid'?'badge-success':i.status==='PartiallyPaid'?'badge-warning':'badge-danger'">{{ i.status }}</span></td>
          <td>
            <button *ngIf="i.status!=='Paid'" class="btn btn-sm btn-success" (click)="openPayModal(i)"><span class="material-icons-round" style="font-size:16px">payments</span> Pay</button>
          </td>
        </tr></tbody>
      </table></div></div>
    </div>

    <!-- Customer Modal -->
    <div class="modal-overlay" *ngIf="showCustForm" (click)="showCustForm=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>{{ custForm.id ? 'Edit' : 'New' }} Customer</h3><button class="btn btn-sm btn-secondary" (click)="showCustForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">Name *</label><input class="form-control" [(ngModel)]="custForm.customerName"></div><div class="form-group"><label class="form-label">Contact Person</label><input class="form-control" [(ngModel)]="custForm.contactPerson"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Phone</label><input class="form-control" [(ngModel)]="custForm.phoneNumber"></div><div class="form-group"><label class="form-label">Email</label><input class="form-control" [(ngModel)]="custForm.email"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Address</label><input class="form-control" [(ngModel)]="custForm.address"></div><div class="form-group"><label class="form-label">Tax Number</label><input class="form-control" [(ngModel)]="custForm.taxNumber"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showCustForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveCust()">{{ 'SAVE' | translate }}</button></div>
    </div></div>

    <!-- Create Invoice Modal -->
    <div class="modal-overlay" *ngIf="showInvoiceForm" (click)="showInvoiceForm=false"><div class="modal modal-lg" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3>New Sales Invoice</h3>
        <button class="btn btn-sm btn-secondary" (click)="showInvoiceForm=false"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Customer *</label>
            <select class="form-control" [(ngModel)]="invoiceForm.customerId">
              <option [ngValue]="null">— Select Customer —</option>
              <option *ngFor="let c of customers" [ngValue]="c.id">{{ c.customerName }}</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Invoice Date</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.invoiceDate"></div>
          <div class="form-group"><label class="form-label">Due Date</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.dueDate"></div>
        </div>
        <div class="form-group mt-4"><label class="form-label">Notes</label><input class="form-control" [(ngModel)]="invoiceForm.notes" placeholder="Optional notes..."></div>

        <!-- Line Items -->
        <div class="divider"></div>
        <div class="flex justify-between items-center mb-4">
          <h4>Invoice Lines</h4>
          <button class="btn btn-sm btn-secondary" (click)="addLine()"><span class="material-icons-round" style="font-size:16px">add</span> Add Line</button>
        </div>
        <div class="inv-lines">
          <div *ngFor="let line of invoiceForm.items; let i = index" class="inv-line">
            <div class="form-group" style="flex:2">
              <label class="form-label" *ngIf="i===0">Item</label>
              <select class="form-control" [(ngModel)]="line.itemId" (change)="onItemSelect(line)">
                <option [ngValue]="null">— Select Item —</option>
                <option *ngFor="let it of inventoryItems" [ngValue]="it.id">{{ it.itemName }}</option>
              </select>
            </div>
            <div class="form-group" style="flex:1.5">
              <label class="form-label" *ngIf="i===0">Warehouse</label>
              <select class="form-control" [(ngModel)]="line.warehouseId">
                <option [ngValue]="null">— Warehouse —</option>
                <option *ngFor="let w of warehouses" [ngValue]="w.id">{{ w.warehouseName }}</option>
              </select>
            </div>
            <div class="form-group" style="flex:0.8">
              <label class="form-label" *ngIf="i===0">Qty</label>
              <input class="form-control" type="number" [(ngModel)]="line.quantity" (input)="calcLine(line)" min="1">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label" *ngIf="i===0">Unit Price</label>
              <input class="form-control" type="number" [(ngModel)]="line.unitPrice" (input)="calcLine(line)">
            </div>
            <div class="form-group" style="flex:0.8">
              <label class="form-label" *ngIf="i===0">Tax %</label>
              <input class="form-control" type="number" [(ngModel)]="line.taxRate" (input)="calcLine(line)">
            </div>
            <div class="form-group" style="flex:0.8">
              <label class="form-label" *ngIf="i===0">Discount</label>
              <input class="form-control" type="number" [(ngModel)]="line.discount" (input)="calcLine(line)">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label" *ngIf="i===0">Total</label>
              <div class="form-control" style="background:rgba(255,255,255,0.03);color:var(--success);font-weight:700">{{ line._total | currency }}</div>
            </div>
            <div style="display:flex; align-items:flex-end; padding-bottom:2px">
              <button class="btn btn-sm btn-danger" (click)="removeLine(i)"><span class="material-icons-round" style="font-size:16px">delete</span></button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="inv-summary">
          <div class="summary-row"><span>Sub Total:</span><span>{{ getSubTotal() | currency }}</span></div>
          <div class="summary-row"><span>Tax:</span><span>{{ getTax() | currency }}</span></div>
          <div class="summary-row"><span>Discount:</span>
            <input type="number" class="form-control" style="width:120px;text-align:end" [(ngModel)]="invoiceForm.discountAmount">
          </div>
          <div class="summary-row total"><span>Total:</span><span>{{ getTotal() | currency }}</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" (click)="showInvoiceForm=false">{{ 'CANCEL' | translate }}</button>
        <button class="btn btn-primary" (click)="saveInvoice()" [disabled]="saving">
          <span *ngIf="saving" class="spinner spinner-sm"></span>
          <span *ngIf="!saving"><span class="material-icons-round" style="font-size:16px">save</span> Save Invoice</span>
        </button>
      </div>
    </div></div>

    <!-- Payment Modal -->
    <div class="modal-overlay" *ngIf="showPayModal" (click)="showPayModal=false"><div class="modal" style="max-width:420px" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>Record Payment</h3><button class="btn btn-sm btn-secondary" (click)="showPayModal=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="pay-info-card">
          <div class="pay-row"><span class="text-muted">Invoice</span><span class="font-semibold">{{ selectedInvoice?.invoiceNumber }}</span></div>
          <div class="pay-row"><span class="text-muted">Customer</span><span>{{ selectedInvoice?.customerName }}</span></div>
          <div class="pay-row"><span class="text-muted">Total Amount</span><span>{{ selectedInvoice?.totalAmount | currency }}</span></div>
          <div class="pay-row"><span class="text-muted">Paid So Far</span><span class="text-success">{{ selectedInvoice?.paidAmount | currency }}</span></div>
          <div class="pay-row"><span class="text-muted">Remaining</span><span class="text-danger font-semibold">{{ (selectedInvoice?.totalAmount - selectedInvoice?.paidAmount) | currency }}</span></div>
        </div>
        <div class="form-group mt-4">
          <label class="form-label">Payment Amount *</label>
          <input class="form-control" type="number" [(ngModel)]="payAmount" [max]="selectedInvoice?.totalAmount - selectedInvoice?.paidAmount" min="0.01" placeholder="Enter amount...">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" (click)="showPayModal=false">{{ 'CANCEL' | translate }}</button>
        <button class="btn btn-success" (click)="confirmPay()"><span class="material-icons-round" style="font-size:16px">payments</span> Confirm Payment</button>
      </div>
    </div></div>
  `,
  styles: [`
    .inv-lines { display: flex; flex-direction: column; gap: 8px; }
    .inv-line { display: flex; gap: 8px; align-items: flex-start; }
    .inv-line .form-group { margin: 0; }
    .inv-summary { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .summary-row { display: flex; align-items: center; gap: 16px; font-size: 0.9rem; }
    .summary-row span:first-child { color: var(--text-secondary); min-width: 80px; text-align: end; }
    .summary-row.total { font-size: 1.1rem; font-weight: 700; color: var(--primary-light); border-top: 1px solid var(--border); padding-top: 8px; margin-top: 4px; }
    .pay-info-card { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .pay-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
  `]
})
export class SalesComponent implements OnInit {
  tab = 'customers';
  customers: any[] = [];
  invoices: any[] = [];
  inventoryItems: any[] = [];
  warehouses: any[] = [];
  search = '';
  invoiceFilter = '';
  showCustForm = false;
  showInvoiceForm = false;
  showPayModal = false;
  saving = false;
  custForm: any = {};
  invoiceForm: any = this.freshInvoiceForm();
  selectedInvoice: any = null;
  payAmount = 0;

  constructor(
    private svc: SalesService,
    private invSvc: InventoryService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.invSvc.getItems({}).subscribe(r => this.inventoryItems = r.items);
    this.invSvc.getWarehouses().subscribe(w => this.warehouses = w);
  }

  freshInvoiceForm() {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    return { customerId: null, invoiceDate: today, dueDate: due, notes: '', discountAmount: 0, items: [this.freshLine()] };
  }

  freshLine() { return { itemId: null, warehouseId: null, quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, _total: 0 }; }

  openCustomerForm() { this.custForm = {}; this.showCustForm = true; }
  editCust(c: any) { this.custForm = { ...c }; this.showCustForm = true; }
  openInvoiceForm() { this.invoiceForm = this.freshInvoiceForm(); this.showInvoiceForm = true; }

  openPayModal(inv: any) {
    this.selectedInvoice = inv;
    this.payAmount = +(inv.totalAmount - inv.paidAmount).toFixed(2);
    this.showPayModal = true;
  }

  addLine() { this.invoiceForm.items.push(this.freshLine()); }
  removeLine(i: number) { if (this.invoiceForm.items.length > 1) this.invoiceForm.items.splice(i, 1); }

  onItemSelect(line: any) {
    const item = this.inventoryItems.find(it => it.id === line.itemId);
    if (item) {
      line.unitPrice = item.salePrice || 0;
      line.taxRate = item.taxRate || 0;
      this.calcLine(line);
    }
  }

  calcLine(line: any) {
    const qty = +line.quantity || 0;
    const price = +line.unitPrice || 0;
    const tax = +line.taxRate || 0;
    const disc = +line.discount || 0;
    line._total = qty * price - disc + (qty * price * tax / 100);
  }

  getSubTotal(): number { return this.invoiceForm.items.reduce((s: number, l: any) => s + (+l.quantity * +l.unitPrice - +l.discount), 0); }
  getTax(): number { return this.invoiceForm.items.reduce((s: number, l: any) => s + (+l.quantity * +l.unitPrice * +l.taxRate / 100), 0); }
  getTotal(): number { return this.getSubTotal() + this.getTax() - (+this.invoiceForm.discountAmount || 0); }

  loadCustomers() { this.svc.getCustomers({ search: this.search }).subscribe(r => this.customers = r.items); }
  loadInvoices() { this.svc.getSalesInvoices({}, this.invoiceFilter || undefined).subscribe(r => this.invoices = r.items); }

  saveCust() {
    const obs = this.custForm.id ? this.svc.updateCustomer(this.custForm.id, this.custForm) : this.svc.createCustomer(this.custForm);
    obs.subscribe({ next: () => { this.toast.success('Saved'); this.showCustForm = false; this.loadCustomers(); }, error: () => this.toast.error('Error') });
  }

  saveInvoice() {
    if (!this.invoiceForm.customerId) { this.toast.error('Please select a customer'); return; }
    if (!this.invoiceForm.items.some((l: any) => l.itemId)) { this.toast.error('Add at least one item'); return; }
    this.saving = true;
    const payload = {
      ...this.invoiceForm,
      items: this.invoiceForm.items.filter((l: any) => l.itemId).map((l: any) => ({
        itemId: l.itemId, warehouseId: l.warehouseId, quantity: +l.quantity,
        unitPrice: +l.unitPrice, taxRate: +l.taxRate, discount: +l.discount
      }))
    };
    this.svc.createSalesInvoice(payload).subscribe({
      next: () => { this.toast.success('Invoice created'); this.showInvoiceForm = false; this.saving = false; this.tab = 'invoices'; this.loadInvoices(); },
      error: (e: any) => { this.toast.error(e.error?.message || 'Error creating invoice'); this.saving = false; }
    });
  }

  confirmPay() {
    if (!this.payAmount || this.payAmount <= 0) { this.toast.error('Enter a valid amount'); return; }
    this.svc.paySalesInvoice(this.selectedInvoice.id, this.payAmount).subscribe({
      next: () => { this.toast.success('Payment recorded'); this.showPayModal = false; this.loadInvoices(); },
      error: () => this.toast.error('Payment failed')
    });
  }
}
