import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PatientService, ClinicalService, LabService, PharmacyService, RadiologyService, InpatientBillingService } from '../../../core/services/api.services';
import { ToastService } from '../../../core/services/language.service';

@Component({
   selector: 'app-patient-profile',
   standalone: true,
   imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
   styles: [`
    .profile-header { background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--accent-rgb), 0.05)); border: 1px solid var(--border); border-radius: 32px; padding: 40px; margin-bottom: 30px; display: flex; gap: 40px; align-items: center; position: relative; overflow: hidden; }
    .profile-header::after { content: 'health_and_safety'; font-family: 'Material Icons Round'; position: absolute; right: -20px; bottom: -20px; font-size: 200px; opacity: 0.03; transform: rotate(-15deg); pointer-events: none; }
    
    .avatar-large { width: 120px; height: 120px; border-radius: 40px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 900; box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.3); }
    
    .stat-mini-card { background: rgba(var(--card-bg-rgb), 0.4); border: 1px solid var(--border); border-radius: 20px; padding: 15px 25px; min-width: 150px; }
    
    .tab-bar { display: flex; gap: 8px; background: rgba(0,0,0,0.1); padding: 6px; border-radius: 18px; margin-bottom: 30px; width: fit-content; border: 1px solid var(--border); }
    .tab-item { padding: 12px 24px; border-radius: 14px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
    .tab-item.active { background: var(--primary); color: white; box-shadow: var(--shadow-md); }
    
    .vital-trend-box { background: rgba(var(--card-bg-rgb), 0.4); border: 1px solid var(--border); border-radius: 24px; padding: 24px; height: 100%; }
    .trend-chart { height: 120px; display: flex; align-items: flex-end; gap: 10px; margin-top: 20px; padding: 0 10px; border-bottom: 1px solid var(--border); }
    .trend-bar { flex: 1; background: var(--primary); opacity: 0.7; border-radius: 4px 4px 0 0; transition: 0.3s; position: relative; min-width: 12px; }
    .trend-bar:hover { opacity: 1; transform: scaleY(1.05); }
    .trend-bar::after { content: attr(data-val); position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 900; opacity: 0; transition: 0.2s; }
    .trend-bar:hover::after { opacity: 1; top: -25px; }

    .ehr-timeline { position: relative; padding-left: 32px; border-left: 2px dashed var(--border); margin-left: 10px; }
    .timeline-item { position: relative; margin-bottom: 40px; padding: 20px; background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 20px; }
    .timeline-dot { position: absolute; left: -42px; top: 20px; width: 18px; height: 18px; border-radius: 50%; background: var(--bg-page); border: 4px solid var(--primary); }
    
    .allergy-tag { background: rgba(var(--danger-rgb), 0.1); color: var(--danger); border: 1px solid rgba(var(--danger-rgb), 0.2); padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
  `],
   template: `
    <div class="animate-in" *ngIf="patient">
      <div class="flex items-center gap-4 mb-6">
         <button [routerLink]="['/patients']" class="btn btn-icon btn-secondary rounded-xl">
           <span class="material-icons-round">arrow_back</span>
         </button>
         <div class="text-xs font-black uppercase tracking-widest text-muted">{{ 'PATIENT_DIRECTORY' | translate }} / {{ patient.fullName }}</div>
      </div>

      <div class="profile-header">
         <div class="avatar-large">{{ patient.fullName[0] }}</div>
         <div class="flex-grow">
            <div class="flex items-center gap-3 mb-2">
               <h1 class="text-4xl font-black tracking-tighter m-0">{{ patient.fullName }}</h1>
               <span class="badge badge-primary bg-opacity-10 text-primary border-primary border-opacity-20 px-3 py-1 text-sm font-black">{{ patient.patientCode }}</span>
               <span class="badge" [ngClass]="patient.isActive ? 'badge-success' : 'badge-danger'">{{ (patient.isActive ? 'ACTIVE' : 'INACTIVE') | translate }}</span>
            </div>
            <div class="flex gap-6 text-sm font-bold text-muted">
               <span class="flex items-center gap-2"><span class="material-icons-round text-primary opacity-50">cake</span> {{ patient.dateOfBirth | date:'mediumDate' }}</span>
               <span class="flex items-center gap-2"><span class="material-icons-round text-primary opacity-50">{{ patient.gender==='Male'?'male':'female' }}</span> {{ patient.gender | translate }}</span>
               <span class="flex items-center gap-2"><span class="material-icons-round text-primary opacity-50">bloodtype</span> {{ patient.bloodType || 'N/A' }}</span>
               <span class="flex items-center gap-2"><span class="material-icons-round text-primary opacity-50">phone</span> {{ patient.phoneNumber || 'N/A' }}</span>
            </div>
         </div>
         <div class="flex gap-3">
            <div class="stat-mini-card">
               <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'TOTAL_VISITS' | translate }}</div>
               <div class="text-2xl font-black">{{ appointments.length }}</div>
            </div>
            <div class="stat-mini-card">
               <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'BALANCE_DUE' | translate }}</div>
               <div class="text-2xl font-black text-danger">{{ calculateBalance() | currency }}</div>
            </div>
         </div>
      </div>

      <div class="tab-bar animate-in" style="animation-delay: 0.1s">
         <button class="tab-item" [class.active]="tab==='overview'" (click)="tab='overview'">
            <span class="material-icons-round">dashboard</span> {{ 'OVERVIEW' | translate }}
         </button>
         <button class="tab-item" [class.active]="tab==='clinical'" (click)="tab='clinical'">
            <span class="material-icons-round">history_edu</span> {{ 'CLINICAL_ENCOUNTERS' | translate }}
         </button>
         <button class="tab-item" [class.active]="tab==='vitals'" (click)="tab='vitals'">
            <span class="material-icons-round">monitor_heart</span> {{ 'VITALS_TRENDS' | translate }}
         </button>
         <button class="tab-item" [class.active]="tab==='diagnostics'" (click)="tab='diagnostics'">
            <span class="material-icons-round">biotech</span> {{ 'DIAGNOSTICS' | translate }}
         </button>
         <button class="tab-item" [class.active]="tab==='pharmacy'" (click)="tab='pharmacy'">
            <span class="material-icons-round">medication</span> {{ 'Rx_HISTORY' | translate }}
         </button>
         <button class="tab-item" [class.active]="tab==='billing'" (click)="tab='billing'">
            <span class="material-icons-round">receipt</span> {{ 'INPATIENT_BILLS' | translate }}
         </button>
      </div>

      <div class="grid grid-cols-12 gap-8">
         <!-- LEFT CONTENT -->
         <div class="col-span-8">
            <div *ngIf="tab==='overview'" class="animate-in">
               <div class="grid grid-cols-2 gap-8 mb-8">
                  <div class="card bg-glass h-full">
                     <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-danger">report_problem</span> {{ 'CRITICAL_INFO' | translate }}</h3>
                     <div class="flex flex-col gap-4">
                        <div>
                           <div class="text-[0.65rem] font-black uppercase text-muted mb-2">{{ 'ALLERGIES' | translate }}</div>
                           <div class="flex flex-wrap gap-2">
                              <span *ngFor="let a of patient.allergies?.split(',')" class="allergy-tag">{{ a.trim() }}</span>
                              <span *ngIf="!patient.allergies" class="text-xs italic text-muted">No known allergies</span>
                           </div>
                        </div>
                        <div>
                           <div class="text-[0.65rem] font-black uppercase text-muted mb-2">{{ 'CHRONIC_CONDITIONS' | translate }}</div>
                           <div class="font-bold text-sm">{{ patient.medicalHistory || 'No history recorded' }}</div>
                        </div>
                     </div>
                  </div>
                  <div class="card bg-glass h-full">
                     <h3 class="font-black text-lg mb-6 flex items-center gap-2"><span class="material-icons-round text-primary">contact_support</span> {{ 'EMERGENCY_CONTACT' | translate }}</h3>
                     <div class="p-4 bg-primary bg-opacity-5 rounded-2xl border">
                        <div class="font-black text-lg">{{ patient.emergencyContact || 'Not Set' }}</div>
                        <div class="text-primary font-black text-sm">{{ patient.emergencyPhone }}</div>
                     </div>
                  </div>
               </div>

               <div class="card bg-glass">
                  <h3 class="font-black text-lg mb-6">{{ 'RECENT_CLINICAL_TIMELINE' | translate }}</h3>
                  <div class="ehr-timeline">
                     <div *ngFor="let item of getRecentHistory()" class="timeline-item animate-in">
                        <div class="timeline-dot"></div>
                        <div class="flex justify-between items-start mb-2">
                           <div class="font-black text-lg">{{ item.title | translate }}</div>
                           <div class="text-[0.65rem] font-black text-muted uppercase">{{ item.date | date:'medium' }}</div>
                        </div>
                        <div class="text-sm font-bold text-muted mb-3">{{ item.description }}</div>
                        <div *ngIf="item.subDetails" class="p-3 bg-glass border rounded-xl text-xs font-bold text-primary">
                           {{ item.subDetails }}
                        </div>
                     </div>
                     <div *ngIf="!getRecentHistory().length" class="p-10 text-center opacity-30 italic">No historical data available</div>
                  </div>
               </div>
            </div>

            <div *ngIf="tab==='clinical'" class="animate-in">
                <div class="flex flex-col gap-4">
                   <div *ngFor="let e of encounters" class="card bg-glass hover:border-primary transition-all">
                      <div class="flex justify-between items-start mb-4">
                         <div>
                            <div class="text-[0.65rem] font-black text-primary uppercase mb-1">{{ e.encounterDate | date:'fullDate' }}</div>
                            <h4 class="font-black text-xl">{{ e.chiefComplaint }}</h4>
                         </div>
                         <div class="text-right">
                            <span class="badge" [ngClass]="e.isFinalized ? 'badge-success' : 'badge-warning'">{{ (e.isFinalized ? 'FINALIZED' : 'DRAFT') | translate }}</span>
                            <div class="text-[0.6rem] font-black text-muted mt-1">Dr. {{ e.doctorName }}</div>
                         </div>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                         <div class="p-3 bg-glass border rounded-xl">
                            <div class="text-[0.6rem] font-black text-primary uppercase mb-1">Assessment</div>
                            <div class="text-sm font-bold truncate">{{ e.assessment }}</div>
                         </div>
                         <div class="p-3 bg-glass border rounded-xl">
                            <div class="text-[0.6rem] font-black text-primary uppercase mb-1">Plan</div>
                            <div class="text-sm font-bold truncate">{{ e.plan }}</div>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            <div *ngIf="tab==='vitals'" class="animate-in">
               <div class="grid grid-cols-2 gap-8">
                  <div class="vital-trend-box">
                     <div class="flex justify-between items-center mb-4">
                        <h4 class="font-black text-sm uppercase tracking-widest text-primary">Temperature Trend</h4>
                        <span class="material-icons-round text-danger">thermostat</span>
                     </div>
                     <div class="trend-chart">
                        <div *ngFor="let v of vitals.slice(-7)" class="trend-bar" 
                             [style.height.%]="(v.temperature / 45) * 100"
                             [attr.data-val]="v.temperature + '°C'"></div>
                     </div>
                     <div class="flex justify-between text-[0.6rem] font-black text-muted mt-2">
                        <span>Past Records</span>
                        <span>Latest</span>
                     </div>
                  </div>
                  <div class="vital-trend-box">
                     <div class="flex justify-between items-center mb-4">
                        <h4 class="font-black text-sm uppercase tracking-widest text-primary">Heart Rate Trend</h4>
                        <span class="material-icons-round text-success">favorite</span>
                     </div>
                     <div class="trend-chart">
                        <div *ngFor="let v of vitals.slice(-7)" class="trend-bar" 
                             [style.height.%]="(v.heartRate / 180) * 100"
                             [attr.data-val]="v.heartRate + ' bpm'"
                             style="background: var(--success)"></div>
                     </div>
                     <div class="flex justify-between text-[0.6rem] font-black text-muted mt-2">
                        <span>Past Records</span>
                        <span>Latest</span>
                     </div>
                  </div>
               </div>
               <div class="card bg-glass mt-8 p-0 overflow-hidden">
                  <table class="table">
                     <thead>
                        <tr>
                           <th>Date</th>
                           <th>Temp</th>
                           <th>BP</th>
                           <th>HR</th>
                           <th>SpO2</th>
                           <th>Weight</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr *ngFor="let v of vitals" class="hover-row">
                           <td class="text-xs font-bold">{{ v.recordedDate | date:'short' }}</td>
                           <td class="font-black text-danger">{{ v.temperature }}°C</td>
                           <td class="font-black text-primary">{{ v.bloodPressureSystolic }}/{{ v.bloodPressureDiastolic }}</td>
                           <td class="font-black text-success">{{ v.heartRate }}</td>
                           <td class="font-black text-info">{{ v.spO2 }}%</td>
                           <td class="font-bold">{{ v.weightKg }} kg</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div *ngIf="tab==='diagnostics'" class="animate-in">
               <div class="flex flex-col gap-6">
                  <div class="card bg-glass">
                     <h3 class="font-black text-lg mb-4 flex items-center gap-2"><span class="material-icons-round text-primary">biotech</span> Laboratory Results</h3>
                     <div class="flex flex-col gap-3">
                        <div *ngFor="let lr of labRequests" class="p-4 bg-glass border rounded-2xl hover:border-primary transition-all">
                           <div class="flex justify-between mb-3">
                              <span class="badge badge-info font-mono">{{ lr.requestNumber }}</span>
                              <span class="badge" [ngClass]="lr.status==='Completed'?'badge-success':'badge-warning'">{{ lr.status }}</span>
                           </div>
                           <div class="flex flex-wrap gap-2">
                              <span *ngFor="let res of lr.results" class="px-2 py-1 bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg text-xs font-bold text-primary">
                                 {{ res.testName }}: <span class="font-black">{{ res.resultValue || '...' }}</span> {{ res.unit }}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                   <div class="card bg-glass">
                      <h3 class="font-black text-lg mb-4 flex items-center gap-2"><span class="material-icons-round text-accent">camera</span> Imaging / Radiology</h3>
                      <div *ngFor="let rr of radiologyRequests" class="p-4 bg-glass border rounded-2xl mb-3">
                         <div class="flex justify-between items-start">
                            <div>
                               <div class="font-black text-lg">{{ rr.results[0]?.testName }}</div>
                               <div class="text-[0.6rem] font-black text-muted uppercase">{{ rr.requestDate | date:'medium' }}</div>
                               <div *ngIf="rr.status==='Completed'" class="mt-3 p-3 bg-glass border rounded-xl text-xs font-bold text-accent">
                                  <span class="material-icons-round text-xs">analytics</span> RESULT READY: {{ rr.results[0]?.findings || 'Attached' }}
                               </div>
                            </div>
                            <span class="badge" [ngClass]="{
                               'badge-success': rr.status==='Completed',
                               'badge-warning': rr.status==='Pending',
                               'badge-info': rr.status==='In Progress'
                            }">{{ rr.status | uppercase | translate }}</span>
                         </div>
                      </div>
                   </div>
               </div>
            </div>

            <div *ngIf="tab==='pharmacy'" class="animate-in">
               <div class="flex flex-col gap-4">
                  <div *ngFor="let rx of prescriptions" class="card bg-glass">
                     <div class="flex justify-between items-center mb-4">
                        <div>
                           <div class="badge badge-primary font-mono mb-2">{{ rx.prescriptionNumber }}</div>
                           <div class="text-[0.6rem] font-black text-muted uppercase">{{ rx.prescriptionDate | date:'fullDate' }}</div>
                        </div>
                        <span class="badge" [ngClass]="rx.status==='Dispensed'?'badge-success':'badge-warning'">{{ rx.status }}</span>
                     </div>
                     <div class="flex flex-col gap-2">
                        <div *ngFor="let item of rx.items" class="flex justify-between items-center p-3 bg-glass border rounded-xl">
                           <div>
                              <div class="font-black">{{ item.itemName }}</div>
                              <div class="text-xs font-bold text-muted">{{ item.dosage }} | {{ item.frequency }} | {{ item.duration }}</div>
                           </div>
                           <div class="text-xl font-black text-primary">{{ item.quantity }}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div *ngIf="tab==='billing'" class="animate-in">
                <div class="flex flex-col gap-4">
                   <div *ngFor="let bill of inpatientBills" class="card bg-glass">
                      <div class="flex justify-between items-center mb-4">
                         <div>
                            <div class="font-black text-lg">{{ bill.invoiceNumber }}</div>
                            <div class="text-[0.6rem] font-black text-muted uppercase">{{ bill.invoiceDate | date:'mediumDate' }}</div>
                         </div>
                         <span class="badge" [ngClass]="bill.status==='Paid'?'badge-success':'badge-danger'">{{ bill.status | translate }}</span>
                      </div>
                      <div class="flex flex-col gap-2">
                         <div *ngFor="let item of bill.invoiceItems" class="p-3 bg-glass border rounded-xl flex justify-between items-center">
                            <div class="flex-grow">
                               <div class="font-bold text-sm">{{ item.description }}</div>
                               <div class="text-xs text-muted">{{ item.quantity }} x {{ item.unitPrice | currency }}</div>
                            </div>
                            <div class="font-black text-primary text-lg">{{ (item.quantity * item.unitPrice) | currency }}</div>
                         </div>
                      </div>
                      <div class="mt-4 pt-4 border-t flex justify-between items-center">
                         <div class="text-muted font-bold">{{ 'TOTAL_AMOUNT' | translate }}</div>
                         <div class="text-2xl font-black text-primary">{{ bill.totalAmount | currency }}</div>
                      </div>
                   </div>
                   <div *ngIf="inpatientBills.length === 0" class="p-10 text-center opacity-30 italic">No inpatient bills found</div>
                </div>
            </div>
         </div>

         <!-- RIGHT SIDEBAR -->
         <div class="col-span-4">
            <div class="flex flex-col gap-8">
               <!-- QUICK DASHBOARD -->
               <div class="card bg-glass overflow-hidden p-0">
                  <div class="p-6 bg-primary text-white">
                     <h3 class="font-black text-lg m-0 flex items-center gap-2"><span class="material-icons-round">medical_services</span> {{ 'ACTIVE_SUMMARY' | translate }}</h3>
                  </div>
                  <div class="p-6">
                         <div *ngIf="vitals && vitals.length > 0; else noVitals" class="flex flex-col gap-6">
                            <div class="flex items-center gap-4">
                               <div class="w-10 h-10 rounded-xl bg-danger bg-opacity-10 text-danger flex items-center justify-center font-black">T</div>
                               <div class="flex-grow">
                                  <div class="text-[0.6rem] font-black text-muted uppercase">Latest Temperature</div>
                                  <div class="font-black text-xl">{{ vitals[vitals.length-1].temperature }}°C</div>
                               </div>
                               <div class="text-xs font-black" [ngClass]="vitals[vitals.length-1].temperature > 37.5 ? 'text-danger' : 'text-success'">
                                  {{ vitals[vitals.length-1].temperature > 37.5 ? 'FEVER' : 'NORMAL' }}
                               </div>
                            </div>
                            <div class="flex items-center gap-4">
                               <div class="w-10 h-10 rounded-xl bg-primary bg-opacity-10 text-primary flex items-center justify-center font-black">BP</div>
                               <div class="flex-grow">
                                  <div class="text-[0.6rem] font-black text-muted uppercase">Latest Blood Pressure</div>
                                  <div class="font-black text-xl">{{ vitals[vitals.length-1].bloodPressureSystolic }}/{{ vitals[vitals.length-1].bloodPressureDiastolic }}</div>
                               </div>
                            </div>
                         </div>
                         <ng-template #noVitals>
                            <div class="text-center py-6 opacity-40 italic text-xs uppercase font-black tracking-widest">{{ 'NO_VITALS_RECORDED' | translate }}</div>
                         </ng-template>
                         <div class="pt-4 border-top">
                            <div class="text-[0.6rem] font-black text-muted uppercase mb-3">Pending Diagnostics</div>
                            <div class="flex gap-2">
                               <div class="flex-1 p-3 bg-glass border rounded-xl text-center">
                                  <div class="font-black text-lg">{{ getPendingCount('lab') }}</div>
                                  <div class="text-[0.5rem] font-black text-muted uppercase">Lab</div>
                               </div>
                               <div class="flex-1 p-3 bg-glass border rounded-xl text-center">
                                  <div class="font-black text-lg">{{ getPendingCount('rad') }}</div>
                                  <div class="text-[0.5rem] font-black text-muted uppercase">Rad</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

               <!-- RECENT INVOICES -->
               <div class="card bg-glass">
                  <h3 class="font-black text-lg mb-4">{{ 'RECENT_BILLING' | translate }}</h3>
                  <div class="flex flex-col gap-3">
                     <div *ngFor="let inv of invoices.slice(0, 3)" class="flex justify-between items-center p-3 bg-glass border rounded-xl">
                        <div>
                           <div class="text-xs font-black text-muted">{{ inv.invoiceNumber }}</div>
                           <div class="font-black tracking-tighter">{{ inv.totalAmount | currency }}</div>
                        </div>
                        <span class="badge" [ngClass]="inv.status==='Paid'?'badge-success':'badge-danger'">{{ inv.status | translate }}</span>
                     </div>
                     <div *ngIf="!invoices.length" class="text-center text-xs text-muted italic p-4">{{ 'NO_DATA' | translate }}</div>
                  </div>
               </div>

               <!-- INSURANCE DETAILS -->
               <div class="card bg-glass" *ngIf="patient.insuranceProvider">
                  <h3 class="font-black text-lg mb-4 flex items-center gap-2">
                     <span class="material-icons-round text-accent">health_and_safety</span>
                     {{ 'INSURANCE_DETAILS' | translate }}
                  </h3>
                  <div class="flex flex-col gap-3">
                     <div class="p-3 bg-glass border rounded-xl">
                        <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'INSURANCE_PROVIDER' | translate }}</div>
                        <div class="font-black">{{ patient.insuranceProvider }}</div>
                     </div>
                     <div class="p-3 bg-glass border rounded-xl" *ngIf="patient.insurancePolicyNumber">
                        <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'POLICY_NUMBER' | translate }}</div>
                        <div class="font-mono font-black text-primary">{{ patient.insurancePolicyNumber }}</div>
                     </div>
                     <div class="p-3 bg-glass border rounded-xl" *ngIf="patient.insuranceCoverage">
                        <div class="text-[0.6rem] font-black text-muted uppercase tracking-widest mb-1">{{ 'COVERAGE_TERMS' | translate }}</div>
                        <div class="font-bold text-sm">{{ patient.insuranceCoverage }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  `,
})
export class PatientProfileComponent implements OnInit {
   patient: any;
   tab = 'overview';
   appointments: any[] = [];
   invoices: any[] = [];
   vitals: any[] = [];
   prescriptions: any[] = [];
   encounters: any[] = [];
   labRequests: any[] = [];
   radiologyRequests: any[] = [];
   inpatientBills: any[] = [];

