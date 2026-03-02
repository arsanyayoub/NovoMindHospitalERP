import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentService, DoctorService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'APPOINTMENTS' | translate }}</h1></div>
      <div class="flex gap-2">
        <div class="view-toggle">
          <button [class.active]="viewMode==='list'" (click)="viewMode='list'">
            <span class="material-icons-round">list</span>
            {{ 'LIST_VIEW' | translate }}
          </button>
          <button [class.active]="viewMode==='calendar'" (click)="viewMode='calendar';buildCalendar()">
            <span class="material-icons-round">calendar_month</span>
            {{ 'CALENDAR_VIEW' | translate }}
          </button>
        </div>
        <button class="btn btn-secondary" (click)="exportCsv()"><span class="material-icons-round">download</span> {{ 'EXPORT' | translate }}</button>
        <button class="btn btn-primary" (click)="openForm()"><span class="material-icons-round">add</span> {{ 'ADD_NEW' | translate }}</button>
      </div>
    </div>

    <div class="filter-bar mb-4">
      <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadData()"></div>
      <select class="form-control" style="width:auto;" [(ngModel)]="statusFilter" (change)="loadData()"><option value="">All Status</option><option value="Scheduled">Scheduled</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select>
      <input class="form-control" type="date" style="width:auto;" [(ngModel)]="dateFilter" (change)="loadData()">
    </div>

    <!-- LIST VIEW -->
    <div *ngIf="viewMode==='list'">
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
                <td><span class="badge" [ngClass]="getStatusClass(a.status)">{{ a.status }}</span></td>
                <td>{{ a.fee | currency }}</td>
                <td><div class="flex gap-1"><button class="btn btn-sm btn-secondary" (click)="openForm(a)"><span class="material-icons-round" style="font-size:16px">edit</span></button><button class="btn btn-sm btn-danger" (click)="deleteAppt(a)"><span class="material-icons-round" style="font-size:16px">delete</span></button></div></td>
              </tr>
              <tr *ngIf="appointments.length === 0"><td colspan="8"><div class="empty-state"><span class="material-icons-round empty-icon">calendar_month</span><span class="empty-title">{{ 'NO_DATA' | translate }}</span></div></td></tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" *ngIf="totalPages > 1"><span class="pagination-info">Page {{ page }} of {{ totalPages }}</span><div class="pagination-buttons"><button class="page-btn" (click)="page=page-1;loadData()" [disabled]="page<=1"><span class="material-icons-round">chevron_left</span></button><button class="page-btn" (click)="page=page+1;loadData()" [disabled]="page>=totalPages"><span class="material-icons-round">chevron_right</span></button></div></div>
      </div>
    </div>

    <!-- CALENDAR VIEW -->
    <div *ngIf="viewMode==='calendar'" class="calendar-container animate-fade-in">
      <div class="calendar-nav">
        <button class="btn btn-sm btn-secondary" (click)="prevMonth()"><span class="material-icons-round">chevron_left</span></button>
        <h3 class="calendar-month-title">{{ calendarDate | date:'MMMM yyyy' }}</h3>
        <button class="btn btn-sm btn-secondary" (click)="nextMonth()"><span class="material-icons-round">chevron_right</span></button>
        <button class="btn btn-sm btn-secondary" (click)="goToday()">Today</button>
      </div>
      <div class="card" style="padding:0; overflow:hidden;">
        <div class="calendar-grid">
          <div class="calendar-day-header" *ngFor="let d of dayHeaders">{{ d }}</div>
          <div *ngFor="let cell of calendarCells"
               class="calendar-cell"
               [class.other-month]="!cell.currentMonth"
               [class.today]="cell.isToday"
               (click)="selectDate(cell.date)">
            <span class="cell-day" [class.today-num]="cell.isToday">{{ cell.day }}</span>
            <div class="cell-events">
              <div *ngFor="let ev of cell.events.slice(0,3)"
                   class="cal-event"
                   [class.cal-event-scheduled]="ev.status==='Scheduled'"
                   [class.cal-event-confirmed]="ev.status==='Confirmed'"
                   [class.cal-event-completed]="ev.status==='Completed'"
                   [class.cal-event-cancelled]="ev.status==='Cancelled'"
                   [class.cal-event-inprogress]="ev.status==='InProgress'"
                   [title]="ev.patientName + ' - Dr. ' + ev.doctorName">
                {{ ev.appointmentTime?.substring(0,5) }} {{ ev.patientName }}
              </div>
              <div *ngIf="cell.events.length > 3" class="cal-more">+{{ cell.events.length - 3 }} more</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calendar-legend">
        <span class="legend-chip cal-event-scheduled">Scheduled</span>
        <span class="legend-chip cal-event-confirmed">Confirmed</span>
        <span class="legend-chip cal-event-completed">Completed</span>
        <span class="legend-chip cal-event-cancelled">Cancelled</span>
        <span class="legend-chip cal-event-inprogress">In Progress</span>
      </div>
    </div>

    <!-- FORM MODAL -->
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
  `,
  styles: [`
    .view-toggle { display: flex; border-radius: 10px; border: 1px solid var(--border); overflow: hidden; }
    .view-toggle button { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: none; background: none; color: var(--text-secondary); cursor: pointer; font-family: var(--font-family); font-size: 0.8rem; font-weight: 500; transition: var(--transition); }
    .view-toggle button.active { background: rgba(99,102,241,0.15); color: var(--primary-light); }
    .view-toggle button:hover:not(.active) { background: rgba(255,255,255,0.05); }
    .view-toggle button .material-icons-round { font-size: 18px; }

    .calendar-container { display: flex; flex-direction: column; gap: 16px; }
    .calendar-nav { display: flex; align-items: center; gap: 12px; }
    .calendar-month-title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); min-width: 180px; text-align: center; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
    .calendar-day-header { background: var(--bg-sidebar); padding: 10px 8px; text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
    .calendar-cell { min-height: 110px; padding: 8px; cursor: pointer; transition: background 0.15s; display: flex; flex-direction: column; gap: 4px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .calendar-cell:nth-child(7n) { border-right: none; }
    .calendar-cell:hover { background: rgba(99,102,241,0.06); }
    .calendar-cell.other-month { background: rgba(0,0,0,0.15); opacity: 0.5; }
    .calendar-cell.today { background: rgba(99,102,241,0.08); }
    .cell-day { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); line-height: 1; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
    .cell-day.today-num { background: var(--primary); color: white; border-radius: 50%; font-weight: 800; }
    .cell-events { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow: hidden; }
    .cal-event { font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
    .cal-event-scheduled { background: rgba(59,130,246,0.2); color: #93c5fd; border-left: 3px solid #3b82f6; }
    .cal-event-confirmed { background: rgba(99,102,241,0.2); color: #a5b4fc; border-left: 3px solid #6366f1; }
    .cal-event-completed { background: rgba(16,185,129,0.2); color: #6ee7b7; border-left: 3px solid #10b981; }
    .cal-event-cancelled { background: rgba(239,68,68,0.2); color: #fca5a5; border-left: 3px solid #ef4444; }
    .cal-event-inprogress { background: rgba(245,158,11,0.2); color: #fcd34d; border-left: 3px solid #f59e0b; }
    .cal-more { font-size: 0.68rem; color: var(--text-muted); padding: 2px 6px; }
    .calendar-legend { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .legend-chip { font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; font-weight: 500; }
  `]
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
  dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(
    private svc: AppointmentService,
    private patientSvc: PatientService,
    private doctorSvc: DoctorService,
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
    this.patientSvc.getAll({ pageSize: 500 }).subscribe(r => this.patientsList = r.items);
    this.doctorSvc.getAll({ pageSize: 500 }).subscribe(r => this.doctorsList = r.items);
  }

  openForm(a?: any) {
    this.editing = a || null;
    this.form = a
      ? { ...a, appointmentDate: a.appointmentDate?.split('T')[0], appointmentTimeStr: a.appointmentTime?.substring(0, 5) }
      : { durationMinutes: 30, fee: 0, appointmentDate: '', appointmentTimeStr: '09:00' };
    this.showForm = true;
  }

  save() {
    if (!this.form.patientId || !this.form.doctorId) return;
    this.saving = true;
    const data = { ...this.form, appointmentTime: this.form.appointmentTimeStr + ':00' };
    const obs = this.editing ? this.svc.update(this.editing.id, data) : this.svc.create(data);
    obs.subscribe({
      next: () => { this.toast.success('Saved'); this.showForm = false; this.saving = false; this.loadData(); },
      error: () => { this.toast.error('Error'); this.saving = false; }
    });
  }

  deleteAppt(a: any) {
    if (confirm('Delete?')) this.svc.delete(a.id).subscribe({ next: () => { this.toast.success('Deleted'); this.loadData(); } });
  }

  getStatusClass(s: string): string {
    switch (s) {
      case 'Scheduled': return 'badge-info';
      case 'Confirmed': return 'badge-primary';
      case 'InProgress': return 'badge-warning';
      case 'Completed': return 'badge-success';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
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

    // Monday-based: 0=Mon … 6=Sun
    let startDow = firstDay.getDay();
    const offset = startDow === 0 ? 6 : startDow - 1;

    const cells: any[] = [];

    // Previous month padding cells
    for (let i = offset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      cells.push({ date: d, day: d.getDate(), currentMonth: false, isToday: false, events: [] });
    }

    // Current month cells
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const events = this.allAppointments.filter(a => a.appointmentDate?.startsWith(dateStr));
      cells.push({ date, day: d, currentMonth: true, isToday: date.getTime() === today.getTime(), events });
    }

    // Next month padding cells to complete final row
    const remaining = (7 - cells.length % 7) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ date: d, day: d.getDate(), currentMonth: false, isToday: false, events: [] });
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

  selectDate(date: Date) {
    this.dateFilter = date.toISOString().split('T')[0];
    this.viewMode = 'list';
    this.loadData();
  }
}
