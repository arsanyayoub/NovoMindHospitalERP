import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousekeepingService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';

import { ModuleDashboardComponent } from '../../core/components/module-dashboard.component';

@Component({
    selector: 'app-housekeeping',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, ModuleDashboardComponent],
    template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">{{ 'UI_HOUSEKEEPING_FACILITY_CARE' | translate }}</h1>
        <button (click)="showNewTask = true" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
          <i class="fas fa-plus"></i> New Task
        </button>
      </div>
    <app-module-dashboard class="no-print" name="housekeeping"></app-module-dashboard>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{{ 'UI_DIRTY_BEDS' | translate }}</p>
          <h3 class="text-2xl font-bold text-amber-800">{{filterTasks('Pending').length}}</h3>
        </div>
        <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{{ 'UI_IN_PROGRESS' | translate }}</p>
          <h3 class="text-2xl font-bold text-blue-800">{{filterTasks('InProgress').length}}</h3>
        </div>
        <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">{{ 'UI_CLEAN_READY' | translate }}</p>
          <h3 class="text-2xl font-bold text-emerald-800">{{filterTasks('Completed').length}}</h3>
        </div>
        <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{{ 'UI_TOTAL_TASKS' | translate }}</p>
          <h3 class="text-2xl font-bold text-slate-800">{{tasks.length}}</h3>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{{ 'UI_LOCATION_BED' | translate }}</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{{ 'UI_TASK_TYPE' | translate }}</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{{ 'UI_ASSIGNED_TO' | translate }}</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{{ 'UI_STATUS' | translate }}</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{{ 'UI_ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let t of tasks" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <i class="fas fa-bed"></i>
                  </div>
                  <span class="font-medium text-slate-700">{{t.roomNumber || 'Area'}}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">{{t.taskType}}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{t.staffName || 'Unassigned'}}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                      [class.bg-amber-100]="t.status === 'Pending'" [class.text-amber-700]="t.status === 'Pending'"
                      [class.bg-blue-100]="t.status === 'InProgress'" [class.text-blue-700]="t.status === 'InProgress'"
                      [class.bg-emerald-100]="t.status === 'Completed'" [class.text-emerald-700]="t.status === 'Completed'">
                  {{t.status}}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button *ngIf="t.status === 'Pending'" (click)="updateStatus(t.id, 'InProgress')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" [title]="'UI_START_JOB' | translate">
                    <i class="fas fa-play"></i>
                  </button>
                  <button *ngIf="t.status === 'InProgress'" (click)="updateStatus(t.id, 'Completed')" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" [title]="'UI_COMPLETE_JOB' | translate">
                    <i class="fas fa-check"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!tasks.length">
              <td colspan="5" class="py-12 text-center text-slate-400">{{ 'UI_NO_ACTIVE_HOUSEKEEPING_TASKS' | translate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- New Task Modal -->
      <div *ngIf="showNewTask" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-lg">{{ 'UI_CREATE_CLEANING_TASK' | translate }}</h3>
            <button (click)="showNewTask = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
          </div>
          <div class="p-6 space-y-4">
             <div>
               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">{{ 'UI_TASK_TYPE' | translate }}</label>
               <select [(ngModel)]="newTask.taskType" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                 <option value="Routine Cleaning">{{ 'UI_ROUTINE_CLEANING' | translate }}</option>
                 <option value="Deep Clean">{{ 'UI_DEEP_CLEAN' | translate }}</option>
                 <option value="Discharge Clean">{{ 'UI_DISCHARGE_CLEAN' | translate }}</option>
                 <option value="Infection Control Wash">{{ 'UI_INFECTION_CONTROL_WASH' | translate }}</option>
               </select>
             </div>
             <div>
               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">{{ 'UI_STAFF_ASSIGNMENT' | translate }}</label>
               <input type="text" [(ngModel)]="newTask.assignedStaffId" [placeholder]="'UI_STAFF_NAME_OR_ID' | translate" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
             </div>
             <div>
               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">{{ 'UI_REMARKS' | translate }}</label>
               <textarea [(ngModel)]="newTask.remarks" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
             </div>
          </div>
          <div class="p-6 bg-slate-50 flex gap-3">
             <button (click)="showNewTask = false" class="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-100">{{ 'UI_CANCEL' | translate }}</button>
             <button (click)="saveTask()" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md">{{ 'UI_CREATE_TASK' | translate }}</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HousekeepingComponent implements OnInit {
    tasks: any[] = [];
    showNewTask = false;
    newTask: any = { taskType: 'Routine Cleaning' };

    constructor(private housekeepingService: HousekeepingService) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.housekeepingService.getTasks().subscribe(res => {
            this.tasks = res.items;
        });
    }

    filterTasks(status: string) {
        return this.tasks.filter(t => t.status === status);
    }

    saveTask(): void {
        this.housekeepingService.createTask(this.newTask).subscribe(() => {
            this.showNewTask = false;
            this.loadTasks();
            this.newTask = { taskType: 'Routine Cleaning' };
        });
    }

    updateStatus(id: number, status: string): void {
        this.housekeepingService.updateStatus(id, status).subscribe(() => this.loadTasks());
    }
}