   constructor(
      private route: ActivatedRoute,
      private patientSvc: PatientService,
      private clinicalSvc: ClinicalService,
      private labSvc: LabService,
      private rxSvc: PharmacyService,
      private radSvc: RadiologyService,
      private billingSvc: InpatientBillingService,
      private toast: ToastService,
      private translate: TranslateService
   ) { }

   ngOnInit() {
      this.route.params.subscribe(params => {
         const id = params['id'];
         if (id) {
            this.loadData(id);
         }
      });
   }


   loadData(id: number) {
      this.patientSvc.getById(id).subscribe(p => this.patient = p);
      this.patientSvc.getAppointments(id).subscribe(a => this.appointments = a);
      this.patientSvc.getInvoices(id).subscribe(r => this.invoices = r); // Retained from original loadHistory
      this.patientSvc.getVitals(id).subscribe(v => this.vitals = v);
      this.patientSvc.getPrescriptions(id).subscribe(pr => this.prescriptions = pr);
      this.patientSvc.getLabRequests(id).subscribe(lr => this.labRequests = lr);
      this.patientSvc.getRadiologyRequests(id).subscribe(rr => this.radiologyRequests = rr);
      this.billingSvc.getPatientBills(id).subscribe(ib => this.inpatientBills = ib);
      this.clinicalSvc.getEncounters({ page: 1, pageSize: 100 }, id).subscribe(r => this.encounters = r.items);
   }

