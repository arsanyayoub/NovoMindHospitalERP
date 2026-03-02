import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentService, DoctorService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'APPOINTMENTS' | translate }}</h1></div>
      <button class="btn btn-primary" (click)="openForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
    </div>
    <div class="filter-bar mb-4">
      <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadData()"></div>
      <select class="form-control" style="width:auto;" [(ngModel)]="statusFilter" (change)="loadData()"><option value="">All Status</option><option value="Scheduled">Scheduled</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select>
      <input class="form-control" type="date" style="width:auto;" [(ngModel)]="dateFilter" (change)="loadData()">
    </div>
    <div class="card" style="padding:0;">
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead><tr><th>{{ 'APPOINTMENT_CODE' | translate }}</th><th>{{ 'PATIENT_NAME' | translate }}</th><th>{{ 'DOCTOR_NAME' | translate }}</th><th>{{ 'DATE' | translate }}</th><th>Time</th><th>{{ 'STATUS' | translate }}</th><th>Fee</th><th>{{ 'ACTIONS' | translate }}</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td><span class="badge badge-info">{{ a.appointmentCode }}</span></td>
              <td class="font-semibold">{{ a.patientName }}</td>
              <td>{{ a.doctorName }}</td>
              <td>{{ a.appointmentDate | date:'mediumDate' }}</td>
              <td>{{ a.appointmentTime }}</td>
              <td><span class="badge" [ngClass]="getStatusClass(a.status)">{{ a.status | translate }}</span></td>
              <td>{{ a.fee | currency }}</td>
              <td><div class="flex gap-1"><button class="btn btn-sm btn-secondary" (click)="openForm(a)"><span class="material-icons-round" style="font-size:16px">edit</span></button><button class="btn btn-sm btn-danger" (click)="deleteAppt(a)"><span class="material-icons-round" style="font-size:16px">delete</span></button></div></td>
            </tr>
            <tr *ngIf="appointments.length === 0"><td colspan="8"><div class="empty-state"><span class="material-icons-round empty-icon">calendar_month</span><span class="empty-title">{{ 'NO_DATA' | translate }}</span></div></td></tr>
          </tbody>
        </table>
      </div>
      <div class="pagination" *ngIf="totalPages > 1"><span class="pagination-info">Page {{ page }} of {{ totalPages }}</span><div class="pagination-buttons"><button class="page-btn" (click)="page=page-1;loadData()" [disabled]="page<=1"><span class="material-icons-round">chevron_left</span></button><button class="page-btn" (click)="page=page+1;loadData()" [disabled]="page>=totalPages"><span class="material-icons-round">chevron_right</span></button></div></div>
    </div>

    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false"><div class="modal modal-lg" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">{{ editing ? ('EDIT' | translate) : ('ADD_NEW' | translate) }}</h3><button class="btn btn-sm btn-secondary" (click)="showForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">{{ 'PATIENTS' | translate }} *</label><select class="form-control" [(ngModel)]="form.patientId"><option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option></select></div>
          <div class="form-group"><label class="form-label">{{ 'DOCTORS' | translate }} *</label><select class="form-control" [(ngModel)]="form.doctorId"><option *ngFor="let d of doctorsList" [value]="d.id">{{ d.fullName }} — {{ d.specialization }}</option></select></div>
        </div>
        <div class="form-row mt-4">
          <div class="form-group"><label class="form-label">{{ 'APPOINTMENT_DATE' | translate }}</label><input class="form-control" type="date" [(ngModel)]="form.appointmentDate"></div>
          <div class="form-group"><label class="form-label">{{ 'APPOINTMENT_TIME' | translate }}</label><input class="form-control" type="time" [(ngModel)]="form.appointmentTimeStr"></div>
          <div class="form-group"><label class="form-label">{{ 'DURATION' | translate }}</label><input class="form-control" type="number" [(ngModel)]="form.durationMinutes"></div>
        </div>
        <div class="form-row mt-4">
          <div class="form-group"><label class="form-label">Fee</label><input class="form-control" type="number" [(ngModel)]="form.fee"></div>
          <div class="form-group" *ngIf="editing"><label class="form-label">{{ 'STATUS' | translate }}</label><select class="form-control" [(ngModel)]="form.status"><option value="Scheduled">Scheduled</option><option value="Confirmed">Confirmed</option><option value="InProgress">In Progress</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
        </div>
        <div class="form-group mt-4" *ngIf="editing"><label class="form-label">{{ 'DIAGNOSIS' | translate }}</label><textarea class="form-control" [(ngModel)]="form.diagnosis" rows="2"></textarea></div>
        <div class="form-group mt-4" *ngIf="editing"><label class="form-label">{{ 'PRESCRIPTION' | translate }}</label><textarea class="form-control" [(ngModel)]="form.prescription" rows="2"></textarea></div>
        <div class="form-group mt-4"><label class="form-label">{{ 'NOTES' | translate }}</label><textarea class="form-control" [(ngModel)]="form.notes" rows="2"></textarea></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="save()" [disabled]="saving"><span class="spinner spinner-sm" *ngIf="saving"></span> {{ 'SAVE' | translate }}</button></div>
    </div></div>
  `
})
export class AppointmentsComponent implements OnInit {
    appointments: any[] = []; loading = true; search = ''; statusFilter = ''; dateFilter = '';
    page = 1; totalPages = 1; showForm = false; editing: any = null; saving = false;
    form: any = {}; patientsList: any[] = []; doctorsList: any[] = [];
    constructor(private svc: AppointmentService, private patientSvc: PatientService, private doctorSvc: DoctorService, private toast: ToastService) { }
    ngOnInit() { this.loadData(); this.loadLookups(); }
    loadData() { this.loading = true; this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }, { status: this.statusFilter, date: this.dateFilter }).subscribe({ next: r => { this.appointments = r.items; this.totalPages = r.totalPages; this.loading = false; }, error: () => this.loading = false }); }
    loadLookups() {
        this.patientSvc.getAll({ pageSize: 500 }).subscribe(r => this.patientsList = r.items);
        this.doctorSvc.getAll({ pageSize: 500 }).subscribe(r => this.doctorsList = r.items);
    }
    openForm(a?: any) { this.editing = a || null; this.form = a ? { ...a, appointmentDate: a.appointmentDate?.split('T')[0], appointmentTimeStr: a.appointmentTime?.substring(0, 5) } : { durationMinutes: 30, fee: 0, appointmentDate: '', appointmentTimeStr: '09:00' }; this.showForm = true; }
    save() {
        if (!this.form.patientId || !this.form.doctorId) return; this.saving = true;
        const data = { ...this.form, appointmentTime: this.form.appointmentTimeStr + ':00' };
        const obs = this.editing ? this.svc.update(this.editing.id, data) : this.svc.create(data);
        obs.subscribe({ next: () => { this.toast.success('Saved'); this.showForm = false; this.saving = false; this.loadData(); }, error: () => { this.toast.error('Error'); this.saving = false; } });
    }
    deleteAppt(a: any) { if (confirm('Delete?')) this.svc.delete(a.id).subscribe({ next: () => { this.toast.success('Deleted'); this.loadData(); } }); }
    getStatusClass(s: string): string {
        switch (s) { case 'Scheduled': return 'badge-info'; case 'Confirmed': return 'badge-primary'; case 'InProgress': return 'badge-warning'; case 'Completed': return 'badge-success'; case 'Cancelled': return 'badge-danger'; default: return 'badge-secondary'; }
    }
}
