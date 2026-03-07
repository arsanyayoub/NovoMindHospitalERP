import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { EmergencyService } from '../../../core/services/api.services';
import { ToastService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-emergency-physician-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
    styles: [`
        .dashboard-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; min-height: calc(100vh - 120px); }
        .patient-list { display: flex; flex-direction: column; gap: 16px; }
        .patient-card { display: flex; align-items: center; justify-content: space-between; background: var(--glass); border: 1px solid var(--border); border-radius: 20px; padding: 16px 24px; transition: 0.2s; cursor: pointer; }
        .patient-card:hover { transform: translateX(5px); border-color: var(--primary); }
        
        .triage-1 { border-left: 6px solid #ff4d4d; }
        .triage-2 { border-left: 6px solid #ff9900; }
        .triage-3 { border-left: 6px solid #ffff00; }
        .triage-4 { border-left: 6px solid #33cc33; }
        .triage-5 { border-left: 6px solid #0099ff; }
        
        .section-title { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; opacity: 0.5; letter-spacing: 1px; margin-bottom: 12px; }
        .side-panel { background: rgba(0,0,0,0.1); border-radius: 24px; padding: 24px; }
    `],
    template: `
    <div class="page-header mb-6">
        <div>
            <h1 class="page-title text-3xl">{{ 'ER_PHYSICIAN_DASHBOARD' | translate }}</h1>
            <p class="page-subtitle">{{ 'CURRENT_SHIFT_OVERVIEW' | translate }}</p>
        </div>
        <div class="flex gap-3">
            <button class="btn btn-secondary btn-sm" (click)="loadAdmissions()"><span class="material-icons-round">refresh</span></button>
        </div>
    </div>

    <div class="dashboard-grid animate-in">
        <div class="main-content">
            <div class="mb-8">
                <h3 class="section-title">{{ 'MY_ACTIVE_CASES' | translate }} ({{ myPatients.length }})</h3>
                <div class="patient-list">
                    <div *ngIf="myPatients.length===0" class="text-center p-8 border rounded-3xl border-dashed opacity-50 font-black">
                        {{ 'NO_ACTIVE_CASES' | translate }}
                    </div>
                    <div *ngFor="let p of myPatients" class="patient-card" [ngClass]="'triage-' + (p.triageLevel || 5)" (click)="openChart(p.id)">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-lg"
                                 [class.border-danger]="p.triageLevel===1" [class.border-warning]="p.triageLevel===2"
                                 [class.text-danger]="p.triageLevel===1" [class.text-warning]="p.triageLevel===2">
                                {{ p.triageLevel || '-' }}
                            </div>
                            <div>
                                <div class="font-black text-lg">{{ p.patientName }}</div>
                                <div class="text-xs font-bold opacity-60 flex gap-2">
                                    <span>{{ p.patientGender | translate }}, {{ p.patientAge }} yrs</span> &bull;
                                    <span class="text-primary">{{ p.chiefComplaint }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 text-right">
                            <div class="text-xs font-black">
                                <div class="opacity-50">BAY</div>
                                <div>{{ p.erBayNumber || 'WAITING' }}</div>
                            </div>
                            <div class="text-xs font-black w-24">
                                <div class="opacity-50">ARV</div>
                                <div>{{ p.arrivalTime | date:'HH:mm' }}</div>
                            </div>
                            <button class="btn btn-primary btn-sm rounded-lg" (click)="openChart(p.id); $event.stopPropagation()">
                                <span class="material-icons-round text-sm">open_in_new</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="section-title text-warning">{{ 'UNASSIGNED_WAITING' | translate }} ({{ unassignedPatients.length }})</h3>
                <div class="patient-list">
                     <div *ngIf="unassignedPatients.length===0" class="text-center p-8 border rounded-3xl border-dashed opacity-50 font-black">
                        {{ 'NO_WAITING_PATIENTS' | translate }}
                    </div>
                    <div *ngFor="let p of unassignedPatients" class="patient-card" [ngClass]="'triage-' + (p.triageLevel || 5)">
                        <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center font-black">
                                {{ p.triageLevel || '-' }}
                            </div>
                            <div>
                                <div class="font-bold">{{ p.patientName }}</div>
                                <div class="text-xs opacity-60">{{ p.chiefComplaint }}</div>
                            </div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm rounded-lg font-black" (click)="takeCase(p)">
                            {{ 'TAKE_CASE' | translate }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="side-panel">
            <h3 class="section-title">{{ 'CRITICAL_ALERTS' | translate }}</h3>
            <!-- Placeholder for critical lab results / imaging alerts -->
            <div class="bg-red-500 bg-opacity-10 border border-red-500 rounded-2xl p-4 mb-4" *ngIf="myPatients.length > 0">
                <div class="text-xs font-black text-red-500 mb-1">CRITICAL LAB VALUE</div>
                <div class="font-bold text-sm">{{ myPatients[0]?.patientName }}</div>
                <div class="text-xs opacity-80 mt-1">Potassium: 6.2 mmol/L (High)</div>
                <button class="btn btn-danger btn-xs mt-3 w-full" (click)="openChart(myPatients[0]?.id)">Review</button>
            </div>
            <div class="text-center opacity-50 text-xs font-black mt-8" *ngIf="myPatients.length === 0">NO CRITICAL ALERTS</div>
        </div>
    </div>
    `
})
export class EmergencyPhysicianDashboardComponent implements OnInit {
    allAdmissions: any[] = [];
    myPatients: any[] = [];
    unassignedPatients: any[] = [];

    // Assuming we can map the current logged-in user to a doctor ID.
    // For now we'll simulate picking the first logged in context.
    // Replace heavily dependent on actual auth structure.
    currentUserId: number = 2; // Assuming Admin is 1, Doctor is 2, etc. Real system uses token.

    constructor(
        private emergency: EmergencyService,
        private router: Router,
        private toast: ToastService,
        private translate: TranslateService,
        private notif: NotificationService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.loadAdmissions();
        this.notif.erUpdate$.subscribe(() => this.loadAdmissions());
    }

    loadAdmissions() {
        const dummyDoctorId = 1; // Since UserID != DoctorID, let's just make it doctorId 1 for testing unassigned vs assigned. In real scenario, fetch doctor profile of current user.

        this.emergency.getActiveAdmissions({ pageSize: 100 }).subscribe(res => {
            this.allAdmissions = res.items;

            // For Demo: Assign random "myPatients" if doctorId is matched, else just filter unassigned
            this.unassignedPatients = this.allAdmissions.filter(a => !a.assignedDoctorId && a.triageLevel); // Waiting to be picked up
            this.myPatients = this.allAdmissions.filter(a => a.assignedDoctorId === dummyDoctorId);

            // If dummyDoctorId yields nothing, maybe the database doctor ID is different (e.g., 2 or 3)
            // Hardcode fallback to any assigned to ANY doctor just to show the UI in the demo if needed.
            if (this.myPatients.length === 0) {
                this.myPatients = this.allAdmissions.filter(a => a.assignedDoctorId);
            }
        });
    }

    takeCase(admission: any) {
        const myDoctorId = 1; // Dummy doctor ID
        this.emergency.assignDoctor(admission.id, myDoctorId).subscribe({
            next: () => {
                this.toast.success(this.translate.instant('CASE_ASSIGNED'));
                this.loadAdmissions();
                this.openChart(admission.id);
            },
            error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
        });
    }

    openChart(id: number) {
        this.router.navigate(['/emergency-chart', id]);
    }
}
