import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralService, PatientService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-referral',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="p-8 bg-[#f8fafc] min-h-screen">
      <div class="max-w-7xl mx-auto">
        
        <div class="flex justify-between items-end mb-10">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Health <span class="text-indigo-600">Exchange</span> & Referrals</h1>
            <p class="text-slate-500 font-medium">Interoperability and external facility coordination</p>
          </div>
          <button (click)="showCreate = true" class="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2">
             <i class="fas fa-external-link-alt"></i> New Referral
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <!-- History and Activity -->
           <div class="lg:col-span-8 space-y-8">
              <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                 <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 class="font-black text-lg text-slate-800 uppercase tracking-tight">Active Referrals</h3>
                    <div class="flex gap-2">
                       <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">Outbound</span>
                    </div>
                 </div>
                 <div class="divide-y divide-slate-50">
                    <div *ngFor="let r of referrals" class="p-8 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                       <div class="flex items-center gap-6">
                          <div class="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black relative">
                             {{r.patientName[0]}}
                             <span *ngIf="r.status === 'Pending'" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full"></span>
                          </div>
                          <div>
                             <p class="font-black text-slate-800 text-lg leading-tight">{{r.patientName}}</p>
                             <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">To: {{r.facilityName}}</p>
                          </div>
                       </div>
                       <div class="text-center hidden md:block">
                          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">{{r.status}}</span>
                       </div>
                       <div class="flex gap-3">
                          <button (click)="viewData(r)" class="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all shadow-sm active:scale-95"><i class="fas fa-eye"></i></button>
                          <button (click)="exportFHIR(r.id)" class="px-4 h-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                             <i class="fas fa-file-export"></i> FHIR Export
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Facility Directory -->
           <div class="lg:col-span-4 space-y-6">
              <div class="bg-indigo-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                 <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                 <h4 class="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">Registered Facilities</h4>
                 <div class="space-y-4">
                    <div *ngFor="let f of facilities" class="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                       <p class="font-bold text-sm">{{f.name}}</p>
                       <p class="text-[10px] text-indigo-300 font-bold uppercase mt-1">{{f.type}} • {{f.phone}}</p>
                    </div>
                    <button (click)="showFacility = true" class="w-full p-4 border-2 border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-white/40 hover:text-indigo-200 transition-all">
                       <i class="fas fa-plus mr-2"></i> Register New Facility
                    </button>
                 </div>
              </div>

              <!-- Interop Stats -->
              <div class="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">HIE Health</h4>
                 <div class="space-y-6">
                    <div>
                       <div class="flex justify-between text-[10px] font-black uppercase mb-2">
                          <span class="text-emerald-600">Sync Status</span>
                          <span class="text-slate-400">100% SUCCESS</span>
                       </div>
                       <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 w-[100%] rounded-full"></div>
                       </div>
                    </div>
                    <div class="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                       <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><i class="fas fa-network-wired"></i></div>
                       <div>
                          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Standard</p>
                          <p class="font-black text-slate-800 text-sm">HL7 FHIR v4.0.1</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Create Referral Modal -->
      <div *ngIf="showCreate" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div class="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div class="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 class="font-black text-2xl text-slate-800 tracking-tight">Create <span class="text-indigo-600">Referral</span></h3>
               <button (click)="showCreate = false" class="w-12 h-12 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-10 space-y-6">
               <div class="grid grid-cols-2 gap-6">
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Facility</label>
                     <select [(ngModel)]="newReferral.facilityId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
                        <option *ngFor="let f of facilities" [value]="f.id">{{f.name}}</option>
                     </select>
                  </div>
                  <div>
                     <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Referral Type</label>
                     <select [(ngModel)]="newReferral.referralType" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold">
                        <option value="Outbound">Outbound (Transfer)</option>
                        <option value="Inbound">Inbound (Accept)</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Patient Code / ID</label>
                  <input type="text" [(ngModel)]="newReferral.patientId" placeholder="Enter Patient ID" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold uppercase">
               </div>
               <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Medical Reason</label>
                  <textarea [(ngModel)]="newReferral.reason" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-300" placeholder="Describe the clinical necessity..."></textarea>
               </div>
            </div>
            <div class="p-10 bg-slate-50/50 flex gap-4">
               <button (click)="showCreate = false" class="flex-1 px-8 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-white active:scale-95 transition-all uppercase tracking-widest text-[10px]">Cancel</button>
               <button (click)="saveReferral()" class="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest text-[10px]">Submit Referral</button>
            </div>
         </div>
      </div>

      <!-- JSON Viewer Modal -->
      <div *ngIf="showPayload" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-8">
         <div class="bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <div class="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                  <h3 class="text-white font-black text-xl leading-tight">FHIR <span class="text-emerald-400">Bundle</span></h3>
                  <p class="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Exported Standard-compliant Dataset</p>
                </div>
                <button (click)="showPayload = false" class="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-white/40 hover:text-white transition-all"><i class="fas fa-times"></i></button>
            </div>
            <div class="flex-1 p-8 overflow-y-auto font-mono text-emerald-400 text-sm whitespace-pre">
               {{payload}}
            </div>
            <div class="p-8 bg-black/20 flex gap-4">
               <button class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95"><i class="fas fa-copy mr-2"></i> Copy to Clipboard</button>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class ReferralComponent implements OnInit {
    facilities: any[] = [];
    referrals: any[] = [];
    showCreate = false;
    showFacility = false;
    showPayload = false;
    payload = '';

    newReferral: any = { facilityId: null, patientId: null, referralType: 'Outbound', reason: '' };

    constructor(
        private referralService: ReferralService,
        private patientService: PatientService
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.referralService.getFacilities().subscribe(res => {
            this.facilities = res;
            if (this.facilities.length) this.newReferral.facilityId = this.facilities[0].id;
        });
        this.referralService.getReferrals().subscribe(res => this.referrals = res.items);
    }

    saveReferral(): void {
        this.referralService.createReferral(this.newReferral).subscribe(() => {
            this.showCreate = false;
            this.loadData();
        });
    }

    exportFHIR(id: number): void {
        this.referralService.exportHie(id).subscribe(res => {
            this.payload = res;
            this.showPayload = true;
        });
    }

    viewData(r: any): void {
        // Simplified: just show history if any or exported data
        this.referralService.getExchangeHistory(r.id).subscribe(res => {
            if (res.length) {
                this.payload = "Latest Exchange Log:\n" + JSON.stringify(res[0], null, 2);
                this.showPayload = true;
            } else {
                alert('No exchange history found for this referral. Click FHIR Export first.');
            }
        });
    }
}
