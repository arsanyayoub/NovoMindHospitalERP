import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PatientService, InvoiceService, AppointmentService, InsuranceService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
   selector: 'app-patients',
   standalone: true,
   imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
   styles: [`
    .patient-tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); }
    .patient-tab-btn { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .patient-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }

    .patient-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .patient-card { background: rgba(var(--card-bg-rgb), 0.4); border: 1px solid var(--border); border-radius: 24px; padding: 20px; transition: 0.3s; position: relative; overflow: hidden; }
    .patient-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(var(--card-bg-rgb), 0.6); box-shadow: var(--shadow-lg); }
    .patient-avatar { width: 56px; height: 56px; border-radius: 18px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; text-transform: uppercase; }

    .history-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 600px; background: var(--bg-card); border-left: 1px solid var(--border); z-index: 1000; box-shadow: -10px 0 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; }
    .drawer-header { padding: 30px; border-bottom: 1px solid var(--border); background: var(--bg-page); }
    .drawer-nav { display: flex; overflow-x: auto; padding: 0 20px; gap: 4px; background: rgba(0,0,0,0.1); border-bottom: 1px solid var(--border); }
    .drawer-nav-item { padding: 16px 20px; border: none; background: none; color: var(--text-muted); font-weight: 700; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.2s; white-space: nowrap; font-size: 0.8rem; }
    .drawer-nav-item.active { color: var(--primary); border-bottom-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

    .vitals-pill { background: rgba(var(--primary-rgb), 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; }
    .vitals-val { font-weight: 800; font-size: 1.1rem; color: var(--primary); }
    .vitals-unit { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; }
  `],
   template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'PATIENT_MANAGEMENT' | translate }}</h1>
        <p class="page-subtitle">{{ 'PATIENT_MODULE_DESC' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <div class="search-bar h-12" style="width:300px">
           <span class="material-icons-round search-icon">search</span>
           <input class="form-control rounded-xl border-0 bg-transparent" [placeholder]="'SEARCH_BY_NAME_ID' | translate" [(ngModel)]="search" (input)="page=1;loadData()">
        </div>
        <button class="btn btn-primary px-6 rounded-xl shadow-primary font-black" (click)="openForm()">
          <span class="material-icons-round mr-1">person_add</span> {{ 'ADD_NEW_PATIENT' | translate }}
        </button>
      </div>
    </div>

    <div class="patient-tab-nav animate-in">
       <button class="patient-tab-btn" [class.active]="tab==='patients'" (click)="tab='patients';loadData()">
          <span class="material-icons-round">groups</span> {{ 'PATIENTS' | translate }}
       </button>
       <button class="patient-tab-btn" [class.active]="tab==='invoices'" (click)="tab='invoices';loadInvoices()">
          <span class="material-icons-round">receipt_long</span> {{ 'BILLING_CENTER' | translate }}
       </button>
    </div>

    <!-- PATIENT LIST CARDS -->
    <div *ngIf="tab==='patients'" class="animate-in">
       <div class="patient-grid">
          <div *ngFor="let p of patients" class="patient-card animate-in">
             <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4">
                   <div class="patient-avatar shadow-primary">{{ (p.fullName || 'P')[0] }}</div>
                   <div>
                      <div class="font-black text-xl tracking-tighter">{{ p.fullName }}</div>
                      <div class="text-[0.65rem] font-black uppercase text-primary tracking-widest">{{ p.patientCode }}</div>
                   </div>
                </div>
                 <div class="flex gap-1">
                    <button class="btn btn-icon btn-xs text-muted" [routerLink]="['/patients', p.id]"><span class="material-icons-round">history</span></button>
                    <button class="btn btn-icon btn-xs text-primary" (click)="openForm(p)"><span class="material-icons-round">edit</span></button>
                 </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                 <div class="bg-glass p-3 rounded-2xl border cursor-pointer" [routerLink]="['/patients', p.id]">
                    <div class="text-[0.55rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'GENDER' | translate }}</div>
                    <div class="font-bold flex items-center gap-1 text-sm"><span class="material-icons-round text-xs">{{ p.gender === 'Male' ? 'male' : 'female' }}</span> {{ p.gender | translate }}</div>
                 </div>
                 <div class="bg-glass p-3 rounded-2xl border">
                    <div class="text-[0.55rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'CONTACT' | translate }}</div>
                    <div class="font-bold text-sm truncate">{{ p.phoneNumber || 'N/A' }}</div>
                 </div>
              </div>

              <div class="flex items-center justify-between border-top pt-4">
                 <div class="text-[0.6rem] font-black uppercase text-muted">{{ 'REGISTERED' | translate }}: {{ p.createdDate | date:'mediumDate' }}</div>
                 <button class="btn btn-secondary btn-sm px-4 rounded-lg font-black text-[0.7rem]" [routerLink]="['/patients', p.id]">{{ 'VIEW_FULL_PROFILE' | translate }}</button>
              </div>
          </div>
       </div>

       <div *ngIf="!loading && !patients.length" class="p-20 text-center card bg-glass">
          <span class="material-icons-round text-6xl opacity-20 mb-4">person_search</span>
          <h3 class="font-black uppercase tracking-widest">{{ 'NO_PATIENTS_FOUND' | translate }}</h3>
       </div>

       <!-- Pagination -->
       <div class="flex items-center justify-between mt-10" *ngIf="totalPages > 1">
          <div class="text-xs font-black uppercase text-muted tracking-widest">{{ 'PAGE'|translate }} {{ page }} / {{ totalPages }}</div>
          <div class="flex gap-2">
             <button class="btn btn-secondary h-11 w-11 rounded-xl" [disabled]="page <= 1" (click)="page=page-1;loadData()"><span class="material-icons-round">arrow_back</span></button>
             <button class="btn btn-secondary h-11 w-11 rounded-xl" [disabled]="page >= totalPages" (click)="page=page+1;loadData()"><span class="material-icons-round">arrow_forward</span></button>
          </div>
       </div>
    </div>

    <!-- BILLING CENTER -->
    <div *ngIf="tab==='invoices'" class="animate-in">
       <div class="card p-0 overflow-hidden shadow-2xl">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'INV' | translate }} #</th>
                      <th>{{ 'PATIENT_NAME' | translate }}</th>
                      <th class="text-end">{{ 'BILLED_AMOUNT' | translate }}</th>
                      <th class="text-end">{{ 'PAID' | translate }}</th>
                      <th class="text-center">{{ 'STATUS' | translate }}</th>
                      <th class="text-end">{{ 'ACTIONS' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let i of invoices" class="hover-row">
                      <td><span class="badge badge-info font-mono">{{ i.invoiceNumber }}</span></td>
                      <td>
                         <div class="font-bold">{{ i.patientName }}</div>
                         <div class="text-[0.6rem] text-muted">{{ i.invoiceDate | date:'medium' }}</div>
                      </td>
                      <td class="text-end font-black text-lg">{{ i.totalAmount | currency }}</td>
                      <td class="text-end font-black text-success">{{ i.paidAmount | currency }}</td>
                      <td class="text-center">
                         <span class="badge uppercase text-[0.6rem] font-black tracking-widest" [ngClass]="i.status==='Paid'?'badge-success':i.status==='PartiallyPaid'?'badge-warning':'badge-danger'">
                            {{ i.status | translate }}
                         </span>
                      </td>
                      <td class="text-end">
                         <div class="flex justify-end gap-1">
                            <button *ngIf="i.status!=='Paid'" class="btn btn-icon btn-xs text-success" (click)="openPayModal(i)" [title]="'PAY' | translate"><span class="material-icons-round">payments</span></button>
                            <button class="btn btn-icon btn-xs text-primary"><span class="material-icons-round">print</span></button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>


    <!-- PATIENT FORM MODAL -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
       <div class="modal modal-lg animate-in" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <h3 class="modal-title font-black uppercase tracking-tighter">{{ (editing ? 'EDIT_PATIENT_IDENTITY' : 'NEW_PATIENT_ONBOARDING') | translate }}</h3>
             <button (click)="showForm=false" class="btn-close">×</button>
          </div>
          <div class="modal-body p-8">
             <div class="grid grid-cols-2 gap-8">
                <div class="form-group col-span-2"><label class="form-label font-black text-xs uppercase">{{ 'FULL_NAME_LEGAL'|translate }}*</label><input class="form-control h-14 rounded-2xl text-lg font-bold" [(ngModel)]="form.fullName"></div>
                <div class="form-group"><label class="form-label font-black text-xs uppercase">{{ 'MOBILE_NUMBER'|translate }}</label><input class="form-control h-12 rounded-xl" [(ngModel)]="form.phoneNumber"></div>
                <div class="form-group"><label class="form-label font-black text-xs uppercase">{{ 'EMAIL_ADDRESS'|translate }}</label><input class="form-control h-12 rounded-xl" [(ngModel)]="form.email"></div>
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'BIRTH_DATE'|translate }}</label>
                   <input class="form-control h-12 rounded-xl" type="date" [(ngModel)]="form.dateOfBirth">
                </div>
                <div class="form-group">
                   <label class="form-label font-black text-xs uppercase">{{ 'GENDER'|translate }}</label>
                   <select class="form-control h-12 rounded-xl" [(ngModel)]="form.gender">
                      <option value="Male">{{ 'MALE' | translate }}</option>
                      <option value="Female">{{ 'FEMALE' | translate }}</option>
                   </select>
                </div>
                <div class="form-group col-span-2"><label class="form-label font-black text-xs uppercase">{{ 'RELEVANT_MEDICAL_HISTORY'|translate }}</label><textarea class="form-control rounded-2xl p-4" rows="3" [(ngModel)]="form.medicalHistory"></textarea></div>
                
                <div class="form-group col-span-2 mt-4 pt-4 border-top">
                   <h4 class="font-black text-xs uppercase tracking-widest text-primary mb-4">{{ 'INSURANCE_DETAILS' | translate }}</h4>
                   <div class="grid grid-cols-2 gap-4">
                      <div class="form-group">
                         <label class="form-label font-black text-[0.6rem] uppercase">{{ 'INSURANCE_PROVIDER' | translate }}</label>
                         <select class="form-control h-12 rounded-xl" [(ngModel)]="form.insuranceProviderId" (change)="loadPlans()">
                            <option [ngValue]="null">-- {{ 'NO_INSURANCE' | translate }} --</option>
                            <option *ngFor="let p of providers" [value]="p.id">{{ p.name }}</option>
                         </select>
                      </div>
                      <div class="form-group">
                         <label class="form-label font-black text-[0.6rem] uppercase">{{ 'INSURANCE_PLAN' | translate }}</label>
                         <select class="form-control h-12 rounded-xl" [(ngModel)]="form.insurancePlanId" [disabled]="!form.insuranceProviderId">
                            <option [ngValue]="null">-- {{ 'SELECT_PLAN' | translate }} --</option>
                            <option *ngFor="let pl of plans" [value]="pl.id">{{ pl.planName }} ({{ pl.coveragePercentage }}%)</option>
                         </select>
                      </div>
                      <div class="form-group">
                         <label class="form-label font-black text-[0.6rem] uppercase">{{ 'POLICY_NUMBER' | translate }}</label>
                         <input class="form-control h-12 rounded-xl" [(ngModel)]="form.insurancePolicyNumber">
                      </div>
                      <div class="form-group">
                         <label class="form-label font-black text-[0.6rem] uppercase">{{ 'MANUAL_PROVIDER_NAME' | translate }}</label>
                         <input class="form-control h-12 rounded-xl" [(ngModel)]="form.insuranceProviderNameManual" [disabled]="!!form.insuranceProviderId" placeholder="If not in list...">
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer bg-glass">
             <button class="btn btn-secondary px-8 rounded-xl font-bold" (click)="showForm=false">{{ 'CANCEL'|translate }}</button>
             <button class="btn btn-primary px-12 rounded-xl font-black shadow-primary h-12" (click)="save()">{{ 'PERSIST_PATIENT_RECORD'|translate }}</button>
          </div>
       </div>
    </div>

    <!-- PAYMENT MODAL -->
    <div class="modal-overlay" *ngIf="showPayModal" (click)="showPayModal=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:400px">
          <div class="modal-body p-10 text-center">
             <div class="w-20 h-20 rounded-full bg-success bg-opacity-10 text-success mx-auto flex items-center justify-center mb-6 shadow-inner shadow-success"><span class="material-icons-round text-4xl">payments</span></div>
             <h3 class="font-black text-2xl tracking-tighter mb-2 uppercase">{{ 'PROCESS_PAYMENT' | translate }}</h3>
             <p class="text-xs font-black uppercase tracking-widest text-muted mb-8">{{ selectedInvoice?.invoiceNumber }} &bull; {{ selectedInvoice?.patientName }}</p>
             
             <div class="form-group mb-12">
                <label class="form-label font-black text-[0.6rem] uppercase tracking-widest text-success">{{ 'INPUT_AMOUNT' | translate }}</label>
                <input class="form-control text-4xl font-black text-center border-0 bg-transparent h-20 text-success" type="number" [(ngModel)]="payAmount">
                <div class="text-[0.6rem] font-black uppercase text-danger mt-2">{{ 'OUTSTANDING'|translate }}: {{ (selectedInvoice?.totalAmount - selectedInvoice?.paidAmount) | currency }}</div>
             </div>

             <button class="btn btn-success w-full h-16 rounded-2xl shadow-lg shadow-success text-lg font-black uppercase tracking-widest" (click)="confirmPay()">{{ 'POST_PAYMENT'|translate }}</button>
             <button class="btn btn-text mt-4 font-bold opacity-40 hover:opacity-100 uppercase text-xs tracking-widest" (click)="showPayModal=false">{{ 'ABORT'|translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
   tab = 'patients';
   patients: any[] = [];
   invoices: any[] = [];
   loading = true;
   search = '';
   page = 1;
   totalPages = 1;
   showForm = false;
   showPayModal = false;
   editing: any = null;
   form: any = {};
   selectedInvoice: any = null;
   payAmount = 0;
   providers: any[] = [];
   plans: any[] = [];

   constructor(
      private svc: PatientService,
      private invSvc: InvoiceService,
      private insSvc: InsuranceService,
      private translate: TranslateService,
      private toast: ToastService
   ) { }

   ngOnInit() {
      this.loadData();
      this.insSvc.getProviders().subscribe(res => this.providers = res);
   }

   loadData() {
      this.loading = true;
      this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({
         next: (r) => { this.patients = r.items; this.totalPages = r.totalPages; this.loading = false; },
         error: () => { this.loading = false; }
      });
   }

   loadInvoices() {
      this.invSvc.getAll({}, 'Pending', 'Hospital').subscribe({
         next: r => this.invoices = r.items
      });
   }

   openForm(patient?: any) {
      this.editing = patient || null;
      this.form = patient ? { ...patient, dateOfBirth: patient.dateOfBirth?.split('T')[0] } : { gender: 'Male', isActive: true, insuranceProviderId: null, insurancePlanId: null };
      if (this.form.insuranceProviderId) this.loadPlans();
      this.showForm = true;
   }

   loadPlans() {
      if (!this.form.insuranceProviderId) {
         this.plans = [];
         return;
      }
      this.insSvc.getPlans(this.form.insuranceProviderId).subscribe(res => this.plans = res);
   }

   openPayModal(inv: any) {
      this.selectedInvoice = inv;
      this.payAmount = +(inv.totalAmount - inv.paidAmount).toFixed(2);
      this.showPayModal = true;
   }

   save() {
      if (!this.form.fullName) return;
      const obs = this.editing ? this.svc.update(this.editing.id, this.form) : this.svc.create(this.form);
      obs.subscribe({
         next: () => {
            this.toast.success(this.translate.instant('SUCCESS_SAVE'));
            this.showForm = false;
            this.loadData();
         },
         error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
   }

   confirmPay() {
      this.invSvc.recordPayment({ invoiceId: this.selectedInvoice.id, patientId: this.selectedInvoice.patientId, amount: this.payAmount, paymentMethod: 'Cash' }).subscribe({
         next: () => {
            this.toast.success(this.translate.instant('SUCCESS_PAYMENT'));
            this.showPayModal = false;
            this.loadInvoices();
         },
         error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
   }
}
