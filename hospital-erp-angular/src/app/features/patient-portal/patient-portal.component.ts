import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPortalService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-patient-portal',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Health Record <span class="text-indigo-600">Portal</span></h1>
            <p class="text-slate-500 font-medium">Welcome back, {{profile?.fullName}}</p>
          </div>
          <div class="flex gap-3 w-full md:w-auto">
             <button (click)="downloadSummary()" class="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
               <i class="fas fa-file-download text-indigo-500"></i> Export Medical Summary
             </button>
             <button class="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
               Book Visit
             </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Profile Card -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
               <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
               <div class="relative z-10 text-center mb-6">
                 <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl">
                    {{(profile?.fullName || 'P')[0]}}
                 </div>
                 <h3 class="text-xl font-bold text-slate-800">{{profile?.fullName}}</h3>
                 <p class="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">{{profile?.patientCode}}</p>
               </div>
               
               <div class="space-y-4 relative z-10">
                 <div class="flex justify-between items-center py-2 border-b border-slate-50">
                    <span class="text-xs font-bold text-slate-400 uppercase">Gender</span>
                    <span class="text-sm font-semibold text-slate-700">{{profile?.gender}}</span>
                 </div>
                 <div class="flex justify-between items-center py-2 border-b border-slate-50">
                    <span class="text-xs font-bold text-slate-400 uppercase">DOB</span>
                    <span class="text-sm font-semibold text-slate-700">{{profile?.dateOfBirth | date}}</span>
                 </div>
                 <div class="flex items-center gap-3 mt-6">
                    <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                       <i class="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase">Mobile</p>
                      <p class="text-sm font-semibold text-slate-800">{{profile?.phone}}</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                       <i class="fas fa-envelope"></i>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                      <p class="text-sm font-semibold text-slate-800">{{profile?.email}}</p>
                    </div>
                 </div>
               </div>
            </div>

            <!-- Health Snapshot Card -->
            <div class="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <div class="absolute -bottom-8 -right-8 opacity-10">
                 <i class="fas fa-heartbeat text-9xl"></i>
               </div>
               <h4 class="text-lg font-bold mb-6">Health Snapshot</h4>
               <div class="space-y-6">
                 <div>
                    <div class="flex justify-between text-xs font-bold text-indigo-300 uppercase mb-2">
                       <span>Blood Pressure</span>
                       <span>Normal</span>
                    </div>
                    <p class="text-2xl font-bold">120/80 <span class="text-xs font-medium text-indigo-400">mmHg</span></p>
                 </div>
                 <div>
                    <div class="flex justify-between text-xs font-bold text-indigo-300 uppercase mb-2">
                       <span>Weight</span>
                       <span>Steady</span>
                    </div>
                    <p class="text-2xl font-bold">74.5 <span class="text-xs font-medium text-indigo-400">kg</span></p>
                 </div>
               </div>
            </div>
          </div>

          <!-- Timeline & Records Container -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Appointment Timeline -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
               <h3 class="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                 <i class="fas fa-history text-indigo-500"></i> Medical Visit History
               </h3>
               
               <div class="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                 <div *ngFor="let app of appointments" class="relative">
                   <!-- Timeline Dot -->
                   <div class="absolute -left-[37px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10"
                        [class.bg-emerald-500]="app.status === 'Completed'"
                        [class.bg-indigo-500]="app.status === 'Scheduled'"
                        [class.bg-slate-300]="app.status === 'Cancelled'"></div>
                   
                   <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{app.appointmentDate | date:'mediumDate'}}</p>
                        <h4 class="text-lg font-bold text-slate-800 mt-1">{{app.doctorName}}</h4>
                        <p class="text-sm text-slate-500 font-medium">{{app.specialization}}</p>
                     </div>
                     <span class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border"
                           [class]="app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'">
                       {{app.status}}
                     </span>
                   </div>
                   
                   <div *ngIf="app.diagnosis" class="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Diagnosis/Notes</p>
                      <p class="text-sm text-slate-600 leading-relaxed">{{app.diagnosis}}</p>
                   </div>
                 </div>

                 <div *ngIf="!appointments.length" class="text-center py-10 opacity-40">
                    <i class="fas fa-calendar-alt text-4xl mb-3"></i>
                    <p class="font-bold">No visit history found</p>
                 </div>
               </div>
            </div>

            <!-- Lab Results Quick View -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
               <div class="flex justify-between items-center mb-8">
                 <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <i class="fas fa-flask text-rose-500"></i> Recent Lab Results
                 </h3>
                 <button class="text-indigo-600 font-bold text-xs hover:underline">View All</button>
               </div>

               <div class="space-y-4">
                 <div class="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                    <div class="flex items-center gap-4">
                       <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                         <i class="fas fa-vial"></i>
                       </div>
                       <div>
                         <h5 class="font-bold text-slate-800">Comprehensive Lipid Panel</h5>
                         <p class="text-xs text-slate-400">Oct 24, 2024 • Normal Range</p>
                       </div>
                    </div>
                    <i class="fas fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                 </div>
                 
                 <div class="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                    <div class="flex items-center gap-4">
                       <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                         <i class="fas fa-vial"></i>
                       </div>
                       <div>
                         <h5 class="font-bold text-slate-800">Vitamin D (25-Hydroxy)</h5>
                         <p class="text-xs text-slate-400">Sep 12, 2024 • Requires Attention</p>
                       </div>
                    </div>
                    <i class="fas fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                 </div>
               </div>
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
export class PatientPortalComponent implements OnInit {
    profile: any;
    appointments: any[] = [];

    constructor(private portalService: PatientPortalService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.portalService.getProfile().subscribe(res => this.profile = res);
        this.portalService.getAppointments().subscribe(res => this.appointments = res);
    }

    downloadSummary(): void {
        this.portalService.exportClinicalSummary().subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ClinicalSummary_${this.profile.patientCode}.pdf`;
            a.click();
        });
    }
}
