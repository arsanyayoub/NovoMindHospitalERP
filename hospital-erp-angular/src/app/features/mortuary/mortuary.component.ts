import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-mortuary',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mortuary <span class="text-slate-400">Management</span></h1>
          <p class="text-slate-500 font-medium italic">Secure and dignified deceased care tracking</p>
        </div>
        <button (click)="showNewRecord = true" class="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-2">
          <i class="fas fa-plus-circle"></i> New Entry
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div class="lg:col-span-1 space-y-6">
           <!-- Statistics Card -->
           <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Current Status</h4>
              <div class="space-y-6">
                <div>
                   <p class="text-3xl font-black text-slate-800">{{records.length}}</p>
                   <p class="text-xs font-bold text-slate-400 uppercase">In Custody</p>
                </div>
                <div>
                   <p class="text-3xl font-black text-emerald-600">85%</p>
                   <p class="text-xs font-bold text-slate-400 uppercase">Capacity Used</p>
                </div>
                <div class="pt-6 border-t border-slate-50">
                   <p class="text-sm font-bold text-slate-600 mb-2">Chamber Availability</p>
                   <div class="grid grid-cols-5 gap-2">
                      <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" 
                           [class]="i < 7 ? 'bg-rose-100' : 'bg-emerald-100'"
                           class="h-2 rounded-full"></div>
                   </div>
                </div>
              </div>
           </div>

           <!-- Quick Links -->
           <div class="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl">
              <h4 class="font-bold mb-4">Regulatory Tasks</h4>
              <ul class="space-y-4 text-sm font-medium opacity-90">
                <li class="flex items-center gap-3"><i class="fas fa-file-medical"></i> Death Certificate Gen</li>
                <li class="flex items-center gap-3"><i class="fas fa-address-card"></i> ID Verification</li>
                <li class="flex items-center gap-3"><i class="fas fa-truck"></i> Fleet Notification</li>
              </ul>
           </div>
        </div>

        <div class="lg:col-span-3">
           <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <table class="w-full text-left">
                <thead>
                   <tr class="bg-slate-50 border-b border-slate-100">
                     <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Deceased Name</th>
                     <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Status</th>
                     <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Location</th>
                     <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Received Date</th>
                     <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                   <tr *ngFor="let r of records" class="hover:bg-slate-50 transition-colors">
                     <td class="px-8 py-5">
                        <div class="flex flex-col">
                           <span class="font-bold text-slate-800">{{r.name}}</span>
                           <span class="text-xs text-slate-400">{{r.causeOfDeath}}</span>
                        </div>
                     </td>
                     <td class="px-8 py-5">
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200 shadow-sm">
                           {{r.bodyStatus}}
                        </span>
                     </td>
                     <td class="px-8 py-5 font-bold text-indigo-600">{{r.chamberNumber}}</td>
                     <td class="px-8 py-5 text-sm text-slate-500">{{r.receivedDate | date:'mediumDate'}}</td>
                     <td class="px-8 py-5 text-right">
                        <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                           <i class="fas fa-ellipsis-v"></i>
                        </button>
                     </td>
                   </tr>
                   <tr *ngIf="!records.length">
                      <td colspan="5" class="py-20 text-center text-slate-300 font-bold italic">No records currently in registry</td>
                   </tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>

      <!-- Registration Modal -->
      <div *ngIf="showNewRecord" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
         <div class="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div class="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div>
                  <h3 class="font-black text-2xl text-slate-800 tracking-tighter">Deceased <span class="text-slate-400">Entry</span></h3>
                  <p class="text-xs font-bold text-slate-400 uppercase mt-1">Official Mortality Registry</p>
               </div>
               <button (click)="showNewRecord = false" class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-md transition-all active:scale-95"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="p-10 space-y-8">
               <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Name / Patient ID</label>
                     <input type="text" [(ngModel)]="newRecord.name" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-slate-800 transition-all font-bold text-slate-800 text-lg">
                  </div>
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">D.O.D</label>
                     <input type="datetime-local" [(ngModel)]="newRecord.dateOfDeath" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-slate-800 transition-all font-bold text-slate-800">
                  </div>
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Chamber Location</label>
                     <input type="text" [(ngModel)]="newRecord.chamberNumber" placeholder="Exp: C-14" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-slate-800 transition-all font-bold text-slate-800 uppercase">
                  </div>
                  <div class="col-span-2">
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Certified Cause of Death</label>
                     <textarea [(ngModel)]="newRecord.causeOfDeath" rows="2" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-slate-800 transition-all font-bold text-slate-800"></textarea>
                  </div>
               </div>
            </div>

            <div class="p-10 bg-slate-50/50 flex gap-4">
               <button (click)="showNewRecord = false" class="flex-1 px-8 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-white transition-all active:scale-95">Discard</button>
               <button (click)="saveRecord()" class="flex-1 px-8 py-4 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all active:scale-95">Finalize Entry</button>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class MortuaryComponent implements OnInit {
    records: any[] = [];
    showNewRecord = false;
    newRecord: any = { name: '', dateOfDeath: new Date().toISOString().substring(0, 16), causeOfDeath: '', chamberNumber: '' };

    constructor(private supportService: SupportService) { }

    ngOnInit(): void {
        this.loadRecords();
    }

    loadRecords(): void {
        this.supportService.getMortuaryRecords().subscribe(res => this.records = res.items);
    }

    saveRecord(): void {
        this.supportService.recordDeath(this.newRecord).subscribe(() => {
            this.showNewRecord = false;
            this.loadRecords();
            this.newRecord = { name: '', dateOfDeath: new Date().toISOString().substring(0, 16), causeOfDeath: '', chamberNumber: '' };
        });
    }
}
