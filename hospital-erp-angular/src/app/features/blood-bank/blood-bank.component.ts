import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BloodBankService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-blood-bank',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    styles: [`
        .bb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .stock-card { background: var(--glass); border: 1.5px solid var(--border); border-radius: 20px; padding: 20px; transition: 0.3s; }
        .stock-card:hover { border-color: var(--primary); transform: translateY(-3px); }
        .blood-type { height: 50px; width: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 900; background: var(--primary-light); color: var(--primary); }
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; }
        .inventory-summary { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 24px; }
        .inv-item { background: var(--glass); border: 1px solid var(--border); padding: 12px 20px; border-radius: 16px; min-width: 120px; text-align: center; }
        .inv-val { font-size: 1.25rem; font-weight: 900; color: var(--primary); }
        .inv-label { font-size: 0.6rem; font-weight: 800; opacity: 0.5; text-transform: uppercase; }
    `],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'BLOOD_BANK_MANAGEMENT' | translate }}</h1>
        <p class="page-subtitle">{{ 'MONITOR_BLOOD_STOCK_DONORS' | translate }}</p>
      </div>
      <div class="flex gap-2">
         <button class="btn btn-primary btn-icon-text" (click)="openDonorForm()">
            <span class="material-icons-round">person_add</span> {{ 'ADD_DONOR' | translate }}
         </button>
      </div>
    </div>

    <div class="inventory-summary animate-in">
        <div class="inv-item" *ngFor="let s of stockSummary">
            <div class="inv-val">{{ s.count }}</div>
            <div class="inv-label">{{ s.group }} {{ s.rh }}</div>
        </div>
    </div>

    <div class="card p-0 overflow-hidden mb-6">
      <div class="flex border-bottom bg-glass">
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'stock'"
                [class.text-primary]="activeTab === 'stock'"
                [class.border-transparent]="activeTab !== 'stock'"
                (click)="activeTab = 'stock'">
          {{ 'BLOOD_STOCK' | translate }}
        </button>
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'donors'"
                [class.text-primary]="activeTab === 'donors'"
                [class.border-transparent]="activeTab !== 'donors'"
                (click)="activeTab = 'donors'">
          {{ 'DONORS' | translate }}
        </button>
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'requests'"
                [class.text-primary]="activeTab === 'requests'"
                [class.border-transparent]="activeTab !== 'requests'"
                (click)="activeTab = 'requests'">
          {{ 'BLOOD_REQUESTS' | translate }}
        </button>
      </div>

      <!-- STOCK TAB -->
      <div class="p-4 animate-in" *ngIf="activeTab === 'stock'">
        <div class="bb-grid">
           <div *ngFor="let item of stock" class="stock-card">
              <div class="flex justify-between items-start mb-4">
                 <div class="blood-type">{{ item.bloodGroup }}{{ item.rhFactor }}</div>
                 <span class="status-pill badge-success" *ngIf="item.status === 'Available'">{{ item.status }}</span>
                 <span class="status-pill badge-warning" *ngIf="item.status === 'Reserved'">{{ item.status }}</span>
                 <span class="status-pill badge-danger" *ngIf="item.status === 'Expired'">{{ item.status }}</span>
              </div>
              <div class="text-[0.65rem] font-black opacity-50 uppercase tracking-widest mb-1">{{ item.componentType }}</div>
              <div class="font-black text-lg mb-1">{{ item.bagNumber }}</div>
              <div class="text-xs font-bold text-muted mb-3">{{ item.volumeMl }}ml &bull; EXP: {{ item.expiryDate | date:'mediumDate' }}</div>
              <div class="flex items-center gap-2 text-[0.7rem] font-bold p-2 bg-glass rounded-lg border border-dashed">
                 <span class="material-icons-round text-sm">location_on</span> {{ item.storageLocation || 'N/A' }}
              </div>
           </div>
        </div>
      </div>

      <!-- DONORS TAB -->
      <div class="p-0 animate-in" *ngIf="activeTab === 'donors'">
         <table class="table mb-0">
            <thead>
               <tr>
                  <th>{{ 'CODE' | translate }}</th>
                  <th>{{ 'NAME' | translate }}</th>
                  <th>{{ 'BLOOD_GROUP' | translate }}</th>
                  <th>{{ 'LAST_DONATION' | translate }}</th>
                  <th>{{ 'STATUS' | translate }}</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let d of donors">
                  <td class="font-mono font-bold">{{ d.donorCode }}</td>
                  <td class="font-black">{{ d.fullName }}</td>
                  <td><div class="blood-type w-8 h-8 rounded-lg text-xs">{{ d.bloodGroup }}{{ d.rhFactor }}</div></td>
                  <td class="text-xs">{{ d.lastDonationDate ? (d.lastDonationDate | date:'mediumDate') : 'NEVER' }}</td>
                  <td><span class="badge" [class.badge-success]="d.isEligible" [class.badge-danger]="!d.isEligible">{{ d.isEligible ? 'Eligible' : 'Ineligible' }}</span></td>
                  <td>
                     <button class="btn btn-xs btn-primary" (click)="openDonationForm(d)">{{ 'RECORD_DONATION' | translate }}</button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- REQUESTS TAB -->
      <div class="p-0 animate-in" *ngIf="activeTab === 'requests'">
         <table class="table mb-0">
            <thead>
               <tr>
                  <th>{{ 'REQ_NO' | translate }}</th>
                  <th>{{ 'PATIENT' | translate }}</th>
                  <th>{{ 'TYPE' | translate }}</th>
                  <th>{{ 'URGENCY' | translate }}</th>
                  <th>{{ 'STATUS' | translate }}</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               <tr *ngFor="let r of requests">
                  <td class="font-mono font-bold">{{ r.requestNumber }}</td>
                  <td class="font-black">{{ r.patientName }}</td>
                  <td class="text-xs font-bold">{{ r.bloodGroupRequired }}{{ r.rhFactorRequired }} &bull; {{ r.componentType }}</td>
                  <td><span class="badge" [class.badge-danger]="r.urgency === 'Stat' || r.urgency === 'Emergency'">{{ r.urgency }}</span></td>
                  <td><span class="badge badge-warning">{{ r.status }}</span></td>
                  <td>
                     <button class="btn btn-xs btn-secondary" (click)="matchStock(r)">{{ 'MATCH_STOCK' | translate }}</button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>

    <!-- DONOR MODAL -->
    <div class="modal-backdrop flex items-center justify-center p-4" *ngIf="showDonorModal">
       <div class="card w-full max-w-md p-6 animate-in">
          <h2 class="font-black text-xl mb-6">{{ 'REGISTER_NEW_DONOR' | translate }}</h2>
          <div class="grid grid-cols-2 gap-4 mb-4">
             <div class="col-span-2">
                <label class="form-label">{{ 'FULL_NAME' | translate }}</label>
                <input type="text" class="form-control" [(ngModel)]="donorForm.fullName">
             </div>
             <div>
                <label class="form-label">{{ 'BLOOD_GROUP' | translate }}</label>
                <select class="form-control" [(ngModel)]="donorForm.bloodGroup">
                   <option *ngFor="let g of ['A', 'B', 'AB', 'O']" [value]="g">{{ g }}</option>
                </select>
             </div>
             <div>
                <label class="form-label">{{ 'RH_FACTOR' | translate }}</label>
                <select class="form-control" [(ngModel)]="donorForm.rhFactor">
                   <option value="+">+</option>
                   <option value="-">-</option>
                </select>
             </div>
             <div>
                <label class="form-label">{{ 'GENDER' | translate }}</label>
                <select class="form-control" [(ngModel)]="donorForm.gender">
                   <option value="Male">{{ 'MALE' | translate }}</option>
                   <option value="Female">{{ 'FEMALE' | translate }}</option>
                </select>
             </div>
             <div>
                <label class="form-label">{{ 'DOB' | translate }}</label>
                <input type="date" class="form-control" [(ngModel)]="donorForm.dateOfBirth">
             </div>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-top">
             <button class="btn btn-secondary" (click)="showDonorModal=false">{{ 'CANCEL' | translate }}</button>
             <button class="btn btn-primary" (click)="saveDonor()">{{ 'SAVE' | translate }}</button>
          </div>
       </div>
    </div>
    `
})
export class BloodBankComponent implements OnInit {
    activeTab = 'stock';
    stock: any[] = [];
    donors: any[] = [];
    requests: any[] = [];
    stockSummary: any[] = [];

