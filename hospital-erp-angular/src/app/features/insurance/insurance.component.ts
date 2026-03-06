import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InsuranceService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-insurance',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'INSURANCE_TPA_MANAGEMENT' | translate }}</h1>
        <p class="page-subtitle text-primary">{{ 'MANAGE_INSURANCE_CONTRACTS_CLAIMS' | translate }}</p>
      </div>
      <div class="flex gap-2">
         <button class="btn btn-primary btn-icon-text" (click)="openProviderForm()">
            <span class="material-icons-round">add_business</span>
            {{ 'ADD_PROVIDER' | translate }}
         </button>
      </div>
    </div>

    <div class="card p-0 mb-6 overflow-hidden">
      <div class="flex border-bottom bg-glass">
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'providers'"
                [class.text-primary]="activeTab === 'providers'"
                [class.border-transparent]="activeTab !== 'providers'"
                (click)="activeTab = 'providers'">
          <span class="flex items-center justify-center gap-2">
            <span class="material-icons-round">corporate_fare</span>
            {{ 'PROVIDERS_PLANS' | translate }}
          </span>
        </button>
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'claims'"
                [class.text-primary]="activeTab === 'claims'"
                [class.border-transparent]="activeTab !== 'claims'"
                (click)="activeTab = 'claims'">
          <span class="flex items-center justify-center gap-2">
            <span class="material-icons-round">assignment_turned_in</span>
            {{ 'CLAIMS_TRACKING' | translate }}
          </span>
        </button>
      </div>

      <div class="p-4" *ngIf="activeTab === 'providers'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let p of providers" class="card p-4 hover-scale border-primary border-opacity-10">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-2xl bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                <span class="material-icons-round text-3xl">business</span>
              </div>
              <div class="flex gap-1">
                <button class="btn btn-xs btn-secondary btn-icon" (click)="editProvider(p)"><span class="material-icons-round">edit</span></button>
                <button class="btn btn-xs btn-primary btn-icon" (click)="openPlanForm(p.id)"><span class="material-icons-round">add</span></button>
              </div>
            </div>
            <h3 class="font-black text-lg mb-1">{{ p.name }}</h3>
            <div class="text-xs font-bold text-muted mb-4 flex items-center gap-1">
              <span class="material-icons-round text-sm">contact_phone</span> {{ p.phoneNumber || 'N/A' }}
            </div>
            
            <div class="space-y-2">
              <div *ngFor="let plan of p.plans" class="flex justify-between items-center p-2 rounded-xl bg-glass border border-dashed border-primary border-opacity-20">
                <div>
                   <div class="font-bold text-sm">{{ plan.planName }}</div>
                   <div class="text-[0.65rem] uppercase text-primary font-black">{{ plan.coveragePercentage }}% {{ 'COVERAGE' | translate }}</div>
                </div>
                <button class="btn btn-xs btn-ghost btn-icon" (click)="editPlan(plan)"><span class="material-icons-round text-sm">settings</span></button>
              </div>
              <div *ngIf="!p.plans?.length" class="text-center p-4 italic text-muted text-xs">
                {{ 'NO_PLANS_CONFIGURED' | translate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-0" *ngIf="activeTab === 'claims'">
        <div class="p-4 bg-glass border-bottom flex gap-4">
          <div class="flex-grow relative">
            <span class="material-icons-round absolute left-3 top-3 text-muted">search</span>
            <input type="text" class="form-control pl-10" [placeholder]="'SEARCH_CLAIMS' | translate" [(ngModel)]="searchClaim" (keyup.enter)="loadClaims()">
          </div>
          <select class="form-control w-48" [(ngModel)]="statusFilter" (change)="loadClaims()">
            <option value="">{{ 'ALL_STATUS' | translate }}</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        
        <table class="table mb-0">
          <thead class="bg-gray-50 dark:bg-gray-800 uppercase text-[0.65rem] font-black">
            <tr>
              <th>{{ 'CLAIM_NO' | translate }}</th>
              <th>{{ 'PATIENT' | translate }}</th>
              <th>{{ 'PROVIDER' | translate }}</th>
              <th>{{ 'AMOUNT' | translate }}</th>
              <th>{{ 'STATUS' | translate }}</th>
              <th>{{ 'DATE' | translate }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of claims">
              <td class="font-mono font-bold text-primary">{{ c.claimNumber }}</td>
              <td class="font-bold text-sm">{{ c.patientName }}</td>
              <td class="text-sm">{{ c.providerName }}</td>
              <td class="font-black">{{ c.claimAmount | currency }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-warning': c.status === 'Pending',
                  'badge-success': c.status === 'Approved' || c.status === 'Paid',
                  'badge-danger': c.status === 'Rejected'
                }">{{ c.status }}</span>
              </td>
              <td class="text-xs">{{ c.submissionDate | date:'shortDate' }}</td>
              <td>
                <button class="btn btn-xs btn-secondary" (click)="openClaimStatusModal(c)">{{ 'UPDATE_STATUS' | translate }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODALS (Simplified for implementation) -->
    <div class="modal-backdrop flex items-center justify-center p-4 overflow-y-auto" *ngIf="showProviderModal">
       <div class="card w-full max-w-md animate-in p-6">
          <h2 class="font-black text-xl mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">add_business</span> {{ (providerForm.id ? 'EDIT_PROVIDER' : 'NEW_PROVIDER') | translate }}</h2>
          <div class="space-y-4">
             <div><label class="form-label">{{ 'NAME' | translate }}</label><input type="text" class="form-control" [(ngModel)]="providerForm.name"></div>
             <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">{{ 'CONTACT' | translate }}</label><input type="text" class="form-control" [(ngModel)]="providerForm.contactPerson"></div>
                <div><label class="form-label">{{ 'PHONE' | translate }}</label><input type="text" class="form-control" [(ngModel)]="providerForm.phoneNumber"></div>
             </div>
             <div><label class="form-label">{{ 'EMAIL' | translate }}</label><input type="email" class="form-control" [(ngModel)]="providerForm.email"></div>
             <div><label class="form-label">{{ 'TPA_CODE' | translate }}</label><input type="text" class="form-control" [(ngModel)]="providerForm.tpa"></div>
          </div>
          <div class="flex justify-end gap-2 mt-8 pt-4 border-top">
             <button class="btn btn-secondary" (click)="showProviderModal = false">{{ 'CANCEL' | translate }}</button>
             <button class="btn btn-primary" (click)="saveProvider()">{{ 'SAVE' | translate }}</button>
          </div>
       </div>
    </div>

    <div class="modal-backdrop flex items-center justify-center p-4 overflow-y-auto" *ngIf="showPlanModal">
       <div class="card w-full max-w-md animate-in p-6">
          <h2 class="font-black text-xl mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">policy</span> {{ (planForm.id ? 'EDIT_PLAN' : 'NEW_PLAN') | translate }}</h2>
          <div class="space-y-4">
             <div><label class="form-label">{{ 'PLAN_NAME' | translate }}</label><input type="text" class="form-control" [(ngModel)]="planForm.planName"></div>
             <div class="grid grid-cols-2 gap-4">
                <div><label class="form-label">{{ 'COVERAGE' | translate }} (%)</label><input type="number" class="form-control" [(ngModel)]="planForm.coveragePercentage"></div>
                <div><label class="form-label">{{ 'CO_PAY' | translate }}</label><input type="number" class="form-control" [(ngModel)]="planForm.coPayAmount"></div>
             </div>
             <div><label class="form-label">{{ 'MAX_LIMIT' | translate }}</label><input type="number" class="form-control" [(ngModel)]="planForm.maxLimit"></div>
             <div class="flex items-center gap-2 p-3 bg-glass rounded-xl cursor-pointer" (click)="planForm.requiresPreAuth = !planForm.requiresPreAuth">
                <span class="material-icons-round" [class.text-primary]="planForm.requiresPreAuth">{{ planForm.requiresPreAuth ? 'check_box' : 'check_box_outline_blank' }}</span>
                <span class="font-bold text-sm">{{ 'REQUIRES_PREAUTH' | translate }}</span>
             </div>
          </div>
          <div class="flex justify-end gap-2 mt-8 pt-4 border-top">
             <button class="btn btn-secondary" (click)="showPlanModal = false">{{ 'CANCEL' | translate }}</button>
             <button class="btn btn-primary" (click)="savePlan()">{{ 'SAVE' | translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class InsuranceComponent implements OnInit {
    activeTab = 'providers';
    providers: any[] = [];
    claims: any[] = [];
    searchClaim = '';
    statusFilter = '';

    showProviderModal = false;
    providerForm: any = {};

    showPlanModal = false;
    planForm: any = {};

    constructor(
        private service: InsuranceService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadProviders();
        this.loadClaims();
    }

    loadProviders() {
        this.service.getProviders().subscribe(res => this.providers = res);
    }

    loadClaims() {
        this.service.getClaims({ search: this.searchClaim }, this.statusFilter).subscribe(res => this.claims = res.items);
    }

    openProviderForm() {
        this.providerForm = { isActive: true };
        this.showProviderModal = true;
    }

    editProvider(p: any) {
        this.providerForm = { ...p };
        this.showProviderModal = true;
    }

    saveProvider() {
        const op = this.providerForm.id ?
            this.service.updateProvider(this.providerForm.id, this.providerForm) :
            this.service.createProvider(this.providerForm);

        op.subscribe(() => {
            this.toast.success('PROVIDER_SAVED');
            this.showProviderModal = false;
            this.loadProviders();
        });
    }

    openPlanForm(providerId: number) {
        this.planForm = { insuranceProviderId: providerId, isActive: true, coveragePercentage: 80 };
        this.showPlanModal = true;
    }

    editPlan(plan: any) {
        this.planForm = { ...plan };
        this.showPlanModal = true;
    }

    savePlan() {
        const op = this.planForm.id ?
            this.service.updatePlan(this.planForm.id, this.planForm) :
            this.service.createPlan(this.planForm);

        op.subscribe(() => {
            this.toast.success('PLAN_SAVED');
            this.showPlanModal = false;
            this.loadProviders();
        });
    }

    openClaimStatusModal(claim: any) {
        // Implement Status Change Modal...
        const status = window.prompt("Enter new status (Approved, Rejected, Paid):", claim.status);
        if (status) {
            let approved = claim.claimAmount;
            if (status === 'Approved') {
                const val = window.prompt("Approved Amount:", claim.claimAmount.toString());
                approved = parseFloat(val || '0');
            }
            this.service.updateClaimStatus(claim.id, { status, approvedAmount: approved }).subscribe(() => {
                this.toast.success('CLAIM_UPDATED');
                this.loadClaims();
            });
        }
    }
}