   calculateBalance() {
      return this.invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
   }

   getPendingCount(type: 'lab' | 'rad'): number {
      const list = type === 'lab' ? this.labRequests : this.radiologyRequests;
      return list.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;
   }

   calculateTotalClaims(): number {
      // Mock logic: assuming insurance balance reflects claims processed
      return this.invoices.filter(i => i.invoiceType === 'Insurance').reduce((sum, i) => sum + i.totalAmount, 0);
   }

   calculateTotalPaid(): number {
      return this.invoices.reduce((sum, i) => sum + i.paidAmount, 0);
   }

   getRecentHistory() {
      const history: any[] = [];

      this.encounters.forEach(e => history.push({
         title: 'CLINICAL_ENCOUNTER',
         date: e.encounterDate,
         description: e.chiefComplaint,
         subDetails: `Diagnosis: ${e.assessment || 'Pending'}`
      }));

      this.prescriptions.forEach(p => history.push({
         title: 'RX_ORDERED',
         date: p.prescriptionDate,
         description: `${p.items.length} Medications prescribed`,
         subDetails: p.prescriptionNumber
      }));

      this.labRequests.forEach(l => history.push({
         title: 'LAB_ORDER',
         date: l.requestDate,
         description: `${l.results.length} tests requested`,
         subDetails: l.requestNumber
      }));

      return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
   }
}
