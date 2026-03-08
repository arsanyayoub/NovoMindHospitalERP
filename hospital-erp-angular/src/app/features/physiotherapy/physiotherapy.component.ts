import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PhysiotherapyService, PatientService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-physiotherapy',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'PHYSIOTHERAPY' | translate }}</h1>
        <p class="page-subtitle">{{ 'REHABILITATION_AND_RECOVERY' | translate }}</p>
      </div>
      <button class="btn btn-primary btn-icon-text" (click)="showPlanModal = true">
         <span class="material-icons-round">add_circle</span> {{ 'NEW_PLAN' | translate }}
      </button>
    </div>

    <div class="card p-0 overflow-hidden">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>{{ 'PATIENT' | translate }}</th>
                    <th>{{ 'DIAGNOSIS' | translate }}</th>
                    <th>{{ 'START_DATE' | translate }}</th>
                    <th>{{ 'STATUS' | translate }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let plan of rehabPlans" class="animate-in">
                    <td class="font-black">{{ plan.patientName }}</td>
                    <td>{{ plan.diagnosis }}</td>
                    <td class="text-xs">{{ plan.startDate | date:'mediumDate' }}</td>
                    <td>
                        <span class="badge" [class.badge-success]="plan.status === 'Active'" [class.badge-secondary]="plan.status === 'Completed'">
                            {{ plan.status }}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-secondary" (click)="viewSessions(plan)">{{ 'SESSIONS' | translate }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- SESSIONS MODAL -->
    <div class="modal-backdrop flex items-center justify-center p-4" *ngIf="selectedPlan">
        <div class="card w-full max-w-2xl p-6 animate-in">
            <div class="flex justify-between items-center mb-6">
                <h2 class="font-black text-xl">{{ 'THERAPY_SESSIONS' | translate }} - {{ selectedPlan.patientName }}</h2>
                <button class="btn btn-xs btn-primary" (click)="openSessionForm()">+ {{ 'RECORD_SESSION' | translate }}</button>
            </div>
            
            <div class="overflow-y-auto max-h-[400px]">
                <div *ngFor="let s of sessions" class="p-3 bg-glass rounded-xl mb-3 border border-dashed hover:border-primary transition-all">
                    <div class="flex justify-between mb-1">
                        <span class="font-black">{{ s.sessionDate | date:'mediumDate' }}</span>
                        <span class="text-xs font-bold opacity-50">{{ s.therapistName }}</span>
                    </div>
                    <div class="text-sm">{{ s.procedurePerformed }}</div>
                    <div class="flex gap-4 mt-2 text-[0.6rem] font-black uppercase opacity-60">
                        <span>Pain Level After: {{ s.painLevelAfter }}/10</span>
                    </div>
                </div>
                <div *ngIf="sessions.length === 0" class="text-center p-8 opacity-50">{{ 'NO_RECORDS' | translate }}</div>
            </div>

            <div class="flex justify-end gap-2 mt-6 pt-4 border-top">
                <button class="btn btn-secondary" (click)="selectedPlan = null">{{ 'CLOSE' | translate }}</button>
            </div>
        </div>
    </div>
    `
})
export class PhysiotherapyComponent implements OnInit {
    rehabPlans: any[] = [];
    selectedPlan: any = null;
    sessions: any[] = [];
    showPlanModal = false;

    constructor(
        private physio: PhysiotherapyService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadPlans();
    }

    loadPlans() {
        this.physio.getRehabPlans({ pageSize: 50 }).subscribe(res => this.rehabPlans = res.items);
    }

    viewSessions(plan: any) {
        this.selectedPlan = plan;
        this.physio.getSessions(plan.id).subscribe(res => this.sessions = res);
    }

    openSessionForm() {
        const proc = window.prompt("Enter Procedure Performed:");
        if (proc) {
            const payload = {
                rehabPlanId: this.selectedPlan.id,
                sessionDate: new Date().toISOString(),
                therapistId: 1, // Demo therapist
                procedurePerformed: proc,
                progressNotes: "Patient tolerated well",
                painLevelBefore: 5,
                painLevelAfter: 2,
                durationMinutes: 45
            };
            this.physio.recordSession(payload).subscribe(() => {
                this.toast.success(this.translate.instant('SESSION_RECORDED'));
                this.viewSessions(this.selectedPlan);
            });
        }
    }
}
