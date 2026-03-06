import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BedManagementService, PatientService, DoctorService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-bed-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'BED_MANAGEMENT' | translate }}</h1>
        <p class="page-subtitle">{{ ('MANAGE_WARDS_ROOMS_ADMISSIONS' | translate) || 'Manage wards, rooms, and patient admissions' }}</p>
      </div>
      <div class="flex gap-2" *ngIf="!activeWard">
        <button class="btn btn-primary" (click)="openWardForm()">
          <span class="material-icons-round">add_home</span> {{ 'NEW_WARD' | translate }}
        </button>
      </div>
    </div>

    <!-- Wards Grid -->
    <div *ngIf="!activeWard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div *ngFor="let w of wards" class="card p-0 overflow-hidden hover:shadow-xl transition-all">
        <div class="p-4" [ngClass]="w.isActive ? 'bg-primary bg-opacity-10' : 'bg-gray-100 dark:bg-gray-800'">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-black text-lg">{{ w.wardName }} <span class="text-sm font-bold text-muted ml-2">({{w.wardCode}})</span></h3>
                <div class="badge" [ngClass]="w.isActive ? 'badge-success' : 'badge-danger'">{{ (w.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}</div>
            </div>
            <p class="text-sm text-muted">{{ w.description || w.wardType }}</p>
        </div>
        <div class="p-4 flex gap-4 border-b border-gray-100 dark:border-gray-800">
            <div class="flex-1 text-center">
                <div class="text-2xl font-black text-primary">{{ w.totalRooms }}</div>
                <div class="text-xs font-bold text-muted uppercase tracking-wider">{{ 'ROOMS' | translate }}</div>
            </div>
            <div class="flex-1 text-center border-l dark:border-gray-800">
                <div class="text-2xl font-black text-accent">{{ w.totalBeds }}</div>
                <div class="text-xs font-bold text-muted uppercase tracking-wider">{{ ('TOTAL_BEDS' | translate) || 'Total Beds' }}</div>
            </div>
            <div class="flex-1 text-center border-l dark:border-gray-800">
                <div class="text-2xl font-black text-warning">{{ w.occupiedBeds }}</div>
                <div class="text-xs font-bold text-muted uppercase tracking-wider">{{ 'OCCUPIED' | translate }}</div>
            </div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
            <button class="btn btn-sm btn-secondary" (click)="viewWardDetails(w)">{{ 'MANAGE_ROOMS' | translate }}</button>
            <button class="btn btn-icon btn-secondary" (click)="openWardForm(w)"><span class="material-icons-round text-sm">edit</span></button>
            <button class="btn btn-icon btn-secondary hover:text-danger" (click)="deleteWard(w, $event)"><span class="material-icons-round text-sm">delete</span></button>
        </div>
      </div>
    </div>
    
    <div *ngIf="loading && !activeWard" class="py-10 text-center text-muted"><span class="spinner"></span></div>
    
    <div *ngIf="!activeWard && !loading && wards.length === 0" class="card py-10 text-center text-muted">
       <span class="material-icons-round text-4xl mb-2 opacity-50">hotel</span>
       <p>{{ ('NO_WARDS_CONFIGURED' | translate) || 'No wards configured yet.' }}</p>
    </div>

    <!-- Ward Details & Beds View -->
    <div *ngIf="activeWard" class="animate-fade-in">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
            <button class="btn btn-icon btn-secondary" (click)="closeWardDetails()">
                <span class="material-icons-round">arrow_back</span>
            </button>
            <div>
                <h2 class="text-2xl font-black m-0">{{ activeWard.wardName }}</h2>
                <p class="text-muted text-sm">{{ activeWard.wardType }} {{ ('WARD' | translate) || 'Ward' }} • {{ 'FLOOR' | translate }} {{ activeWard.floorNumber }}</p>
            </div>
        </div>
        <div class="flex gap-2">
            <button class="btn btn-secondary" (click)="openRoomForm()"><span class="material-icons-round">add</span> {{ 'NEW_ROOM' | translate }}</button>
            <button class="btn btn-primary" (click)="openBedForm()"><span class="material-icons-round">hotel</span> {{ 'ADD_BED' | translate }}</button>
        </div>
      </div>

      <div *ngIf="loading" class="py-10 text-center text-muted"><span class="spinner"></span></div>

      <div *ngIf="!loading && rooms.length === 0" class="card py-20 text-center text-muted">
         <span class="material-icons-round text-4xl mb-2 opacity-50">meeting_room</span>
         <p>{{ 'NO_ROOM_IN_WARD' | translate }}</p>
         <button class="btn btn-outline-primary mt-4" (click)="openRoomForm()">{{ 'CREATE_FIRST_ROOM' | translate }}</button>
      </div>

      <div *ngIf="!loading" class="grid grid-cols-1" style="gap: 1.5rem">
        <div *ngFor="let room of rooms" class="card p-0 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <span class="material-icons-round text-primary text-2xl">meeting_room</span>
                    <div>
                        <h3 class="font-black text-lg m-0 leading-tight">{{ ('ROOM' | translate) || 'Room' }} {{ room.roomNumber }}</h3>
                        <span class="text-xs font-bold text-muted uppercase tracking-wider">{{ room.roomType }} • {{ 'CAPACITY' | translate }}: {{ room.capacity }}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-icon btn-sm btn-secondary" (click)="openRoomForm(room)"><span class="material-icons-round text-xs">edit</span></button>
                    <button class="btn btn-icon btn-sm btn-secondary hover:text-danger" (click)="deleteRoom(room)"><span class="material-icons-round text-xs">delete</span></button>
                </div>
            </div>
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div *ngFor="let bed of getBedsForRoom(room.id)" class="card p-4 border relative transition-all hover:shadow-md" 
                     [ngClass]="{'border-green-200 bg-green-50/30 dark:bg-green-900/10 dark:border-green-800/50': bed.status === 'Available',
                                 'border-orange-200 bg-orange-50/30 dark:bg-orange-900/10 dark:border-orange-800/50': bed.status === 'Occupied',
                                 'border-red-200 bg-red-50/30 dark:bg-red-900/10 dark:border-red-800/50': bed.status === 'Maintenance'}">
                    
                    <div class="flex justify-between items-start mb-3">
                        <div class="font-black text-xl flex items-center gap-2">
                            <span class="material-icons-round text-muted" style="font-size: 1.2rem">hotel</span> {{ bed.bedNumber }}
                        </div>
                        <div class="flex gap-1 items-center">
                            <button class="btn btn-icon btn-xs text-muted hover:text-danger mr-1" *ngIf="bed.status !== 'Occupied'" (click)="deleteBed(bed)">
                                <span class="material-icons-round" style="font-size: 14px">delete</span>
                            </button>
                            <div class="badge text-xs px-2 py-0.5" 
                                [ngClass]="{'badge-success': bed.status === 'Available', 'badge-warning': bed.status === 'Occupied', 'badge-danger': bed.status === 'Maintenance'}">
                                {{ (bed.status === 'Available' ? 'AVAILABLE' : bed.status === 'Occupied' ? 'OCCUPIED' : 'MAINTENANCE') | translate }}
                            </div>
                        </div>
                    </div>

                    <div *ngIf="bed.status === 'Occupied'" class="mt-2 pt-3 border-t border-black/5 dark:border-white/5">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-8 h-8 rounded-full bg-warning/20 text-warning flex items-center justify-center font-black text-xs">
                                {{ bed.patientName?.charAt(0) }}
                            </div>
                            <div class="min-w-0">
                                <div class="font-black text-sm truncate" [title]="bed.patientName">{{ bed.patientName }}</div>
                                <div class="text-xs text-muted">{{ bed.patientCode }}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 mt-3">
                            <button class="btn btn-sm btn-outline-warning" (click)="openDischargeForm(bed)">
                                <span class="material-icons-round text-xs mr-1">exit_to_app</span> {{ ('DISCHARGE' | translate) || 'Discharge' }}
                            </button>
                            <button class="btn btn-sm btn-outline-primary" (click)="openTransferForm(bed)">
                                <span class="material-icons-round text-xs mr-1">swap_horiz</span> {{ ('TRANSFER' | translate) || 'Transfer' }}
                            </button>
                        </div>
                        <button class="btn btn-sm btn-primary w-full mt-2" [routerLink]="['/inpatient-chart', bed.currentAdmissionId]">
                            <span class="material-icons-round text-xs mr-1">assignment</span> {{ 'INPATIENT_CLINICAL_CHART' | translate }}
                        </button>
                    </div>

                    <div *ngIf="bed.status === 'Available'" class="mt-2 pt-3">
                        <p class="text-xs text-muted mb-4">{{ ('PATIENT_ADMISSION_HINT' | translate) || 'Patient can be admitted to this bed.' }}</p>
                        <button class="btn btn-sm btn-outline-primary w-full" (click)="openAdmitForm(bed)">
                            <span class="material-icons-round text-xs mr-1">person_add</span> {{ 'ADMIT_PATIENT' | translate }}
                        </button>
                    </div>

                    <div *ngIf="bed.status === 'Maintenance'" class="mt-2 pt-3 text-center">
                         <span class="material-icons-round text-danger text-3xl opacity-30">construction</span>
                         <p class="text-xs text-muted mt-2">{{ ('UNDER_MAINTENANCE' | translate) || 'Under Maintenance' }}</p>
                         <button class="btn btn-xs btn-link mt-1" (click)="openBedForm(bed)">{{ ('UPDATE_STATUS' | translate) || 'Update Status' }}</button>
                    </div>
                </div>
                
                <div *ngIf="getBedsForRoom(room.id).length === 0" class="text-center text-sm text-muted p-8 col-span-full border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                    <span class="material-icons-round opacity-30 text-3xl mb-1">hotel</span>
                    <p>{{ 'NO_BEDS_IN_ROOM' | translate }}</p>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Ward Form Modal -->
    <div class="modal" [class.show]="showWardForm" *ngIf="showWardForm">
      <div class="modal-backdrop" (click)="closeWardForm()"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ (wardForm.id ? 'EDIT' : 'NEW_WARD') | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="closeWardForm()"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">{{ 'WARD_CODE' | translate }} *</label>
              <input type="text" class="form-control" [(ngModel)]="wardForm.wardCode" placeholder="e.g. W-ICU-01">
            </div>
            <div class="form-group flex-1">
              <label class="form-label">{{ 'WARD_TYPE' | translate }}</label>
              <select class="form-control form-select" [(ngModel)]="wardForm.wardType">
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="CCU">CCU</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Maternity">Maternity</option>
                <option value="Surgical">Surgical</option>
              </select>
            </div>
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'WARD_NAME_EN' | translate }} *</label>
            <input type="text" class="form-control" [(ngModel)]="wardForm.wardName">
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'WARD_NAME_AR' | translate }}</label>
            <input type="text" class="form-control" [(ngModel)]="wardForm.wardNameAr">
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'WARD_FLOOR' | translate }}</label>
            <input type="number" class="form-control" [(ngModel)]="wardForm.floorNumber">
          </div>
          <div class="form-group mt-4">
            <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="wardForm.isActive"> {{ 'WARD_ACTIVE_STATUS' | translate }}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeWardForm()">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveWard()" [disabled]="saving">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Room Form Modal -->
    <div class="modal" [class.show]="showRoomForm" *ngIf="showRoomForm">
      <div class="modal-backdrop" (click)="showRoomForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ (roomForm.id ? 'EDIT' : 'NEW_ROOM') | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showRoomForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">{{ 'ROOM_NUMBER' | translate }} *</label>
              <input type="text" class="form-control" [(ngModel)]="roomForm.roomNumber">
            </div>
            <div class="form-group flex-1">
              <label class="form-label">{{ 'ROOM_TYPE' | translate }}</label>
              <select class="form-control form-select" [(ngModel)]="roomForm.roomType">
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Semi-Private">Semi-Private</option>
                <option value="Private">Private</option>
                <option value="Isolation">Isolation</option>
              </select>
            </div>
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'ROOM_CAPACITY' | translate }} *</label>
            <input type="number" class="form-control" [(ngModel)]="roomForm.capacity">
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'NOTES' | translate }}</label>
            <textarea class="form-control" [(ngModel)]="roomForm.notes"></textarea>
          </div>
          <div class="form-group mt-4">
            <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="roomForm.isActive"> {{ 'ACTIVE' | translate }}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showRoomForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveRoom()" [disabled]="saving">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Bed Form Modal -->
    <div class="modal" [class.show]="showBedForm" *ngIf="showBedForm">
      <div class="modal-backdrop" (click)="showBedForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ (bedForm.id ? 'EDIT' : 'ADD_BED') | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showBedForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ 'SELECT_ROOM' | translate }} *</label>
            <select class="form-control form-select" [(ngModel)]="bedForm.roomId">
                <option *ngFor="let r of rooms" [value]="r.id">{{ ('ROOM' | translate) || 'Room' }} {{ r.roomNumber }} ({{r.roomType}})</option>
            </select>
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'BED_NUMBER' | translate }} *</label>
            <input type="text" class="form-control" [(ngModel)]="bedForm.bedNumber" placeholder="e.g. B-101">
          </div>
          <div class="form-group mt-3">
            <label class="form-label">{{ 'BED_STATUS' | translate }}</label>
            <select class="form-control form-select" [(ngModel)]="bedForm.status" [disabled]="bedForm.status === 'Occupied'">
                <option value="Available">{{ 'AVAILABLE' | translate }}</option>
                <option value="Maintenance">{{ 'MAINTENANCE' | translate }}</option>
                <option *ngIf="bedForm.status === 'Occupied'" value="Occupied">{{ 'OCCUPIED' | translate }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showBedForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveBed()" [disabled]="saving">{{ 'SAVE' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Admission Form Modal -->
    <div class="modal" [class.show]="showAdmitForm" *ngIf="showAdmitForm">
      <div class="modal-backdrop" (click)="showAdmitForm = false"></div>
      <div class="modal-content" style="max-width: 600px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'ADMIT_PATIENT' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showAdmitForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
           <div class="p-3 bg-primary bg-opacity-10 rounded-xl mb-4 flex items-center gap-3">
             <span class="material-icons-round text-primary">hotel</span>
             <div>
                <div class="font-bold">{{ ('BED' | translate) || 'Bed' }} {{ activeBed?.bedNumber }}</div>
                <div class="text-xs text-muted">{{ ('ROOM' | translate) || 'Room' }} {{ activeBed?.roomNumber }} • {{ activeBed?.wardName }}</div>
             </div>
           </div>

           <div class="form-group">
              <label class="form-label">{{ ('SEARCH_PATIENT' | translate) || 'Search/Select Patient' }} *</label>
              <select class="form-control form-select" [(ngModel)]="admitForm.patientId">
                 <option *ngFor="let p of patients" [value]="p.id">{{ p.fullName }} ({{p.patientCode}})</option>
              </select>
           </div>
           
           <div class="form-group mt-3">
              <label class="form-label">{{ 'DOCTOR' | translate }} *</label>
              <select class="form-control form-select" [(ngModel)]="admitForm.doctorId">
                 <option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</option>
              </select>
           </div>

           <div class="form-row mt-3">
              <div class="form-group flex-1">
                <label class="form-label">{{ 'ADMISSION_TYPE' | translate }}</label>
                <select class="form-control form-select" [(ngModel)]="admitForm.admissionType">
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Observation">Observation</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label class="form-label">{{ 'DAILY_RATE' | translate }} ($)</label>
                <input type="number" class="form-control" [(ngModel)]="admitForm.dailyRate">
              </div>
           </div>

           <div class="form-group mt-3">
              <label class="form-label">{{ 'ADMISSION_REASON' | translate }}</label>
              <textarea class="form-control" [(ngModel)]="admitForm.admissionReason"></textarea>
           </div>
           
           <div class="form-group mt-3">
              <label class="form-label">{{ 'CLINICAL_NOTES' | translate }}</label>
              <textarea class="form-control" [(ngModel)]="admitForm.notes"></textarea>
           </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showAdmitForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveAdmission()" [disabled]="saving">{{ 'ADMIT_PATIENT' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Discharge Form Modal -->
    <div class="modal" [class.show]="showDischargeForm" *ngIf="showDischargeForm">
      <div class="modal-backdrop" (click)="showDischargeForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'DISCHARGE_PATIENT' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showDischargeForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
            <div class="p-4 bg-warning bg-opacity-10 rounded-xl mb-4">
                <div class="text-xs font-bold text-muted uppercase tracking-wider mb-1">{{ 'PATIENT' | translate }}</div>
                <div class="font-black text-lg text-warning">{{ activeBed?.patientName }}</div>
                <div class="text-xs text-muted">{{ activeBed?.patientCode }} • {{ ('BED' | translate) || 'Bed' }} {{ activeBed?.bedNumber }}</div>
            </div>
            
            <div class="form-group">
                <label class="form-label">{{ 'DISCHARGE_NOTES' | translate }}</label>
                <textarea class="form-control" rows="4" [(ngModel)]="dischargeForm.dischargeNotes" placeholder="Summary of treatment, medication, next visit..."></textarea>
            </div>
            
            <p class="text-xs text-muted mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span class="material-icons-round text-sm align-middle mr-1">info</span>
                {{ ('DISCHARGE_HINT' | translate) || 'Discharging the patient will release the bed and update its status to "Available".' }}
            </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showDischargeForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-warning" (click)="processDischarge()" [disabled]="saving">{{ 'CONFIRM' | translate }}</button>
        </div>
      </div>
    </div>

    <!-- Transfer Form Modal -->
    <div class="modal" [class.show]="showTransferForm" *ngIf="showTransferForm">
      <div class="modal-backdrop" (click)="showTransferForm = false"></div>
      <div class="modal-content" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'TRANSFER_PATIENT' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showTransferForm = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="modal-body">
            <div class="p-4 bg-primary bg-opacity-10 rounded-xl mb-4">
                <div class="text-xs font-bold text-muted uppercase tracking-wider mb-1">{{ 'PATIENT' | translate }}</div>
                <div class="font-black text-lg text-primary">{{ activeBed?.patientName }}</div>
                <div class="text-xs text-muted">{{ ('CURRENT_BED' | translate) || 'Current' }}: {{ activeBed?.wardName }} - {{ activeBed?.bedNumber }}</div>
            </div>
            
            <div class="form-group">
                <label class="form-label">{{ 'TARGET_BED' | translate }} *</label>
                <select class="form-control form-select" [(ngModel)]="transferForm.newBedId">
                    <option [value]="null" disabled>{{ ('SELECT_AVAILABLE_BED' | translate) || 'Select Available Bed' }}</option>
                    <option *ngFor="let b of availableBeds" [value]="b.id">
                        {{b.wardName}} - {{b.roomNumber}} - Bed {{b.bedNumber}}
                    </option>
                </select>
                <p *ngIf="availableBeds.length === 0" class="text-xs text-danger mt-1">{{ ('NO_AVAILABLE_BEDS' | translate) || 'No available beds found.' }}</p>
            </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showTransferForm = false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="processTransfer()" [disabled]="saving || !transferForm.newBedId">{{ 'CONFIRM' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner { border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BedManagementComponent implements OnInit {
  wards: any[] = [];
  rooms: any[] = [];
  beds: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  availableBeds: any[] = [];

  loading = false;
  saving = false;
  activeWard: any = null;
  activeBed: any = null;

  // Modals visibility
  showWardForm = false;
  showRoomForm = false;
  showBedForm = false;
  showAdmitForm = false;
  showDischargeForm = false;
  showTransferForm = false;

  // Forms data
  wardForm: any = {};
  roomForm: any = {};
  bedForm: any = {};
  admitForm: any = {};
  dischargeForm: any = {};
  transferForm: any = {};

  constructor(
    private service: BedManagementService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadWards();
    this.loadLookups();
  }

  loadWards() {
    this.loading = true;
    this.service.getWards({ pageSize: 100 }).subscribe({
      next: (res) => { this.wards = res.items; this.loading = false; },
      error: () => { this.toast.error('Failed to load wards'); this.loading = false; }
    });
  }

  loadLookups() {
    this.doctorService.getAll({ pageSize: 100 }).subscribe(res => this.doctors = res.items);
    this.patientService.getAll({ pageSize: 100 }).subscribe(res => this.patients = res.items);
  }

  viewWardDetails(ward: any) {
    this.activeWard = ward;
    this.loadWardRoomsAndBeds();
  }

  closeWardDetails() {
    this.activeWard = null;
    this.rooms = [];
    this.beds = [];
    this.loadWards();
  }

  loadWardRoomsAndBeds() {
    this.loading = true;
    this.service.getRooms(this.activeWard.id, { pageSize: 100 }).subscribe({
      next: (res) => {
        this.rooms = res.items;
        this.service.getBeds({ wardId: this.activeWard.id, pageSize: 200 }).subscribe({
          next: (resBeds) => {
            this.beds = resBeds.items;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => {
        this.toast.error('Failed to load rooms');
        this.loading = false;
      }
    });
  }

  getBedsForRoom(roomId: number) {
    return this.beds.filter(b => b.roomId === roomId);
  }

  // --- Wards ---
  openWardForm(w?: any) {
    this.wardForm = w ? { ...w } : { isActive: true, wardType: 'General', floorNumber: 1 };
    this.showWardForm = true;
  }

  closeWardForm() { this.showWardForm = false; }

  saveWard() {
    if (!this.wardForm.wardCode || !this.wardForm.wardName) {
      this.toast.error('Code and Name are required');
      return;
    }
    this.saving = true;
    const req = this.wardForm.id ? this.service.updateWard(this.wardForm.id, this.wardForm) : this.service.createWard(this.wardForm);
    req.subscribe({
      next: () => {
        this.toast.success('SUCCESS_SAVE');
        this.saving = false;
        this.closeWardForm();
        this.loadWards();
      },
      error: (e) => {
        this.toast.error(e.error?.message || 'ERROR_OCCURRED');
        this.saving = false;
      }
    });
  }

  // --- Rooms ---
  openRoomForm(room?: any) {
    this.roomForm = room ? { ...room } : { wardId: this.activeWard.id, capacity: 4, isActive: true, roomType: 'Standard' };
    this.showRoomForm = true;
  }

  saveRoom() {
    if (!this.roomForm.roomNumber) { this.toast.error('Room number is required'); return; }
    this.saving = true;
    const req = this.roomForm.id ? this.service.updateRoom(this.roomForm.id, this.roomForm) : this.service.createRoom(this.roomForm);
    req.subscribe({
      next: () => {
        this.toast.success('SUCCESS_SAVE');
        this.saving = false;
        this.showRoomForm = false;
        this.loadWardRoomsAndBeds();
      },
      error: (e) => { this.toast.error(e.error?.message || 'ERROR_OCCURRED'); this.saving = false; }
    });
  }

  // --- Beds ---
  openBedForm(bed?: any) {
    this.bedForm = bed ? { ...bed } : { roomId: this.rooms[0]?.id, status: 'Available' };
    this.showBedForm = true;
  }

  saveBed() {
    if (!this.bedForm.roomId || !this.bedForm.bedNumber) { this.toast.error('Room and Bed Number are required'); return; }
    this.saving = true;
    const req = this.bedForm.id ? this.service.updateBed(this.bedForm.id, this.bedForm) : this.service.createBed(this.bedForm);
    req.subscribe({
      next: () => {
        this.toast.success('SUCCESS_SAVE');
        this.saving = false;
        this.showBedForm = false;
        this.loadWardRoomsAndBeds();
      },
      error: (e) => { this.toast.error(e.error?.message || 'ERROR_OCCURRED'); this.saving = false; }
    });
  }

  // --- Admissions ---
  openAdmitForm(bed: any) {
    this.activeBed = bed;
    this.admitForm = { bedId: bed.id, admissionType: 'General', dailyRate: 150 };
    this.showAdmitForm = true;
  }

  saveAdmission() {
    if (!this.admitForm.patientId || !this.admitForm.doctorId) { this.toast.error('Patient and Doctor are required'); return; }
    this.saving = true;
    this.service.admitPatient(this.admitForm).subscribe({
      next: () => {
        this.toast.success('Patient admitted successfully');
        this.saving = false;
        this.showAdmitForm = false;
        this.loadWardRoomsAndBeds();
      },
      error: (e) => { this.toast.error(e.error?.message || 'ERROR_OCCURRED'); this.saving = false; }
    });
  }

  // --- Discharge ---
  openDischargeForm(bed: any) {
    this.activeBed = bed;
    this.dischargeForm = { dischargeNotes: '' };
    this.showDischargeForm = true;
  }

  processDischarge() {
    this.saving = true;
    this.service.dischargePatient(this.activeBed.currentAdmissionId, this.dischargeForm).subscribe({
      next: () => {
        this.toast.success('Patient discharged successfully');
        this.saving = false;
        this.showDischargeForm = false;
        this.loadWardRoomsAndBeds();
      },
      error: (e) => { this.toast.error(e.error?.message || 'ERROR_OCCURRED'); this.saving = false; }
    });
  }

  // --- Transfer ---
  openTransferForm(bed: any) {
    this.activeBed = bed;
    this.transferForm = { newBedId: null };
    this.availableBeds = [];
    this.loading = true;
    // Load available beds hospital-wide
    this.service.getBeds({ status: 'Available', pageSize: 500 }).subscribe({
      next: (res) => {
        // Filter out the current bed just in case it's returned as available
        this.availableBeds = res.items.filter((b: any) => b.id !== bed.id);
        this.showTransferForm = true;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load available beds');
        this.loading = false;
      }
    });
  }

  processTransfer() {
    if (!this.transferForm.newBedId) return;
    this.saving = true;
    this.service.transferPatient(this.activeBed.currentAdmissionId, this.transferForm.newBedId).subscribe({
      next: () => {
        this.toast.success('SUCCESS_TRANSFER');
        this.saving = false;
        this.showTransferForm = false;
        this.loadWardRoomsAndBeds();
      },
      error: (e) => {
        this.toast.error(e.error?.message || 'ERROR_OCCURRED');
        this.saving = false;
      }
    });
  }

  deleteWard(w: any, event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ward "${w.wardName}"?`)) {
      this.service.deleteWard(w.id).subscribe({
        next: () => { this.toast.success('SUCCESS_DELETE'); this.loadWards(); },
        error: (e) => this.toast.error(e.error?.message || 'ERROR_OCCURRED')
      });
    }
  }

  deleteRoom(room: any) {
    if (confirm(`Are you sure you want to delete room "${room.roomNumber}"?`)) {
      this.service.deleteRoom(room.id).subscribe({
        next: () => { this.toast.success('SUCCESS_DELETE'); this.loadWardRoomsAndBeds(); },
        error: (e) => this.toast.error(e.error?.message || 'ERROR_OCCURRED')
      });
    }
  }

  deleteBed(bed: any) {
    if (confirm(`Are you sure you want to delete bed "${bed.bedNumber}"?`)) {
      this.service.deleteBed(bed.id).subscribe({
        next: () => { this.toast.success('SUCCESS_DELETE'); this.loadWardRoomsAndBeds(); },
        error: (e) => this.toast.error(e.error?.message || 'ERROR_OCCURRED')
      });
    }
  }
}
