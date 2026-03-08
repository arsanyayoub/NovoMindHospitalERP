import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HRExtendedService, HRService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-roster',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="p-8 bg-[#f8fafc] min-h-screen">
      <div class="max-w-7xl mx-auto">
        
        <div class="flex justify-between items-end mb-10">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Staff <span class="text-indigo-600">Rostering</span></h1>
            <p class="text-slate-500 font-medium">Efficient shift coordination and hospital coverage</p>
          </div>
          <div class="flex gap-3">
             <button (click)="prevWeek()" class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><i class="fas fa-chevron-left"></i></button>
             <div class="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 shadow-sm">
                {{weekDays[0] | date:'MMM d'}} - {{weekDays[6] | date:'MMM d, y'}}
             </div>
             <button (click)="nextWeek()" class="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><i class="fas fa-chevron-right"></i></button>
             <button (click)="showAssign = true" class="ml-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2">
                <i class="fas fa-calendar-plus"></i> Assign Shift
             </button>
          </div>
        </div>

        <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div class="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50">
             <div class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Employee</div>
             <div *ngFor="let day of weekDays" class="p-6 text-center">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{day | date:'EEE'}}</p>
                <p class="text-lg font-black text-slate-800">{{day | date:'d'}}</p>
             </div>
          </div>

          <div class="divide-y divide-slate-100">
             <div *ngFor="let emp of employees" class="grid grid-cols-8 group">
                <div class="p-6 border-r border-slate-100 flex items-center gap-3 bg-slate-50/20">
                   <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{{emp.fullName[0]}}</div>
                   <div>
                      <p class="font-bold text-slate-800 text-sm">{{emp.fullName}}</p>
                      <p class="text-[10px] text-slate-400 font-bold uppercase">{{emp.position}}</p>
                   </div>
                </div>
                <div *ngFor="let day of weekDays" class="p-2 min-h-[100px] hover:bg-slate-50/50 transition-colors relative">
                   <div *ngFor="let r of getRostersForDay(emp.id, day)" 
                        [style.border-left-color]="r.colorCode"
                        class="mb-1 p-2 bg-white border border-slate-200 border-l-4 rounded-lg shadow-sm">
                      <p class="text-[10px] font-black text-slate-800">{{r.shiftName}}</p>
                      <p class="text-[8px] font-bold text-slate-400">{{r.status}}</p>
                   </div>
                   <button (click)="quickAssign(emp.id, day)" class="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-indigo-600/5 transition-opacity">
                      <i class="fas fa-plus text-indigo-600"></i>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Assign Modal -->
      <div *ngIf="showAssign" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div class="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 class="font-black text-xl text-slate-800">Shift <span class="text-indigo-600">Assignment</span></h3>
               <button (click)="showAssign = false" class="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-rose-500 shadow-sm transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-8 space-y-6">
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Employee</label>
                  <select [(ngModel)]="newRoster.employeeId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
                     <option *ngFor="let e of employees" [value]="e.id">{{e.fullName}}</option>
                  </select>
               </div>
               <div class="grid grid-cols-2 gap-4">
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shift Type</label>
                     <select [(ngModel)]="newRoster.workShiftId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold uppercase">
                        <option *ngFor="let s of shifts" [value]="s.id">{{s.shiftName}}</option>
                     </select>
                  </div>
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
                     <input type="date" [(ngModel)]="newRoster.date" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
                  </div>
               </div>
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Notes</label>
                  <textarea [(ngModel)]="newRoster.notes" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"></textarea>
               </div>
            </div>
            <div class="p-8 bg-slate-50/50 flex gap-4">
               <button (click)="showAssign = false" class="flex-1 px-6 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-white active:scale-95 transition-all">Cancel</button>
               <button (click)="saveRoster()" class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all">Create Slot</button>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class RosterComponent implements OnInit {
    employees: any[] = [];
    shifts: any[] = [];
    rosters: any[] = [];
    weekDays: Date[] = [];
    currentDate = new Date();
    showAssign = false;
    newRoster: any = { employeeId: null, workShiftId: null, date: '', notes: '' };

    constructor(
        private hrExtended: HRExtendedService,
        private hrService: HRService
    ) {
        this.generateWeek();
    }

    ngOnInit(): void {
        this.loadData();
    }

    generateWeek(): void {
        const start = new Date(this.currentDate);
        start.setDate(start.getDate() - start.getDay());
        this.weekDays = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            this.weekDays.push(d);
        }
    }

    loadData(): void {
        this.hrService.getEmployees({ pageSize: 100 }).subscribe((res: any) => this.employees = res.items);
        this.hrExtended.getShifts().subscribe((res: any) => {
            this.shifts = res;
            if (this.shifts.length) this.newRoster.workShiftId = this.shifts[0].id;
        });
        this.loadRoster();
    }

    loadRoster(): void {
        const start = this.weekDays[0].toISOString();
        const end = this.weekDays[6].toISOString();
        this.hrExtended.getRoster(start, end).subscribe((res: any) => this.rosters = res);
    }

    getRostersForDay(empId: number, day: Date): any[] {
        return this.rosters.filter(r => r.employeeId === empId && new Date(r.date).toDateString() === day.toDateString());
    }

    prevWeek(): void {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        this.generateWeek();
        this.loadRoster();
    }

    nextWeek(): void {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        this.generateWeek();
        this.loadRoster();
    }

    quickAssign(empId: number, date: Date): void {
        this.newRoster.employeeId = empId;
        this.newRoster.date = date.toISOString().split('T')[0];
        this.showAssign = true;
    }

    saveRoster(): void {
        this.hrExtended.createRoster([this.newRoster]).subscribe(() => {
            this.showAssign = false;
            this.loadRoster();
        });
    }
}
