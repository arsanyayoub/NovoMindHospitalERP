import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
    EmergencyService, LabService, RadiologyService, PharmacyService,
    ClinicalService, DoctorService, BedManagementService
} from '../../../core/services/api.services';
import { ToastService } from '../../../core/services/language.service';

@Component({
    selector: 'app-emergency-chart',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
    styles: [`
        .chart-container { display: grid; grid-template-columns: 280px 1fr; gap: 24px; min-height: calc(100vh - 120px); }
        .side-panel { background: var(--glass); border: 1.5px solid var(--border); border-radius: 24px; padding: 24px; height: fit-content; }
        .main-content { display: flex; flex-direction: column; gap: 24px; }
        .tab-nav { display: flex; gap: 8px; background: var(--glass); padding: 8px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 8px; }
        .tab-btn { padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 0.75rem; transition: 0.3s; color: var(--muted); border: none; background: transparent; cursor: pointer; }
        .tab-btn.active { background: var(--primary); color: white; box-shadow: var(--shadow-primary); }
        
        .vital-card { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; padding: 12px; text-align: center; }
        .vital-val { font-size: 1.25rem; font-weight: 900; color: var(--primary); }
        .vital-label { font-size: 0.6rem; font-black uppercase opacity: 0.6; }

        .timeline-item { position: relative; padding-left: 32px; padding-bottom: 24px; }
        .timeline-item::before { content: ''; position: absolute; left: 0; top: 8px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); z-index: 1; }
        .timeline-item::after { content: ''; position: absolute; left: 5px; top: 12px; width: 2px; height: 100%; background: var(--border); }
        .timeline-item:last-child::after { display: none; }
    `],
    template: `
    <div class="page-header mb-6">
        <div class="flex items-center gap-4">
            <button class="btn btn-icon-secondary btn-sm" routerLink="/emergency">
                <span class="material-icons-round">arrow_back</span>
            </button>
            <div>
                <div class="text-[0.65rem] font-black opacity-50 uppercase tracking-widest">{{ admission?.patientCode }} &bull; ER CASE #{{ admission?.id }}</div>
                <h1 class="page-title text-3xl">{{ admission?.patientName }}</h1>
            </div>
        </div>
        <div class="flex gap-3">
            <div class="badge badge-xl mr-2" [ngClass]="'badge-' + getTriageColor(admission?.triageLevel)">
                {{ admission?.triageCategory || 'WAITING' | translate }}
            </div>
            <div class="badge badge-xl badge-secondary">{{ admission?.status | translate }}</div>
        </div>
    </div>

    <div class="chart-container animate-in">
        <div class="side-panel flex flex-col gap-6">
            <div>
                <h4 class="text-[0.65rem] font-black opacity-50 uppercase mb-4">{{ 'QUICK_VITALS' | translate }}</h4>
                <div class="grid grid-cols-2 gap-3">
                    <div class="vital-card">
                        <div class="vital-val text-red-500">{{ latestVital?.temperature || '--' }}</div>
                        <div class="vital-label">TEMP</div>
                    </div>
                    <div class="vital-card">
                        <div class="vital-val text-blue-500">{{ latestVital?.spO2 || '--' }}%</div>
                        <div class="vital-label">SpO2</div>
                    </div>
                    <div class="vital-card col-span-2">
                        <div class="vital-val text-primary">{{ latestVital?.bloodPressure || '--' }}</div>
                        <div class="vital-label">BLOOD PRESSURE</div>
                    </div>
                </div>
                <button class="btn btn-secondary btn-xs w-full mt-3 rounded-lg py-2" (click)="openVitalsModal()">
                    <span class="material-icons-round text-sm">add</span> {{ 'RECORD_VITALS' | translate }}
                </button>
            </div>

            <div class="border-t pt-6">
                <h4 class="text-[0.65rem] font-black opacity-50 uppercase mb-4">{{ 'ASSIGNED_CARE' | translate }}</h4>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                        <span class="material-icons-round">medical_services</span>
                    </div>
                    <div>
                        <div class="text-[0.6rem] font-black opacity-50 uppercase">{{ 'ER_PHYSICIAN' | translate }}</div>
                        <div class="text-sm font-black">{{ admission?.assignedDoctorName || 'UNASSIGNED' }}</div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-success bg-opacity-10 flex items-center justify-center text-success">
                        <span class="material-icons-round">meeting_room</span>
                    </div>
                    <div>
                        <div class="text-[0.6rem] font-black opacity-50 uppercase">{{ 'ER_BAY' | translate }}</div>
                        <div class="text-sm font-black">{{ admission?.erBayNumber || 'WAITING_AREA' }}</div>
                    </div>
                </div>
            </div>

            <div class="border-t pt-6 mt-auto">
                <button class="btn btn-primary w-full shadow-primary mb-3 rounded-xl py-3 h-auto" (click)="showDispositionModal=true">
                    <span class="material-icons-round mr-2">exit_to_app</span> {{ 'ER_DISPOSITION' | translate }}
                </button>
            </div>
        </div>

        <div class="main-content">
            <div class="tab-nav">
                <button class="tab-btn" [class.active]="activeTab==='timeline'" (click)="activeTab='timeline'">{{ 'TIMELINE' | translate }}</button>
                <button class="tab-btn" [class.active]="activeTab==='orders'" (click)="activeTab='orders'">{{ 'INVESTIGATIONS' | translate }}</button>
                <button class="tab-btn" [class.active]="activeTab==='pharmacy'" (click)="activeTab='pharmacy'">{{ 'MEDICATIONS' | translate }}</button>
                <button class="tab-btn" [class.active]="activeTab==='clinical'" (click)="activeTab='clinical'">{{ 'CLINICAL_NOTES' | translate }}</button>
            </div>

            <!-- TIMELINE TAB -->
            <div *ngIf="activeTab==='timeline'" class="bg-glass rounded-3xl border border-white border-opacity-10 p-8 min-h-[500px]">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-xl font-black uppercase tracking-tighter">{{ 'PATIENT_ACTIVITY' | translate }}</h3>
                    <button class="btn btn-secondary btn-sm rounded-lg" (click)="loadSummary()">
                        <span class="material-icons-round">refresh</span>
                    </button>
                </div>

                <div class="timeline">
                    <div class="timeline-item" *ngFor="let ev of timeline">
                        <div class="text-[0.65rem] font-black text-muted mb-1">{{ ev.date | date:'shortTime' }} &bull; {{ ev.type }}</div>
                        <div class="font-bold text-sm">{{ ev.title }}</div>
                        <div class="text-xs opacity-60 mt-1">{{ ev.desc }}</div>
                    </div>
                </div>
            </div>

            <!-- ORDERS TAB -->
            <div *ngIf="activeTab==='orders'" class="flex flex-col gap-6">
                <!-- LABS -->
                <div class="bg-glass rounded-3xl border border-white border-opacity-10 p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-black uppercase tracking-tighter">{{ 'LAB_REQUESTS' | translate }}</h3>
                        <button class="btn btn-primary btn-sm rounded-lg" (click)="openLabModal()">
                            <span class="material-icons-round">add</span> {{ 'NEW_LAB_ORDER' | translate }}
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>{{ 'REQUEST_NO' | translate }}</th>
                                    <th>{{ 'DATE' | translate }}</th>
                                    <th>{{ 'STATUS' | translate }}</th>
                                    <th>{{ 'ACTIONS' | translate }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let r of summary?.labRequests">
                                    <td class="font-black">{{ r.requestNumber }}</td>
                                    <td class="text-xs">{{ r.requestDate | date:'short' }}</td>
                                    <td><span class="badge" [class.badge-primary]="r.status==='Completed'" [class.badge-warning]="r.status==='Pending'">{{ r.status }}</span></td>
                                    <td>
                                        <button class="btn btn-icon-secondary btn-xs" (click)="viewLabResults(r)"><span class="material-icons-round">visibility</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- RADIOLOGY -->
                <div class="bg-glass rounded-3xl border border-white border-opacity-10 p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-black uppercase tracking-tighter">{{ 'RADIOLOGY_REQUESTS' | translate }}</h3>
                        <button class="btn btn-primary btn-sm rounded-lg" (click)="openRadModal()">
                            <span class="material-icons-round">add</span> {{ 'NEW_RAD_ORDER' | translate }}
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>{{ 'REQUEST_NO' | translate }}</th>
                                    <th>{{ 'DATE' | translate }}</th>
                                    <th>{{ 'STATUS' | translate }}</th>
                                    <th>{{ 'ACTIONS' | translate }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let r of summary?.radiologyRequests">
                                    <td class="font-black">{{ r.requestNumber }}</td>
                                    <td class="text-xs">{{ r.requestDate | date:'short' }}</td>
                                    <td><span class="badge" [class.badge-primary]="r.status==='Completed'" [class.badge-warning]="r.status==='Pending'">{{ r.status }}</span></td>
                                    <td>
                                        <button class="btn btn-icon-secondary btn-xs"><span class="material-icons-round">visibility</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- PHARMACY TAB -->
            <div *ngIf="activeTab==='pharmacy'" class="bg-glass rounded-3xl border border-white border-opacity-10 p-8 min-h-[400px]">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-black uppercase tracking-tighter">{{ 'PRESCRIPTION_HISTORY' | translate }}</h3>
                    <button class="btn btn-primary btn-sm rounded-lg" (click)="openPrescrModal()">
                        <span class="material-icons-round">add</span> {{ 'NEW_PRESCRIPTION' | translate }}
                    </button>
                </div>
                <div *ngFor="let p of summary?.prescriptions" class="border rounded-2xl p-4 mb-4 bg-white bg-opacity-5">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black text-sm">{{ p.prescriptionNumber }} &bull; {{ p.prescriptionDate | date:'short' }}</span>
                        <span class="badge badge-outline-primary text-[0.6rem]">{{ p.status }}</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span *ngFor="let itm of p.items" class="bg-glass border rounded-lg px-3 py-1 text-xs font-bold">
                            {{ itm.itemName }} ({{ itm.dosage }}) - {{ itm.frequency }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- CLINICAL TAB -->
            <div *ngIf="activeTab==='clinical'" class="bg-glass rounded-3xl border border-white border-opacity-10 p-8 min-h-[400px]">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-black uppercase tracking-tighter">{{ 'CLINICAL_ENCOUNTERS' | translate }}</h3>
                    <button class="btn btn-primary btn-sm rounded-lg" (click)="openEncounterModal()">
                        <span class="material-icons-round">edit_note</span> {{ 'NEW_SOAP_NOTE' | translate }}
                    </button>
                </div>
                <div *ngFor="let e of summary?.encounters" class="border-left border-primary pl-4 mb-8">
                    <div class="text-[0.65rem] font-black opacity-50">{{ e.encounterDate | date:'medium' }} &bull; {{ e.doctorName }}</div>
                    <div class="font-black text-sm mb-2">{{ 'ASSESSMENT'|translate }}: {{ e.assessment }}</div>
                    <div class="text-xs opacity-70 whitespace-pre-line">{{ e.plan }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODALS (Simplified for briefness, would implement full forms) -->
    <div *ngIf="showDispositionModal" class="modal-overlay" (click)="showDispositionModal=false">
        <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:450px">
            <div class="modal-header">
                <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'PATIENT_DISPOSITION' | translate }}</h3>
                <button (click)="showDispositionModal=false" class="btn-close">×</button>
            </div>
            <div class="modal-body p-8 flex flex-col gap-3">
                <button class="btn btn-outline-primary h-14 rounded-xl font-black text-left px-6" (click)="updateStatus('Discharged', 'Home')">
                    <span class="material-icons-round mr-3">home</span> {{ 'DISCHARGE_HOME' | translate }}
                </button>
                <button class="btn btn-outline-warning h-14 rounded-xl font-black text-left px-6" (click)="admitPatient()">
                    <span class="material-icons-round mr-3">hotel</span> {{ 'ADMIT_TO_INPATIENT' | translate }}
                </button>
                <button class="btn btn-outline-danger h-14 rounded-xl font-black text-left px-6" (click)="updateStatus('Expired', 'Death')">
                    <span class="material-icons-round mr-3">warning</span> {{ 'PATIENT_EXPIRED' | translate }}
                </button>
            </div>
        </div>
    </div>

    <!-- ADMIT MODAL -->
    <div *ngIf="showAdmitModal" class="modal-overlay" (click)="showAdmitModal=false">
        <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:500px">
            <div class="modal-header">
                <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'ADMIT_TO_INPATIENT' | translate }}</h3>
                <button (click)="showAdmitModal=false" class="btn-close">×</button>
            </div>
            <div class="modal-body p-8">
                <div class="form-group mb-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'WARD' | translate }}</label>
                    <select class="form-control" [(ngModel)]="admitForm.wardId" (change)="loadRooms()">
                        <option value="">-- Select Ward --</option>
                        <option *ngFor="let w of wards" [value]="w.id">{{ w.wardName }}</option>
                    </select>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'ROOM' | translate }}</label>
                    <select class="form-control" [(ngModel)]="admitForm.roomId" (change)="loadBeds()">
                        <option value="">-- Select Room --</option>
                        <option *ngFor="let r of rooms" [value]="r.id">{{ r.roomNumber }}</option>
                    </select>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'BED' | translate }}</label>
                    <select class="form-control" [(ngModel)]="admitForm.bedId">
                        <option value="">-- Select Bed --</option>
                        <option *ngFor="let b of beds" [value]="b.id">{{ b.bedNumber }}</option>
                    </select>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label font-black text-xs uppercase">{{ 'ADMISSION_REASON' | translate }}*</label>
                    <input class="form-control" [(ngModel)]="admitForm.reason">
                </div>
            </div>
            <div class="modal-footer border-0">
                <button class="btn btn-primary w-full h-14 rounded-xl shadow-primary font-black uppercase" 
                    [disabled]="!admitForm.bedId || !admitForm.reason" (click)="confirmAdmit()">
                    {{ 'CONFIRM_ADMISSION' | translate }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class EmergencyChartComponent implements OnInit {
    admissionId: number = 0;
    admission: any = null;
    summary: any = null;
    latestVital: any = null;
    timeline: any[] = [];
    activeTab: string = 'timeline';

    showDispositionModal = false;
    showAdmitModal = false;
    wards: any[] = [];
    rooms: any[] = [];
    beds: any[] = [];
    admitForm: any = { wardId: '', roomId: '', bedId: '', reason: '', notes: '' };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private emergency: EmergencyService,
        private lab: LabService,
        private rad: RadiologyService,
        private pharmacy: PharmacyService,
        private clinical: ClinicalService,
        private bedService: BedManagementService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.admissionId = +this.route.snapshot.params['id'];
        this.loadAdmission();
        this.loadSummary();
    }

    loadAdmission() {
        this.emergency.getAdmission(this.admissionId).subscribe(r => {
            this.admission = r;
        });
    }

    loadSummary() {
        this.emergency.getTreatmentSummary(this.admissionId).subscribe(r => {
            this.summary = r;
            this.latestVital = r.vitals[0];
            this.buildTimeline(r);
        });
    }

    buildTimeline(summary: any) {
        let events: any[] = [];

        summary.vitals.forEach((v: any) => events.push({ date: v.recordedDate, type: 'Vitals', title: 'Vitals Recorded', desc: `BP: ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}, Temp: ${v.temperature}°C` }));
        summary.labRequests.forEach((r: any) => events.push({ date: r.requestDate, type: 'Lab', title: `Lab Ordered: ${r.requestNumber}`, desc: r.notes || 'Routine investigations' }));
        summary.radiologyRequests.forEach((r: any) => events.push({ date: r.requestDate, type: 'Imaging', title: `Imaging Ordered: ${r.requestNumber}`, desc: r.notes || '' }));
        summary.prescriptions.forEach((p: any) => events.push({ date: p.prescriptionDate, type: 'Medication', title: `Prescribed: ${p.prescriptionNumber}`, desc: p.items.length + ' medication(s)' }));
        summary.encounters.forEach((e: any) => events.push({ date: e.encounterDate, type: 'Note', title: 'Clinical Encounter', desc: e.assessment }));

        this.timeline = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    getTriageColor(level: number): string {
        if (level === 1) return 'danger';
        if (level === 2) return 'warning';
        if (level === 3) return 'info';
        return 'success';
    }

    openVitalsModal() {
        // Implement full vitals entry
        this.toast.info("Vitals Entry WIP");
    }

    openLabModal() { this.toast.info("Lab Order WIP"); }
    openRadModal() { this.toast.info("Radiology Order WIP"); }
    openPrescrModal() { this.toast.info("Prescription WIP"); }
    openEncounterModal() { this.toast.info("SOAP Note WIP"); }

    updateStatus(status: string, disposition: string) {
        this.emergency.updateStatus(this.admissionId, status, disposition, '').subscribe(() => {
            this.toast.success(this.translate.instant('STATUS_UPDATED'));
            this.showDispositionModal = false;
            if (status === 'Discharged') this.router.navigate(['/emergency']);
            else this.loadAdmission();
        });
    }

    admitPatient() {
        this.showDispositionModal = false;
        this.bedService.getWards({ pageSize: 100 }).subscribe((res: any) => {
            this.wards = res.items;
            this.showAdmitModal = true;
        });
    }

    loadRooms() {
        if (!this.admitForm.wardId) return;
        this.bedService.getRooms(this.admitForm.wardId, { pageSize: 100 }).subscribe((res: any) => {
            this.rooms = res.items;
        });
    }

    loadBeds() {
        if (!this.admitForm.roomId) return;
        this.bedService.getBeds({ roomId: this.admitForm.roomId, status: 'Available', pageSize: 100 }).subscribe((res: any) => {
            this.beds = res.items;
        });
    }

    confirmAdmit() {
        const payload = {
            bedId: +this.admitForm.bedId,
            admissionReason: this.admitForm.reason,
            notes: this.admitForm.notes
        };
        this.emergency.transferToInpatient(this.admissionId, payload).subscribe({
            next: (res) => {
                this.toast.success(this.translate.instant('PATIENT_ADMITTED'));
                this.showAdmitModal = false;
                this.router.navigate(['/inpatient-chart', res.inpatientAdmissionId]);
            },
            error: (err: any) => this.toast.error(err?.error?.message || this.translate.instant('ERROR_OCCURRED'))
        });
    }

    viewLabResults(r: any) {
        this.toast.info(`Viewing results for ${r.requestNumber}`);
    }
}
