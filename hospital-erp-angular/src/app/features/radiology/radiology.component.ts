import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RadiologyService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-radiology',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .rad-tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); }
    .rad-tab-btn { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .rad-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }

    .rad-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
    .rad-card { background: rgba(var(--card-bg-rgb), 0.4); border: 1px solid var(--border); border-radius: 24px; padding: 24px; transition: 0.3s; position: relative; overflow: hidden; }
    .rad-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(var(--card-bg-rgb), 0.6); box-shadow: var(--shadow-lg); }
    .rad-card::after { content: ''; position: absolute; right: -20px; bottom: -20px; font-family: 'Material Icons Round'; font-size: 100px; opacity: 0.05; }
    .status-completed::after { content: 'check_circle'; color: var(--success); }
    .status-pending::after { content: 'history'; color: var(--warning); }

    .findings-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 16px; transition: 0.2s; }
    .findings-card:hover { border-color: var(--primary); }
    .rad-textarea { background: transparent; border: 1px solid var(--border); border-radius: 14px; padding: 16px; width: 100%; color: var(--text-primary); font-family: inherit; resize: none; transition: 0.2s; }
    .rad-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); outline: none; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'IMAGING_RADIOLOGY' | translate }}</h1>
        <p class="page-subtitle">{{ 'RADIOLOGY_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <div class="search-bar h-12" style="width:280px">
           <span class="material-icons-round search-icon">search</span>
           <input class="form-control rounded-xl border-0 bg-transparent" [placeholder]="'SEARCH_XRAY_CT' | translate" [(ngModel)]="reqSearch" (input)="loadRequests()">
        </div>
        <button class="btn btn-primary px-6 rounded-xl shadow-primary font-black flex items-center gap-2" (click)="openRequestForm()">
          <span class="material-icons-round">wallpaper</span> {{ 'NEW_IMAGING_ORDER' | translate }}
        </button>
      </div>
    </div>

    <div class="rad-tab-nav animate-in">
       <button class="rad-tab-btn" [class.active]="tab==='requests'" (click)="tab='requests';loadRequests()">
          <span class="material-icons-round">view_timeline</span> {{ 'IMAGING_QUEUE' | translate }}
       </button>
       <button class="rad-tab-btn" [class.active]="tab==='tests'" (click)="tab='tests';loadTests()">
          <span class="material-icons-round">camera_alt</span> {{ 'MODALITY_CATALOG' | translate }}
       </button>
    </div>

    <!-- IMAGING QUEUE -->
    <div *ngIf="tab==='requests'" class="animate-in">
       <div class="rad-grid">
          <div *ngFor="let r of requests" class="rad-card animate-in" [ngClass]="'status-' + r.status.toLowerCase()">
             <div class="flex justify-between items-start mb-6">
                <div>
                   <div class="badge badge-secondary font-mono mb-2">{{ r.requestNumber }}</div>
                   <div class="font-black text-xl tracking-tighter">{{ r.patientName }}</div>
                   <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest">{{ r.requestDate | date:'medium' }}</div>
                </div>
                <span class="badge uppercase text-[0.6rem] tracking-widest" [ngClass]="r.status==='Completed'?'badge-success':'badge-warning'">
                   {{ r.status | translate }}
                </span>
             </div>

             <div class="bg-glass p-3 rounded-2xl border mb-6 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary bg-opacity-10 text-primary flex items-center justify-center"><span class="material-icons-round">settings_overscan</span></div>
                <div class="flex-1">
                   <div class="text-[0.6rem] font-black uppercase text-muted tracking-widest">{{ 'REQUESTED_SCAN'|translate }}</div>
                   <div class="font-bold text-sm truncate uppercase">{{ r.testNames || 'MULTIPLE_PROCEDURES' | translate }}</div>
                </div>
             </div>

             <div class="flex items-center justify-between pt-4 border-top">
                <div class="text-[0.6rem] font-black uppercase text-muted">DR. {{ r.doctorName || 'OPD' }}</div>
                <button class="btn btn-primary h-11 px-6 rounded-xl font-black text-xs flex items-center gap-2 shadow-primary" (click)="viewDetails(r)">
                   <span class="material-icons-round text-sm">visibility</span> {{ 'VIEW_DETAILS' | translate }}
                </button>
             </div>
          </div>
       </div>

       <div *ngIf="!requests.length" class="p-20 text-center card bg-glass grayscale opacity-30">
          <span class="material-icons-round text-6xl mb-4">camera</span>
          <h3 class="font-black uppercase tracking-widest">{{ 'NO_PENDING_SCANS' | translate }}</h3>
       </div>
    </div>

    <!-- CATALOG VIEW -->
    <div *ngIf="tab==='tests'" class="animate-in">
       <div class="card p-0 overflow-hidden shadow-2xl">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'MODALITY_CODE' | translate }}</th>
                      <th>{{ 'PROCEDURE_NAME' | translate }}</th>
                      <th>{{ 'CATEGORY' | translate }}</th>
                      <th class="text-end">{{ 'FEE' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let t of tests" class="hover-row">
                      <td><span class="badge badge-info font-mono">{{ t.testCode }}</span></td>
                      <td class="font-black text-lg">{{ t.name }}</td>
                      <td><span class="badge badge-secondary uppercase text-[0.65rem] tracking-widest">{{ t.category }}</span></td>
                      <td class="text-end font-black text-primary">{{ t.price | currency }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- IMAGING DETAILS/REPORTING MODAL -->
    <div class="modal-overlay" *ngIf="showDetails" (click)="showDetails=false">
       <div class="modal modal-xl animate-in" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-primary bg-opacity-10 text-primary flex items-center justify-center font-black">X</div>
                <div>
                   <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'RADIOLOGY_REPORTING_TOOL' | translate }}</h3>
                   <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest">ORDER #{{ selectedReq?.requestNumber }} &bull; {{ selectedReq?.patientName }}</div>
                </div>
             </div>
             <button (click)="showDetails=false" class="btn-close">×</button>
          </div>
          <div class="modal-body custom-scrollbar p-10 bg-glass" style="min-height:500px">
             <div *ngFor="let res of selectedReq?.results" class="findings-card animate-in border-primary border-opacity-20">
                <h4 class="font-black text-xl mb-6 uppercase tracking-tight text-primary border-b pb-2">{{ res.testName }}</h4>
                <div class="grid grid-cols-2 gap-8">
                   <div class="form-group">
                      <label class="form-label font-black text-[0.65rem] uppercase tracking-widest mb-3">{{ 'RADIOLOGICAL_FINDINGS'|translate }}</label>
                      <textarea class="rad-textarea" rows="8" [(ngModel)]="res.findings" [disabled]="selectedReq.status==='Completed'"></textarea>
                   </div>
                   <div class="form-group">
                      <label class="form-label font-black text-[0.65rem] uppercase tracking-widest mb-3">{{ 'CLINICAL_IMPRESSION'|translate }}</label>
                      <textarea class="rad-textarea" rows="8" [(ngModel)]="res.impression" [disabled]="selectedReq.status==='Completed'"></textarea>
                   </div>
                </div>
                
                <div class="grid grid-cols-3 gap-6 mt-8 p-6 bg-glass border rounded-3xl">
                   <div class="form-group mb-0"><label class="form-label font-black text-[0.6rem] uppercase">{{ 'IMAGE_ACCESS_URL' | translate }}</label><input class="form-control font-mono text-[0.7rem]" [(ngModel)]="res.imageUrl"></div>
                   <div class="form-group mb-0"><label class="form-label font-black text-[0.6rem] uppercase">{{ 'PERFORMING_TECH' | translate }}</label><input class="form-control" [(ngModel)]="res.performedBy"></div>
                   <div class="form-group mb-0"><label class="form-label font-black text-[0.6rem] uppercase">{{ 'SIGNING_RADIOLOGIST' | translate }}</label><input class="form-control font-bold" [(ngModel)]="res.radiologistName"></div>
                </div>

                <div class="flex justify-end mt-8">
                   <button *ngIf="selectedReq.status !== 'Completed'" class="btn btn-primary px-8 rounded-xl font-black shadow-primary h-12" (click)="saveResult(res)">
                      <span class="material-icons-round mr-1">save</span> {{ 'SAVE_FINDINGS' | translate }}
                   </button>
                   <div *ngIf="selectedReq.status === 'Completed'" class="bg-success bg-opacity-10 text-success p-3 px-6 rounded-xl font-black flex items-center gap-2 border border-success border-opacity-30">
                      <span class="material-icons-round">verified_user</span> {{ 'REPORT_CERTIFIED' | translate }}
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer bg-glass">
             <div class="text-[0.65rem] font-black uppercase text-muted tracking-widest flex items-center gap-2"><span class="material-icons-round text-primary">info</span> {{ 'PACS_INTEGRATION_HINT' | translate }}</div>
             <div class="flex gap-2">
                <button class="btn btn-secondary px-6 rounded-xl font-bold" (click)="showDetails=false">{{ 'CANCEL' | translate }}</button>
                <button class="btn btn-success px-10 rounded-xl font-black shadow-lg h-12 text-white" (click)="completeRequest()" *ngIf="selectedReq?.status==='Pending'">
                   {{ 'SUBMIT_FINAL_REPORT' | translate }}
                </button>
             </div>
          </div>
       </div>
    </div>

    <!-- NEW MODALITY ORDER MODAL -->
    <div class="modal-overlay" *ngIf="showReqForm" (click)="showReqForm=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:520px">
          <div class="modal-header"><h3 class="modal-title font-black uppercase tracking-tighter">{{ 'NEW_IMAGING_PROTOCOL' | translate }}</h3><button (click)="showReqForm=false" class="btn-close">×</button></div>
          <div class="modal-body">
             <div class="form-group mb-8">
                <label class="form-label font-black text-xs uppercase">{{ 'PATIENT_IDENTIFICATION' | translate }}*</label>
                <select class="form-control h-14 rounded-2xl font-black" [(ngModel)]="reqForm.patientId">
                   <option [ngValue]="null">— SELECT PATIENT —</option>
                   <option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
                </select>
             </div>
             <div class="form-group">
                <label class="form-label font-black text-xs uppercase mb-4">{{ 'PROCEDURE_CATALOG' | translate }}*</label>
                <div class="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-2">
                   <div *ngFor="let t of tests" class="p-3 bg-glass border rounded-xl flex items-center gap-3 cursor-pointer hover:border-primary transition" [class.border-primary]="isTestSelected(t.id)" (click)="toggleTest(t.id)">
                      <span class="material-icons-round text-primary">{{ isTestSelected(t.id) ? 'check_circle' : 'circle_outline' }}</span>
                      <div class="flex-1">
                         <div class="font-bold text-sm">{{ t.name }}</div>
                         <div class="text-[0.6rem] font-black uppercase opacity-40">{{ t.category }}</div>
                      </div>
                      <div class="font-black text-sm text-primary opacity-80">{{ t.price | currency }}</div>
                   </div>
                </div>
             </div>
             
             <div class="mt-8 p-6 bg-glass border-2 border-primary border-opacity-30 rounded-3xl flex justify-between items-center shadow-inner">
                <div class="text-[0.65rem] font-black uppercase text-primary tracking-widest">{{ 'TOTAL_ESTIMATED_FEE' | translate }}</div>
                <div class="text-3xl font-black text-primary">{{ calculateTotal() | currency }}</div>
             </div>
          </div>
          <div class="modal-footer border-0">
             <button class="btn btn-primary w-full h-16 rounded-2xl shadow-primary font-black uppercase tracking-widest" (click)="createRequest()" [disabled]="!reqForm.patientId || !reqForm.testIds.length">{{ 'GENERATE_ORDER' | translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class RadiologyComponent implements OnInit {
  tab = 'requests';
  requests: any[] = [];
  tests: any[] = [];
  reqSearch = '';
  testSearch = '';
  showDetails = false;
  selectedReq: any = null;
  showReqForm = false;
  reqForm: any = { patientId: null, testIds: [], notes: '' };
  patientsList: any[] = [];

  constructor(
    private radiology: RadiologyService,
    private patientSvc: PatientService,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadRequests();
    this.loadTests();
    this.patientSvc.getAll({ pageSize: 1000 }).subscribe((r: any) => this.patientsList = r.items);
  }

  loadRequests() {
    this.radiology.getRequests({ search: this.reqSearch, page: 1, pageSize: 50 }).subscribe(r => this.requests = r.items);
  }

  loadTests() {
    this.radiology.getTests({ search: this.testSearch, page: 1, pageSize: 100 }).subscribe(r => this.tests = r.items);
  }

  openRequestForm() {
    this.reqForm = { patientId: null, testIds: [], notes: '', requestDate: new Date().toISOString() };
    this.showReqForm = true;
  }

  isTestSelected(id: number) { return this.reqForm.testIds.includes(id); }

  toggleTest(id: number) {
    const idx = this.reqForm.testIds.indexOf(id);
    if (idx > -1) this.reqForm.testIds.splice(idx, 1);
    else this.reqForm.testIds.push(id);
  }

  calculateTotal() {
    return this.tests.filter(t => this.isTestSelected(t.id)).reduce((acc, t) => acc + (t.price || 0), 0);
  }

  createRequest() {
    this.radiology.createRequest(this.reqForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showReqForm = false;
        this.loadRequests();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  viewDetails(r: any) {
    this.radiology.getRequest(r.id).subscribe(data => {
      this.selectedReq = data;
      this.showDetails = true;
    });
  }

  saveResult(res: any) {
    this.radiology.updateResult(res.id, {
      findings: res.findings,
      impression: res.impression,
      imageUrl: res.imageUrl,
      performedBy: res.performedBy,
      radiologistName: res.radiologistName
    }).subscribe({
      next: () => this.toast.success(this.translate.instant('SUCCESS_RADIOLOGY')),
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  completeRequest() {
    this.radiology.completeRequest(this.selectedReq.id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('RADIOLOGY_COMPLETED'));
        this.showDetails = false;
        this.loadRequests();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }
}
