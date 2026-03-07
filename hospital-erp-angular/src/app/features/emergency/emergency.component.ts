import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmergencyService, PatientService, DoctorService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-emergency',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    styles: [`
    .er-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    .er-card { background: rgba(var(--card-bg-rgb), 0.4); border: 1.5px solid var(--border); border-radius: 24px; padding: 24px; transition: 0.3s; position: relative; overflow: hidden; }
    .er-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
    
    .triage-1 { border-left: 8px solid #ff4d4d; } /* Resuscitation */
    .triage-2 { border-left: 8px solid #ff9900; } /* Emergent */
    .triage-3 { border-left: 8px solid #ffff00; } /* Urgent */
    .triage-4 { border-left: 8px solid #33cc33; } /* Less Urgent */
    .triage-5 { border-left: 8px solid #0099ff; } /* Non-Urgent */
    
    .stats-bar { display: flex; gap: 16px; margin-bottom: 32px; overflow-x: auto; padding-bottom: 8px; }
    .stat-pill { background: var(--glass); border: 1px solid var(--border); padding: 12px 24px; border-radius: 16px; display: flex; flex-direction: column; min-width: 140px; }
    .stat-val { font-size: 1.5rem; font-weight: 900; color: var(--primary); }
    .stat-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; opacity: 0.6; }

    .bay-info { background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin-top: 16px; width: fit-content; }
    .vital-badge { background: var(--primary-light); color: var(--primary); padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; }
  `],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'EMERGENCY_TRIAGE_DEPT' | translate }}</h1>
        <p class="page-subtitle">{{ 'ER_REALTIME_MONITOR' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-primary px-6 rounded-xl shadow-primary font-black flex items-center gap-2 h-12" (click)="showRegModal=true">
          <span class="material-icons-round">emergency</span> {{ 'QUICK_ER_ADMISSION' | translate }}
        </button>
      </div>
    </div>

    <div class="stats-bar animate-in">
        <div class="stat-pill border-primary border-opacity-30">
            <span class="stat-val">{{ occupancy?.totalPatients || 0 }}</span>
            <span class="stat-label">{{ 'TOTAL_CASES' | translate }}</span>
        </div>
        <div class="stat-pill border-red-500 border-opacity-30">
            <span class="stat-val text-red-500">{{ occupancy?.level1Count || 0 }}</span>
            <span class="stat-label">RESUSCITATION (L1)</span>
        </div>
        <div class="stat-pill border-orange-500 border-opacity-30">
            <span class="stat-val text-orange-500">{{ occupancy?.level2Count || 0 }}</span>
            <span class="stat-label">EMERGENT (L2)</span>
        </div>
        <div class="stat-pill opacity-50">
            <span class="stat-val">{{ occupancy?.waitingCount || 0 }}</span>
            <span class="stat-label">PENDING TRIAGE</span>
        </div>
    </div>

    <div class="er-grid">
        <div *ngFor="let a of admissions" class="er-card animate-in" [ngClass]="'triage-' + (a.triageLevel || 'none')">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest mb-1">{{ a.arrivalTime | date:'shortTime' }} &bull; {{ a.arrivalMode | translate }}</div>
                    <div class="font-black text-xl tracking-tighter">{{ a.patientName }}</div>
                    <div class="text-xs font-bold opacity-60">{{ a.patientGender | translate }}, {{ a.patientAge }} yrs</div>
                </div>
                <div class="badge" [ngClass]="{
                    'badge-danger': a.triageLevel === 1,
                    'badge-warning': a.triageLevel === 2,
                    'badge-info': a.triageLevel === 3,
                    'badge-success': a.triageLevel >= 4,
                    'badge-secondary': !a.triageLevel
                }">{{ a.triageCategory || 'WAITING' | translate }}</div>
            </div>

            <div class="bg-glass p-3 rounded-2xl border mb-4">
                <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest mb-1">{{ 'CHIEF_COMPLAINT' | translate }}</div>
                <div class="font-bold text-sm highlight-text">{{ a.chiefComplaint }}</div>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
                <span class="vital-badge" *ngIf="a.status !== 'Arrived'">
                    <span class="material-icons-round text-[0.8rem] align-middle">monitor_heart</span> STABLE
                </span>
                <span class="vital-badge bg-info bg-opacity-10 text-info" *ngIf="a.assignedDoctorName">
                    <span class="material-icons-round text-[0.8rem] align-middle">person</span> DR. {{ a.assignedDoctorName }}
                </span>
            </div>

            <div class="bay-info">
                <span class="material-icons-round text-sm">meeting_room</span>
                {{ a.erBayNumber || 'UNASSIGNED' | translate }}
            </div>

            <div class="flex justify-end gap-2 mt-6 pt-4 border-top">
                <button class="btn btn-icon-secondary btn-sm rounded-lg" (click)="openTriage(a)" title="Triage Scoring">
                    <span class="material-icons-round">analytics</span>
                </button>
                <button class="btn btn-primary btn-sm px-4 rounded-lg font-black" (click)="viewAdmission(a)">
                    {{ 'MANAGE_CASE' | translate }}
                </button>
            </div>
        </div>
    </div>

    <!-- QUICK REGISTRATION MODAL -->
    <div class="modal-overlay" *ngIf="showRegModal" (click)="showRegModal=false">
        <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:500px">
            <div class="modal-header">
                <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'EMERGENCY_INTAKE' | translate }}</h3>
                <button (click)="showRegModal=false" class="btn-close">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group mb-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'PATIENT_NAME'|translate }}</label>
                    <input class="form-control" [(ngModel)]="regForm.patientFullNameManual" placeholder="Search or Enter Name">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label font-black text-xs uppercase">{{ 'GENDER'|translate }}</label>
                        <select class="form-control" [(ngModel)]="regForm.patientGender">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Unknown/Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label font-black text-xs uppercase">{{ 'ARRIVAL_MODE'|translate }}</label>
                        <select class="form-control" [(ngModel)]="regForm.arrivalMode">
                            <option value="Walk-in">Walk-in</option>
                            <option value="Ambulance">Ambulance</option>
                            <option value="Referral">Physician Referral</option>
                        </select>
                    </div>
                </div>
                <div class="form-group mt-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'CHIEF_COMPLAINT'|translate }}*</label>
                    <textarea class="form-control" [(ngModel)]="regForm.chiefComplaint" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label font-black text-xs uppercase">{{ 'ER_BAY_ROOM'|translate }}</label>
                    <input class="form-control" [(ngModel)]="regForm.erBayNumber" placeholder="e.g. Bay 4, Resus 1">
                </div>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-primary w-full h-14 rounded-xl shadow-primary font-black uppercase" 
                    (click)="registerEmergency()" [disabled]="!regForm.chiefComplaint">
                    {{ 'START_ER_ADMISSION' | translate }}
                </button>
            </div>
        </div>
    </div>

    <!-- TRIAGE MODAL -->
    <div class="modal-overlay" *ngIf="showTriageModal" (click)="showTriageModal=false">
        <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:600px">
            <div class="modal-header">
                <div>
                    <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'ER_TRIAGE_SCORING' | translate }}</h3>
                    <div class="text-xs font-black text-muted">{{ selectedAdmission?.patientName }}</div>
                </div>
                <button (click)="showTriageModal=false" class="btn-close">×</button>
            </div>
            <div class="modal-body p-8">
                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label class="form-label font-black text-xs uppercase mb-3 block">ESI Triage Level</label>
                        <div class="flex flex-col gap-2">
                            <button class="btn text-left justify-start gap-4 h-12 rounded-xl font-black" 
                                [class.btn-danger]="triageForm.triageLevel===1" [class.btn-secondary]="triageForm.triageLevel!==1"
                                (click)="triageForm.triageLevel=1; triageForm.triageCategory='Resuscitation'">
                                <span class="w-6 h-6 rounded-full bg-white bg-opacity-20 text-center">1</span> Resuscitation
                            </button>
                            <button class="btn text-left justify-start gap-4 h-12 rounded-xl font-black" 
                                [class.btn-warning]="triageForm.triageLevel===2" [class.btn-secondary]="triageForm.triageLevel!==2"
                                (click)="triageForm.triageLevel=2; triageForm.triageCategory='Emergent'">
                                <span class="w-6 h-6 rounded-full bg-white bg-opacity-20 text-center">2</span> Emergent
                            </button>
                            <button class="btn border-2 border-yellow-500 text-yellow-500 text-left justify-start gap-4 h-12 rounded-xl font-black" 
                                [style.background]="triageForm.triageLevel===3 ? '#ffff0033' : 'transparent'"
                                (click)="triageForm.triageLevel=3; triageForm.triageCategory='Urgent'">
                                <span class="w-6 h-6 rounded-full bg-yellow-500 text-white text-center">3</span> Urgent
                            </button>
                            <button class="btn border-2 border-green-500 text-green-500 text-left justify-start gap-4 h-12 rounded-xl font-black" 
                                [style.background]="triageForm.triageLevel===4 ? '#33cc3333' : 'transparent'"
                                (click)="triageForm.triageLevel=4; triageForm.triageCategory='Less Urgent'">
                                <span class="w-6 h-6 rounded-full bg-green-500 text-white text-center">4</span> Less Urgent
                            </button>
                        </div>
                    </div>
                    <div class="bg-glass p-6 rounded-3xl border border-primary border-opacity-10">
                        <h4 class="text-[0.65rem] font-black uppercase text-primary mb-4">Initial Triage Vitals</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group mb-0"><label class="text-[0.6rem] font-black uppercase opacity-60">Temp (°C)</label><input type="number" step="0.1" class="form-control form-control-sm" [(ngModel)]="triageForm.temp"></div>
                            <div class="form-group mb-0"><label class="text-[0.6rem] font-black uppercase opacity-60">BP</label><input class="form-control form-control-sm" [(ngModel)]="triageForm.bp" placeholder="120/80"></div>
                            <div class="form-group mb-0"><label class="text-[0.6rem] font-black uppercase opacity-60">Pulse</label><input type="number" class="form-control form-control-sm" [(ngModel)]="triageForm.hr"></div>
                            <div class="form-group mb-0"><label class="text-[0.6rem] font-black uppercase opacity-60">SpO2 (%)</label><input type="number" class="form-control form-control-sm" [(ngModel)]="triageForm.spO2"></div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label font-black text-xs uppercase">Triage Assessment Notes</label>
                    <textarea class="form-control" rows="3" [(ngModel)]="triageForm.triageNotes"></textarea>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-primary w-full h-14 rounded-xl shadow-primary font-black uppercase" (click)="saveTriage()">
                    {{ 'COMMIT_TRIAGE_DATA' | translate }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class EmergencyComponent implements OnInit {
    admissions: any[] = [];
    occupancy: any = null;
    showRegModal = false;
    showTriageModal = false;
    selectedAdmission: any = null;

    regForm: any = { arrivalMode: 'Walk-in', patientGender: 'Male', chiefComplaint: '' };
    triageForm: any = { triageLevel: 3, triageCategory: 'Urgent', temp: 37, bp: '', hr: 80, rr: 18, spO2: 98, painScale: '0', triageNotes: '' };

    constructor(
        private emergency: EmergencyService,
        private toast: ToastService,
        private translate: TranslateService,
        private notif: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadActiveAdmissions();
        this.loadOccupancy();
        this.notif.erUpdate$.subscribe(() => {
            this.loadActiveAdmissions();
            this.loadOccupancy();
        });
    }

    loadActiveAdmissions() {
        this.emergency.getActiveAdmissions({ pageSize: 50 }).subscribe(r => this.admissions = r.items);
    }

    loadOccupancy() {
        this.emergency.getOccupancy().subscribe(r => this.occupancy = r);
    }

    registerEmergency() {
        this.emergency.register(this.regForm).subscribe({
            next: () => {
                this.toast.success(this.translate.instant('SUCCESS_SAVE'));
                this.showRegModal = false;
                this.loadActiveAdmissions();
                this.loadOccupancy();
                this.regForm = { arrivalMode: 'Walk-in', patientGender: 'Male', chiefComplaint: '' };
            },
            error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
        });
    }

    openTriage(a: any) {
        this.selectedAdmission = a;
        this.triageForm = {
            triageLevel: a.triageLevel || 3,
            triageCategory: a.triageCategory || 'Urgent',
            temp: 37, bp: '', hr: 80, rr: 18, spO2: 98, painScale: '0',
            triageNotes: a.triageNotes || ''
        };
        this.showTriageModal = true;
    }

    saveTriage() {
        this.emergency.updateTriage(this.selectedAdmission.id, this.triageForm).subscribe({
            next: () => {
                this.toast.success(this.translate.instant('TRIAGE_COMPLETED'));
                this.showTriageModal = false;
                this.loadActiveAdmissions();
                this.loadOccupancy();
            },
            error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
        });
    }

    viewAdmission(a: any) {
        this.router.navigate(['/emergency-chart', a.id]);
    }
}
