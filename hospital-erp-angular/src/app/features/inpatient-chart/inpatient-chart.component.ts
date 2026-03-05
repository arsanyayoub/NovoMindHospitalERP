import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicalService, BedManagementService, PharmacyService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-inpatient-chart',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
    template: `
    <div class="animate-in" *ngIf="admission">
      <!-- Patient Summary Header -->
      <div class="card bg-glass border-primary border-opacity-20 mb-6">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="w-16 h-16 rounded-2xl bg-primary bg-opacity-10 text-primary flex items-center justify-center font-black text-2xl">
                {{ admission.patientName?.charAt(0) }}
             </div>
             <div>
                <h1 class="text-2xl font-black tracking-tighter m-0">{{ admission.patientName }}</h1>
                <div class="flex items-center gap-2 text-sm">
                   <span class="badge badge-info">{{ admission.patientCode }}</span>
                   <span class="text-muted">•</span>
                   <span class="font-bold">{{ admission.wardName }} - {{ admission.bedNumber }}</span>
                </div>
             </div>
          </div>
          <div class="flex gap-4">
             <div class="text-right">
                <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider">Admission Date</div>
                <div class="font-black">{{ admission.admissionDate | date:'mediumDate' }}</div>
             </div>
             <div class="text-right">
                <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider">Attending Doctor</div>
                <div class="font-black">Dr. {{ admission.doctorName || 'N/A' }}</div>
             </div>
          </div>
        </div>
      </div>

      <div class="flex border-b mb-6 overflow-x-auto bg-white dark:bg-gray-800 rounded-xl px-2">
         <button class="px-6 py-4 font-black text-sm tracking-tight transition-all border-b-2" 
            [class.border-primary]="activeTab === 'nursing'" [class.text-primary]="activeTab === 'nursing'" [class.border-transparent]="activeTab !== 'nursing'"
            (click)="activeTab = 'nursing'">
            {{ 'NURSING_ASSESSMENTS' | translate }}
         </button>
         <button class="px-6 py-4 font-black text-sm tracking-tight transition-all border-b-2" 
            [class.border-primary]="activeTab === 'mar'" [class.text-primary]="activeTab === 'mar'" [class.border-transparent]="activeTab !== 'mar'"
            (click)="activeTab = 'mar'">
            {{ 'MAR' | translate }}
         </button>
         <button class="px-6 py-4 font-black text-sm tracking-tight transition-all border-b-2" 
            [class.border-primary]="activeTab === 'vitals'" [class.text-primary]="activeTab === 'vitals'" [class.border-transparent]="activeTab !== 'vitals'"
            (click)="activeTab = 'vitals'">
            {{ 'VITALS_HISTORY' | translate }}
         </button>
      </div>

      <div class="grid grid-cols-12 gap-6" [ngSwitch]="activeTab">
        <!-- Vitals Tab -->
        <div class="col-span-12" *ngSwitchCase="'vitals'">
           <div class="flex justify-between items-center mb-4">
              <h3 class="font-black m-0">{{ 'VITALS_HISTORY' | translate }}</h3>
              <button class="btn btn-sm btn-primary" (click)="showVitalsForm = true">
                <span class="material-icons-round text-sm">add</span> {{ 'ADD_VITALS' | translate }}
              </button>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let v of vitals" class="card bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-all">
                 <div class="flex justify-between items-start mb-2">
                    <span class="text-[0.65rem] font-bold text-muted">{{ v.recordedDate | date:'medium' }}</span>
                    <span class="text-[0.65rem] font-bold text-primary uppercase">{{ v.recordedBy }}</span>
                 </div>
                 <div class="grid grid-cols-2 gap-y-2">
                    <div class="flex items-center gap-2" *ngIf="v.temperature">
                       <span class="material-icons-round text-orange-500 text-sm">thermostat</span>
                       <span class="font-black">{{ v.temperature }}°C</span>
                    </div>
                    <div class="flex items-center gap-2" *ngIf="v.bloodPressureSystolic">
                       <span class="material-icons-round text-red-500 text-sm">monitor_heart</span>
                       <span class="font-black">{{ v.bloodPressureSystolic }}/{{ v.bloodPressureDiastolic }}</span>
                    </div>
                    <div class="flex items-center gap-2" *ngIf="v.heartRate">
                       <span class="material-icons-round text-pink-500 text-sm">favorite</span>
                       <span class="font-black">{{ v.heartRate }} bpm</span>
                    </div>
                    <div class="flex items-center gap-2" *ngIf="v.spO2">
                       <span class="material-icons-round text-blue-500 text-sm">cloud</span>
                       <span class="font-black">{{ v.spO2 }}%</span>
                    </div>
                 </div>
              </div>
              <div *ngIf="vitals.length === 0" class="card text-center py-10 opacity-50 italic">
                 No vitals recorded during this stay.
              </div>
           </div>
        </div>

        <!-- Nursing Assessments Tab -->
        <div class="col-span-12" *ngSwitchCase="'nursing'">
           <div class="flex justify-between items-center mb-4">
              <h3 class="font-black m-0">{{ 'NURSING_ASSESSMENTS' | translate }}</h3>
              <button class="btn btn-sm btn-accent" (click)="openAssessmentForm()">
                <span class="material-icons-round text-sm">assignment</span> {{ 'NEW_ASSESSMENT' | translate }}
              </button>
           </div>

           <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div *ngFor="let a of assessments" class="card border-l-4 border-accent">
                 <div class="flex justify-between items-center mb-4">
                    <div>
                       <span class="badge badge-accent mr-2">{{ 'SHIFT_' + a.shift.toUpperCase() | translate }}</span>
                       <span class="text-sm font-black">{{ a.assessmentDate | date:'medium' }}</span>
                    </div>
                    <span class="text-xs font-bold text-muted">{{ 'BY' | translate }}: {{ a.recordedBy }}</span>
                 </div>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div *ngIf="a.neurological">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'NEUROLOGICAL' | translate }}</div>
                       <p class="m-0">{{ a.neurological }}</p>
                    </div>
                    <div *ngIf="a.respiratory">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'RESPIRATORY' | translate }}</div>
                       <p class="m-0">{{ a.respiratory }}</p>
                    </div>
                    <div *ngIf="a.cardiovascular">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'CARDIOVASCULAR' | translate }}</div>
                       <p class="m-0">{{ a.cardiovascular }}</p>
                    </div>
                    <div *ngIf="a.skinIntegumentary">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'SKIN_INTEGUMENTARY' | translate }}</div>
                       <p class="m-0">{{ a.skinIntegumentary }}</p>
                    </div>
                 </div>

                 <div class="mt-4 pt-4 border-t" *ngIf="a.nursingNotes || a.planOfCare">
                    <div class="mb-3" *ngIf="a.nursingNotes">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'NURSING_NOTES' | translate }}</div>
                       <p class="m-0 italic">{{ a.nursingNotes }}</p>
                    </div>
                    <div *ngIf="a.planOfCare">
                       <div class="font-bold text-muted uppercase text-[0.6rem] mb-1">{{ 'PLAN_OF_CARE' | translate }}</div>
                       <p class="m-0 font-bold">{{ a.planOfCare }}</p>
                    </div>
                 </div>
              </div>

              <div *ngIf="assessments.length === 0" class="card text-center py-20 opacity-50 italic col-span-full">
                 <span class="material-icons-round text-4xl mb-2">assignment_late</span>
                 <p>No nursing assessments found for this stay.</p>
              </div>
           </div>
        </div>

        <!-- MAR Tab -->
        <div class="col-span-12" *ngSwitchCase="'mar'">
           <div class="grid grid-cols-12 gap-6">
              <!-- Scheduled Medications -->
              <div class="col-span-12 lg:col-span-5">
                 <h3 class="font-black mb-4">{{ 'PENDING_MEDICATIONS' | translate }}</h3>
                 <div class="flex flex-col gap-3">
                    <div *ngFor="let m of activeMedications" class="card hover:border-primary transition-colors cursor-pointer" (click)="openMARForm(m)">
                       <div class="flex justify-between items-start mb-2">
                          <span class="font-black text-primary">{{ m.itemName }}</span>
                          <span class="badge badge-outline text-[0.6rem]">{{ m.dosage }}</span>
                       </div>
                       <div class="text-xs font-bold text-muted mb-2">{{ m.frequency }} • {{ m.duration }}</div>
                       <div class="text-[0.65rem] italic text-muted" *ngIf="m.instructions">{{ m.instructions }}</div>
                       <div class="mt-3 flex justify-end">
                          <button class="btn btn-xs btn-primary">{{ 'RECORD_MAR' | translate }}</button>
                       </div>
                    </div>
                    <div *ngIf="activeMedications.length === 0" class="card text-center py-10 opacity-50 italic">
                       No pending medications found for this admission.
                    </div>
                 </div>
              </div>

              <!-- MAR History -->
              <div class="col-span-12 lg:col-span-7">
                 <h3 class="font-black mb-4">{{ 'MAR_HISTORY' | translate }}</h3>
                 <div class="table-responsive bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <table class="table">
                       <thead>
                          <tr>
                             <th>{{ 'DATE' | translate }}</th>
                             <th>{{ 'MEDICINE_NAME' | translate }}</th>
                             <th>{{ 'DOSE' | translate }}</th>
                             <th>{{ 'STATUS' | translate }}</th>
                             <th>{{ 'BY' | translate }}</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr *ngFor="let h of marHistory">
                             <td class="whitespace-nowrap font-bold text-xs">{{ h.administeredDate | date:'short' }}</td>
                             <td class="font-black text-xs text-primary">{{ h.medicineName }}</td>
                             <td class="text-xs font-bold">{{ h.dose }}</td>
                             <td>
                                <span class="badge text-[0.6rem]" 
                                   [class.badge-success]="h.status === 'Given'" 
                                   [class.badge-danger]="h.status === 'Refused'"
                                   [class.badge-warning]="h.status === 'Held'">
                                   {{ 'SHIFT_' + h.status.toUpperCase() | translate || h.status }}
                                </span>
                             </td>
                             <td class="text-[0.65rem] font-bold text-muted">{{ h.administeredBy }}</td>
                          </tr>
                          <tr *ngIf="marHistory.length === 0">
                             <td colspan="5" class="text-center py-10 opacity-50 italic">No administration records yet.</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="flex justify-center py-20">
       <span class="spinner"></span>
    </div>

    <!-- Vitals Form Modal -->
    <div class="modal" [class.show]="showVitalsForm" *ngIf="showVitalsForm">
      <div class="modal-backdrop" (click)="showVitalsForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'ADD_VITALS' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showVitalsForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
             <div class="form-group">
                <label class="form-label">Temperature (°C)</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.temperature" step="0.1">
             </div>
             <div class="form-group">
                <label class="form-label">Heart Rate (bpm)</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.heartRate">
             </div>
             <div class="form-group">
                <label class="form-label">BP Systolic</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.bloodPressureSystolic">
             </div>
             <div class="form-group">
                <label class="form-label">BP Diastolic</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.bloodPressureDiastolic">
             </div>
             <div class="form-group">
                <label class="form-label">SpO2 (%)</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.spO2">
             </div>
             <div class="form-group">
                <label class="form-label">Resp. Rate</label>
                <input type="number" class="form-control" [(ngModel)]="vitalsForm.respiratoryRate">
             </div>
          </div>
          <div class="form-group mt-3">
             <label class="form-label">Notes</label>
             <textarea class="form-control" [(ngModel)]="vitalsForm.notes"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showVitalsForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveVitals()" [disabled]="saving">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Assessment Form Modal -->
    <div class="modal" [class.show]="showAssessmentForm" *ngIf="showAssessmentForm">
      <div class="modal-backdrop" (click)="showAssessmentForm = false"></div>
      <div class="modal-content" style="max-width: 700px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'NEW_ASSESSMENT' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showAssessmentForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body max-h-[70vh] overflow-y-auto">
          <div class="form-group mb-4">
             <label class="form-label">{{ 'SHIFT' | translate }} *</label>
             <div class="flex gap-2">
                <button type="button" class="btn btn-sm flex-1" [class.btn-primary]="assessmentForm.shift === 'Day'" (click)="assessmentForm.shift = 'Day'">{{ 'SHIFT_DAY' | translate }}</button>
                <button type="button" class="btn btn-sm flex-1" [class.btn-primary]="assessmentForm.shift === 'Evening'" (click)="assessmentForm.shift = 'Evening'">{{ 'SHIFT_EVENING' | translate }}</button>
                <button type="button" class="btn btn-sm flex-1" [class.btn-primary]="assessmentForm.shift === 'Night'" (click)="assessmentForm.shift = 'Night'">{{ 'SHIFT_NIGHT' | translate }}</button>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="form-group">
                <label class="form-label">{{ 'NEUROLOGICAL' | translate }}</label>
                <input type="text" class="form-control" [(ngModel)]="assessmentForm.neurological" placeholder="Alert and oriented x3...">
             </div>
             <div class="form-group">
                <label class="form-label">{{ 'RESPIRATORY' | translate }}</label>
                <input type="text" class="form-control" [(ngModel)]="assessmentForm.respiratory" placeholder="Lungs clear, easy breathing...">
             </div>
             <div class="form-group">
                <label class="form-label">{{ 'CARDIOVASCULAR' | translate }}</label>
                <input type="text" class="form-control" [(ngModel)]="assessmentForm.cardiovascular" placeholder="Normal S1/S2, regular rhythm...">
             </div>
             <div class="form-group">
                <label class="form-label">{{ 'SKIN_INTEGUMENTARY' | translate }}</label>
                <input type="text" class="form-control" [(ngModel)]="assessmentForm.skinIntegumentary" placeholder="Warm, dry, intact...">
             </div>
          </div>

          <div class="form-group mt-4">
             <label class="form-label">{{ 'NURSING_NOTES' | translate }}</label>
             <textarea class="form-control" [(ngModel)]="assessmentForm.nursingNotes" rows="3"></textarea>
          </div>
          <div class="form-group mt-3">
             <label class="form-label">{{ 'PLAN_OF_CARE' | translate }}</label>
             <textarea class="form-control" [(ngModel)]="assessmentForm.planOfCare" rows="2" placeholder="Continue monitoring, assist with ambulation..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showAssessmentForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveAssessment()" [disabled]="saving || !assessmentForm.shift">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- MAR Form Modal -->
    <div class="modal" [class.show]="showMARForm" *ngIf="showMARForm">
      <div class="modal-backdrop" (click)="showMARForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'RECORD_MAR' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showMARForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="card bg-primary bg-opacity-5 border-primary mb-4">
             <div class="font-black text-primary">{{ selectedMedication?.itemName }}</div>
             <div class="text-xs font-bold">{{ selectedMedication?.dosage }} • {{ selectedMedication?.frequency }}</div>
          </div>

          <div class="form-group mb-4">
             <label class="form-label">{{ 'STATUS' | translate }} *</label>
             <div class="flex gap-2">
                <button type="button" class="btn btn-sm flex-1" [class.btn-success]="marForm.status === 'Given'" (click)="marForm.status = 'Given'">{{ 'GIVEN' | translate }}</button>
                <button type="button" class="btn btn-sm flex-1" [class.btn-danger]="marForm.status === 'Refused'" (click)="marForm.status = 'Refused'">{{ 'REFUSED' | translate }}</button>
                <button type="button" class="btn btn-sm flex-1" [class.btn-warning]="marForm.status === 'Held'" (click)="marForm.status = 'Held'">{{ 'HELD' | translate }}</button>
             </div>
          </div>

          <div class="form-group">
             <label class="form-label">{{ 'DOSE' | translate }}</label>
             <input type="text" class="form-control" [(ngModel)]="marForm.dose">
          </div>
          
          <div class="form-group mt-3">
             <label class="form-label">{{ 'NOTES' | translate }}</label>
             <textarea class="form-control" [(ngModel)]="marForm.notes" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showMARForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveMAR()" [disabled]="saving || !marForm.status">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .spinner { border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class InpatientChartComponent implements OnInit {
    admission: any = null;
    vitals: any[] = [];
    assessments: any[] = [];
    activeMedications: any[] = [];
    marHistory: any[] = [];

    activeTab: 'nursing' | 'mar' | 'vitals' = 'nursing';
    loading = false;
    saving = false;

    showVitalsForm = false;
    vitalsForm: any = {};

    showAssessmentForm = false;
    assessmentForm: any = { shift: 'Day' };

    showMARForm = false;
    selectedMedication: any = null;
    marForm: any = { status: 'Given' };

    constructor(
        private route: ActivatedRoute,
        private clinicalSvc: ClinicalService,
        private pharmacySvc: PharmacyService,
        private bedSvc: BedManagementService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['admissionId'];
            if (id) {
                this.loadAdmissionData(+id);
            }
        });
    }

    loadAdmissionData(admissionId: number) {
        this.loading = true;
        // We don't have a direct getAdmissionById but we can use getAdmissions with ID if it supported it, 
        // or better, just get the bed status or similar. 
        // Assuming BedManagementService.getAdmissions({id: admissionId}) or similar.
        // For now, let's just get all active and find it (not efficient but works for demo).
        this.bedSvc.getAdmissions({ page: 1, pageSize: 1000 }).subscribe({
            next: (res) => {
                this.admission = res.items.find((a: any) => a.id === admissionId);
                if (this.admission) {
                    this.loadClinicalData(admissionId);
                } else {
                    this.toast.error('Admission not found');
                    this.loading = false;
                }
            },
            error: () => this.loading = false
        });
    }

    loadClinicalData(admissionId: number) {
        // Load Vitals
        this.clinicalSvc.getVitals({ page: 1, pageSize: 100 }, undefined, admissionId).subscribe(res => {
            this.vitals = res.items;
        });

        // Load Assessments
        this.clinicalSvc.getNursingAssessments(admissionId).subscribe(res => {
            this.assessments = res;
        });

        // Load Prescriptions/Medications for this admission
        this.pharmacySvc.getPrescriptions({ page: 1, pageSize: 100 }, undefined, undefined, admissionId).subscribe(res => {
            // Flatten items from all prescriptions
            this.activeMedications = res.items.flatMap((p: any) => p.items.map((i: any) => ({ ...i, prescriptionId: p.id })));
        });

        // Load MAR History
        this.pharmacySvc.getMAR(admissionId).subscribe(res => {
            this.marHistory = res;
            this.loading = false;
        });
    }

    openMARForm(med: any) {
        this.selectedMedication = med;
        this.marForm = {
            prescriptionItemId: med.id,
            bedAdmissionId: this.admission.id,
            status: 'Given',
            dose: med.dosage
        };
        this.showMARForm = true;
    }

    saveMAR() {
        this.saving = true;
        this.pharmacySvc.createMAR(this.marForm).subscribe({
            next: () => {
                this.toast.success('Medication administration recorded');
                this.showMARForm = false;
                this.loadClinicalData(this.admission.id);
                this.saving = false;
            },
            error: () => {
                this.toast.error('Failed to record administration');
                this.saving = false;
            }
        });
    }

    openAssessmentForm() {
        this.assessmentForm = { bedAdmissionId: this.admission.id, shift: 'Day' };
        this.showAssessmentForm = true;
    }

    saveVitals() {
        this.saving = true;
        const dto = {
            ...this.vitalsForm,
            patientId: this.admission.patientId,
            bedAdmissionId: this.admission.id
        };
        this.clinicalSvc.createVital(dto).subscribe({
            next: () => {
                this.toast.success('Vitals recorded');
                this.showVitalsForm = false;
                this.vitalsForm = {};
                this.loadClinicalData(this.admission.id);
                this.saving = false;
            },
            error: () => {
                this.toast.error('Failed to save vitals');
                this.saving = false;
            }
        });
    }

    saveAssessment() {
        this.saving = true;
        this.clinicalSvc.createNursingAssessment(this.assessmentForm).subscribe({
            next: () => {
                this.toast.success('Assessment recorded');
                this.showAssessmentForm = false;
                this.loadClinicalData(this.admission.id);
                this.saving = false;
            },
            error: () => {
                this.toast.error('Failed to save assessment');
                this.saving = false;
            }
        });
    }
}
