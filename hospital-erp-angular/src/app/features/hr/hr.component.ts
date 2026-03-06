import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HRService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  styles: [`
    .hr-tab-container { background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; display: inline-flex; gap: 4px; border: 1px solid var(--border); margin-bottom: 24px; }
    .hr-tab { padding: 10px 24px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
    .hr-tab.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .hr-tab:hover:not(.active) { color: var(--text-primary); background: rgba(255,255,255,0.05); }

    .employee-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: 0.2s; }
    .employee-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    
    .salary-pill { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; }
  `],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'HUMAN_RESOURCES' | translate }}</h1>
        <p class="page-subtitle">{{ 'HR_MANAGEMENT_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button *ngIf="tab==='employees'" class="btn btn-primary px-4 shadow-primary" (click)="showEmpForm=true;empForm={isActive:true}">
          <span class="material-icons-round mr-1" style="font-size:20px">person_add</span> {{ 'ADD_EMPLOYEE' | translate }}
        </button>
        <button *ngIf="tab==='payroll'" class="btn btn-primary px-4 shadow-primary" (click)="showGenPayroll=true">
          <span class="material-icons-round mr-1" style="font-size:20px">payments</span> {{ 'GENERATE_PAYROLL' | translate }}
        </button>
      </div>
    </div>

    <div class="hr-tab-container animate-in">
      <button class="hr-tab" [class.active]="tab==='employees'" (click)="tab='employees';loadEmployees()">
        <span class="material-icons-round">people</span> {{ 'EMPLOYEES' | translate }}
      </button>
      <button class="hr-tab" [class.active]="tab==='attendance'" (click)="tab='attendance';loadAttendance()">
        <span class="material-icons-round">fact_check</span> {{ 'ATTENDANCE' | translate }}
      </button>
      <button class="hr-tab" [class.active]="tab==='payroll'" (click)="tab='payroll';loadPayrolls()">
        <span class="material-icons-round">account_balance_wallet</span> {{ 'PAYROLL' | translate }}
      </button>
    </div>

    <!-- EMPLOYEES TAB -->
    <div *ngIf="tab==='employees'" class="animate-in">
      <div class="card p-0 overflow-hidden">
        <div class="p-4 border-bottom bg-glass flex justify-between items-center">
          <div class="search-bar" style="max-width:350px">
            <span class="material-icons-round search-icon">search</span>
            <input class="form-control" [placeholder]="'SEARCH_EMPLOYEES' | translate" [(ngModel)]="search" (input)="loadEmployees()">
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'CODE' | translate }}</th>
                <th>{{ 'NAME' | translate }}</th>
                <th>{{ 'DEPARTMENT' | translate }}</th>
                <th>{{ 'POSITION' | translate }}</th>
                <th class="text-end">{{ 'BASIC_SALARY' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of employees" class="hover-row">
                <td><span class="badge badge-secondary font-mono">{{ e.employeeCode }}</span></td>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold">{{ e.fullName.charAt(0) }}</div>
                    <div class="font-bold">{{ e.fullName }}</div>
                  </div>
                </td>
                <td><span class="badge badge-info">{{ e.department }}</span></td>
                <td class="text-sm font-semibold">{{ e.position }}</td>
                <td class="text-end font-black text-primary">{{ e.basicSalary | currency }}</td>
                <td>
                  <span class="badge" [ngClass]="e.isActive ? 'badge-success' : 'badge-secondary'">
                    {{ (e.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="flex justify-end gap-1">
                    <button class="btn btn-icon btn-xs text-primary" (click)="editEmp(e)">
                      <span class="material-icons-round">edit</span>
                    </button>
                    <button class="btn btn-icon btn-xs text-danger" (click)="deleteEmp(e)">
                      <span class="material-icons-round">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!employees.length"><td colspan="7" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">badge</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ATTENDANCE TAB -->
    <div *ngIf="tab==='attendance'" class="animate-in">
      <div class="card p-0 overflow-hidden">
        <div class="p-4 border-bottom bg-glass flex justify-between items-center">
          <div class="flex gap-4 items-center">
            <input type="month" class="form-control" [(ngModel)]="attendanceMonth" (change)="loadAttendance()" style="width:200px">
          </div>
          <button class="btn btn-primary btn-sm px-4" (click)="showAttForm=true; attForm={date: todayStr, status:'Present'}">
             <span class="material-icons-round mr-1">check_circle</span> {{ 'RECORD_ATTENDANCE' | translate }}
          </button>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'DATE' | translate }}</th>
                <th>{{ 'EMPLOYEE' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th>{{ 'CLOCK_IN' | translate }}</th>
                <th>{{ 'CLOCK_OUT' | translate }}</th>
                <th>{{ 'NOTES' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of attendanceRecords" class="hover-row">
                <td class="font-bold">{{ a.date | date:'mediumDate' }}</td>
                <td>{{ a.employeeName }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-success': a.status === 'Present',
                    'badge-danger': a.status === 'Absent',
                    'badge-warning': a.status === 'Late' || a.status === 'Half-Day'
                  }">{{ a.status | translate }}</span>
                </td>
                <td class="font-mono">{{ a.clockIn ? (a.clockIn | date:'shortTime') : '--:--' }}</td>
                <td class="font-mono">{{ a.clockOut ? (a.clockOut | date:'shortTime') : '--:--' }}</td>
                <td class="text-xs italic">{{ a.notes }}</td>
              </tr>
              <tr *ngIf="!attendanceRecords.length"><td colspan="6" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">fact_check</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PAYROLL TAB -->
    <div *ngIf="tab==='payroll'" class="animate-in">
      <div class="card p-0 overflow-hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'EMPLOYEE' | translate }}</th>
                <th>{{ 'PERIOD' | translate }}</th>
                <th class="text-end">{{ 'BASIC' | translate }}</th>
                <th class="text-end">{{ 'ALLOWANCES' | translate }}</th>
                <th class="text-end">{{ 'DEDUCTIONS' | translate }}</th>
                <th class="text-end">{{ 'NET_SALARY' | translate }}</th>
                <th>{{ 'STATUS' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payrolls" class="hover-row">
                <td class="font-bold">{{ p.employeeName }}</td>
                <td><div class="p-1 px-3 bg-glass border rounded-lg font-bold text-center w-20">{{ p.month }}/{{ p.year }}</div></td>
                <td class="text-end">{{ p.basicSalary | currency }}</td>
                <td class="text-end text-success">{{ p.allowances | currency }}</td>
                <td class="text-end text-danger">({{ p.deductions | currency }})</td>
                <td class="text-end"><span class="salary-pill">{{ p.netSalary | currency }}</span></td>
                <td>
                  <span class="badge" [ngClass]="p.status==='Paid' ? 'badge-success' : 'badge-warning'">
                    {{ p.status | translate }}
                  </span>
                </td>
                <td class="text-end">
                  <button *ngIf="p.status!=='Paid'" class="btn btn-success btn-sm font-bold shadow-success" (click)="processPayroll(p.id)">
                    {{ 'PROCESS_PAYMENT' | translate }}
                  </button>
                  <span *ngIf="p.status==='Paid'" class="material-icons-round text-success">check_circle</span>
                </td>
              </tr>
              <tr *ngIf="!payrolls.length"><td colspan="8" class="p-20 text-center text-muted"><span class="material-icons-round text-5xl opacity-20 mb-4">payments</span><p>{{ 'NO_DATA' | translate }}</p></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ATTENDANCE MODAL -->
    <div class="modal-overlay" *ngIf="showAttForm" (click)="showAttForm=false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:500px">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ 'RECORD_ATTENDANCE' | translate }}</h3>
           <button (click)="showAttForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body animate-in">
          <div class="form-group mb-4">
             <label class="form-label font-bold">{{ 'SELECT_EMPLOYEE' | translate }}*</label>
             <select class="form-control" [(ngModel)]="attForm.employeeId">
                <option *ngFor="let e of employees" [ngValue]="e.id">{{ e.fullName }} ({{ e.employeeCode }})</option>
             </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'DATE' | translate }}*</label>
               <input class="form-control" type="date" [(ngModel)]="attForm.date">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'STATUS' | translate }}*</label>
               <select class="form-control" [(ngModel)]="attForm.status">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half-Day">Half-Day</option>
                  <option value="Late">Late</option>
               </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs text-info">{{ 'CLOCK_IN' | translate }}</label>
               <input class="form-control" type="datetime-local" [(ngModel)]="attForm.clockIn">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs text-info">{{ 'CLOCK_OUT' | translate }}</label>
               <input class="form-control" type="datetime-local" [(ngModel)]="attForm.clockOut">
            </div>
          </div>
          <div class="form-group">
             <label class="form-label font-bold text-xs uppercase">{{ 'NOTES' | translate }}</label>
             <textarea class="form-control" [(ngModel)]="attForm.notes" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary w-full" (click)="showAttForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary w-full shadow-primary font-bold" (click)="saveAttendance()">
             <span class="material-icons-round mr-1">save</span> {{ 'SAVE_RECORD' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- EMPLOYEE MODAL -->
    <div class="modal-overlay" *ngIf="showEmpForm" (click)="showEmpForm=false">
      <div class="modal modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ (empForm.id ? 'EDIT' : 'ADD_NEW') | translate }} {{ 'EMPLOYEE' | translate }}</h3>
           <button (click)="showEmpForm=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-6 animate-in">
            <div class="form-group col-span-2">
               <label class="form-label font-bold">{{ 'FULL_NAME' | translate }}*</label>
               <input class="form-control" [(ngModel)]="empForm.fullName">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'NATIONAL_ID' | translate }}</label>
               <input class="form-control" [(ngModel)]="empForm.nationalId">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'PHONE' | translate }}</label>
               <input class="form-control" [(ngModel)]="empForm.phoneNumber">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'DEPARTMENT' | translate }}*</label>
               <input class="form-control" [(ngModel)]="empForm.department" placeholder="Nursing, Admin, IT...">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'POSITION' | translate }}*</label>
               <input class="form-control" [(ngModel)]="empForm.position" placeholder="Senior Staff, Manager...">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'BASIC_SALARY' | translate }}</label>
               <input class="form-control font-bold" type="number" [(ngModel)]="empForm.basicSalary">
            </div>
            <div class="form-group">
               <label class="form-label font-bold uppercase text-xs">{{ 'HIRE_DATE' | translate }}</label>
               <input class="form-control" type="date" [(ngModel)]="empForm.hireDate">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showEmpForm=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary" (click)="saveEmp()">
            <span class="material-icons-round mr-1">save</span> {{ 'SAVE' | translate }}
          </button>
        </div>
      </div>
    </div>

    <!-- GENERATE PAYROLL MODAL -->
    <div class="modal-overlay" *ngIf="showGenPayroll" (click)="showGenPayroll=false">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:500px">
        <div class="modal-header">
           <h3 class="modal-title font-bold">{{ 'GENERATE_PAYROLL' | translate }}</h3>
           <button (click)="showGenPayroll=false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-4">
             <label class="form-label font-bold">{{ 'SELECT_EMPLOYEE' | translate }}</label>
             <select class="form-control" [(ngModel)]="genForm.employeeId">
                <option *ngFor="let e of employees" [ngValue]="e.id">{{ e.fullName }} ({{ e.employeeCode }})</option>
             </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
             <div class="form-group">
                <label class="form-label text-xs font-bold uppercase">{{ 'MONTH' | translate }}</label>
                <input class="form-control font-bold" type="number" [(ngModel)]="genForm.month" min="1" max="12">
             </div>
             <div class="form-group">
                <label class="form-label text-xs font-bold uppercase">{{ 'YEAR' | translate }}</label>
                <input class="form-control font-bold" type="number" [(ngModel)]="genForm.year">
             </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div class="form-group">
                <label class="form-label text-xs font-bold uppercase text-success">{{ 'EXTRA_BONUSES' | translate }}</label>
                <input class="form-control font-bold text-success" type="number" [(ngModel)]="genForm.bonuses">
             </div>
             <div class="form-group">
                <label class="form-label text-xs font-bold uppercase text-danger">{{ 'EXTRA_DEDUCTIONS' | translate }}</label>
                <input class="form-control font-bold text-danger" type="number" [(ngModel)]="genForm.deductions">
             </div>
          </div>
          <p class="text-xs text-muted mt-4 italic"><span class="material-icons-round align-middle text-xs">info</span> {{ 'PAYROLL_AUTO_CALC_HINT' | translate }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary w-full" (click)="showGenPayroll=false">{{ 'CANCEL' | translate }}</button>
          <button class="btn btn-primary w-full shadow-primary font-bold" (click)="generatePayroll()">
             <span class="material-icons-round mr-1">calculate</span> {{ 'GENERATE_STATEMENT' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class HrComponent implements OnInit {
  tab = 'employees';
  employees: any[] = [];
  attendanceRecords: any[] = [];
  payrolls: any[] = [];
  search = '';

  showEmpForm = false;
  showGenPayroll = false;
  showAttForm = false;

  empForm: any = {};
  genForm: any = { month: new Date().getMonth() + 1, year: new Date().getFullYear(), bonuses: 0, deductions: 0 };
  attForm: any = { status: 'Present' };

  attendanceMonth = new Date().toISOString().substring(0, 7);
  todayStr = new Date().toISOString().substring(0, 10);

  constructor(
    private svc: HRService,
    private translate: TranslateService,
    private toast: ToastService
  ) { }

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.svc.getEmployees({ search: this.search }).subscribe(r => this.employees = r.items);
  }

  loadAttendance() {
    const year = parseInt(this.attendanceMonth.split('-')[0]);
    const month = parseInt(this.attendanceMonth.split('-')[1]);
    const from = new Date(year, month - 1, 1).toISOString();
    const to = new Date(year, month, 0).toISOString();
    this.svc.getAttendance({ page: 1, pageSize: 100 }, undefined, from, to).subscribe(r => this.attendanceRecords = r.items);
  }

  loadPayrolls() {
    this.svc.getPayrolls({}).subscribe(r => this.payrolls = r.items);
  }

  saveAttendance() {
    this.svc.recordAttendance(this.attForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showAttForm = false;
        this.loadAttendance();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  editEmp(e: any) {
    this.showEmpForm = true;
    this.empForm = { ...e, hireDate: e.hireDate?.split('T')[0] };
  }

  saveEmp() {
    const obs = this.empForm.id ? this.svc.updateEmployee(this.empForm.id, this.empForm) : this.svc.createEmployee(this.empForm);
    obs.subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showEmpForm = false;
        this.loadEmployees();
      },
      error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
    });
  }

  deleteEmp(e: any) {
    if (confirm(this.translate.instant('CONFIRM_DELETE'))) {
      this.svc.deleteEmployee(e.id).subscribe({
        next: () => {
          this.toast.success(this.translate.instant('SUCCESS_DELETE'));
          this.loadEmployees();
        },
        error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
    }
  }

  generatePayroll() {
    this.svc.generatePayroll(this.genForm).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.showGenPayroll = false;
        this.loadPayrolls();
      },
      error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }

  processPayroll(id: number) {
    this.svc.processPayroll(id).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('SUCCESS_SAVE'));
        this.loadPayrolls();
      },
      error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
    });
  }
}
