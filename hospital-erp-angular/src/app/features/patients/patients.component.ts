import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService, InvoiceService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'PATIENTS' | translate }}</h1>
      </div>
      <div class="flex gap-2">
        <button class="btn" [class.btn-primary]="tab==='patients'" [class.btn-secondary]="tab!=='patients'" (click)="tab='patients'">{{ 'PATIENTS' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='invoices'" [class.btn-secondary]="tab!=='invoices'" (click)="tab='invoices';loadInvoices()">Patient Invoices (Billing)</button>
      </div>
    </div>

    <!-- Patients Tab -->
    <div *ngIf="tab==='patients'">
      <div class="filter-bar mb-4">
        <div class="search-bar">
          <span class="material-icons-round search-icon">search</span>
          <input class="form-control" [placeholder]="'SEARCH' | translate"
                 [(ngModel)]="search" (input)="loadData()">
        </div>
        <button class="btn btn-primary" (click)="openForm()">
          <span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}
        </button>
      </div>

      <div class="card" style="padding:0;">
        <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
        <div class="table-container" *ngIf="!loading">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'PATIENT_CODE' | translate }}</th>
                <th>{{ 'PATIENT_NAME' | translate }}</th>
                <th>{{ 'PHONE' | translate }}</th>
                <th>{{ 'GENDER' | translate }}</th>
                <th>{{ 'DATE_OF_BIRTH' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th>{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of patients">
                <td><span class="badge badge-primary">{{ p.patientCode }}</span></td>
                <td class="font-semibold">{{ p.fullName }}</td>
                <td>{{ p.phoneNumber || '—' }}</td>
                <td>{{ p.gender }}</td>
                <td>{{ p.dateOfBirth | date:'mediumDate' }}</td>
                <td><span class="badge" [ngClass]="p.isActive ? 'badge-success' : 'badge-secondary'">{{ (p.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}</span></td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-sm btn-secondary" (click)="openForm(p)"><span class="material-icons-round" style="font-size:16px">edit</span></button>
                    <button class="btn btn-sm btn-danger" (click)="deletePatient(p)"><span class="material-icons-round" style="font-size:16px">delete</span></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="patients.length === 0">
                <td colspan="7">
                  <div class="empty-state"><span class="material-icons-round empty-icon">personal_injury</span><span class="empty-title">{{ 'NO_DATA' | translate }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" *ngIf="totalPages > 1">
          <span class="pagination-info">Page {{ page }} of {{ totalPages }}</span>
          <div class="pagination-buttons">
            <button class="page-btn" (click)="page = page - 1; loadData()" [disabled]="page <= 1"><span class="material-icons-round">chevron_left</span></button>
            <button class="page-btn" (click)="page = page + 1; loadData()" [disabled]="page >= totalPages"><span class="material-icons-round">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoices Tab -->
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
        <button class="btn btn-primary btn-sm" (click)="openInvoiceForm()"><span class="material-icons-round">add</span> New Bill</button>
      </div>
      <div class="card" style="padding:0">
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Invoice #</th><th>Patient</th><th>Date</th><th>Due Date</th><th>Total</th><th>Paid</th><th>Remaining</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody><tr *ngFor="let i of invoices">
              <td><span class="badge badge-info">{{ i.invoiceNumber }}</span></td>
              <td class="font-semibold">{{ i.patientName }}</td>
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
          </table>
        </div>
      </div>
    </div>

    <!-- Patient Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm = false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ editing ? ('EDIT' | translate) : ('ADD_NEW' | translate) }} {{ 'PATIENTS' | translate }}</h3>
          <button class="btn btn-sm btn-secondary" (click)="showForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">{{ 'FULL_NAME' | translate }} *</label><input class="form-control" [(ngModel)]="form.fullName" required></div>
            <div class="form-group"><label class="form-label">{{ 'PHONE' | translate }}</label><input class="form-control" [(ngModel)]="form.phoneNumber"></div>
          </div>
          <div class="form-row mt-4">
            <div class="form-group"><label class="form-label">{{ 'EMAIL' | translate }}</label><input class="form-control" [(ngModel)]="form.email" type="email"></div>
            <div class="form-group"><label class="form-label">National ID</label><input class="form-control" [(ngModel)]="form.nationalId"></div>
          </div>
          <div class="form-row mt-4">
            <div class="form-group"><label class="form-label">{{ 'DATE_OF_BIRTH' | translate }}</label><input class="form-control" [(ngModel)]="form.dateOfBirth" type="date"></div>
            <div class="form-group"><label class="form-label">{{ 'GENDER' | translate }}</label>
              <select class="form-control" [(ngModel)]="form.gender"><option value="Male">{{ 'MALE' | translate }}</option><option value="Female">{{ 'FEMALE' | translate }}</option></select>
            </div>
          </div>
          <div class="form-row mt-4">
            <div class="form-group"><label class="form-label">{{ 'BLOOD_TYPE' | translate }}</label>
              <select class="form-control" [(ngModel)]="form.bloodType"><option value="">—</option><option *ngFor="let bt of bloodTypes" [value]="bt">{{ bt }}</option></select>
            </div>
            <div class="form-group"><label class="form-label">{{ 'EMERGENCY_CONTACT' | translate }}</label><input class="form-control" [(ngModel)]="form.emergencyContact"></div>
          </div>
          <div class="form-group mt-4"><label class="form-label">{{ 'ALLERGIES' | translate }}</label><textarea class="form-control" [(ngModel)]="form.allergies" rows="2"></textarea></div>
          <div class="form-group mt-4"><label class="form-label">{{ 'MEDICAL_HISTORY' | translate }}</label><textarea class="form-control" [(ngModel)]="form.medicalHistory" rows="2"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving">
            <span class="spinner spinner-sm" *ngIf="saving"></span>
            {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <div class="modal-overlay" *ngIf="showInvoiceForm" (click)="showInvoiceForm=false"><div class="modal modal-lg" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h3>New Patient Bill</h3>
        <button class="btn btn-sm btn-secondary" (click)="showInvoiceForm=false"><span class="material-icons-round">close</span></button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Patient *</label>
            <select class="form-control" [(ngModel)]="invoiceForm.patientId">
              <option [ngValue]="null">— Select Patient —</option>
              <option *ngFor="let p of patients" [ngValue]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Invoice Date</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.invoiceDate"></div>
          <div class="form-group"><label class="form-label">Due Date</label><input class="form-control" type="date" [(ngModel)]="invoiceForm.dueDate"></div>
        </div>
        <div class="form-group mt-4"><label class="form-label">Notes</label><input class="form-control" [(ngModel)]="invoiceForm.notes" placeholder="Optional notes..."></div>

        <div class="divider"></div>
        <div class="flex justify-between items-center mb-4">
          <h4>Bill Items / Services</h4>
          <button class="btn btn-sm btn-secondary" (click)="addLine()"><span class="material-icons-round" style="font-size:16px">add</span> Add Item</button>
        </div>
        <div class="inv-lines">
          <div *ngFor="let line of invoiceForm.items; let i = index" class="inv-line">
            <div class="form-group" style="flex:2">
              <label class="form-label" *ngIf="i===0">Description</label>
              <input class="form-control" [(ngModel)]="line.description" placeholder="Consultation, X-Ray, etc.">
            </div>
            <div class="form-group" style="flex:0.8">
              <label class="form-label" *ngIf="i===0">Qty</label>
              <input class="form-control" type="number" [(ngModel)]="line.quantity" (input)="calcLine(line)" min="1">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label" *ngIf="i===0">Amount</label>
              <input class="form-control" type="number" [(ngModel)]="line.unitPrice" (input)="calcLine(line)">
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

        <div class="inv-summary">
          <div class="summary-row"><span>Sub Total:</span><span>{{ getSubTotal() | currency }}</span></div>
          <div class="summary-row"><span>Tax Amount:</span>
            <input type="number" class="form-control" style="width:120px;text-align:end" [(ngModel)]="invoiceForm.taxAmount">
          </div>
          <div class="summary-row"><span>Global Discount:</span>
            <input type="number" class="form-control" style="width:120px;text-align:end" [(ngModel)]="invoiceForm.discountAmount">
          </div>
          <div class="summary-row total"><span>Total:</span><span>{{ getTotal() | currency }}</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" (click)="showInvoiceForm=false">{{ 'CANCEL' | translate }}</button>
        <button class="btn btn-primary" (click)="saveInvoice()" [disabled]="saving">
          <span *ngIf="saving" class="spinner spinner-sm"></span>
          <span *ngIf="!saving"><span class="material-icons-round" style="font-size:16px">save</span> Save Bill</span>
        </button>
      </div>
    </div></div>

    <!-- Payment Modal -->
    <div class="modal-overlay" *ngIf="showPayModal" (click)="showPayModal=false"><div class="modal" style="max-width:420px" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>Record Payment</h3><button class="btn btn-sm btn-secondary" (click)="showPayModal=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="pay-info-card">
          <div class="pay-row"><span class="text-muted">Invoice</span><span class="font-semibold">{{ selectedInvoice?.invoiceNumber }}</span></div>
          <div class="pay-row"><span class="text-muted">Patient</span><span>{{ selectedInvoice?.patientName }}</span></div>
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
    .summary-row span:first-child { color: var(--text-secondary); min-width: 100px; text-align: end; }
    .summary-row.total { font-size: 1.1rem; font-weight: 700; color: var(--primary-light); border-top: 1px solid var(--border); padding-top: 8px; margin-top: 4px; }
    .pay-info-card { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .pay-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
  `]
})
export class PatientsComponent implements OnInit {
  tab = 'patients';
  patients: any[] = [];
  invoices: any[] = [];
  loading = true;
  search = '';
  invoiceFilter = '';
  page = 1;
  totalPages = 1;
  showForm = false;
  showInvoiceForm = false;
  showPayModal = false;
  editing: any = null;
  saving = false;
  form: any = {};
  invoiceForm: any = this.freshInvoiceForm();
  selectedInvoice: any = null;
  payAmount = 0;
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private svc: PatientService,
    private invSvc: InvoiceService,
    private toast: ToastService
  ) { }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({
      next: (r) => { this.patients = r.items; this.totalPages = r.totalPages; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadInvoices() {
    this.invSvc.getAll({}, this.invoiceFilter || undefined, 'Hospital').subscribe({
      next: r => this.invoices = r.items
    });
  }

  freshInvoiceForm() {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    return { patientId: null, invoiceDate: today, dueDate: due, notes: '', discountAmount: 0, taxAmount: 0, invoiceType: 'Hospital', items: [this.freshLine()] };
  }

  freshLine() { return { description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, _total: 0 }; }

  openForm(patient?: any) {
    this.editing = patient || null;
    this.form = patient ? { ...patient, dateOfBirth: patient.dateOfBirth?.split('T')[0] } : { gender: 'Male', dateOfBirth: '' };
    this.showForm = true;
  }

  openInvoiceForm() {
    if (this.patients.length === 0) this.loadData();
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

  calcLine(line: any) {
    const qty = +line.quantity || 0;
    const price = +line.unitPrice || 0;
    const disc = +line.discount || 0;
    line._total = qty * price - disc;
  }

  getSubTotal(): number { return this.invoiceForm.items.reduce((s: number, l: any) => s + (+l.quantity * +l.unitPrice - +l.discount), 0); }
  getTotal(): number { return this.getSubTotal() + (+this.invoiceForm.taxAmount || 0) - (+this.invoiceForm.discountAmount || 0); }

  save() {
    if (!this.form.fullName) return;
    this.saving = true;
    const obs = this.editing
      ? this.svc.update(this.editing.id, this.form)
      : this.svc.create(this.form);
    obs.subscribe({
      next: () => { this.toast.success('Saved successfully'); this.showForm = false; this.saving = false; this.loadData(); },
      error: () => { this.toast.error('Error saving'); this.saving = false; }
    });
  }

  saveInvoice() {
    if (!this.invoiceForm.patientId) { this.toast.error('Please select a patient'); return; }
    if (!this.invoiceForm.items.some((l: any) => l.description)) { this.toast.error('Add at least one item description'); return; }
    this.saving = true;
    const payload = {
      ...this.invoiceForm,
      taxAmount: +this.invoiceForm.taxAmount,
      discountAmount: +this.invoiceForm.discountAmount,
      items: this.invoiceForm.items.filter((l: any) => l.description).map((l: any) => ({
        description: l.description, quantity: +l.quantity,
        unitPrice: +l.unitPrice, taxRate: +l.taxRate, discount: +l.discount
      }))
    };
    this.invSvc.create(payload).subscribe({
      next: () => { this.toast.success('Bill created'); this.showInvoiceForm = false; this.saving = false; this.tab = 'invoices'; this.loadInvoices(); },
      error: (e: any) => { this.toast.error(e.error?.message || 'Error creating bill'); this.saving = false; }
    });
  }

  confirmPay() {
    if (!this.payAmount || this.payAmount <= 0) { this.toast.error('Enter a valid amount'); return; }
    this.invSvc.recordPayment({ invoiceId: this.selectedInvoice.id, patientId: this.selectedInvoice.patientId, amount: this.payAmount, paymentMethod: 'Cash' }).subscribe({
      next: () => { this.toast.success('Payment recorded'); this.showPayModal = false; this.loadInvoices(); },
      error: () => this.toast.error('Payment failed')
    });
  }

  deletePatient(p: any) {
    if (confirm('Delete patient?')) {
      this.svc.delete(p.id).subscribe({ next: () => { this.toast.success('Deleted'); this.loadData(); } });
    }
  }
}
