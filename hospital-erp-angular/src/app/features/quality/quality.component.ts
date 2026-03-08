import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QualityService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-quality',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Quality & Patient Safety</h1>
          <p class="text-slate-500 text-sm">Incident reporting and patient satisfaction tracking</p>
        </div>
        <div class="flex gap-3">
          <button (click)="view = 'incidents'" [class.bg-indigo-600]="view === 'incidents'" [class.text-white]="view === 'incidents'" class="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-all">Incidents</button>
          <button (click)="view = 'feedback'" [class.bg-indigo-600]="view === 'feedback'" [class.text-white]="view === 'feedback'" class="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-all">Feedback</button>
        </div>
      </div>

      <!-- INCIDENTS VIEW -->
      <div *ngIf="view === 'incidents'">
        <div class="flex justify-between items-center mb-6">
           <h2 class="text-lg font-bold text-slate-700">Clinical Incidents</h2>
           <button (click)="showReportModal = true" class="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 shadow-md flex items-center gap-2">
             <i class="fas fa-exclamation-triangle"></i> Report Incident
           </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Severity</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let i of incidents" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-700 text-sm">{{i.incidentType}}</td>
                <td class="px-6 py-4 text-sm text-slate-600">{{i.patientName || 'N/A'}}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                        [class.bg-rose-100]="i.severity === 'Critical' || i.severity === 'High'" [class.text-rose-700]="i.severity === 'Critical' || i.severity === 'High'"
                        [class.bg-amber-100]="i.severity === 'Medium'" [class.text-amber-700]="i.severity === 'Medium'"
                        [class.bg-blue-100]="i.severity === 'Low'" [class.text-blue-700]="i.severity === 'Low'">
                    {{i.severity}}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">{{i.status}}</td>
                <td class="px-6 py-4 text-xs text-slate-400">{{i.createdDate | date:'mediumDate'}}</td>
              </tr>
              <tr *ngIf="!incidents.length">
                 <td colspan="5" class="py-12 text-center text-slate-400 italic">No incidents reported. Good job!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FEEDBACK VIEW -->
      <div *ngIf="view === 'feedback'">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
             <p class="text-xs font-bold text-slate-400 uppercase mb-2">Avg. Satisfaction</p>
             <div class="flex items-baseline gap-2">
               <h3 class="text-4xl font-black text-indigo-600">4.8</h3>
               <span class="text-slate-400 text-sm">/ 5.0</span>
             </div>
             <div class="flex gap-1 mt-2 text-amber-400">
               <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
             </div>
           </div>
           <!-- Other stats... -->
        </div>

        <div class="space-y-4">
           <div *ngFor="let f of feedback" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div class="flex justify-between items-start mb-4">
               <div>
                  <h4 class="font-bold text-slate-800">{{f.patientName}}</h4>
                  <p class="text-xs text-slate-400">{{f.department}} • {{f.createdDate | date:'mediumDate'}}</p>
               </div>
               <div class="flex gap-1 text-xs px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-bold">
                 <i class="fas fa-star"></i> {{f.rating}}
               </div>
             </div>
             <p class="text-slate-600 text-sm leading-relaxed italic">"{{f.comments}}"</p>
           </div>
        </div>
      </div>

      <!-- Incident Modal -->
      <div *ngIf="showReportModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-rose-50 flex justify-between items-center text-rose-900">
            <h3 class="font-bold text-lg flex items-center gap-2"><i class="fas fa-biohazard"></i> Clinical Incident Report</h3>
            <button (click)="showReportModal = false" class="text-rose-400 hover:text-rose-600"><i class="fas fa-times"></i></button>
          </div>
          <div class="p-6 space-y-4">
             <div class="grid grid-cols-2 gap-4">
               <div>
                 <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                 <select [(ngModel)]="newIncident.incidentType" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none">
                   <option value="Medication Error">Medication Error</option>
                   <option value="Patient Fall">Patient Fall</option>
                   <option value="Surgical Complication">Surgical Complication</option>
                   <option value="Diagnostic Delay">Diagnostic Delay</option>
                 </select>
               </div>
               <div>
                 <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Severity</label>
                 <select [(ngModel)]="newIncident.severity" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none">
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                   <option value="Critical">Critical</option>
                 </select>
               </div>
             </div>
             <div>
               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Incident Description</label>
               <textarea [(ngModel)]="newIncident.description" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none" placeholder="Exactly what happened..."></textarea>
             </div>
             <div>
               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Immediate Action Taken</label>
               <textarea [(ngModel)]="newIncident.actionTaken" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none" placeholder="First response..."></textarea>
             </div>
          </div>
          <div class="p-6 bg-slate-50 flex gap-3">
             <button (click)="showReportModal = false" class="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
             <button (click)="submitIncident()" class="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 shadow-md">Submit Report</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class QualityComponent implements OnInit {
    view: 'incidents' | 'feedback' = 'incidents';
    incidents: any[] = [];
    feedback: any[] = [];
    showReportModal = false;
    newIncident: any = { severity: 'Medium', incidentType: 'Medication Error' };

    constructor(private qualityService: QualityService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.qualityService.getIncidents().subscribe(res => this.incidents = res.items);
        this.qualityService.getFeedback().subscribe(res => this.feedback = res.items);
    }

    submitIncident(): void {
        this.qualityService.reportIncident(this.newIncident).subscribe(() => {
            this.showReportModal = false;
            this.loadData();
            this.newIncident = { severity: 'Medium', incidentType: 'Medication Error' };
        });
    }
}
