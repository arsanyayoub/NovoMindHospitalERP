import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaternityService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-maternity',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    styles: [`
        .mat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        .baby-card { background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--accent-rgb), 0.1)); border: 1.5px solid var(--border); border-radius: 20px; padding: 20px; }
        .mother-card { background: var(--glass); border: 1px solid var(--border); border-radius: 20px; padding: 20px; }
        .week-badge { background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 900; }
        .status-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 8px; }
        .stat-group { display: flex; gap: 16px; margin-top: 12px; }
        .stat-item { flex: 1; text-align: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 12px; }
        .stat-val { display: block; font-size: 1rem; font-weight: 900; color: var(--primary-light); }
        .stat-lab { display: block; font-size: 0.55rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
    `],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'MATERNITY_NICU' | translate }}</h1>
        <p class="page-subtitle">{{ 'PREGNANCY_TRACKING_AND_NEONATAL_CARE' | translate }}</p>
      </div>
      <div class="flex gap-2">
         <button class="btn btn-primary" (click)="showPregnancyModal=true">{{ 'START_TRACKING' | translate }}</button>
      </div>
    </div>

    <!-- TABS -->
    <div class="card p-0 overflow-hidden mb-6">
       <div class="flex border-bottom bg-glass">
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'tracking'"
                [class.text-primary]="activeTab === 'tracking'"
                [class.border-transparent]="activeTab !== 'tracking'"
                (click)="activeTab = 'tracking'">
          {{ 'PREGNANCY_TRACKING' | translate }}
        </button>
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'nicu'"
                [class.text-primary]="activeTab === 'nicu'"
                [class.border-transparent]="activeTab !== 'nicu'"
                (click)="activeTab = 'nicu'">
          {{ 'NICU_MONITOR' | translate }}
        </button>
      </div>

      <!-- TRACKING TAB -->
      <div class="p-4 animate-in" *ngIf="activeTab === 'tracking'">
         <div class="mat-grid">
            <div *ngFor="let p of pregnancies" class="mother-card hover-up">
               <div class="flex justify-between items-start mb-4">
                  <div>
                     <div class="font-black text-lg">{{ p.patientName }}</div>
                     <div class="text-xs font-bold text-muted">{{ 'EDD' | translate }}: {{ p.edd | date:'mediumDate' }}</div>
                  </div>
                  <span class="week-badge">{{ calculateWeeks(p.edd) }} Wks</span>
               </div>
               
               <div class="stat-group">
                  <div class="stat-item">
                     <span class="stat-val">{{ p.gravidity }}</span>
                     <span class="stat-lab">GRAV</span>
                  </div>
                  <div class="stat-item">
                     <span class="stat-val">{{ p.parity }}</span>
                     <span class="stat-lab">PARITY</span>
                  </div>
                  <div class="stat-item">
                     <span class="stat-val">{{ p.bloodGroup }}</span>
                     <span class="stat-lab">BLOOD</span>
                  </div>
               </div>

               <div class="mt-4 p-3 bg-glass border border-dashed rounded-xl text-xs font-bold" *ngIf="p.riskFactors">
                  <span class="text-red-400 uppercase text-[0.6rem] block mb-1">Risk Factors</span>
                  {{ p.riskFactors }}
               </div>

               <div class="flex gap-2 mt-4 pt-4 border-top">
                  <button class="btn btn-xs btn-primary font-black" (click)="openDeliveryForm(p)">{{ 'RECORD_DELIVERY' | translate }}</button>
                  <button class="btn btn-xs btn-secondary font-black">{{ 'VIEW_VISITS' | translate }}</button>
               </div>
            </div>
         </div>
      </div>

      <!-- NICU TAB -->
      <div class="p-4 animate-in" *ngIf="activeTab === 'nicu'">
         <div class="mat-grid">
            <div *ngFor="let b of babies" class="baby-card">
               <div class="flex justify-between items-start mb-4">
                  <div>
                    <span class="material-icons-round text-primary mb-2">child_care</span>
                    <div class="font-black text-lg">{{ b.babyName }}</div>
                  </div>
                  <span class="status-tag bg-blue-500 bg-opacity-20 text-blue-400">{{ b.gender }}</span>
               </div>

               <div class="stat-group">
                  <div class="stat-item">
                     <span class="stat-val">{{ b.birthWeight }}kg</span>
                     <span class="stat-lab">WEIGHT</span>
                  </div>
                  <div class="stat-item">
                     <span class="stat-val">{{ b.apgar5Min }}/10</span>
                     <span class="stat-lab">APGAR 5m</span>
                  </div>
               </div>

               <div class="mt-4 flex items-center gap-3">
                  <div class="flex-1">
                     <div class="text-[0.6rem] font-bold opacity-50 uppercase mb-1">Status</div>
                     <div class="text-xs font-black">{{ b.healthStatus || 'Stable' }}</div>
                  </div>
                  <button class="btn btn-xs btn-primary rounded-full px-4">{{ 'VITAL_CHART' | translate }}</button>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- PREGNANCY MODAL -->
    <div class="modal-backdrop flex items-center justify-center p-4" *ngIf="showPregnancyModal">
       <div class="card w-full max-w-md p-6 animate-in">
          <h2 class="font-black text-xl mb-6">{{ 'NEW_PREGNANCY_RECORD' | translate }}</h2>
          <div class="grid grid-cols-2 gap-4 mb-4">
             <div class="col-span-2">
                <label class="form-label">{{ 'PATIENT_ID' | translate }}</label>
                <input type="number" class="form-control" [(ngModel)]="pregForm.patientId">
             </div>
             <div>
                <label class="form-label">{{ 'LMP' | translate }}</label>
                <input type="date" class="form-control" [(ngModel)]="pregForm.lmp">
             </div>
             <div>
                <label class="form-label">{{ 'EDD' | translate }}</label>
                <input type="date" class="form-control" [(ngModel)]="pregForm.edd">
             </div>
             <div>
                <label class="form-label">{{ 'GRAVIDITY' | translate }}</label>
                <input type="number" class="form-control" [(ngModel)]="pregForm.gravidity">
             </div>
             <div>
                <label class="form-label">{{ 'PARITY' | translate }}</label>
                <input type="number" class="form-control" [(ngModel)]="pregForm.parity">
             </div>
             <div class="col-span-2">
                <label class="form-label">{{ 'RISK_FACTORS' | translate }}</label>
                <textarea class="form-control" [(ngModel)]="pregForm.riskFactors"></textarea>
             </div>
          </div>
          <div class="flex justify-end gap-2">
             <button class="btn btn-secondary" (click)="showPregnancyModal=false">{{ 'CANCEL' | translate }}</button>
             <button class="btn btn-primary" (click)="savePregnancy()">{{ 'SAVE' | translate }}</button>
          </div>
       </div>
    </div>
    `
})
export class MaternityComponent implements OnInit {
    activeTab = 'tracking';
    pregnancies: any[] = [];
    babies: any[] = [];

