import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, TelehealthService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-telehealth',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="p-8 bg-slate-50 min-h-screen">
      <div class="max-w-7xl mx-auto">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tighter">Telehealth <span class="text-indigo-600">CMD</span></h1>
            <p class="text-slate-500 font-medium">Virtual consultation management & remote diagnostics</p>
          </div>
          <div class="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <div class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span class="text-xs font-black uppercase tracking-widest">Network Secure</span>
             </div>
             <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <i class="fas fa-cog"></i>
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Appointments Queue -->
          <div class="lg:col-span-2 space-y-8">
             <div class="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <div class="flex justify-between items-center mb-8">
                   <h3 class="font-black text-xl text-slate-800">Scheduled <span class="text-indigo-600">Virtual Visits</span></h3>
                   <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{{teleApps.length}} APPS</span>
                </div>

                <div class="space-y-4">
                   <div *ngFor="let app of teleApps" class="group relative bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all p-6 rounded-3xl border border-transparent hover:border-indigo-100 cursor-pointer">
                      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                         <div class="flex items-center gap-5">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-xl font-black">
                               {{app.patientName[0]}}
                            </div>
                            <div>
                               <h4 class="text-lg font-black text-slate-800 tracking-tight">{{app.patientName}}</h4>
                               <p class="text-sm text-slate-500 font-medium">{{app.appointmentDate | date:'shortTime'}} • {{app.notes || 'General Consult'}}</p>
                               <div class="flex items-center gap-2 mt-2">
                                  <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-md">ID: {{app.patientCode}}</span>
                                  <span class="text-[10px] font-bold text-slate-400">{{app.specialization}}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div class="flex gap-2 w-full sm:w-auto">
                            <button *ngIf="!app.meetingLink" (click)="generateLink(app.id)" class="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                               Initialize Call
                            </button>
                            <a *ngIf="app.meetingLink" [href]="app.meetingLink" target="_blank" class="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                               <i class="fas fa-video"></i> Join Studio
                            </a>
                            <button class="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"><i class="fas fa-ellipsis-h"></i></button>
                         </div>
                      </div>
                   </div>

                   <div *ngIf="!teleApps.length" class="text-center py-20 opacity-30">
                      <i class="fas fa-video-slash text-5xl mb-4"></i>
                      <p class="font-black text-lg">No virtual sessions queued</p>
                   </div>
                </div>
             </div>
          </div>

          <!-- Side Panel: Hardware & Quick Actions -->
          <div class="space-y-8">
             <div class="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>
                <h4 class="font-black text-lg mb-6 flex items-center gap-3">
                   <i class="fas fa-microchip text-indigo-400"></i> Local Hardware
                </h4>
                <div class="space-y-6">
                   <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div class="flex items-center gap-3">
                         <i class="fas fa-camera text-slate-400"></i>
                         <span class="text-xs font-bold">4K Camera</span>
                      </div>
                      <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                   </div>
                   <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div class="flex items-center gap-3">
                         <i class="fas fa-microphone text-slate-400"></i>
                         <span class="text-xs font-bold">Spatial Mic</span>
                      </div>
                      <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                   </div>
                   <div class="p-4 bg-indigo-600 rounded-2xl">
                      <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Bandwidth Status</p>
                      <p class="text-xl font-black">94.2 <span class="text-xs opacity-60">Mbps</span></p>
                   </div>
                </div>
             </div>

             <div class="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <h4 class="font-black text-slate-800 mb-6">Patient Instructions</h4>
                <div class="space-y-4">
                   <div class="p-4 bg-slate-50 rounded-2xl relative before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-1 before:bg-indigo-500">
                      <p class="text-xs font-bold text-slate-700 leading-relaxed">Ensure patient has a stable connection and is in a quiet, well-lit environment.</p>
                   </div>
                </div>
                <button class="w-full mt-6 py-4 border-2 border-indigo-50 text-indigo-600 font-black rounded-2xl text-xs hover:bg-indigo-50 transition-all uppercase tracking-widest">
                   Send Guide to Patient
                </button>
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
export class TelehealthComponent implements OnInit {
    teleApps: any[] = [];

    constructor(
        private appService: AppointmentService,
        private teleService: TelehealthService
    ) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    loadAppointments(): void {
        // For demo, we filter appointments or use a specific endpoint
        // Assuming we just get appointments and some are telehealth
        this.appService.getAll().subscribe((res: any) => {
            this.teleApps = res.items.filter((a: any) => a.notes?.toLowerCase().includes('virtual') || a.isTelehealth);
        });
    }

    generateLink(id: number): void {
        this.teleService.generateLink(id).subscribe(res => {
            this.loadAppointments();
        });
    }
}
