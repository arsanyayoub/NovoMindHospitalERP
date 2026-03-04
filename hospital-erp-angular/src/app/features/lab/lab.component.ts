import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LabService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .lab-tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); }
    .lab-tab-btn { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .lab-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }

    .lab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    .lab-card { background: rgba(var(--card-bg-rgb), 0.4); border: 1px solid var(--border); border-radius: 24px; padding: 24px; transition: 0.3s; position: relative; overflow: hidden; }
    .lab-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(var(--card-bg-rgb), 0.6); box-shadow: var(--shadow-lg); }
    .lab-card::before { content: ''; position: absolute; top:0; left:0; width:4px; height:100%; background: var(--primary); opacity: 0.3; }
    .lab-card.status-completed::before { background: var(--success); opacity: 1; }
    .lab-card.status-pending::before { background: var(--warning); opacity: 1; }

    .test-pill { display: flex; align-items: center; gap: 8px; background: rgba(var(--primary-rgb), 0.05); border: 1px solid var(--border); padding: 8px 12px; border-radius: 12px; margin-bottom: 8px; transition: 0.2s; cursor: pointer; }
    .test-pill:hover { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }
    .test-pill.selected { border-color: var(--primary); background: var(--primary); color: white; }

    .result-entry { background: rgba(var(--card-bg-rgb), 0.3); border: 1.5px solid var(--border); border-radius: 20px; padding: 20px; margin-bottom: 16px; transition: 0.2s; }
    .result-entry:hover { border-color: var(--primary); }
    .val-input { background: transparent; border: none; border-bottom: 2px solid var(--border); width: 100px; text-align: center; font-weight: 800; font-size: 1.2rem; color: var(--primary); transition: 0.2s; }
    .val-input:focus { outline: none; border-color: var(--primary); }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'LABORATORY_DIAGNOSTICS' | translate }}</h1>
        <p class="page-subtitle">{{ 'LAB_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <div class="search-bar h-12" style="width:280px">
           <span class="material-icons-round search-icon">search</span>
           <input class="form-control rounded-xl border-0 bg-transparent" [placeholder]="'SEARCH_REQUESTS' | translate" [(ngModel)]="reqSearch" (input)="loadRequests()">
        </div>
        <button class="btn btn-primary px-6 rounded-xl shadow-primary font-black flex items-center gap-2" (click)="openRequestForm()">
          <span class="material-icons-round">biotech</span> {{ 'CREATE_LAB_ORDER' | translate }}
        </button>
      </div>
    </div>

    <div class="lab-tab-nav animate-in">
       <button class="lab-tab-btn" [class.active]="tab==='requests'" (click)="tab='requests';loadRequests()">
          <span class="material-icons-round">science</span> {{ 'ORDER_QUEUE' | translate }}
       </button>
       <button class="lab-tab-btn" [class.active]="tab==='tests'" (click)="tab='tests';loadTests()">
          <span class="material-icons-round">list_alt</span> {{ 'TEST_CATALOG' | translate }}
       </button>
    </div>

    <!-- REQUEST QUEUE -->
    <div *ngIf="tab==='requests'" class="animate-in">
       <div class="lab-grid">
          <div *ngFor="let r of requests" class="lab-card animate-in" [ngClass]="'status-' + r.status.toLowerCase()">
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

             <div class="bg-glass p-4 rounded-3xl border mb-6">
                <div class="text-[0.6rem] font-black uppercase text-muted mb-3">{{ 'ORDERED_TESTS' | translate }}</div>
                <div class="flex flex-wrap gap-2">
                   <span *ngFor="let res of r.results | slice:0:3" class="badge badge-primary bg-opacity-10 text-primary border-primary border-opacity-20 text-[0.65rem] font-black px-2 py-1 uppercase">{{ res.testName }}</span>
                   <span *ngIf="r.results.length > 3" class="text-xs font-black opacity-30">+{{ r.results.length - 3 }}</span>
                </div>
             </div>

             <div class="flex items-center justify-between pt-4 border-top">
                <div class="text-[0.6rem] font-black uppercase text-muted">DR. {{ r.doctorName || 'AUTO_GEN' | translate }}</div>
                <button class="btn btn-secondary h-11 px-6 rounded-xl font-black text-xs flex items-center gap-2" (click)="viewDetails(r)">
                   <span class="material-icons-round text-sm">edit_note</span> {{ 'RESULT_ENTRY' | translate }}
                </button>
             </div>
          </div>
       </div>

       <div *ngIf="!requests.length" class="p-20 text-center card bg-glass grayscale opacity-30">
          <span class="material-icons-round text-6xl mb-4">biotech</span>
          <h3 class="font-black uppercase tracking-widest">{{ 'QUEUE_IS_EMPTY' | translate }}</h3>
       </div>
    </div>

    <!-- CATALOG VIEW -->
    <div *ngIf="tab==='tests'" class="animate-in">
       <div class="card p-0 overflow-hidden shadow-2xl">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'CODE' | translate }}</th>
                      <th>{{ 'TEST_NAME' | translate }}</th>
                      <th>{{ 'CATEGORY' | translate }}</th>
                      <th class="text-center">{{ 'UNIT' | translate }}</th>
                      <th class="text-end">{{ 'NORMAL_RANGE' | translate }}</th>
                      <th class="text-end">{{ 'COST' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let t of tests" class="hover-row">
                      <td><span class="badge badge-info font-mono">{{ t.testCode }}</span></td>
                      <td class="font-black text-lg">{{ t.name }}</td>
                      <td><span class="badge badge-secondary uppercase text-[0.65rem] tracking-widest">{{ t.category }}</span></td>
                      <td class="text-center font-bold opacity-60">{{ t.unit }}</td>
                      <td class="text-end font-black">{{ t.normalRange }}</td>
                      <td class="text-end font-black text-primary">{{ t.price | currency }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- RESULT ENTRY MODAL -->
    <div class="modal-overlay" *ngIf="showDetails" (click)="showDetails=false">
       <div class="modal modal-xl animate-in" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-primary bg-opacity-10 text-primary flex items-center justify-center font-black">L</div>
                <div>
                   <h3 class="modal-title font-black uppercase tracking-tighter">{{ 'INPUT_DIAGNOSTIC_RESULTS' | translate }}</h3>
                   <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest">ORDER #{{ selectedReq?.requestNumber }} &bull; {{ selectedReq?.patientName }}</div>
                </div>
             </div>
             <button (click)="showDetails=false" class="btn-close">×</button>
          </div>
          <div class="modal-body max-h-[500px] overflow-y-auto px-10 py-8 custom-scrollbar">
             <div *ngFor="let res of selectedReq.results" class="result-entry animate-in">
                <div class="grid grid-cols-12 gap-8 items-center">
                   <div class="col-span-4">
                      <div class="font-black text-xl tracking-tighter">{{ res.testName }}</div>
                      <div class="text-[0.6rem] font-black uppercase text-primary opacity-60">{{ res.category || 'GENERAL_LAB' | translate }}</div>
                   </div>
                   <div class="col-span-3 text-center border-x">
                      <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-2">{{ 'NORMAL_RANGE'|translate }}</div>
                      <div class="font-black text-lg">{{ res.normalRange }} <span class="text-xs opacity-50">{{ res.unit }}</span></div>
                   </div>
                   <div class="col-span-3 flex flex-col items-center">
                      <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-2">{{ 'OBSERVED_VALUE'|translate }}</div>
                      <div class="flex items-end gap-2">
                         <input class="val-input" [(ngModel)]="res.resultValue" [disabled]="selectedReq.status==='Completed'">
                         <span class="text-xs font-black uppercase opacity-40">{{ res.unit }}</span>
                      </div>
                   </div>
                   <div class="col-span-2 text-right">
                      <button *ngIf="selectedReq.status !== 'Completed'" class="btn btn-primary h-12 w-12 rounded-2xl shadow-primary" (click)="saveResult(res)"><span class="material-icons-round">save</span></button>
                      <span *ngIf="selectedReq.status === 'Completed'" class="material-icons-round text-success text-3xl">check_circle</span>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal-footer bg-glass flex justify-between">
             <div class="text-xs font-black uppercase text-muted tracking-widest flex items-center gap-2"><span class="material-icons-round text-success">verified</span> {{ 'DOUBLE_CHECK_VALUES_NOTICE' | translate }}</div>
             <div class="flex gap-3">
                <button class="btn btn-secondary px-8 rounded-xl font-bold" (click)="showDetails=false">{{ 'CANCEL'|translate }}</button>
                <button class="btn btn-primary px-10 rounded-xl font-black shadow-primary h-12" (click)="completeRequest()" *ngIf="selectedReq.status==='Pending'">{{ 'FINALIZE_REPORT'|translate }}</button>
             </div>
          </div>
       </div>
    </div>

    <!-- NEW REQUEST MODAL -->
    <div class="modal-overlay" *ngIf="showReqForm" (click)="showReqForm=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:500px">
          <div class="modal-header"><h3 class="modal-title font-black uppercase tracking-tighter">{{ 'GENERATE_LAB_ORDER' | translate }}</h3><button (click)="showReqForm=false" class="btn-close">×</button></div>
          <div class="modal-body">
             <div class="form-group mb-8">
                <label class="form-label font-black text-xs uppercase">{{ 'TARGET_PATIENT' | translate }}*</label>
                <select class="form-control h-14 rounded-2xl font-bold" [(ngModel)]="reqForm.patientId">
                   <option [ngValue]="null">— SELECT IDENTITY —</option>
                   <option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
                </select>
             </div>
             <div class="form-group">
                <label class="form-label font-black text-xs uppercase mb-4">{{ 'TEST_SELECTION_CATALOG' | translate }}*</label>
                <div class="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   <div *ngFor="let t of tests" class="test-pill" [class.selected]="isTestSelected(t.id)" (click)="toggleTest(t.id)">
                      <span class="material-icons-round text-sm">{{ isTestSelected(t.id) ? 'check_circle' : 'circle' }}</span>
                      <span class="font-bold flex-1">{{ t.name }}</span>
                      <span class="font-black opacity-60 font-mono text-xs">{{ t.price | currency }}</span>
                   </div>
                </div>
             </div>
             
             <div class="mt-8 p-6 bg-glass border-2 border-primary border-opacity-30 rounded-3xl flex justify-between items-center shadow-inner">
                <div class="text-xs font-black uppercase text-primary tracking-widest">{{ 'TOTAL_ORDER_VAL' | translate }}</div>
                <div class="text-3xl font-black text-primary">{{ calculateTotal() | currency }}</div>
             </div>
          </div>
          <div class="modal-footer border-0">
             <button class="btn btn-primary w-full h-16 rounded-2xl shadow-primary font-black uppercase tracking-widest" (click)="createRequest()" [disabled]="!reqForm.patientId || !reqForm.testIds.length">{{ 'INITIALIZE_ORDER' | translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class LabComponent implements OnInit {
  tab = 'requests';
  requests: any[] = [];
  tests: any[] = [];
  reqSearch = '';
  testSearch = '';
  showDetails = false;
  selectedReq: any = null;
  showReqForm = false;
  reqForm: any = { testIds: [] };
  patientsList: any[] = [];

  constructor(
    private lab: LabService,
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
    this.lab.getRequests({ search: this.reqSearch, page: 1, pageSize: 50 }).subscribe(r => this.requests = r.items);
  }

  loadTests() {
    this.lab.getTests({ search: this.testSearch, page: 1, pageSize: 100 }).subscribe(r => this.tests = r.items);
  }

  openRequestForm() {
    this.reqForm = { patientId: null, testIds: [], requestDate: new Date().toISOString() };
    this.showReqForm = true;
  }

  isTestSelected(id: number) { return this.reqForm.testIds.includes(id); }

  toggleTest(id: number) {
    const idx = this.reqForm.testIds.indexOf(id);
    if (idx > -1) this.reqForm.testIds.splice(idx, 1);
    else this.reqForm.testIds.push(id);
  }

  calculateTotal() {
    return this.tests.filter(t => this.reqForm.testIds.includes(t.id)).reduce((sum, t) => sum + (t.price || 0), 0);
  }

  createRequest() {
    this.lab.createRequest(this.reqForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showReqForm = false;
        this.loadRequests();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  viewDetails(r: any) {
    this.selectedReq = r;
    this.showDetails = true;
  }

  saveResult(res: any) {
    this.lab.updateResult(res.id, { resultValue: res.resultValue }).subscribe({
      next: () => this.toast.success(this.translate.instant('LAB_RESULT_SAVED')),
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  completeRequest() {
    this.lab.completeRequest(this.selectedReq.id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('LAB_REQUEST_COMPLETED'));
        this.showDetails = false;
        this.loadRequests();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }
}
