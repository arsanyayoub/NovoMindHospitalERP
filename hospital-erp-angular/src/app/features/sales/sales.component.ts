import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SalesService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .tab-bar { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 0; }
    .tab-item { padding: 12px 24px; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text-muted); font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
    .tab-item:hover { color: var(--text-primary); }
    .tab-item.active { border-color: var(--primary); color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }
    
    .invoice-row { transition: var(--transition); border-left: 3px solid transparent; }
    .invoice-row:hover { background: rgba(var(--primary-rgb), 0.02); }
    .invoice-row.pending { border-left-color: var(--danger); }
    .invoice-row.partially-paid { border-left-color: var(--warning); }
    .invoice-row.paid { border-left-color: var(--success); }
    
    .expand-content { background: rgba(var(--card-bg-rgb), 0.3); padding: 20px; border-radius: 0 0 12px 12px; margin: 0 10px 10px; border: 1px solid var(--border); border-top: none; }
    .inv-line { display: grid; grid-template-columns: 2fr 1.5fr 0.8fr 1fr 0.8fr 0.8fr 1.2fr 0.4fr; gap: 8px; align-items: end; padding: 12px 0; border-bottom: 1px dashed var(--border); }
    .inv-line:last-child { border-bottom: none; }
    
    .summary-box { background: rgba(var(--primary-rgb), 0.05); border-radius: 16px; padding: 20px; border: 1px solid rgba(var(--primary-rgb), 0.1); margin-top: 20px; width: 100%; max-width: 350px; margin-left: auto; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
    .summary-row.total { font-size: 1.25rem; font-weight: bold; color: var(--primary); border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; }
    
    .pay-card { background: rgba(var(--card-bg-rgb), 0.5); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'SALES' | translate }}</h1>
        <p class="page-subtitle">{{ 'SALES_INVOICES' | translate }}</p>
      </div>
      <div class="flex gap-2">
        <button *ngIf="tab==='customers'" class="btn btn-primary" (click)="openCustomerForm()">
           <span class="material-icons-round">person_add</span> {{ 'ADD_NEW' | translate }}
        </button>
        <button *ngIf="tab==='invoices'" class="btn btn-primary" (click)="openInvoiceForm()">
           <span class="material-icons-round">add_shopping_cart</span> {{ 'NEW_SALES_INVOICE' | translate }}
        </button>
      </div>
    </div>

    <div class="tab-bar">
      <div class="tab-item" [class.active]="tab==='customers'" (click)="tab='customers';loadCustomers()">
        <span class="material-icons-round" style="font-size:18px">people</span> {{ 'CUSTOMERS' | translate }}
      </div>
      <div class="tab-item" [class.active]="tab==='invoices'" (click)="tab='invoices';loadInvoices()">
        <span class="material-icons-round" style="font-size:18px">receipt</span> {{ 'SALES_INVOICES' | translate }}
      </div>
    </div>

    <!-- Customers Tab -->
    <div *ngIf="tab==='customers'" class="animate-in">
      <div class="card p-0 overflow-hidden">
        <div class="p-4 border-bottom flex justify-between items-center bg-glass">
          <div class="search-bar" style="max-width:300px">
            <span class="material-icons-round search-icon">search</span>
            <input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadCustomers()">
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'CODE' | translate }}</th>
                <th>{{ 'NAME' | translate }}</th>
                <th>{{ 'CONTACT_PERSON' | translate }}</th>
                <th>{{ 'PHONE' | translate }}</th>
                <th class="text-end">{{ 'BALANCE' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of customers" class="hover-row">
                <td><span class="badge badge-primary">{{ c.customerCode }}</span></td>
                <td class="font-bold">{{ c.customerName }}</td>
                <td>{{ c.contactPerson }}</td>
                <td>{{ c.phoneNumber }}</td>
                <td class="text-end font-bold" [class.text-danger]="c.balance > 0" [class.text-success]="c.balance <= 0">
                  {{ c.balance | currency }}
                </td>
                <td class="text-end">
                  <button class="btn btn-icon btn-xs text-primary" (click)="editCust(c)">
                    <span class="material-icons-round">edit</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!customers.length" class="p-12 text-center text-muted">{{ 'NO_DATA' | translate }}</div>
        </div>
      </div>
    </div>

    <!-- Sales Invoices Tab -->
    <div *ngIf="tab==='invoices'" class="animate-in">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-2">
           <div class="search-bar" style="min-width:300px">
              <span class="material-icons-round search-icon">search</span>
              <input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="iSearch" (input)="loadInvoices()">
           </div>
           <select class="form-control" style="width:180px" [(ngModel)]="invoiceFilter" (change)="loadInvoices()">
             <option value="">{{ 'ALL_STATUSES' | translate }}</option>
             <option value="Pending">{{ 'PENDING' | translate }}</option>
             <option value="PartiallyPaid">{{ 'PARTIALLY_PAID' | translate }}</option>
             <option value="Paid">{{ 'PAID' | translate }}</option>
           </select>
        </div>
      </div>

      <div class="card p-0 overflow-hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'INVOICE_NUMBER' | translate }}</th>
                <th>{{ 'CUSTOMER' | translate }}</th>
                <th>{{ 'DATE' | translate }}</th>
                <th>{{ 'DUE_DATE' | translate }}</th>
                <th class="text-end">{{ 'TOTAL' | translate }}</th>
                <th class="text-end">{{ 'PAID' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let i of invoices">
                <tr class="invoice-row hover-row" [ngClass]="i.status.toLowerCase().replace(' ', '-')">
                  <td><span class="badge badge-info">{{ i.invoiceNumber }}</span></td>
                  <td class="font-bold">{{ i.customerName }}</td>
                  <td>{{ i.invoiceDate | date:'mediumDate' }}</td>
                  <td>{{ i.dueDate | date:'mediumDate' }}</td>
                  <td class="text-end font-bold">{{ i.totalAmount | currency }}</td>
                  <td class="text-end text-success font-semibold">{{ i.paidAmount | currency }}</td>
                  <td>
                    <span class="badge" [ngClass]="i.status==='Paid'?'badge-success':i.status==='PartiallyPaid'?'badge-warning':'badge-danger'">
                      {{ i.status | translate }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="flex justify-end gap-1">
                       <button class="btn btn-icon btn-xs text-primary" (click)="toggleRow(i.id)">
                         <span class="material-icons-round">{{ expandedRows[i.id] ? 'expand_less' : 'expand_more' }}</span>
                       </button>
                       <button *ngIf="i.status!=='Paid'" class="btn btn-sm btn-success py-1" (click)="openPayModal(i)">
                         <span class="material-icons-round mr-1" style="font-size:16px">payments</span> {{ 'PAY' | translate }}
                       </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="expandedRows[i.id]">
                  <td colspan="8" class="p-0">
                    <div class="expand-content animate-in">
                       <h5 class="font-bold mb-3 flex items-center gap-2"><span class="material-icons-round text-primary">list</span> {{ 'INVOICE_LINES' | translate }}</h5>
                       <table class="table table-sm bg-glass rounded-lg">
                         <thead>
                           <tr>
                             <th>{{ 'ITEM' | translate }}</th>
                             <th>{{ 'WAREHOUSE' | translate }}</th>
                             <th class="text-center">{{ 'QUANTITY' | translate }}</th>
                             <th class="text-end">{{ 'UNIT_PRICE' | translate }}</th>
                             <th class="text-end">{{ 'TAX' | translate }}</th>
                             <th class="text-end">{{ 'DISCOUNT' | translate }}</th>
                             <th class="text-end">{{ 'TOTAL' | translate }}</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr *ngFor="let line of i.items">
                             <td>{{ line.itemName }}</td>
                             <td>{{ line.warehouseName }}</td>
                             <td class="text-center">{{ line.quantity }}</td>
                             <td class="text-end">{{ line.unitPrice | currency }}</td>
                             <td class="text-end text-xs text-muted">{{ line.taxRate }}%</td>
                             <td class="text-end text-xs text-muted">{{ line.discount | currency }}</td>
                             <td class="text-end font-bold">{{ line.total | currency }}</td>
                           </tr>
                         </tbody>
                       </table>
                    </div>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
          <div *ngIf="!invoices.length" class="p-12 text-center text-muted">{{ 'NO_DATA' | translate }}</div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <div class="modal-overlay" *ngIf="showCustForm" (click)="showCustForm=false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:600px">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ (custForm.id ? 'EDIT' : 'ADD_NEW') | translate }} {{ 'CUSTOMER' | translate }}</h3>
           <button (click)="showCustForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group col-span-2"><label class="form-label font-bold">{{ 'NAME' | translate }} *</label><input class="form-control" [(ngModel)]="custForm.customerName"></div>
            <div class="form-group"><label class="form-label">{{ 'CONTACT_PERSON' | translate }}</label><input class="form-control" [(ngModel)]="custForm.contactPerson"></div>
            <div class="form-group"><label class="form-label">{{ 'PHONE' | translate }}</label><input class="form-control" [(ngModel)]="custForm.phoneNumber"></div>
            <div class="form-group"><label class="form-label">{{ 'EMAIL' | translate }}</label><input class="form-control" [(ngModel)]="custForm.email"></div>
            <div class="form-group"><label class="form-label">{{ 'TAX_NUMBER' | translate }}</label><input class="form-control" [(ngModel)]="custForm.taxNumber"></div>
            <div class="form-group col-span-2"><label class="form-label">{{ 'ADDRESS' | translate }}</label><textarea class="form-control" rows="2" [(ngModel)]="custForm.address"></textarea></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showCustForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveCust()">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <div class="modal-overlay" *ngIf="showInvoiceForm" (click)="showInvoiceForm=false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:1100px">
        <div class="modal-header">
          <h3 class="modal-title font-bold">{{ 'NEW_SALES_INVOICE' | translate }}</h3>
          <button (click)="showInvoiceForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="bg-glass p-6 rounded-2xl border mb-6">
            <div class="grid grid-cols-3 gap-6">
              <div class="form-group">
                 <label class="form-label font-bold">{{ 'CUSTOMER' | translate }} *</label>
                 <select class="form-control" [(ngModel)]="invoiceForm.customerId">
                    <option [ngValue]="null">— Select Customer —</option>
                    <option *ngFor="let c of customers" [ngValue]="c.id">{{ c.customerName }}</option>
                 </select>
              </div>
              <div class="form-group"><label class="form-label font-bold">{{ 'DATE' | translate }}</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.invoiceDate"></div>
              <div class="form-group"><label class="form-label font-bold">{{ 'DUE_DATE' | translate }}</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.dueDate"></div>
              <div class="form-group col-span-3 mb-0"><label class="form-label">{{ 'NOTES' | translate }}</label><input class="form-control" [(ngModel)]="invoiceForm.notes" placeholder="Optional notes..."></div>
            </div>
          </div>

          <h4 class="font-bold mb-4 flex items-center justify-between">
             <span class="flex items-center gap-2"><span class="material-icons-round text-primary">shopping_basket</span> {{ 'INVOICE_LINES' | translate }}</span>
             <button class="btn btn-secondary btn-sm" (click)="addLine()">
                <span class="material-icons-round mr-1" style="font-size:18px">add_circle</span> {{ 'ADD_LINE' | translate }}
             </button>
          </h4>
          
          <div class="inv-lines max-h-96 overflow-y-auto pr-2">
            <div *ngFor="let line of invoiceForm.items; let i = index" class="inv-line animate-in">
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'ITEM' | translate }}</label>
                <select class="form-control" [(ngModel)]="line.itemId" (change)="onItemSelect(line)">
                  <option [ngValue]="null">— Select Item —</option>
                  <option *ngFor="let it of inventoryItems" [ngValue]="it.id">{{ it.itemName }}</option>
                </select>
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'WAREHOUSE' | translate }}</label>
                <select class="form-control" [(ngModel)]="line.warehouseId">
                  <option [ngValue]="null">— Warehouse —</option>
                  <option *ngFor="let w of warehouses" [ngValue]="w.id">{{ w.warehouseName }}</option>
                </select>
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'QTY' | translate }}</label>
                <input class="form-control text-center font-bold" type="number" [(ngModel)]="line.quantity" (input)="calcLine(line)" min="1">
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'PRICE' | translate }}</label>
                <input class="form-control text-end" type="number" [(ngModel)]="line.unitPrice" (input)="calcLine(line)">
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'TAX' | translate }}%</label>
                <input class="form-control text-center text-muted" type="number" [(ngModel)]="line.taxRate" (input)="calcLine(line)">
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'DISCOUNT' | translate }}</label>
                <input class="form-control text-end text-muted" type="number" [(ngModel)]="line.discount" (input)="calcLine(line)">
              </div>
              <div>
                <label *ngIf="i===0" class="text-xs text-muted uppercase font-bold mb-1 block">{{ 'TOTAL' | translate }}</label>
                <div class="form-control text-end bg-transparent border-0 font-bold p-0 pr-2 pt-2">{{ line._total | currency }}</div>
              </div>
              <div class="text-end">
                <button class="btn btn-icon btn-xs text-danger mb-1" (click)="removeLine(i)"><span class="material-icons-round">remove_circle_outline</span></button>
              </div>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-row"><span>{{ 'SUBTOTAL' | translate }}:</span><span class="font-bold">{{ getSubTotal() | currency }}</span></div>
            <div class="summary-row"><span>{{ 'TAX' | translate }}:</span><span class="font-bold">{{ getTax() | currency }}</span></div>
            <div class="summary-row items-center">
               <span>{{ 'DISCOUNT' | translate }}:</span>
               <input type="number" class="form-control text-end py-1" style="width:100px" [(ngModel)]="invoiceForm.discountAmount">
            </div>
            <div class="summary-row total"><span>{{ 'TOTAL' | translate }}:</span><span>{{ getTotal() | currency }}</span></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showInvoiceForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveInvoice()" [disabled]="saving || !invoiceForm.customerId">
            <span *ngIf="saving" class="spinner spinner-sm mr-2"></span>
            <span class="material-icons-round mr-1">save</span> {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal-overlay" *ngIf="showPayModal" (click)="showPayModal=false">
      <div class="modal" style="max-width:450px" (click)="$event.stopPropagation()">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ 'RECORD_PAYMENT' | translate }}</h3>
           <button (click)="showPayModal=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="pay-card">
            <div class="flex justify-between mb-4">
               <div>
                  <div class="text-xs text-muted uppercase font-bold">{{ 'INVOICE' | translate }}</div>
                  <div class="font-bold text-lg text-primary">{{ selectedInvoice?.invoiceNumber }}</div>
               </div>
               <div class="text-end">
                  <div class="text-xs text-muted uppercase font-bold">{{ 'CUSTOMER' | translate }}</div>
                  <div class="font-bold">{{ selectedInvoice?.customerName }}</div>
               </div>
            </div>
            <div class="grid grid-cols-2 gap-4 border-top pt-4">
               <div>
                  <div class="text-xs text-muted">{{ 'TOTAL' | translate }}</div>
                  <div class="font-bold">{{ selectedInvoice?.totalAmount | currency }}</div>
               </div>
               <div class="text-end">
                  <div class="text-xs text-muted">{{ 'REMAINING_AMOUNT' | translate }}</div>
                  <div class="font-bold text-danger text-lg">{{ (selectedInvoice?.totalAmount - selectedInvoice?.paidAmount) | currency }}</div>
               </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label font-bold uppercase text-xs">{{ 'PAYMENT_AMOUNT' | translate }} *</label>
            <input class="form-control text-2xl text-center font-bold" type="number" 
                   [(ngModel)]="payAmount" [max]="selectedInvoice?.totalAmount - selectedInvoice?.paidAmount" 
                   min="0" placeholder="0.00">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary w-full" (click)="showPayModal=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-success w-full" (click)="confirmPay()" [disabled]="payAmount <= 0">
             <span class="material-icons-round mr-1">payments</span> {{ 'CONFIRM_PAYMENT' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SalesComponent implements OnInit {
  tab = 'customers';
  customers: any[] = [];
  invoices: any[] = [];
  inventoryItems: any[] = [];
  warehouses: any[] = [];
  search = '';
  iSearch = ''; // Invoice search
  invoiceFilter = '';
  showCustForm = false;
  showInvoiceForm = false;
  showPayModal = false;
  saving = false;
  custForm: any = {};
  invoiceForm: any = this.freshInvoiceForm();
  selectedInvoice: any = null;
  payAmount = 0;
  expandedRows: { [key: number]: boolean } = {};

  constructor(
    private svc: SalesService,
    private invSvc: InventoryService,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.invSvc.getItems({ pageSize: 1000 }).subscribe(r => this.inventoryItems = r.items);
    this.invSvc.getWarehouses().subscribe(w => this.warehouses = w);
  }

  loadCustomers() { this.svc.getCustomers({ search: this.search }).subscribe(r => this.customers = r.items); }

  loadInvoices() {
    this.svc.getSalesInvoices({ search: this.iSearch }, this.invoiceFilter || undefined).subscribe(r => this.invoices = r.items);
  }

  freshInvoiceForm() {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    return { customerId: null, invoiceDate: today, dueDate: due, notes: '', discountAmount: 0, items: [this.freshLine()] };
  }

  freshLine() { return { itemId: null, warehouseId: null, quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, _total: 0 }; }

  openCustomerForm() { this.custForm = {}; this.showCustForm = true; }
  editCust(c: any) { this.custForm = { ...c }; this.showCustForm = true; }

  openInvoiceForm() {
    this.invoiceForm = this.freshInvoiceForm();
    this.showInvoiceForm = true;
  }

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

  saveCust() {
    const obs = this.custForm.id ? this.svc.updateCustomer(this.custForm.id, this.custForm) : this.svc.createCustomer(this.custForm);
    obs.subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showCustForm = false;
        this.loadCustomers();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
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
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SALES'));
        this.showInvoiceForm = false;
        this.saving = false;
        this.tab = 'invoices';
        this.loadInvoices();
      },
      error: (e: any) => {
        this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'));
        this.saving = false;
      }
    });
  }

  confirmPay() {
    if (!this.payAmount || this.payAmount <= 0) { this.toast.error('Enter a valid amount'); return; }
    this.svc.paySalesInvoice(this.selectedInvoice.id, this.payAmount).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_PAYMENT'));
        this.showPayModal = false;
        this.loadInvoices();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  toggleRow(id: number) {
    this.expandedRows[id] = !this.expandedRows[id];
  }
}
