import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DoctorService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .specialization-badge { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .status-active { color: #10b981; }
    .status-inactive { color: #ef4444; }
    .doctor-card { transition: var(--transition); border: 1px solid var(--border); }
    .doctor-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'DOCTORS' | translate }}</h1>
        <p class="page-subtitle">{{ 'MANAGE_DOCTORS' | translate }}</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <span class="material-icons-round">person_add</span> {{ 'ADD_NEW' | translate }}
      </button>
    </div>

    <div class="filter-bar mb-4">
      <div class="search-bar" style="max-width:350px">
        <span class="material-icons-round search-icon">search</span>
        <input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="page=1;loadData()">
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div *ngIf="loading" class="flex flex-col items-center justify-center p-20 text-muted">
        <span class="spinner mb-4"></span>
        {{ 'LOADING' | translate }}
      </div>

      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'CODE' | translate }}</th>
              <th>{{ 'DOCTOR_NAME' | translate }}</th>
              <th>{{ 'SPECIALIZATION' | translate }}</th>
              <th>{{ 'PHONE' | translate }}</th>
              <th class="text-end">{{ 'CONSULTATION_FEE' | translate }}</th>
              <th>{{ 'STATUS' | translate }}</th>
              <th class="text-end">{{ 'ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of doctors" class="hover-row">
              <td><span class="badge badge-secondary">{{ d.doctorCode }}</span></td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold">
                    {{ d.fullName.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold">{{ d.fullName }}</div>
                    <div class="text-xs text-muted">{{ d.email }}</div>
                  </div>
                </div>
              </td>
              <td><span class="specialization-badge">{{ d.specialization }}</span></td>
              <td>{{ d.phoneNumber || '—' }}</td>
              <td class="text-end font-bold">{{ d.consultationFee | currency }}</td>
              <td>
                <div class="flex items-center gap-1" [ngClass]="d.isActive ? 'status-active' : 'status-inactive'">
                  <span class="material-icons-round" style="font-size:14px">{{ d.isActive ? 'check_circle' : 'cancel' }}</span>
                  <span class="text-xs font-bold uppercase">{{ (d.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}</span>
                </div>
              </td>
              <td class="text-end">
                <div class="flex justify-end gap-1">
                  <button class="btn btn-icon btn-xs text-primary" (click)="openForm(d)">
                    <span class="material-icons-round">edit</span>
                  </button>
                  <button class="btn btn-icon btn-xs text-danger" (click)="deleteDoc(d)">
                    <span class="material-icons-round">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="!doctors.length" class="p-20 text-center text-muted">
          <span class="material-icons-round text-5xl opacity-20 mb-4">medical_services</span>
          <p>{{ 'NO_DATA' | translate }}</p>
        </div>
      </div>

      <div class="pagination p-4 border-top" *ngIf="totalPages > 1">
        <span class="text-xs text-muted">{{ 'PAGE' | translate }} {{ page }} {{ 'OF' | translate }} {{ totalPages }}</span>
        <div class="flex gap-2">
          <button class="btn btn-icon btn-sm" [disabled]="page <= 1" (click)="page=page-1;loadData()">
            <span class="material-icons-round">chevron_left</span>
          </button>
          <button class="btn btn-icon btn-sm" [disabled]="page >= totalPages" (click)="page=page+1;loadData()">
            <span class="material-icons-round">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Doctor Form Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:650px">
        <div class="modal-header">
          <h3 class="modal-title font-bold">{{ (editing ? 'EDIT' : 'ADD_NEW') | translate }} {{ 'DOCTOR' | translate }}</h3>
          <button (click)="showForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4 animate-in">
            <div class="form-group col-span-2">
              <label class="form-label font-bold">{{ 'FULL_NAME' | translate }}*</label>
              <input class="form-control" [(ngModel)]="form.fullName">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs uppercase">{{ 'SPECIALIZATION' | translate }}*</label>
              <input class="form-control" [(ngModel)]="form.specialization" placeholder="Cardiology, etc.">
            </div>
            <div class="form-group">
              <label class="form-label font-bold text-xs uppercase">{{ 'CONSULTATION_FEE' | translate }}</label>
              <input class="form-control" type="number" [(ngModel)]="form.consultationFee">
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'PHONE' | translate }}</label>
              <input class="form-control" [(ngModel)]="form.phoneNumber">
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'EMAIL' | translate }}</label>
              <input class="form-control" [(ngModel)]="form.email">
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'LICENSE_NUMBER' | translate }}</label>
              <input class="form-control" [(ngModel)]="form.licenseNumber">
            </div>
            <div class="form-group">
              <label class="form-label">{{ 'WORKING_DAYS' | translate }}</label>
              <input class="form-control" [(ngModel)]="form.workingDays" placeholder="Mon-Fri">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving || !form.fullName || !form.specialization">
            <span class="spinner spinner-sm mr-2" *ngIf="saving"></span>
            <span class="material-icons-round mr-1">save</span> {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  loading = true;
  search = '';
  page = 1;
  totalPages = 1;
  showForm = false;
  editing: any = null;
  saving = false;
  form: any = {};

  constructor(
    private svc: DoctorService,
    private translate: TranslateService,
    private toast: ToastService
  ) { }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({
      next: r => { this.doctors = r.items; this.totalPages = r.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm(d?: any) {
    this.editing = d || null;
    this.form = d ? { ...d } : { consultationFee: 0, isActive: true };
    this.showForm = true;
  }

  save() {
    if (!this.form.fullName || !this.form.specialization) return;
    this.saving = true;
    const o = this.editing ? this.svc.update(this.editing.id, this.form) : this.svc.create(this.form);
    o.subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showForm = false;
        this.saving = false;
        this.loadData();
      },
      error: () => {
        this.toast.error(this.translate.instant('ERROR_OCCURRED'));
        this.saving = false;
      }
    });
  }

  deleteDoc(d: any) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.svc.delete(d.id).subscribe({
        next: () => { this.toast.success(this.translate.instant('SUCCESS_DELETE')); this.loadData(); },
        error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
    }
  }
}