    showDonorModal = false;
    donorForm: any = {};

    constructor(
        private bb: BloodBankService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadStock();
        this.loadDonors();
        this.loadRequests();
    }

    loadStock() {
        this.bb.getStock({ pageSize: 100 }).subscribe(res => {
            this.stock = res.items;
            this.summarizeStock();
        });
    }

    loadDonors() {
        this.bb.getDonors({ pageSize: 50 }).subscribe(res => this.donors = res.items);
    }

    loadRequests() {
        this.bb.getRequests({ pageSize: 50 }).subscribe(res => this.requests = res.items);
    }

    summarizeStock() {
        const counts: any = {};
        this.stock.forEach(i => {
            const key = `${i.bloodGroup}${i.rhFactor}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        this.stockSummary = Object.keys(counts).map(key => ({
            group: key.slice(0, -1),
            rh: key.slice(-1),
            count: counts[key]
        }));
    }

    openDonorForm() {
        this.donorForm = { bloodGroup: 'O', rhFactor: '+', gender: 'Male', dateOfBirth: '1990-01-01' };
        this.showDonorModal = true;
    }

    saveDonor() {
        this.bb.createDonor(this.donorForm).subscribe(() => {
            this.toast.success(this.translate.instant('DONOR_REGISTERED'));
            this.showDonorModal = false;
            this.loadDonors();
        });
    }

    openDonationForm(donor: any) {
        const bag = window.prompt("Enter Bag Number stickers:");
        if (bag) {
            const payload = {
                bloodDonorId: donor.id,
                volumeMl: 450,
                componentType: 'Whole Blood',
                bagNumber: bag,
                expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
                collectedBy: 'Lab Technician',
                storageLocation: 'Main Blood Fridge'
            };
            this.bb.recordDonation(payload).subscribe(() => {
                this.toast.success(this.translate.instant('DONATION_RECORDED'));
                this.loadStock();
                this.loadDonors();
            });
        }
    }

    matchStock(request: any) {
        this.toast.info("Stock matching algorithm searching...");
        // In a real app, this would open a filtered stock view
    }
}