    showPregnancyModal = false;
    pregForm: any = { gravidity: 1, parity: 0, bloodGroup: 'O+' };

    constructor(
        private mat: MaternityService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadPregnancies();
        this.loadBabies();
    }

    loadPregnancies() {
        this.mat.getPregnancies({ pageSize: 50 }, 'Active').subscribe(res => this.pregnancies = res.items);
    }

    loadBabies() {
        this.mat.getNeonatalRecords({ pageSize: 50 }).subscribe(res => this.babies = res.items);
    }

    calculateWeeks(edd: string): number {
        const diff = new Date(edd).getTime() - new Date().getTime();
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return Math.floor((280 - daysLeft) / 7);
    }

    savePregnancy() {
        this.mat.createPregnancy(this.pregForm).subscribe(() => {
            this.toast.success("Pregnancy record created");
            this.showPregnancyModal = false;
            this.loadPregnancies();
        });
    }

    openDeliveryForm(preg: any) {
        const mode = window.prompt("Delivery Mode? (Spontaneous, C-Section)");
        if (mode) {
            this.mat.recordDelivery({
                pregnancyRecordId: preg.id,
                deliveryDateTime: new Date().toISOString(),
                modeOfDelivery: mode,
                attendingDoctor: 'OB-GYN Specialist'
            }).subscribe(delivery => {
                const name = window.prompt("Baby Name?");
                if (name) {
                    this.mat.recordBirth({
                        deliveryRecordId: delivery.id,
                        fullName: name,
                        birthWeight: 3.2,
                        apgar1Min: 8,
                        apgar5Min: 9,
                        gender: 'Male',
                        healthStatus: 'Stable'
                    }).subscribe(() => {
                        this.toast.success("Delivery and Birth Recorded!");
                        this.loadPregnancies();
                        this.loadBabies();
                    });
                }
            });
        }
    }
}
