import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PharmacyService, PatientService, InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .rx-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 20px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
    .rx-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    
    .status-rx-pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .status-rx-dispensed { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .status-rx-cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    
    .dispense-item { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 20px; transition: 0.2s; }
    .dispense-item:hover { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }
    
    .batch-selector { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .batch-option { padding: 12px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; }
    .batch-option:hover { border-color: var(--primary); }
    .batch-option.selected { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }
    .batch-option.selected::after { content: 'check_circle'; font-family: 'Material Icons Round'; position: absolute; top: 4px; right: 4px; color: var(--primary); font-size: 16px; }

    .tab-switcher { display: flex; background: rgba(0,0,0,0.2); p: 6px; border-radius: 16px; width: fit-content; border: 1px solid var(--border); margin-bottom: 24px; }
    .tab-trigger { padding: 12px 28px; border-radius: 12px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; font-size: 0.85rem; }
    .tab-trigger.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.4); }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'PHARMACY' | translate }}</h1>
        <p class="page-subtitle">{{ 'PHARMACY_MANAGEMENT_SUBTITLE' | translate }}</p>
      </div>
      <button class="btn btn-primary px-4 shadow-primary" (click)="openRxForm()">
        <span class="material-icons-round mr-1" style="font-size:20px">add_task</span> {{ 'NEW_PRESCRIPTION' | translate }}
      </button>
    </div>

    <div class="tab-switcher animate-in">
      <button class="tab-trigger" [class.active]="tab==='prescriptions'" (click)="tab='prescriptions';loadPrescriptions()">
        <span class="material-icons-round">receipt_long</span> {{ 'PRESCRIPTIONS' | translate }}
      </button>
      <button class="tab-trigger" [class.active]="tab==='dispensing'" (click)="tab='dispensing';loadPending()">
        <span class="material-icons-round">medication</span> {{ 'DISPENSING' | translate }}
      </button>
    </div>

    <!-- PRESCRIPTIONS LIST -->
    <div *ngIf="tab==='prescriptions'" class="animate-in">
       <div class="card p-0 overflow-hidden">
         <div class="p-4 border-bottom bg-glass flex justify-between items-center">
           <div class="search-bar" style="max-width:350px">
             <span class="material-icons-round search-icon">search</span>
             <input class="form-control" [placeholder]="'SEARCH_PRESCRIPTIONS' | translate" [(ngModel)]="search" (input)="loadPrescriptions()">
           </div>
         </div>
         <div class="table-container">
           <table class="table">
             <thead>
               <tr>
                 <th>Rx #</th>
                 <th>{{ 'PATIENT' | translate }}</th>
                 <th>{{ 'DOCTOR' | translate }}</th>
                 <th>{{ 'DATE' | translate }}</th>
                 <th>{{ 'ITEMS' | translate }}</th>
                 <th>{{ 'STATUS' | translate }}</th>
                 <th class="text-end">{{ 'ACTIONS' | translate }}</th>
               </tr>
             </thead>
             <tbody>
               <tr *ngFor="let p of prescriptions" class="hover-row">
                 <td><span class="badge badge-secondary font-mono">{{ p.prescriptionNumber }}</span></td>
                 <td>
                    <div class="font-bold">{{ p.patientName }}</div>
                    <div class="text-xs text-muted">{{ p.patientCode }}</div>
                 </td>
                 <td class="font-semibold">Dr. {{ p.doctorName || 'N/A' }}</td>
                 <td class="text-sm">{{ p.prescriptionDate | date:'medium' }}</td>
                 <td><span class="badge badge-primary">{{ p.items.length }} {{ 'MEDS' | translate }}</span></td>
                 <td>
                   <span class="badge font-bold uppercase text-xs" [ngClass]="'status-rx-' + p.status.toLowerCase().replace(' ', '-')">
                     {{ (p.status === 'RxPending' ? 'PENDING' : p.status) | translate }}
                   </span>
                 </td>
                 <td class="text-end">
                   <button class="btn btn-icon btn-xs text-primary" (click)="viewPrescription(p)">
                     <span class="material-icons-round">visibility</span>
                   </button>
                 </td>
               </tr>
               <tr *ngIf="!prescriptions.length"><td colspan="7" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">receipt_long</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
             </tbody>
           </table>
         </div>
       </div>
    </div>

    <!-- DISPENSING COUNTER -->
    <div *ngIf="tab==='dispensing'" class="animate-in">
       <div class="mb-6 flex justify-between items-center">
         <div class="search-bar" style="max-width:350px">
           <span class="material-icons-round search-icon">person_search</span>
           <input class="form-control" [placeholder]="'SEARCH_WAITING_LIST' | translate" [(ngModel)]="pSearch" (input)="loadPending()">
         </div>
         <div class="px-3 py-1 bg-glass border rounded-lg text-sm font-bold">
            {{ pendingItems.length }} {{ 'PENDING_ITEMS' | translate }}
         </div>
       </div>
       
       <div class="grid grid-cols-1 gap-4">
          <div *ngFor="let pi of pendingItems" class="dispense-item animate-in">
             <div class="w-14 h-14 rounded-2xl bg-primary bg-opacity-10 border border-primary border-opacity-20 flex items-center justify-center text-primary">
                <span class="material-icons-round" style="font-size:32px">medication_liquid</span>
             </div>
             <div class="flex-grow">
                <div class="flex items-center gap-2 mb-1">
                   <span class="font-black text-lg">{{ pi.patientName }}</span>
                   <span class="text-xs text-muted font-bold p-1 px-2 bg-glass border rounded-md">RX-{{ pi.prescriptionId }}</span>
                </div>
                <div class="flex items-center gap-3">
                   <div class="px-2 py-1 bg-primary text-white text-xs font-black rounded-lg">{{ pi.itemName }}</div>
                   <div class="text-sm font-bold text-muted">{{ pi.dosage }} | {{ pi.frequency }} | {{ pi.duration }}</div>
                </div>
             </div>
             <div class="text-right">
                <div class="text-2xl font-black text-primary mb-1">{{ pi.quantity }} <span class="text-xs text-muted">QTY</span></div>
                <button class="btn btn-primary px-4 shadow-primary" (click)="openDispenseForm(pi)">
                   <span class="material-icons-round mr-1" style="font-size:18px">check_circle</span> {{ 'DISPENSE' | translate }}
                </button>
             </div>
          </div>
          <div *ngIf="!pendingItems.length" class="p-20 text-center text-muted border border-dashed rounded-3xl">
             <span class="material-icons-round text-6xl opacity-20 mb-4">medication</span>
             <p class="font-bold text-lg text-muted">{{ 'CLEAR_WAITING_LIST' | translate }}</p>
          </div>
       </div>
    </div>

    <!-- RX FORM MODAL -->
    <div class="modal-overlay" *ngIf="showRxForm" (click)="showRxForm=false">
      <div class="modal modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ 'NEW_PRESCRIPTION' | translate }}</h3>
           <button (click)="showRxForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
           <div class="grid grid-cols-2 gap-6 mb-8 p-6 bg-glass border rounded-2xl">
              <div class="form-group">
                 <label class="form-label font-bold">{{ 'PATIENT' | translate }}*</label>
                 <select class="form-control" [(ngModel)]="rxForm.patientId">
                    <option *ngFor="let p of patients" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
                 </select>
              </div>
              <div class="form-group">
                 <label class="form-label font-bold uppercase text-xs">{{ 'CLINICAL_NOTES' | translate }}</label>
                 <textarea class="form-control" [(ngModel)]="rxForm.notes" rows="1" placeholder="Diagnosis or special instructions..."></textarea>
              </div>
           </div>
           
           <div class="mb-4 flex items-center justify-between">
              <h4 class="font-bold flex items-center gap-2"><span class="material-icons-round text-primary">pill</span> {{ 'MEDICATIONS' | translate }}</h4>
              <button class="btn btn-icon btn-sm btn-primary" (click)="addRxItem()"><span class="material-icons-round">add</span></button>
           </div>
           
           <div class="flex flex-col gap-3">
              <div *ngFor="let item of rxForm.items; let i = index" class="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] gap-3 items-end p-3 bg-glass border rounded-xl animate-in">
                 <div class="form-group">
                    <label class="form-label text-xs font-bold">{{ 'MEDICINE' | translate }}</label>
                    <select class="form-control" [(ngModel)]="item.itemId">
                       <option *ngFor="let m of medicines" [value]="m.id">{{ m.itemName }}</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="form-label text-xs font-bold">{{ 'DOSAGE' | translate }}</label>
                    <input class="form-control" [(ngModel)]="item.dosage" placeholder="500mg">
                 </div>
                 <div class="form-group">
                    <label class="form-label text-xs font-bold">{{ 'FREQ' | translate }}</label>
                    <input class="form-control" [(ngModel)]="item.frequency" placeholder="TID">
                 </div>
                 <div class="form-group">
                    <label class="form-label text-xs font-bold">{{ 'DURATION' | translate }}</label>
                    <input class="form-control" [(ngModel)]="item.duration" placeholder="5d">
                 </div>
                 <div class="form-group">
                    <label class="form-label text-xs font-bold">{{ 'QTY' | translate }}</label>
                    <input class="form-control font-bold" type="number" [(ngModel)]="item.quantity">
                 </div>
                 <button class="btn btn-icon btn-xs text-danger mb-1" (click)="rxForm.items.splice(i, 1)"><span class="material-icons-round">delete_outline</span></button>
              </div>
           </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showRxForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary shadow-primary" (click)="savePrescription()" [disabled]="!rxForm.patientId || !rxForm.items.length">
            <span class="material-icons-round mr-1">send</span> {{ 'SAVE_AND_RELEASE' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- DISPENSE MODAL -->
    <div class="modal-overlay" *ngIf="showDispense" (click)="showDispense=false">
       <div class="modal" (click)="$event.stopPropagation()" style="max-width:550px">
          <div class="modal-header">
             <h3 class="modal-title font-bold">{{ 'DISPENSE_MEDICATION' | translate }}</h3>
             <button (click)="showDispense=false" class="btn-close">×</button>
          </div>
          <div class="modal-body">
             <div class="p-6 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-3xl mb-8 flex items-center justify-between">
                <div>
                   <h4 class="font-black text-2xl text-primary m-0">{{ selectedDispense.itemName }}</h4>
                   <p class="text-sm font-bold text-muted m-0">{{ selectedDispense.dosage }} | {{ selectedDispense.frequency }}</p>
                </div>
                <div class="text-right">
                   <div class="text-xs text-muted font-bold uppercase">{{ 'DISPENSING_QTY' | translate }}</div>
                   <div class="text-3xl font-black text-primary">{{ selectedDispense.quantity }}</div>
                </div>
             </div>

             <div class="form-group mb-8">
                <label class="form-label font-bold uppercase text-xs mb-3 block tracking-widest">{{ 'SELECT_BATCH_FROM_INVENTORY' | translate }}*</label>
                <div *ngIf="!itemBatches.length" class="p-8 text-center text-danger bg-danger bg-opacity-5 border border-dashed border-danger border-opacity-20 rounded-2xl">
                   <span class="material-icons-round text-5xl mb-2">inventory_2</span>
                   <p class="font-bold m-0">{{ 'OUT_OF_STOCK_ERROR' | translate }}</p>
                </div>
                <div class="batch-selector">
                   <div *ngFor="let b of itemBatches" 
                        (click)="dispenseForm.itemBatchId = b.id"
                        class="batch-option"
                        [class.selected]="dispenseForm.itemBatchId == b.id"
                        [ngClass]="{'border-danger bg-danger bg-opacity-5': b.isExpired, 'border-warning bg-warning bg-opacity-5': b.isExpiringSoon && !b.isExpired}">
                      <div class="flex justify-between items-start">
                         <div class="font-black text-lg">{{ b.batchNumber }}</div>
                         <span class="material-icons-round text-warning text-sm" *ngIf="b.isExpiringSoon && !b.isExpired">warning</span>
                         <span class="material-icons-round text-danger text-sm" *ngIf="b.isExpired">history_toggle_off</span>
                      </div>
                      <div class="text-xs text-muted font-bold">{{ 'STOCK' | translate }}: <span class="text-primary">{{ b.quantityRemaining }}</span></div>
                      <div class="text-[0.6rem] font-bold mt-1" [class.text-danger]="b.isExpired" [class.text-warning]="b.isExpiringSoon && !b.isExpired">
                         {{ 'EXP' | translate }}: {{ b.expiryDate | date:'MMM yyyy' }}
                      </div>
                   </div>
                </div>
             </div>

             <div class="form-group">
                <label class="form-label font-bold uppercase text-xs mb-3 block tracking-widest">{{ 'FINAL_DISPENSE_QUANTITY' | translate }}</label>
                <input class="form-control text-3xl text-center font-black text-primary h-20 rounded-3xl" type="number" [(ngModel)]="dispenseForm.quantity">
             </div>
          </div>
          <div class="modal-footer flex-col gap-2">
             <button class="btn btn-primary btn-lg w-full shadow-primary py-4 rounded-2xl font-black uppercase tracking-widest" (click)="confirmDispense()" [disabled]="!dispenseForm.itemBatchId">
                <span class="material-icons-round mr-2">check_circle</span> {{ 'COMPLETE_DISPENSING' | translate }}
             </button>
             <button class="btn btn-secondary w-full border-0" (click)="showDispense=false">{{ 'CANCEL' | translate }}</button>
          </div>
       </div>
    </div>
  `
})
export class PharmacyComponent implements OnInit {
  tab = 'prescriptions';
  prescriptions: any[] = [];
  pendingItems: any[] = [];
  patients: any[] = [];
  medicines: any[] = [];
  search = '';
  pSearch = '';
  showRxForm = false;
  rxForm: any = { patientId: null, items: [], notes: '' };

  showDispense = false;
  selectedDispense: any = null;
  itemBatches: any[] = [];
  dispenseForm: any = { itemBatchId: null, quantity: 1 };

  constructor(
    private pharmacy: PharmacyService,
    private patientSvc: PatientService,
    private invSvc: InventoryService,
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadPrescriptions();
    this.patientSvc.getAll({ pageSize: 1000 }).subscribe((r: any) => this.patients = r.items);
    this.invSvc.getItems({ pageSize: 1000 } as any, 'Medicine').subscribe((r: any) => this.medicines = r.items);
  }

  loadPrescriptions() {
    this.pharmacy.getPrescriptions({ search: this.search, page: 1, pageSize: 50 }).subscribe(r => this.prescriptions = r.items);
  }

  loadPending() {
    this.pharmacy.getPendingDispensing().subscribe(data => {
      this.pendingItems = this.pSearch ? data.filter((i: any) => i.patientName.toLowerCase().includes(this.pSearch.toLowerCase())) : data;
    });
  }

  openRxForm() {
    this.rxForm = { patientId: null, notes: '', items: [] };
    this.addRxItem();
    this.showRxForm = true;
  }

  addRxItem() {
    this.rxForm.items.push({ itemId: null, dosage: '', frequency: 'TID', duration: '5 Days', quantity: 10 });
  }

  savePrescription() {
    this.pharmacy.createPrescription(this.rxForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showRxForm = false;
        this.loadPrescriptions();
      },
      error: (err) => this.toast.error(err.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }

  viewPrescription(p: any) {
    this.toast.info(`${this.translate.instant('RX')} ${p.prescriptionNumber}: ${p.items.length} ${this.translate.instant('MEDS')}`);
  }

  openDispenseForm(pi: any) {
    this.selectedDispense = pi;
    this.dispenseForm = { itemBatchId: null, quantity: pi.quantity };
    this.pharmacy.getAvailableBatches(pi.itemId).subscribe(batches => {
      this.itemBatches = batches;
      if (this.itemBatches.length > 0) {
        // Auto-select the first batch (which is best per FEFO) unless it's expired
        const bestBatch = this.itemBatches.find(b => !b.isExpired);
        if (bestBatch) this.dispenseForm.itemBatchId = bestBatch.id;
      }
      this.showDispense = true;
    });
  }

  confirmDispense() {
    this.pharmacy.dispenseItem(this.selectedDispense.id, this.dispenseForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_DISPENSE') || 'Dispensed successfully');
        this.showDispense = false;
        this.loadPending();
      },
      error: (err) => this.toast.error(err.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }
}
