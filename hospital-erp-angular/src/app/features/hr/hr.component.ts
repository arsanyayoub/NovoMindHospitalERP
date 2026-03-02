import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HRService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-hr',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'HR' | translate }}</h1></div>
      <div class="flex gap-2">
        <button class="btn" [class.btn-primary]="tab==='employees'" [class.btn-secondary]="tab!=='employees'" (click)="tab='employees'">{{ 'EMPLOYEES' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='payroll'" [class.btn-secondary]="tab!=='payroll'" (click)="tab='payroll';loadPayrolls()">{{ 'PAYROLL' | translate }}</button>
      </div>
    </div>

    <div *ngIf="tab==='employees'">
      <div class="flex justify-between items-center mb-4">
        <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadEmployees()"></div>
        <button class="btn btn-primary btn-sm" (click)="showEmpForm=true;empForm={}"><span class="material-icons-round">add</span></button>
      </div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Position</th><th>Salary</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let e of employees"><td><span class="badge badge-primary">{{ e.employeeCode }}</span></td><td class="font-semibold">{{ e.fullName }}</td><td>{{ e.department }}</td><td>{{ e.position }}</td><td>{{ e.basicSalary | currency }}</td>
        <td><span class="badge" [ngClass]="e.isActive?'badge-success':'badge-secondary'">{{ (e.isActive?'ACTIVE':'INACTIVE') | translate }}</span></td>
        <td><div class="flex gap-1"><button class="btn btn-sm btn-secondary" (click)="editEmp(e)"><span class="material-icons-round" style="font-size:16px">edit</span></button><button class="btn btn-sm btn-danger" (click)="deleteEmp(e)"><span class="material-icons-round" style="font-size:16px">delete</span></button></div></td></tr></tbody>
      </table></div></div>
    </div>

    <div *ngIf="tab==='payroll'">
      <div class="flex justify-between items-center mb-4"><h3>{{ 'PAYROLL' | translate }}</h3>
        <button class="btn btn-primary btn-sm" (click)="showGenPayroll=true"><span class="material-icons-round">add</span> Generate</button></div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Employee</th><th>Period</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody><tr *ngFor="let p of payrolls"><td class="font-semibold">{{ p.employeeName }}</td><td>{{ p.month }}/{{ p.year }}</td><td>{{ p.basicSalary | currency }}</td><td>{{ p.allowances | currency }}</td><td>{{ p.deductions | currency }}</td><td class="text-success font-bold">{{ p.netSalary | currency }}</td>
        <td><span class="badge" [ngClass]="p.status==='Paid'?'badge-success':'badge-warning'">{{ p.status }}</span></td>
        <td><button *ngIf="p.status!=='Paid'" class="btn btn-sm btn-success" (click)="processPayroll(p.id)">Process</button></td></tr></tbody>
      </table></div></div>
    </div>

    <!-- Employee Modal -->
    <div class="modal-overlay" *ngIf="showEmpForm" (click)="showEmpForm=false"><div class="modal modal-lg" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>{{ empForm.id ? 'Edit' : 'New' }} Employee</h3><button class="btn btn-sm btn-secondary" (click)="showEmpForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">Full Name *</label><input class="form-control" [(ngModel)]="empForm.fullName"></div><div class="form-group"><label class="form-label">National ID</label><input class="form-control" [(ngModel)]="empForm.nationalId"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Department *</label><input class="form-control" [(ngModel)]="empForm.department"></div><div class="form-group"><label class="form-label">Position *</label><input class="form-control" [(ngModel)]="empForm.position"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Hire Date</label><input class="form-control" type="date" [(ngModel)]="empForm.hireDate"></div><div class="form-group"><label class="form-label">Basic Salary</label><input class="form-control" type="number" [(ngModel)]="empForm.basicSalary"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Allowances</label><input class="form-control" type="number" [(ngModel)]="empForm.allowances"></div><div class="form-group"><label class="form-label">Deductions</label><input class="form-control" type="number" [(ngModel)]="empForm.deductions"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Phone</label><input class="form-control" [(ngModel)]="empForm.phoneNumber"></div><div class="form-group"><label class="form-label">Email</label><input class="form-control" [(ngModel)]="empForm.email"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showEmpForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveEmp()">{{ 'SAVE' | translate }}</button></div>
    </div></div>

    <!-- Generate Payroll Modal -->
    <div class="modal-overlay" *ngIf="showGenPayroll" (click)="showGenPayroll=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>Generate Payroll</h3><button class="btn btn-sm btn-secondary" (click)="showGenPayroll=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Employee</label><select class="form-control" [(ngModel)]="genForm.employeeId"><option *ngFor="let e of employees" [ngValue]="e.id">{{ e.fullName }}</option></select></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Month</label><input class="form-control" type="number" [(ngModel)]="genForm.month" min="1" max="12"></div><div class="form-group"><label class="form-label">Year</label><input class="form-control" type="number" [(ngModel)]="genForm.year"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Bonuses</label><input class="form-control" type="number" [(ngModel)]="genForm.bonuses"></div><div class="form-group"><label class="form-label">Extra Deductions</label><input class="form-control" type="number" [(ngModel)]="genForm.deductions"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showGenPayroll=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="generatePayroll()">Generate</button></div>
    </div></div>
  `
})
export class HrComponent implements OnInit {
    tab = 'employees'; employees: any[] = []; payrolls: any[] = [];
    search = ''; showEmpForm = false; showGenPayroll = false;
    empForm: any = {}; genForm: any = { month: new Date().getMonth() + 1, year: new Date().getFullYear(), bonuses: 0, deductions: 0 };
    constructor(private svc: HRService, private toast: ToastService) { }
    editEmp(e: any) { this.showEmpForm = true; this.empForm = { ...e }; }
    ngOnInit() { this.loadEmployees(); }
    loadEmployees() { this.svc.getEmployees({ search: this.search }).subscribe(r => this.employees = r.items); }
    loadPayrolls() { this.svc.getPayrolls({}).subscribe(r => this.payrolls = r.items); }
    saveEmp() { const obs = this.empForm.id ? this.svc.updateEmployee(this.empForm.id, this.empForm) : this.svc.createEmployee(this.empForm); obs.subscribe({ next: () => { this.toast.success('Saved'); this.showEmpForm = false; this.loadEmployees(); }, error: () => this.toast.error('Error') }); }
    deleteEmp(e: any) { if (confirm('Delete?')) this.svc.deleteEmployee(e.id).subscribe({ next: () => { this.toast.success('Deleted'); this.loadEmployees(); } }); }
    generatePayroll() { this.svc.generatePayroll(this.genForm).subscribe({ next: () => { this.toast.success('Generated'); this.showGenPayroll = false; this.loadPayrolls(); }, error: (e: any) => this.toast.error(e.error?.message || 'Error') }); }
    processPayroll(id: number) { this.svc.processPayroll(id).subscribe({ next: () => { this.toast.success('Processed'); this.loadPayrolls(); } }); }
}
