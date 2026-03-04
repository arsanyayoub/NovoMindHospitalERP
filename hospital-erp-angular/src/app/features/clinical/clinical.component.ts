import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClinicalService, PatientService, DoctorService, LabService, PharmacyService, RadiologyService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-clinical',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .vital-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 16px; transition: all 0.2s; overflow: hidden; }
    .vital-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    .vital-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    
    .status-finalized { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-draft { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    
    .soap-box { background: rgba(var(--card-bg-rgb), 0.2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
    .soap-letter { font-size: 1.5rem; font-weight: 900; opacity: 0.1; position: absolute; top: 0; right: 8px; pointer-events: none; }
    
    .tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); }
    .tab-btn { padding: 10px 24px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .tab-btn:hover:not(.active) { color: var(--text-primary); background: rgba(255,255,255,0.05); }

    .order-section { border: 1px solid var(--border); border-radius: 16px; padding: 20px; background: rgba(var(--card-bg-rgb), 0.3); margin-bottom: 20px; }
    .order-title { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    .item-row { display: grid; grid-template-columns: 1fr 100px 120px 40px; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .test-pill { background: rgba(var(--primary-rgb), 0.1); border: 1px solid rgba(var(--primary-rgb), 0.2); border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ (tab === 'vitals' ? 'CLINICAL_VITALS' : 'ENCOUNTERS') | translate }}</h1>
        <p class="page-subtitle">{{ (tab === 'vitals' ? 'PATIENT_TRIAGE_SUBTITLE' : 'DOCTOR_CONSULTATION_SUBTITLE') | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button *ngIf="tab === 'vitals'" class="btn btn-primary px-4" (click)="openVitalForm()">
          <span class="material-icons-round mr-1">add_chart</span> {{ 'RECORD_VITALS' | translate }}
        </button>
        <button *ngIf="tab === 'encounters'" class="btn btn-primary px-4" (click)="openEncounterForm()">
          <span class="material-icons-round mr-1">history_edu</span> {{ 'RECORD_ENCOUNTER' | translate }}
        </button>
      </div>
    </div>

    <div class="tab-nav animate-in">
      <button class="tab-btn" [class.active]="tab === 'vitals'" (click)="tab = 'vitals'; loadVitals()">
        <span class="material-icons-round">monitor_heart</span> {{ 'VITALS' | translate }}
      </button>
      <button class="tab-btn" [class.active]="tab === 'encounters'" (click)="tab = 'encounters'; loadEncounters()">
        <span class="material-icons-round">history_edu</span> {{ 'ENCOUNTERS' | translate }}
      </button>
    </div>

    <div class="card p-0 overflow-hidden animate-in">
      <div class="p-4 border-bottom bg-glass flex justify-between items-center">
        <div class="search-bar" style="max-width:350px">
          <span class="material-icons-round search-icon">search</span>
          <input class="form-control" [placeholder]="'SEARCH_PATIENTS' | translate" [(ngModel)]="search" (input)="load()">
        </div>
        <button class="btn btn-icon btn-secondary" (click)="load()" [title]="'REFRESH' | translate">
          <span class="material-icons-round">refresh</span>
        </button>
      </div>

      <!-- VITALS TABLE -->
      <div *ngIf="tab === 'vitals'" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'PATIENT' | translate }}</th>
              <th>{{ 'DATE' | translate }}</th>
              <th>{{ 'TEMPERATURE' | translate }}</th>
              <th>{{ 'BLOOD_PRESSURE' | translate }}</th>
              <th>{{ 'HEART_RATE' | translate }}</th>
              <th>{{ 'OXYGEN' | translate }}</th>
              <th>{{ 'WEIGHT' | translate }}</th>
              <th class="text-end">{{ 'ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of vitals" class="hover-row">
              <td>
                <div class="font-bold">{{ v.patientName }}</div>
                <div class="text-xs text-muted">{{ v.patientCode }}</div>
              </td>
              <td class="text-sm font-semibold">{{ v.recordedDate | date:'medium' }}</td>
              <td>
                <div *ngIf="v.temperature" class="flex items-center gap-1 text-danger font-bold">
                  <span class="material-icons-round" style="font-size:16px">thermostat</span>
                  {{ v.temperature }}°C
                </div>
              </td>
              <td>
                <div *ngIf="v.bloodPressureSystolic" class="flex items-center gap-1 text-primary font-bold">
                  <span class="material-icons-round" style="font-size:16px">favorite</span>
                  {{ v.bloodPressureSystolic }}/{{ v.bloodPressureDiastolic }}
                </div>
              </td>
              <td>
                <div *ngIf="v.heartRate" class="font-bold text-success">{{ v.heartRate }} <span class="text-xs text-muted">BPM</span></div>
              </td>
              <td>
                <div *ngIf="v.spO2" class="font-bold text-info">{{ v.spO2 }} <span class="text-xs text-muted">%</span></div>
              </td>
              <td>
                <div *ngIf="v.weightKg" class="font-bold">{{ v.weightKg }} <span class="text-xs text-muted">kg</span></div>
                <div *ngIf="v.bmi" class="text-xs font-black text-primary">BMI: {{ v.bmi }}</div>
              </td>
              <td class="text-end">
                <button class="btn btn-icon btn-xs text-danger" (click)="deleteVital(v.id)">
                  <span class="material-icons-round">delete</span>
                </button>
              </td>
            </tr>
            <tr *ngIf="!vitals.length"><td colspan="8" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">monitor_heart</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
          </tbody>
        </table>
      </div>

      <!-- ENCOUNTERS TABLE -->
      <div *ngIf="tab === 'encounters'" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'PATIENT' | translate }}</th>
              <th>{{ 'DOCTOR' | translate }}</th>
              <th>{{ 'DATE' | translate }}</th>
              <th>{{ 'CHIEF_COMPLAINT' | translate }}</th>
              <th>{{ 'STATUS' | translate }}</th>
              <th class="text-end">{{ 'ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of encounters" class="hover-row">
              <td>
                <div class="font-bold">{{ e.patientName }}</div>
                <div class="text-xs text-muted">{{ e.patientCode }}</div>
              </td>
              <td class="font-semibold">Dr. {{ e.doctorName }}</td>
              <td class="text-sm">{{ e.encounterDate | date:'medium' }}</td>
              <td class="italic text-sm truncate" style="max-width:250px" [title]="e.chiefComplaint">{{ e.chiefComplaint }}</td>
              <td>
                <span class="badge" [ngClass]="e.isFinalized ? 'badge-success' : 'badge-warning'">
                  {{ (e.isFinalized ? 'FINALIZED' : 'DRAFT') | translate }}
                </span>
              </td>
              <td class="text-end">
                <div class="flex justify-end gap-1">
                  <button class="btn btn-icon btn-xs text-primary" (click)="editEncounter(e)">
                    <span class="material-icons-round">edit</span>
                  </button>
                  <button class="btn btn-icon btn-xs text-danger" (click)="deleteEncounter(e.id)">
                    <span class="material-icons-round">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!encounters.length"><td colspan="6" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">history_edu</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VITAL FORM MODAL -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm = false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:750px">
        <div class="modal-header">
          <h3 class="modal-title font-bold">{{ 'RECORD_VITALS' | translate }}</h3>
          <button (click)="showForm = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="form-group">
              <label class="form-label font-bold">{{ 'PATIENT' | translate }}*</label>
              <select class="form-control" [(ngModel)]="form.patientId">
                <option *ngFor="let p of patients" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label font-bold uppercase text-xs">{{ 'APPOINTMENT_CODE' | translate }}</label>
              <input class="form-control" type="number" [(ngModel)]="form.appointmentId" placeholder="Optional">
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 animate-in">
            <div class="form-group">
              <label class="form-label font-bold text-xs">TEMP (°C)</label>
              <input class="form-control font-bold" type="number" step="0.1" [(ngModel)]="form.temperature">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs">BP (SYS)</label>
              <input class="form-control font-bold" type="number" [(ngModel)]="form.bloodPressureSystolic">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs">BP (DIA)</label>
              <input class="form-control font-bold" type="number" [(ngModel)]="form.bloodPressureDiastolic">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs">HEART RATE</label>
              <input class="form-control font-bold" type="number" [(ngModel)]="form.heartRate">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs">SPO2 (%)</label>
              <input class="form-control font-bold" type="number" [(ngModel)]="form.spO2">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs">WEIGHT (KG)</label>
              <input class="form-control font-bold" type="number" step="0.1" [(ngModel)]="form.weightKg">
            </div>
            <div class="form-group col-span-2">
              <label class="form-label font-bold text-xs">RESPIRATORY RATE</label>
              <input class="form-control" type="number" [(ngModel)]="form.respiratoryRate">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveVital()" [disabled]="!form.patientId">
            <span class="material-icons-round mr-1">save</span> {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- ENCOUNTER FORM MODAL -->
    <div class="modal-overlay" *ngIf="showEncounterForm" (click)="showEncounterForm = false">
      <div class="modal modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title font-bold">{{ 'RECORD_ENCOUNTER' | translate }}</h3>
          <button (click)="showEncounterForm = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="form-group">
              <label class="form-label font-bold">{{ 'PATIENT' | translate }}*</label>
              <select class="form-control" [(ngModel)]="encounterForm.patientId" [disabled]="encounterForm.id">
                <option *ngFor="let p of patients" [value]="p.id">{{ p.fullName }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label font-bold">{{ 'DOCTOR' | translate }}*</label>
              <select class="form-control" [(ngModel)]="encounterForm.doctorId" [disabled]="encounterForm.isFinalized">
                <option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label font-bold">{{ 'APPOINTMENT_ID' | translate }}</label>
              <input class="form-control" type="number" [(ngModel)]="encounterForm.appointmentId" [disabled]="encounterForm.isFinalized">
            </div>
          </div>

          <div class="form-group mb-6">
            <label class="form-label font-bold uppercase text-xs">{{ 'CHIEF_COMPLAINT' | translate }}*</label>
            <input class="form-control font-bold" [(ngModel)]="encounterForm.chiefComplaint" [disabled]="encounterForm.isFinalized" placeholder="Reason for encounter...">
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="soap-box relative">
              <span class="soap-letter">S</span>
              <label class="form-label font-bold text-primary">{{ 'SUBJECTIVE' | translate }}</label>
              <textarea class="form-control bg-transparent border-0 p-0" [(ngModel)]="encounterForm.subjective" rows="4" [disabled]="encounterForm.isFinalized" placeholder="Patient history, symptoms..."></textarea>
            </div>
            <div class="soap-box relative">
              <span class="soap-letter">O</span>
              <label class="form-label font-bold text-primary">{{ 'OBJECTIVE' | translate }}</label>
              <textarea class="form-control bg-transparent border-0 p-0" [(ngModel)]="encounterForm.objective" rows="4" [disabled]="encounterForm.isFinalized" placeholder="Physical exam findings, vitals..."></textarea>
            </div>
            <div class="soap-box relative">
              <span class="soap-letter">A</span>
              <label class="form-label font-bold text-primary">{{ 'ASSESSMENT' | translate }}</label>
              <textarea class="form-control bg-transparent border-0 p-0" [(ngModel)]="encounterForm.assessment" rows="4" [disabled]="encounterForm.isFinalized" placeholder="Diagnosis, differential diagnosis..."></textarea>
            </div>
            <div class="soap-box relative">
              <span class="soap-letter">P</span>
              <label class="form-label font-bold text-primary">{{ 'PLAN' | translate }}</label>
              <textarea class="form-control bg-transparent border-0 p-0" [(ngModel)]="encounterForm.plan" rows="4" [disabled]="encounterForm.isFinalized" placeholder="Treatment, medications, referrals..."></textarea>
            </div>
          </div>

          <!-- UNIFIED ORDERS -->
          <div class="grid grid-cols-2 gap-6 mb-6" *ngIf="!encounterForm.isFinalized">
             <!-- PRESCRIPTION SECTION -->
             <div class="order-section">
                <div class="order-title"><span class="material-icons-round">medication</span> PHARMACY ORDERS</div>
                <div class="flex gap-2 mb-4">
                   <select class="form-control" [(ngModel)]="currentMed" (change)="addMedication()">
                      <option [ngValue]="null">Search Medication...</option>
                      <option *ngFor="let m of medicines" [ngValue]="m">{{ m.itemName }} ({{ m.unit }})</option>
                   </select>
                </div>
                <div class="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                   <div *ngFor="let mi of encounterOrders.medications; let i = index" class="item-row">
                      <div class="text-xs">
                         <div class="font-bold">{{ mi.itemName }}</div>
                         <input class="form-control h-7 px-2 border-0 bg-transparent text-[0.6rem] font-bold" [(ngModel)]="mi.dosage" placeholder="Dosage (e.g. 500mg)">
                      </div>
                      <input class="form-control h-8 text-center font-bold" type="number" [(ngModel)]="mi.quantity" placeholder="Qty">
                      <select class="form-control h-8 text-[0.6rem] font-bold" [(ngModel)]="mi.frequency">
                         <option value="Once Daily">Once Daily</option>
                         <option value="BID (2x)">BID (2x)</option>
                         <option value="TID (3x)">TID (3x)</option>
                         <option value="QID (4x)">QID (4x)</option>
                         <option value="As Needed">As Needed</option>
                      </select>
                      <button class="btn btn-icon btn-xs text-danger" (click)="removeMed(i)"><span class="material-icons-round">close</span></button>
                   </div>
                </div>
             </div>

             <!-- DIAGNOSTIC ORDERS -->
             <div class="order-section">
                <div class="order-title"><span class="material-icons-round">biotech</span> DIAGNOSTICS & IMAGING</div>
                <div class="flex flex-col gap-4">
                   <div>
                      <div class="text-[0.6rem] font-black text-muted uppercase mb-2">Laboratory Tests</div>
                      <div class="flex flex-wrap gap-2">
                         <div *ngFor="let t of labTests" class="test-pill cursor-pointer hover:bg-opacity-20" 
                              [class.bg-primary]="isTestSelected(t.id, 'lab')"
                              (click)="toggleTest(t, 'lab')">
                            {{ t.name }}
                            <span class="material-icons-round text-xs">{{ isTestSelected(t.id, 'lab') ? 'check_circle' : 'add' }}</span>
                         </div>
                      </div>
                   </div>
                   <div class="pt-4 border-top">
                      <div class="text-[0.6rem] font-black text-muted uppercase mb-2">Imaging (Radiology)</div>
                      <div class="flex flex-wrap gap-2">
                         <div *ngFor="let rt of radTests" class="test-pill cursor-pointer hover:bg-opacity-20"
                              [class.bg-accent]="isTestSelected(rt.id, 'rad')"
                              (click)="toggleTest(rt, 'rad')">
                            {{ rt.name }}
                            <span class="material-icons-round text-xs">{{ isTestSelected(rt.id, 'rad') ? 'check_circle' : 'add' }}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-glass border rounded-xl" *ngIf="!encounterForm.isFinalized">
            <input type="checkbox" id="finalize" [(ngModel)]="encounterForm.isFinalized" style="width:20px;height:20px">
            <div>
              <label for="finalize" class="m-0 font-bold cursor-pointer">{{ 'FINALIZE_RECORDS' | translate }}</label>
              <p class="text-xs text-muted m-0">{{ 'FINALIZE_WARNING' | translate }}</p>
            </div>
          </div>
          <div *ngIf="encounterForm.isFinalized" class="p-4 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-xl flex items-center gap-3">
            <span class="material-icons-round text-success">verified</span>
            <span class="font-bold text-success">{{ 'RECORDS_LOCKED' | translate }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showEncounterForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveEncounter()" *ngIf="!encounterForm.isFinalized" [disabled]="!encounterForm.patientId || !encounterForm.chiefComplaint">
            <span class="material-icons-round mr-1">check_circle</span> {{ 'SAVE_ENCOUNTER' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ClinicalComponent implements OnInit {
  tab = 'vitals';
  vitals: any[] = [];
  encounters: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  search = '';
  showForm = false;
  showEncounterForm = false;
  form: any = {};
  encounterForm: any = {};

  medicines: any[] = [];
  labTests: any[] = [];
  radTests: any[] = [];
  currentMed: any = null;
  encounterOrders = { medications: [] as any[], labTestIds: [] as number[], radTestIds: [] as number[] };

  constructor(
    private clinical: ClinicalService,
    private patientSvc: PatientService,
    private doctorSvc: DoctorService,
    private labSvc: LabService,
    private radSvc: RadiologyService,
    private invSvc: InventoryService,
    private rxSvc: PharmacyService,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.load();
    this.patientSvc.getAll({ pageSize: 1000 }).subscribe((r: any) => this.patients = r.items);
    this.doctorSvc.getAll({ pageSize: 1000 }).subscribe((r: any) => this.doctors = r.items);
    this.invSvc.getItems({}, 'Pharmacy').subscribe(r => this.medicines = r.items);
    this.labSvc.getTests({ pageSize: 1000 }).subscribe((r: any) => this.labTests = r.items || r);
    this.radSvc.getTests({ pageSize: 1000 }).subscribe((r: any) => this.radTests = r.items || r);
  }

  load() {
    if (this.tab === 'vitals') this.loadVitals();
    else this.loadEncounters();
  }

  loadVitals() {
    this.clinical.getVitals({ search: this.search, page: 1, pageSize: 50 }).subscribe(r => this.vitals = r.items);
  }

  loadEncounters() {
    this.clinical.getEncounters({ search: this.search, page: 1, pageSize: 50 }).subscribe(r => this.encounters = r.items);
  }

  openVitalForm() {
    this.form = { patientId: null, appointmentId: null };
    this.showForm = true;
  }

  saveVital() {
    this.clinical.createVital(this.form).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showForm = false;
        this.loadVitals();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  deleteVital(id: number) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.clinical.deleteVital(id).subscribe(() => {
        this.toast.success(this.translate.instant('SUCCESS_DELETE'));
        this.loadVitals();
      });
    }
  }

  openEncounterForm() {
    this.encounterForm = { patientId: null, doctorId: null, isFinalized: false };
    this.showEncounterForm = true;
  }

  editEncounter(e: any) {
    this.encounterForm = { ...e };
    this.showEncounterForm = true;
  }

  saveEncounter() {
    if (this.encounterForm.isFinalized && !confirm(this.translate.instant('FINALIZE_ENCOUNTER_WARNING'))) {
      return;
    }

    const obs = this.encounterForm.id
      ? this.clinical.updateEncounter(this.encounterForm.id, this.encounterForm)
      : this.clinical.createEncounter(this.encounterForm);

    obs.subscribe({
      next: (res: any) => {
        // Trigger orders if any
        this._processOrders(res.id || this.encounterForm.id);

        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showEncounterForm = false;
        this.loadEncounters();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  private _processOrders(encounterId: number) {
    const patientId = this.encounterForm.patientId;
    const doctorId = this.encounterForm.doctorId;

    // 1. Create Prescription if meds exist
    if (this.encounterOrders.medications.length > 0) {
      this.rxSvc.createPrescription({
        patientId, doctorId, encounterId,
        notes: 'Generated from clinical encounter',
        items: this.encounterOrders.medications.map(m => ({
          itemId: m.itemId,
          dosage: m.dosage || 'As directed',
          frequency: m.frequency || 'Once Daily',
          duration: '5 days',
          quantity: m.quantity || 1
        }))
      }).subscribe();
    }

    // 2. Create Lab Request
    if (this.encounterOrders.labTestIds.length > 0) {
      this.labSvc.createRequest({
        patientId, doctorId,
        requestDate: new Date(),
        testIds: this.encounterOrders.labTestIds
      }).subscribe();
    }

    // 3. Create Radiology Request
    if (this.encounterOrders.radTestIds.length > 0) {
      this.radSvc.createRequest({
        patientId, doctorId,
        requestDate: new Date(),
        testIds: this.encounterOrders.radTestIds
      }).subscribe();
    }
  }

  addMedication() {
    if (!this.currentMed) return;
    if (!this.encounterOrders.medications.find(m => m.itemId === this.currentMed.id)) {
      this.encounterOrders.medications.push({
        itemId: this.currentMed.id,
        itemName: this.currentMed.itemName,
        quantity: 1,
        dosage: '',
        frequency: 'Once Daily'
      });
    }
    this.currentMed = null;
  }

  removeMed(index: number) {
    this.encounterOrders.medications.splice(index, 1);
  }

  toggleTest(test: any, type: 'lab' | 'rad') {
    const list = type === 'lab' ? this.encounterOrders.labTestIds : this.encounterOrders.radTestIds;
    const idx = list.indexOf(test.id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(test.id);
  }

  isTestSelected(id: number, type: 'lab' | 'rad') {
    const list = type === 'lab' ? this.encounterOrders.labTestIds : this.encounterOrders.radTestIds;
    return list.includes(id);
  }

  deleteEncounter(id: number) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.clinical.deleteEncounter(id).subscribe(() => {
        this.toast.success(this.translate.instant('SUCCESS_DELETE'));
        this.loadEncounters();
      });
    }
  }
}
