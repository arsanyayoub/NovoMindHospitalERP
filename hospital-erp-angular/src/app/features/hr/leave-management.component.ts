import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HRExtendedService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-leave-management',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="p-8 bg-[#f8fafc] min-h-screen">
      <div class="max-w-7xl mx-auto">
        
        <div class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Leave <span class="text-indigo-600">Requests</span></h1>
            <p class="text-slate-500 font-medium">Manage time-off and absence coverage</p>
          </div>
          <div class="flex gap-4">
             <div class="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span class="text-xs font-black text-slate-800 uppercase tracking-widest">{{pendingCount}} PENDING</span>
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <!-- Statistics Panel -->
           <div class="lg:col-span-1 space-y-6">
              <div class="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                 <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                 <h4 class="text-xs font-black text-indigo-200 uppercase tracking-widest mb-6">Annual Quota</h4>
                 <div class="space-y-6">
                    <div class="flex justify-between items-end">
                       <div>
                          <p class="text-3xl font-black">22 <span class="text-xs opacity-60">Days</span></p>
                          <p class="text-[10px] font-bold opacity-60 uppercase">Used YTD</p>
                       </div>
                       <i class="fas fa-calendar-check text-2xl opacity-40"></i>
                    </div>
                    <div class="h-2 bg-indigo-500 rounded-full overflow-hidden">
                       <div class="h-full bg-white w-3/4 rounded-full"></div>
                    </div>
                 </div>
              </div>

              <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Top Leave Types</h4>
                 <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                       <span class="text-xs font-bold text-slate-600">Annual Leave</span>
                       <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md">65%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                       <span class="text-xs font-bold text-slate-600">Sick Leave</span>
                       <span class="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-md">20%</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                       <span class="text-xs font-bold text-slate-600">Compassionate</span>
                       <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-md">15%</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Requests Table -->
           <div class="lg:col-span-3">
              <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                 <table class="w-full text-left border-collapse">
                    <thead>
                       <tr class="bg-slate-50/50 border-b border-slate-100">
                          <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                          <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                          <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                          <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                       <tr *ngFor="let r of requests" class="group hover:bg-slate-50/50 transition-all">
                          <td class="px-8 py-6">
                             <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400 overflow-hidden">
                                   <i class="fas fa-user-circle text-2xl"></i>
                                </div>
                                <div>
                                   <p class="font-bold text-slate-800 text-sm">{{r.employeeName}}</p>
                                   <p class="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[120px]">{{r.reason}}</p>
                                </div>
                             </div>
                          </td>
                          <td class="px-8 py-6">
                             <div class="flex flex-col">
                                <span class="text-xs font-bold text-slate-800">{{r.startDate | date:'mediumDate'}}</span>
                                <span class="text-[10px] font-bold text-slate-400">{{r.totalDays}} Days Total</span>
                             </div>
                          </td>
                          <td class="px-8 py-6">
                             <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{{r.leaveType}}</span>
                          </td>
                          <td class="px-8 py-6">
                             <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm"
                                   [class]="getStatusClass(r.status)">
                                {{r.status}}
                             </span>
                          </td>
                          <td class="px-8 py-6 text-right">
                             <div *ngIf="r.status === 'Pending'" class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="updateStatus(r.id, 'Approved')" class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm"><i class="fas fa-check"></i></button>
                                <button (click)="updateStatus(r.id, 'Rejected')" class="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-sm"><i class="fas fa-times"></i></button>
                             </div>
                             <span *ngIf="r.status !== 'Pending'" class="text-[10px] font-bold text-slate-300 uppercase">Processed</span>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class LeaveManagementComponent implements OnInit {
    requests: any[] = [];
    pendingCount = 0;

    constructor(private hrService: HRExtendedService) { }

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.hrService.getLeaveRequests(1, 100).subscribe(res => {
            this.requests = res.items;
            this.pendingCount = this.requests.filter(r => r.status === 'Pending').length;
        });
    }

    updateStatus(id: number, status: string): void {
        const comments = status === 'Approved' ? 'Automatically approved by system.' : 'Required documents missing.';
        this.hrService.updateLeaveStatus(id, status, comments).subscribe(() => {
            this.loadRequests();
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    }
}
