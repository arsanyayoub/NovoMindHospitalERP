import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cssd',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">CSSD <span class="text-indigo-600">Sterilization</span></h1>
          <p class="text-slate-500 font-medium">Instrument safety and decontamination logs</p>
        </div>
        <button (click)="showNewBatch = true" class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center gap-2">
          <i class="fas fa-plus"></i> New Batch
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Batches</p>
          <h3 class="text-2xl font-bold text-indigo-600">{{batches.length}}</h3>
        </div>
        <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Sterility Success</p>
          <h3 class="text-2xl font-bold text-emerald-800">99.8%</h3>
        </div>
        <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Equipment Uptime</p>
          <h3 class="text-2xl font-bold text-amber-800">100%</h3>
        </div>
        <div class="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
           <i class="fas fa-microscope absolute -right-4 -bottom-4 text-6xl opacity-10"></i>
           <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Avg Cycle Time</p>
           <h3 class="text-2xl font-bold">45m</h3>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Info</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipment</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Started</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr *ngFor="let b of batches" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                     {{b.batchNumber.substring(0,2)}}
                   </div>
                   <div>
                     <p class="font-bold text-slate-800">{{b.batchNumber}}</p>
                     <p class="text-xs text-slate-400 font-medium">Op: {{b.operatorName}}</p>
                   </div>
                </div>
              </td>
              <td class="px-6 py-5 text-sm font-semibold text-slate-600">{{b.equipmentName}}</td>
              <td class="px-6 py-5">
                <div class="flex flex-wrap gap-1">
                  <span *ngFor="let item of b.items" class="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-md">
                    {{item.itemName}}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                      [class]="b.status === 'InService' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'">
                  {{b.status}}
                </span>
              </td>
              <td class="px-6 py-5 text-xs font-bold text-slate-400">{{b.cycleStartTime | date:'shortTime'}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- New Batch Modal -->
      <div *ngIf="showNewBatch" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
          <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 class="font-black text-xl text-slate-800 tracking-tight">Register <span class="text-indigo-600">Sterilization Batch</span></h3>
            <button (click)="showNewBatch = false" class="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-rose-500 shadow-sm transition-all"><i class="fas fa-times"></i></button>
          </div>
          <div class="p-8 space-y-6">
             <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Batch #</label>
                  <input type="text" [(ngModel)]="newBatch.batchNumber" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
               </div>
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Equipment</label>
                  <select [(ngModel)]="newBatch.equipmentName" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold appearance-none">
                    <option value="Autoclave 01">Autoclave 01</option>
                    <option value="Autoclave 02">Autoclave 02</option>
                    <option value="Flash Sterilizer">Flash Sterilizer</option>
                  </select>
               </div>
             </div>
             <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operator Name</label>
                <input type="text" [(ngModel)]="newBatch.operatorName" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
             </div>
             <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Items (comma separated)</label>
                <textarea (change)="parseItems($event)" rows="3" placeholder="Major Set, Dental Kit, Ortho Pack..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"></textarea>
             </div>
          </div>
          <div class="p-8 bg-slate-50/50 flex gap-4">
             <button (click)="showNewBatch = false" class="flex-1 px-6 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-white active:scale-95 transition-all">Cancel</button>
             <button (click)="saveBatch()" class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all">Start Cycle</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class CssdComponent implements OnInit {
    batches: any[] = [];
    showNewBatch = false;
    newBatch: any = { batchNumber: 'ST-' + Math.floor(Math.random() * 9000 + 1000), equipmentName: 'Autoclave 01', operatorName: '', itemNames: [] };

    constructor(private supportService: SupportService) { }

    ngOnInit(): void {
        this.loadBatches();
    }

    loadBatches(): void {
        this.supportService.getCSSDBatches().subscribe(res => this.batches = res.items);
    }

    parseItems(ev: any): void {
        const val = ev.target.value;
        this.newBatch.itemNames = val.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0);
    }

    saveBatch(): void {
        this.supportService.createCSSDBatch(this.newBatch).subscribe(() => {
            this.showNewBatch = false;
            this.loadBatches();
            this.newBatch = { batchNumber: 'ST-' + Math.floor(Math.random() * 9000 + 1000), equipmentName: 'Autoclave 01', operatorName: '', itemNames: [] };
        });
    }
}
