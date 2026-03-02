import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DoctorService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'DOCTORS' | translate }}</h1><p class="page-subtitle">Manage doctors</p></div>
      <button class="btn btn-primary" (click)="openForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
    </div>
    <div class="filter-bar mb-4">
      <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadData()"></div>
    </div>
    <div class="card" style="padding:0;">
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead><tr><th>{{ 'DOCTOR_CODE' | translate }}</th><th>{{ 'DOCTOR_NAME' | translate }}</th><th>{{ 'SPECIALIZATION' | translate }}</th><th>{{ 'PHONE' | translate }}</th><th>{{ 'CONSULTATION_FEE' | translate }}</th><th>{{ 'STATUS' | translate }}</th><th>{{ 'ACTIONS' | translate }}</th></tr></thead>
          <tbody>
            <tr *ngFor="let d of doctors">
              <td><span class="badge badge-info">{{ d.doctorCode }}</span></td>
              <td class="font-semibold">{{ d.fullName }}</td>
              <td>{{ d.specialization }}</td>
              <td>{{ d.phoneNumber || '—' }}</td>
              <td>{{ d.consultationFee | currency }}</td>
              <td><span class="badge" [ngClass]="d.isActive ? 'badge-success' : 'badge-secondary'">{{ (d.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}</span></td>
              <td><div class="flex gap-1"><button class="btn btn-sm btn-secondary" (click)="openForm(d)"><span class="material-icons-round" style="font-size:16px">edit</span></button><button class="btn btn-sm btn-danger" (click)="deleteDoc(d)"><span class="material-icons-round" style="font-size:16px">delete</span></button></div></td>
            </tr>
            <tr *ngIf="doctors.length === 0"><td colspan="7"><div class="empty-state"><span class="material-icons-round empty-icon">medical_services</span><span class="empty-title">{{ 'NO_DATA' | translate }}</span></div></td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" *ngIf="totalPages > 1"><span class="pagination-info">Page {{ page }} of {{ totalPages }}</span><div class="pagination-buttons"><button class="page-btn" (click)="page=page-1;loadData()" [disabled]="page<=1"><span class="material-icons-round">chevron_left</span></button><button class="page-btn" (click)="page=page+1;loadData()" [disabled]="page>=totalPages"><span class="material-icons-round">chevron_right</span></button></div></div>
    </div>

    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">{{ editing ? ('EDIT' | translate) : ('ADD_NEW' | translate) }}</h3><button class="btn btn-sm btn-secondary" (click)="showForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">{{ 'FULL_NAME' | translate }} *</label><input class="form-control" [(ngModel)]="form.fullName"></div><div class="form-group"><label class="form-label">{{ 'SPECIALIZATION' | translate }} *</label><input class="form-control" [(ngModel)]="form.specialization"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">{{ 'PHONE' | translate }}</label><input class="form-control" [(ngModel)]="form.phoneNumber"></div><div class="form-group"><label class="form-label">{{ 'EMAIL' | translate }}</label><input class="form-control" [(ngModel)]="form.email"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">License Number</label><input class="form-control" [(ngModel)]="form.licenseNumber"></div><div class="form-group"><label class="form-label">{{ 'CONSULTATION_FEE' | translate }}</label><input class="form-control" [(ngModel)]="form.consultationFee" type="number"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">{{ 'WORKING_DAYS' | translate }}</label><input class="form-control" [(ngModel)]="form.workingDays" placeholder="Sun-Thu"></div><div class="form-group"><label class="form-label">Working Hours</label><input class="form-control" [(ngModel)]="form.workingHours" placeholder="09:00 - 17:00"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="save()" [disabled]="saving"><span class="spinner spinner-sm" *ngIf="saving"></span> {{ 'SAVE' | translate }}</button></div>
    </div></div>
  `
})
export class DoctorsComponent implements OnInit {
    doctors: any[] = []; loading = true; search = ''; page = 1; totalPages = 1;
    showForm = false; editing: any = null; saving = false; form: any = {};
    constructor(private svc: DoctorService, private toast: ToastService) { }
    ngOnInit() { this.loadData(); }
    loadData() { this.loading = true; this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({ next: r => { this.doctors = r.items; this.totalPages = r.totalPages; this.loading = false; }, error: () => this.loading = false }); }
    openForm(d?: any) { this.editing = d || null; this.form = d ? { ...d } : { consultationFee: 0 }; this.showForm = true; }
    save() { if (!this.form.fullName || !this.form.specialization) return; this.saving = true; const o = this.editing ? this.svc.update(this.editing.id, this.form) : this.svc.create(this.form); o.subscribe({ next: () => { this.toast.success('Saved'); this.showForm = false; this.saving = false; this.loadData(); }, error: () => { this.toast.error('Error'); this.saving = false; } }); }
    deleteDoc(d: any) { if (confirm('Delete?')) this.svc.delete(d.id).subscribe({ next: () => { this.toast.success('Deleted'); this.loadData(); } }); }
}
