import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DentalService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-dental',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    styles: [`
        .tooth-grid { display: grid; grid-template-columns: repeat(16, 1fr); gap: 4px; margin-bottom: 20px; }
        .tooth { aspect-ratio: 1; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; cursor: pointer; transition: 0.2s; background: var(--glass); }
        .tooth:hover { border-color: var(--primary); transform: scale(1.1); }
        .tooth.active { background: var(--primary); color: white; border-color: var(--primary); }
        .tooth.decayed { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .tooth.filled { background: #dcfce7; color: #16a34a; border-color: #86efac; }
    `],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'DENTAL' | translate }}</h1>
        <p class="page-subtitle">{{ 'DENTAL_CARE_AND_SURGERY' | translate }}</p>
      </div>
    </div>

    <div class="card mb-6 p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="font-black text-lg">{{ 'ODONTOGRAM' | translate }}</h2>
            <div class="flex gap-4">
                <div class="flex items-center gap-2 text-xs font-bold"><span class="w-3 h-3 rounded bg-white border"></span> Healthy</div>
                <div class="flex items-center gap-2 text-xs font-bold"><span class="w-3 h-3 rounded bg-red-100 border-red-300"></span> Decayed</div>
                <div class="flex items-center gap-2 text-xs font-bold"><span class="w-3 h-3 rounded bg-green-100 border-green-300"></span> Filled</div>
            </div>
        </div>

        <div class="text-[0.6rem] font-bold opacity-40 uppercase mb-2">Upper Arch</div>
        <div class="tooth-grid">
            <div *ngFor="let t of upperTeeth" class="tooth" 
                 [class.decayed]="t % 3 === 0" 
                 [class.active]="selectedTooth === t"
                 (click)="selectTooth(t)">{{ t }}</div>
        </div>

        <div class="text-[0.6rem] font-bold opacity-40 uppercase mb-2">Lower Arch</div>
        <div class="tooth-grid">
            <div *ngFor="let t of lowerTeeth" class="tooth" 
                 [class.filled]="t % 5 === 0"
                 [class.active]="selectedTooth === t"
                 (click)="selectTooth(t)">{{ t }}</div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in" *ngIf="selectedTooth">
        <div class="md:col-span-1">
            <div class="card p-6 border-primary">
                <h3 class="font-black mb-4">Tooth #{{ selectedTooth }} Details</h3>
                <div class="space-y-4">
                    <button class="btn btn-outline btn-block btn-sm" (click)="addProcedure('Cleaning')">Record Cleaning</button>
                    <button class="btn btn-outline btn-block btn-sm" (click)="addProcedure('Filling')">Record Filling</button>
                    <button class="btn btn-outline btn-block btn-sm" (click)="addProcedure('Extraction')">Record Extraction</button>
                    <button class="btn btn-primary btn-block btn-sm" (click)="selectedTooth = null">Clear Selection</button>
                </div>
            </div>
        </div>
        <div class="md:col-span-2">
            <div class="card p-0 overflow-hidden">
                <div class="p-4 border-bottom font-black">{{ 'PROCEDURE_HISTORY' | translate }}</div>
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th>{{ 'DATE' | translate }}</th>
                            <th>{{ 'TYPE' | translate }}</th>
                            <th>{{ 'DENTIST' | translate }}</th>
                            <th>{{ 'COST' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let p of procedures">
                            <td class="text-xs">{{ p.procedureDate | date:'shortDate' }}</td>
                            <td class="font-bold text-xs">{{ p.procedureType }}</td>
                            <td class="text-xs">{{ p.dentistName }}</td>
                            <td class="font-mono text-xs">{{ p.cost | currency }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="card p-12 text-center opacity-50" *ngIf="!selectedTooth">
        <span class="material-icons-round text-6xl mb-4">dentistry</span>
        <p class="font-black">{{ 'SELECT_TOOTH_TO_VIEW_HISTORY' | translate }}</p>
    </div>
    `
})
export class DentalComponent implements OnInit {
    upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
    lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17);
    selectedTooth: number | null = null;
    procedures: any[] = [];

    constructor(
        private dental: DentalService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        // demo chart
    }

    selectTooth(t: number) {
        this.selectedTooth = t;
        // In a real app, load procedures for this tooth specifically
        // For demo, we just load general procedures for a sample chart
        this.dental.getProcedures(1).subscribe(res => this.procedures = res.filter(p => p.toothNumber === t || Math.random() > 0.5));
    }

    addProcedure(type: string) {
        const payload = {
            dentalChartId: 1,
            toothNumber: this.selectedTooth,
            procedureType: type,
            surfaces: "O",
            cost: 150,
            procedureDate: new Date().toISOString(),
            dentistId: 1,
            clinicNotes: "Routine procedure"
        };
        this.dental.recordProcedure(payload).subscribe(() => {
            this.toast.success(this.translate.instant('PROCEDURE_RECORDED'));
            this.selectTooth(this.selectedTooth!);
        });
    }
}
