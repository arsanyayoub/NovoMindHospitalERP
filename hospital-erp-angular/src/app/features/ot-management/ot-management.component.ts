import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OTService, PatientService, DoctorService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-ot-management',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'OPERATING_THEATER_MANAGEMENT' | translate }}</h1>
        <p class="text-muted">{{ 'MANAGE_SURGERIES_AND_OT_AVAILABILITY' | translate || 'Manage surgeries and OT availability' }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary" (click)="activeTab = 'theaters'">
          <span class="material-icons-round">meeting_room</span> {{ 'OT_MANAGEMENT' | translate }}
        </button>
        <button class="btn btn-primary" (click)="openScheduleModal()">
          <span class="material-icons-round">add</span> {{ 'SCHEDULE_SURGERY' | translate }}
        </button>
      </div>
    </div>

    <div class="flex border-b mb-6 bg-white dark:bg-gray-800 rounded-xl px-2">
      <button class="px-6 py-4 font-black text-sm transition-all border-b-2" 
        [class.border-primary]="activeTab === 'surgeries'" [class.text-primary]="activeTab === 'surgeries'" [class.border-transparent]="activeTab !== 'surgeries'"
        (click)="activeTab = 'surgeries'">
        {{ 'UPCOMING_SURGERIES' | translate }}
      </button>
      <button class="px-6 py-4 font-black text-sm transition-all border-b-2" 
        [class.border-primary]="activeTab === 'theaters'" [class.text-primary]="activeTab === 'theaters'" [class.border-transparent]="activeTab !== 'theaters'"
        (click)="activeTab = 'theaters'">
        {{ 'OT_MANAGEMENT' | translate }}
      </button>
    </div>

    <div [ngSwitch]="activeTab">
      <!-- Surgeries Tab -->
      <div *ngSwitchCase="'surgeries'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let s of surgeries" class="card hover:shadow-lg transition-all border-none shadow-sm" [class.border-l-4]="true" [ngClass]="getStatusClass(s.status)">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge text-[0.6rem] mb-2" [ngClass]="getPriorityClass(s.priority)">{{ s.priority }}</span>
                <h3 class="font-black text-lg m-0">{{ s.procedureName }}</h3>
                <p class="text-xs font-bold text-muted">{{ s.patientName }}</p>
              </div>
              <div class="text-right">
                <span class="badge badge-outline text-[0.6rem]">{{ s.status }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 mb-4">
              <div class="flex items-center gap-2 text-xs">
                <span class="material-icons-round text-primary text-sm">event</span>
                <span class="font-bold">{{ s.scheduledStartTime | date:'medium' }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="material-icons-round text-accent text-sm">person</span>
                <span class="font-bold">Surgeon: Dr. {{ s.leadSurgeonName }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="material-icons-round text-info text-sm">meeting_room</span>
                <span class="font-bold">{{ s.operatingTheaterName }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-4 border-t border-dashed">
              <button class="btn btn-xs btn-outline" (click)="updateStatus(s, 'Pre-Op')" *ngIf="s.status === 'Scheduled'">{{ 'PRE_OP' | translate }}</button>
              <button class="btn btn-xs btn-outline btn-primary" (click)="updateStatus(s, 'Intra-Op')" *ngIf="s.status === 'Pre-Op'">{{ 'INTRA_OP' | translate }}</button>
              <button class="btn btn-xs btn-outline btn-accent" (click)="updateStatus(s, 'Post-Op')" *ngIf="s.status === 'Intra-Op'">{{ 'POST_OP' | translate }}</button>
              <button class="btn btn-xs btn-success" (click)="updateStatus(s, 'Completed')" *ngIf="s.status === 'Post-Op'">{{ 'COMPLETED' | translate }}</button>
            </div>
          </div>

          <div *ngIf="surgeries.length === 0" class="col-span-full py-20 text-center opacity-50 italic">
            <span class="material-icons-round text-6xl mb-4">event_busy</span>
            <p>No surgeries scheduled at this time.</p>
          </div>
        </div>
      </div>

      <!-- Theaters Tab -->
      <div *ngSwitchCase="'theaters'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let ot of theaters" class="card bg-white dark:bg-gray-800 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4">
               <div class="status-dot" [class.bg-success]="ot.status === 'Available'" [class.bg-danger]="ot.status === 'Busy'" [class.bg-warning]="ot.status === 'Under Maintenance'"></div>
            </div>
            
            <h3 class="font-black mb-1">{{ ot.name }}</h3>
            <p class="text-xs font-bold text-muted mb-4">{{ ot.location }}</p>
            
            <div class="flex flex-col gap-4 mt-4">
               <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  <span class="text-xs font-bold">Status</span>
                  <span class="badge" [class.badge-success]="ot.status === 'Available'" [class.badge-danger]="ot.status === 'Busy'" [class.badge-warning]="ot.status === 'Under Maintenance'">
                    {{ ot.status }}
                  </span>
               </div>
               
               <div class="flex gap-2">
                 <button class="btn btn-xs btn-outline flex-1" (click)="updateOTStatus(ot, 'Available')">Available</button>
                 <button class="btn btn-xs btn-outline btn-warning flex-1" (click)="updateOTStatus(ot, 'Under Maintenance')">Maintain</button>
               </div>
            </div>
          </div>
          
          <!-- Add OT Card -->
          <div class="card border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" (click)="showOTModal = true">
             <span class="material-icons-round text-4xl text-muted mb-2">add_circle_outline</span>
             <span class="font-black text-muted">{{ 'NEW_OT' | translate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Surgery Modal -->
    <div class="modal" [class.show]="showScheduleModal" *ngIf="showScheduleModal">
      <div class="modal-backdrop" (click)="showScheduleModal = false"></div>
      <div class="modal-content" style="max-width: 600px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'SCHEDULE_SURGERY' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showScheduleModal = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group col-span-2">
              <label class="form-label">{{ 'PATIENT' | translate }} *</label>
              <select class="form-control" [(ngModel)]="surgeryForm.patientId">
                <option *ngFor="let p of patients" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
              </select>
            </div>
            
            <div class="form-group col-span-2">
              <label class="form-label">{{ 'PROCEDURE_NAME' | translate }} *</label>
              <input type="text" class="form-control" [(ngModel)]="surgeryForm.procedureName" placeholder="e.g. Appendectomy">
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'LEAD_SURGEON' | translate }} *</label>
              <select class="form-control" [(ngModel)]="surgeryForm.leadSurgeonId">
                <option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'ANESTHETIST' | translate }}</label>
              <select class="form-control" [(ngModel)]="surgeryForm.anesthetistId">
                <option [value]="null">Select Anesthetist</option>
                <option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'OT_NAME' | translate }} *</label>
              <select class="form-control" [(ngModel)]="surgeryForm.operatingTheaterId">
                <option *ngFor="let ot of theaters" [value]="ot.id">{{ ot.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'PRIORITY' | translate }}</label>
              <select class="form-control" [(ngModel)]="surgeryForm.priority">
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'START_TIME' | translate }} *</label>
              <input type="datetime-local" class="form-control" [(ngModel)]="surgeryForm.scheduledStartTime">
            </div>

            <div class="form-group">
              <label class="form-label">{{ 'END_TIME' | translate }} *</label>
              <input type="datetime-local" class="form-control" [(ngModel)]="surgeryForm.scheduledEndTime">
            </div>
            
            <div class="form-group col-span-2">
              <label class="form-label">{{ 'NOTES' | translate }}</label>
              <textarea class="form-control" [(ngModel)]="surgeryForm.notes" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showScheduleModal = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveSurgery()">{{ 'SCHEDULE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- New OT Modal -->
    <div class="modal" [class.show]="showOTModal" *ngIf="showOTModal">
      <div class="modal-backdrop" (click)="showOTModal = false"></div>
      <div class="modal-content" style="max-width: 400px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'NEW_OT' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showOTModal = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-4">
            <label class="form-label">{{ 'OT_NAME' | translate }} *</label>
            <input type="text" class="form-control" [(ngModel)]="otForm.name" placeholder="Operating Theater 1">
          </div>
          <div class="form-group">
            <label class="form-label">{{ 'LOCATION' | translate }}</label>
            <input type="text" class="form-control" [(ngModel)]="otForm.location" placeholder="Floor 2, Wing B">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showOTModal = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveOT()">{{ 'CREATE' | translate }}</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .status-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .border-l-4.scheduled { border-left-color: var(--primary); }
    .border-l-4.pre-op { border-left-color: var(--info); }
    .border-l-4.intra-op { border-left-color: var(--danger); }
    .border-l-4.post-op { border-left-color: var(--accent); }
    .border-l-4.completed { border-left-color: var(--success); }
    .border-l-4.cancelled { border-left-color: var(--text-muted); }
  `]
})
export class OTManagementComponent implements OnInit {
    activeTab: 'surgeries' | 'theaters' = 'surgeries';
    surgeries: any[] = [];
    theaters: any[] = [];
    patients: any[] = [];
    doctors: any[] = [];

    showScheduleModal = false;
    surgeryForm: any = { priority: 'Routine' };

    showOTModal = false;
    otForm: any = { status: 'Available' };

    constructor(
        private otSvc: OTService,
        private patientSvc: PatientService,
        private doctorSvc: DoctorService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadData();
        this.loadDropdowns();
    }

    loadData() {
        this.otSvc.getScheduledSurgeries({ page: 1, pageSize: 50 }).subscribe(res => this.surgeries = res.items);
        this.otSvc.getOperatingTheaters().subscribe(res => this.theaters = res);
    }

    loadDropdowns() {
        this.patientSvc.getAll({ page: 1, pageSize: 100 }).subscribe((res: any) => this.patients = res.items);
        this.doctorSvc.getAll({ page: 1, pageSize: 100 }).subscribe((res: any) => this.doctors = res.items);
    }

    getStatusClass(status: string) {
        return status.toLowerCase().replace(/ /g, '-');
    }

    getPriorityClass(priority: string) {
        switch (priority) {
            case 'Emergency': return 'badge-danger';
            case 'Urgent': return 'badge-warning';
            default: return 'badge-primary';
        }
    }

    openScheduleModal() {
        this.surgeryForm = { priority: 'Routine', scheduledStartTime: new Date().toISOString().slice(0, 16), scheduledEndTime: new Date().toISOString().slice(0, 16) };
        this.showScheduleModal = true;
    }

    saveSurgery() {
        this.otSvc.scheduleSurgery(this.surgeryForm).subscribe({
            next: () => {
                this.toast.success('Surgery scheduled successfully');
                this.showScheduleModal = false;
                this.loadData();
            },
            error: () => this.toast.error('Failed to schedule surgery')
        });
    }

    updateStatus(surgery: any, nextStatus: string) {
        this.otSvc.updateSurgeryStatus(surgery.id, nextStatus).subscribe(() => {
            this.toast.success(`Surgery status updated to ${nextStatus}`);
            this.loadData();

            // Auto-update OT status logic
            if (nextStatus === 'Intra-Op') {
                this.otSvc.updateOTStatus(surgery.operatingTheaterId, 'Busy').subscribe();
            } else if (nextStatus === 'Completed' || nextStatus === 'Cancelled') {
                this.otSvc.updateOTStatus(surgery.operatingTheaterId, 'Available').subscribe();
            }
        });
    }

    saveOT() {
        this.otSvc.createOperatingTheater(this.otForm).subscribe(() => {
            this.toast.success('Operating Theater created');
            this.showOTModal = false;
            this.loadData();
        });
    }

    updateOTStatus(ot: any, status: string) {
        this.otSvc.updateOTStatus(ot.id, status).subscribe(() => {
            this.toast.success('OT status updated');
            this.loadData();
        });
    }
}
