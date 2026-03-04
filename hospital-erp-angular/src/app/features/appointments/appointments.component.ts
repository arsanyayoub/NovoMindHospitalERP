import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppointmentService, DoctorService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .view-toggle { display: flex; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; background: rgba(var(--card-bg-rgb), 0.3); }
    .view-toggle button { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: none; background: none; color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.2s; font-size: 0.85rem; }
    .view-toggle button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .view-toggle button:hover:not(.active) { background: rgba(255,255,255,0.05); color: var(--text-primary); }

    .calendar-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--border); gap: 1px; border: 1px solid var(--border); border-radius: 0 0 20px 20px; overflow: hidden; }
    .calendar-day-header { background: rgba(var(--card-bg-rgb), 0.8); padding: 14px; text-align: center; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .calendar-cell { min-height: 120px; padding: 12px; background: var(--bg-card); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 6px; }
    .calendar-cell:hover { background: rgba(var(--primary-rgb), 0.05); }
    .calendar-cell.other-month { background: rgba(0,0,0,0.15); opacity: 0.4; pointer-events: none; }
    .calendar-cell.today { background: rgba(var(--primary-rgb), 0.08); }
    
    .cell-day { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: 0.2s; }
    .calendar-cell.today .cell-day { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.4); }
    
    .cal-event { font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-left: 3px solid transparent; margin-bottom: 2px; }
    .cal-event-scheduled { background: rgba(59,130,246,0.15); color: #60a5fa; border-color: #3b82f6; }
    .cal-event-confirmed { background: rgba(99,102,241,0.15); color: #818cf8; border-color: #6366f1; }
    .cal-event-completed { background: rgba(16,185,129,0.15); color: #34d399; border-color: #10b981; }
    .cal-event-cancelled { background: rgba(239,68,68,0.15); color: #f87171; border-color: #ef4444; }
    
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-scheduled { background: rgba(59,130,246,0.1); color: #3b82f6; }
    .status-confirmed { background: rgba(99,102,241,0.1); color: #6366f1; }
    .status-completed { background: rgba(16,185,129,0.1); color: #10b981; }
    .status-cancelled { background: rgba(239,68,68,0.1); color: #ef4444; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'APPOINTMENTS' | translate }}</h1>
        <p class="page-subtitle">{{ 'MANAGE_SCHEDULES' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <div class="view-toggle">
          <button [class.active]="viewMode==='list'" (click)="viewMode='list'">
            <span class="material-icons-round" style="font-size:18px">format_list_bulleted</span>
            {{ 'LIST_VIEW' | translate }}
          </button>
          <button [class.active]="viewMode==='calendar'" (click)="viewMode='calendar';buildCalendar()">
            <span class="material-icons-round" style="font-size:18px">calendar_month</span>
            {{ 'CALENDAR_VIEW' | translate }}
          </button>
        </div>
        <button class="btn btn-secondary px-4" (click)="exportCsv()">
          <span class="material-icons-round mr-1" style="font-size:20px">file_download</span> {{ 'EXPORT' | translate }}
        </button>
        <button class="btn btn-primary px-4" (click)="openForm()">
          <span class="material-icons-round mr-1" style="font-size:20px">event_available</span> {{ 'ADD_NEW' | translate }}
        </button>
      </div>
    </div>

    <div class="filter-bar mb-6 animate-in">
      <div class="search-bar" style="max-width:300px">
        <span class="material-icons-round search-icon">search</span>
        <input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadData()">
      </div>
      <select class="form-control" style="width:180px" [(ngModel)]="statusFilter" (change)="loadData()">
        <option value="">{{ 'ALL_STATUSES' | translate }}</option>
        <option value="Scheduled">{{ 'SCHEDULED' | translate }}</option>
        <option value="Confirmed">{{ 'CONFIRMED' | translate }}</option>
        <option value="Completed">{{ 'COMPLETED' | translate }}</option>
        <option value="Cancelled">{{ 'CANCELLED' | translate }}</option>
      </select>
      <div class="flex items-center gap-2 bg-glass border p-1 rounded-xl">
        <input class="form-control border-0 bg-transparent" type="date" [(ngModel)]="dateFilter" (change)="loadData()">
        <button *ngIf="dateFilter" class="btn btn-icon btn-xs text-danger" (click)="dateFilter='';loadData()">
          <span class="material-icons-round">close</span>
        </button>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div *ngIf="viewMode==='list'" class="animate-in">
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
                <th>{{ 'PATIENT' | translate }}</th>
                <th>{{ 'DOCTOR' | translate }}</th>
                <th>{{ 'DATE' | translate }}</th>
                <th>{{ 'TIME' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of appointments" class="hover-row">
                <td><span class="badge badge-secondary">{{ a.appointmentCode }}</span></td>
                <td>
                   <div class="font-bold">{{ a.patientName }}</div>
                   <div class="text-xs text-muted">{{ a.patientCode }}</div>
                </td>
                <td>
                   <div class="font-bold">Dr. {{ a.doctorName }}</div>
                   <div class="text-xs text-muted">{{ a.doctorSpecialization }}</div>
                </td>
                <td>{{ a.appointmentDate | date:'fullDate' }}</td>
                <td class="font-mono">{{ a.appointmentTime | slice:0:5 }}</td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + a.status.toLowerCase()">
                    {{ (a.status === 'InProgress' ? 'IN_PROGRESS' : a.status) | translate }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="flex justify-end gap-1">
                    <button class="btn btn-icon btn-xs text-primary" (click)="openForm(a)">
                      <span class="material-icons-round">edit</span>
                    </button>
                    <button class="btn btn-icon btn-xs text-danger" (click)="deleteAppt(a)">
                      <span class="material-icons-round">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!appointments.length"><td colspan="8"><div class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">event_busy</span><p>{{ 'NO_DATA' | translate }}</p></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- CALENDAR VIEW -->
    <div *ngIf="viewMode==='calendar'" class="animate-in">
      <div class="calendar-card mb-6">
        <div class="p-4 flex items-center justify-between border-bottom bg-glass">
            <div class="flex items-center gap-3">
              <button class="btn btn-icon btn-secondary" (click)="prevMonth()"><span class="material-icons-round">chevron_left</span></button>
              <h3 class="font-bold text-xl min-w-[200px] text-center">{{ calendarDate | date:'MMMM yyyy' }}</h3>
              <button class="btn btn-icon btn-secondary" (click)="nextMonth()"><span class="material-icons-round">chevron_right</span></button>
            </div>
            <button class="btn btn-sm btn-secondary font-bold" (click)="goToday()">{{ 'TODAY' | translate }}</button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-header" *ngFor="let d of dayHeaders">{{ d | translate }}</div>
          <div *ngFor="let cell of calendarCells"
               class="calendar-cell"
               [class.other-month]="!cell.currentMonth"
               [class.today]="cell.isToday"
               (click)="selectDate(cell.date)">
            <span class="cell-day">{{ cell.day }}</span>
            <div class="flex flex-col gap-1 overflow-hidden">
              <div *ngFor="let ev of cell.events.slice(0,3)"
                   class="cal-event"
                   [ngClass]="'cal-event-' + ev.status.toLowerCase()"
                   [title]="ev.patientName + ' - Dr. ' + ev.doctorName">
                <span class="font-mono">{{ ev.appointmentTime | slice:0:5 }}</span> {{ ev.patientName }}
              </div>
              <div *ngIf="cell.events.length > 3" class="text-xs font-bold text-muted ml-1">+{{ cell.events.length - 3 }} {{ 'MORE' | translate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM MODAL -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ (editing ? 'EDIT' : 'ADD_NEW') | translate }} {{ 'APPOINTMENT' | translate }}</h3>
           <button (click)="showForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-6 animate-in">
            <div class="form-group">
               <label class="form-label font-bold">{{ 'PATIENT' | translate }}*</label>
               <select class="form-control" [(ngModel)]="form.patientId">
                 <option *ngFor="let p of patientsList" [value]="p.id">{{ p.fullName }} ({{ p.patientCode }})</option>
               </select>
            </div>
            <div class="form-group">
               <label class="form-label font-bold">{{ 'DOCTOR' | translate }}*</label>
               <select class="form-control" [(ngModel)]="form.doctorId">
                 <option *ngFor="let d of doctorsList" [value]="d.id">Dr. {{ d.fullName }} ({{ d.specialization }})</option>
               </select>
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'DATE' | translate }}*</label>
               <input class="form-control" type="date" [(ngModel)]="form.appointmentDate">
            </div>
            <div class="form-group grid grid-cols-2 gap-3">
               <div>
                  <label class="form-label font-bold uppercase text-xs">{{ 'TIME' | translate }}*</label>
                  <input class="form-control" type="time" [(ngModel)]="form.appointmentTimeStr">
               </div>
               <div>
                  <label class="form-label font-bold uppercase text-xs">{{ 'DURATION' | translate }}</label>
                  <input class="form-control" type="number" [(ngModel)]="form.durationMinutes" step="15">
               </div>
            </div>
            <div class="form-group">
               <label class="form-label uppercase text-xs font-bold">{{ 'STATUS' | translate }}</label>
               <select class="form-control" [(ngModel)]="form.status" [disabled]="!editing">
                 <option value="Scheduled">{{ 'SCHEDULED' | translate }}</option>
                 <option value="Confirmed">{{ 'CONFIRMED' | translate }}</option>
                 <option value="InProgress">{{ 'IN_PROGRESS' | translate }}</option>
                 <option value="Completed">{{ 'COMPLETED' | translate }}</option>
                 <option value="Cancelled">{{ 'CANCELLED' | translate }}</option>
               </select>
            </div>
            <div class="form-group">
               <label class="form-label uppercase text-xs font-bold">{{ 'FEE' | translate }}</label>
               <div class="flex items-center gap-2">
                 <input class="form-control font-bold text-lg" type="number" [(ngModel)]="form.fee">
                 <span class="text-muted font-bold">{{ 'EGP' | translate }}</span>
               </div>
            </div>
            
            <div class="form-group col-span-2">
               <label class="form-label uppercase text-xs font-bold">{{ 'NOTES' | translate }}</label>
               <textarea class="form-control" [(ngModel)]="form.notes" rows="2" placeholder="Reason for visit..."></textarea>
            </div>
            
            <ng-container *ngIf="editing">
               <div class="form-group col-span-2">
                  <label class="form-label uppercase text-xs font-bold">{{ 'DIAGNOSIS' | translate }}</label>
                  <textarea class="form-control" [(ngModel)]="form.diagnosis" rows="2"></textarea>
               </div>
               <div class="form-group col-span-2">
                  <label class="form-label uppercase text-xs font-bold">{{ 'PRESCRIPTION' | translate }}</label>
                  <textarea class="form-control" [(ngModel)]="form.prescription" rows="2"></textarea>
               </div>
            </ng-container>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving || !form.patientId || !form.doctorId || !form.appointmentDate">
            <span class="spinner spinner-sm mr-2" *ngIf="saving"></span>
            <span class="material-icons-round mr-1">save</span> {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  allAppointments: any[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  dateFilter = '';
  page = 1;
  totalPages = 1;
  showForm = false;
  editing: any = null;
  saving = false;
  form: any = {};
  patientsList: any[] = [];
  doctorsList: any[] = [];
  viewMode = 'list';
  calendarDate = new Date();
  calendarCells: any[] = [];
  dayHeaders = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  constructor(
    private svc: AppointmentService,
    private patientSvc: PatientService,
    private doctorSvc: DoctorService,
    private translate: TranslateService,
    private toast: ToastService,
    private exportSvc: ExportService
  ) { }

  ngOnInit() { this.loadData(); this.loadLookups(); }

  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 500, search: this.search }, { status: this.statusFilter, date: this.dateFilter }).subscribe({
      next: r => {
        this.appointments = r.items;
        this.allAppointments = r.items;
        this.totalPages = r.totalPages;
        this.loading = false;
        if (this.viewMode === 'calendar') this.buildCalendar();
      },
      error: () => this.loading = false
    });
  }

  loadLookups() {
    this.patientSvc.getAll({ pageSize: 1000 }).subscribe(r => this.patientsList = r.items);
    this.doctorSvc.getAll({ pageSize: 1000 }).subscribe(r => this.doctorsList = r.items);
  }

  openForm(a?: any) {
    this.editing = a || null;
    this.form = a
      ? { ...a, appointmentDate: a.appointmentDate?.split('T')[0], appointmentTimeStr: a.appointmentTime?.substring(0, 5) }
      : { durationMinutes: 30, fee: 0, appointmentDate: '', appointmentTimeStr: '09:00', status: 'Scheduled' };
    this.showForm = true;
  }

  save() {
    if (!this.form.patientId || !this.form.doctorId) return;
    this.saving = true;
    const data = { ...this.form, appointmentTime: this.form.appointmentTimeStr + ':00' };
    const obs = this.editing ? this.svc.update(this.editing.id, data) : this.svc.create(data);
    obs.subscribe({
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

  deleteAppt(a: any) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.svc.delete(a.id).subscribe({
        next: () => { this.toast.success(this.translate.instant('SUCCESS_DELETE')); this.loadData(); },
        error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
    }
  }

  exportCsv() {
    this.exportSvc.toCSV(
      this.appointments,
      'appointments',
      [
        { key: 'appointmentCode', header: 'Code' },
        { key: 'patientName', header: 'Patient' },
        { key: 'doctorName', header: 'Doctor' },
        { key: 'appointmentDate', header: 'Date' },
        { key: 'appointmentTime', header: 'Time' },
        { key: 'status', header: 'Status' },
        { key: 'fee', header: 'Fee' }
      ]
    );
  }

  // ── Calendar ──────────────────────────────────────────────
  buildCalendar() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);

    let startDow = firstDay.getDay(); // 0=Sun
    const offset = startDow === 0 ? 6 : startDow - 1; // Mon=0, Sun=6

    const cells: any[] = [];
    for (let i = offset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      cells.push({ date: d, day: d.getDate(), currentMonth: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const events = this.allAppointments.filter(a => a.appointmentDate?.startsWith(dateStr));
      cells.push({ date, day: d, currentMonth: true, isToday: date.getTime() === today.getTime(), events });
    }

    const remaining = (7 - cells.length % 7) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d, day: d.getDate(), currentMonth: false });
    }
    this.calendarCells = cells;
  }

  prevMonth() {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth() {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  goToday() {
    this.calendarDate = new Date();
    this.buildCalendar();
  }

  selectDate(cellDate: Date) {
    if (!cellDate) return;
    this.dateFilter = cellDate.toISOString().split('T')[0];
    this.viewMode = 'list';
    this.loadData();
  }
}
