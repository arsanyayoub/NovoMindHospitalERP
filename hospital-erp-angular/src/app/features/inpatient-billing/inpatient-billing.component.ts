import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InpatientBillingService, BedManagementService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-inpatient-billing',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="animate-in">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-black tracking-tighter m-0">{{ 'INPATIENT_BILLING' | translate }}</h1>
          <p class="text-muted font-bold text-sm">{{ 'MANAGE_INPATIENT_CHARGES_AND_DAILY_BILLING' | translate }}</p>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary flex items-center gap-2" (click)="processDaily()" [disabled]="processing">
            <span class="material-icons-round" [class.animate-spin]="processing">autorenew</span>
            {{ 'PROCESS_DAILY_BILLING' | translate }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <!-- Stats Row -->
        <div class="col-span-12 grid grid-cols-4 gap-6 mb-4">
          <div class="card bg-glass border-primary border-opacity-20">
            <div class="text-[0.65rem] font-black uppercase text-primary tracking-widest mb-1">Active Admissions</div>
            <div class="text-3xl font-black">{{ activeAdmissions.length }}</div>
          </div>
          <div class="card bg-glass">
            <div class="text-[0.65rem] font-black uppercase text-muted tracking-widest mb-1">Last Daily Process</div>
            <div class="text-xl font-black">{{ lastProcessDate | date:'medium' || 'NEVER' | translate }}</div>
          </div>
          <!-- Add more stats as needed -->
        </div>

        <!-- Active Admissions Table -->
        <div class="col-span-12">
          <div class="card bg-glass p-0 overflow-hidden">
            <div class="p-6 border-bottom flex justify-between items-center bg-white bg-opacity-5">
              <h3 class="font-black text-lg m-0">{{ 'ACTIVE_ADMISSIONS' | translate }}</h3>
              <div class="search-box">
                <span class="material-icons-round">search</span>
                <input type="text" [(ngModel)]="searchQuery" [placeholder]="'SEARCH_PATIENTS' | translate" class="search-input">
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>{{ 'PATIENT' | translate }}</th>
                  <th>{{ 'WARD_BED' | translate }}</th>
                  <th>{{ 'ADMISSION_DATE' | translate }}</th>
                  <th>{{ 'DAILY_RATE' | translate }}</th>
                  <th>{{ 'STAY_DURATION' | translate }}</th>
                  <th>{{ 'ACTIONS' | translate }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let adm of filteredAdmissions" class="hover-row">
                  <td>
                    <div class="font-black text-primary">{{ adm.patientName }}</div>
                    <div class="text-[0.65rem] font-mono text-muted uppercase">{{ adm.patientCode }}</div>
                  </td>
                  <td>
                    <div class="font-bold">{{ adm.wardName }}</div>
                    <div class="text-xs text-muted">{{ 'BED' | translate }}: {{ adm.bedNumber }}</div>
                  </td>
                  <td>{{ adm.admissionDate | date:'mediumDate' }}</td>
                  <td><span class="font-black text-primary">{{ adm.dailyRate | currency }}</span></td>
                  <td>
                    <span class="badge badge-info">{{ getDuration(adm.admissionDate) }} {{ 'DAYS' | translate }}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-secondary flex items-center gap-1" (click)="finalizeBill(adm.id)">
                      <span class="material-icons-round text-sm">receipt_long</span>
                      {{ 'FINALIZE_BILL' | translate }}
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredAdmissions.length === 0">
                  <td colspan="6" class="text-center py-10 opacity-50 italic">{{ 'NO_ACTIVE_ADMISSIONS_FOUND' | translate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .search-box { position: relative; display: flex; align-items: center; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 0 12px; border: 1px solid var(--border); width: 300px; }
    .search-box .material-icons-round { color: var(--text-muted); font-size: 20px; }
    .search-input { background: none; border: none; padding: 10px; color: var(--text-primary); outline: none; width: 100%; font-size: 0.85rem; font-weight: 600; }
  `]
})
export class InpatientBillingComponent implements OnInit {
    activeAdmissions: any[] = [];
    searchQuery = '';
    processing = false;
    lastProcessDate: Date | null = null;

    constructor(
        private billingSvc: InpatientBillingService,
        private bedSvc: BedManagementService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadAdmissions();
    }

    loadAdmissions() {
        this.bedSvc.getAdmissions({ status: 'Active', page: 1, pageSize: 100 }).subscribe(res => {
            this.activeAdmissions = res.items;
        });
    }

    get filteredAdmissions() {
        if (!this.searchQuery) return this.activeAdmissions;
        const q = this.searchQuery.toLowerCase();
        return this.activeAdmissions.filter(a =>
            a.patientName.toLowerCase().includes(q) ||
            a.patientCode.toLowerCase().includes(q) ||
            a.wardName.toLowerCase().includes(q)
        );
    }

    getDuration(admissionDate: string): number {
        const start = new Date(admissionDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    processDaily() {
        this.processing = true;
        this.billingSvc.processDaily().subscribe({
            next: (res) => {
                this.toast.success(res.message || 'Daily billing processed successfully');
                this.lastProcessDate = new Date();
                this.processing = false;
            },
            error: () => {
                this.toast.error('Failed to process daily billing');
                this.processing = false;
            }
        });
    }

    finalizeBill(admissionId: number) {
        if (confirm('Are you sure you want to generate the final bill for this admission?')) {
            this.billingSvc.finalizeBill(admissionId).subscribe({
                next: (res) => {
                    this.toast.success(res.message || 'Final bill generated');
                },
                error: () => {
                    this.toast.error('Failed to finalize bill');
                }
            });
        }
    }
}
