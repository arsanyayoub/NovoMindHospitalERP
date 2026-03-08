import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FleetService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-fleet',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    styles: [`
        .ambulance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .amb-card { background: var(--glass); border: 2px solid var(--border); border-radius: 20px; padding: 20px; transition: 0.3s; position: relative; overflow: hidden; }
        .amb-card:hover { border-color: var(--primary); transform: translateY(-5px); }
        .amb-card.dispatched { border-color: var(--warning); }
        .amb-card.dispatched::before { content: ""; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--warning); }
        .amb-icon { font-size: 3rem; opacity: 0.1; position: absolute; right: -10px; bottom: -10px; transform: rotate(-15deg); }
    `],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'FLEET' | translate }}</h1>
        <p class="page-subtitle">{{ 'AMBULANCE_AND_DASHBOARD' | translate }}</p>
      </div>
      <button class="btn btn-primary" (click)="openDispatchModal()">
         <span class="material-icons-round">emergency_share</span> {{ 'NEW_DISPATCH' | translate }}
      </button>
    </div>

    <div class="ambulance-grid mb-8">
        <div *ngFor="let a of ambulances" class="amb-card animate-in" [class.dispatched]="a.status === 'Dispatched'">
            <span class="material-icons-round amb-icon">airport_shuttle</span>
            <div class="flex justify-between items-start mb-4">
                <div class="font-black text-xl">{{ a.vehicleNumber }}</div>
                <span class="badge" [class.badge-success]="a.status === 'Available'" [class.badge-warning]="a.status === 'Dispatched'">{{ a.status }}</span>
            </div>
            <div class="text-[0.6rem] font-black opacity-50 uppercase mb-3">{{ a.model }} &bull; {{ a.type }}</div>
            <div class="flex items-center gap-2 text-xs font-bold mb-4">
                <span class="material-icons-round text-sm">location_on</span> {{ a.currentLocation || 'Base Station' }}
            </div>
            <div class="flex gap-2">
                <button class="btn btn-xs btn-outline btn-block" *ngIf="a.status === 'Available'" (click)="dispatchSpecific(a)">{{ 'DISPATCH' | translate }}</button>
                <button class="btn btn-xs btn-primary btn-block" *ngIf="a.status === 'Dispatched'" (click)="updateAmbStatus(a, 'Available')">{{ 'RETURN_TO_BASE' | translate }}</button>
            </div>
        </div>
    </div>

    <div class="card p-0 overflow-hidden">
        <div class="p-4 border-bottom font-black">{{ 'RECENT_DISPATCHES' | translate }}</div>
        <table class="table mb-0">
            <thead>
                <tr>
                    <th>{{ 'TIME' | translate }}</th>
                    <th>{{ 'AMBULANCE' | translate }}</th>
                    <th>{{ 'PICKUP' | translate }}</th>
                    <th>{{ 'STATUS' | translate }}</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let d of dispatches">
                    <td class="text-xs">{{ d.dispatchTime | date:'shortTime' }}</td>
                    <td class="font-black">{{ d.vehicleNumber }}</td>
                    <td class="text-xs">{{ d.pickupLocation }}</td>
                    <td><span class="badge badge-warning">{{ d.status }}</span></td>
                </tr>
            </tbody>
        </table>
    </div>
    `
})
export class FleetComponent implements OnInit {
    ambulances: any[] = [];
    dispatches: any[] = [];

    constructor(
        private fleet: FleetService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadAmbulances();
        this.loadDispatches();
    }

    loadAmbulances() {
        this.fleet.getAmbulances().subscribe(res => this.ambulances = res);
    }

    loadDispatches() {
        this.fleet.getDispatches({ pageSize: 10 }).subscribe(res => this.dispatches = res.items);
    }

    openDispatchModal() {
        const available = this.ambulances.find(a => a.status === 'Available');
        if (!available) {
            this.toast.error("No ambulances available");
            return;
        }
        this.dispatchSpecific(available);
    }

    dispatchSpecific(amb: any) {
        const loc = window.prompt("Enter Pickup Location:");
        if (loc) {
            const payload = {
                ambulanceId: amb.id,
                callSource: "911 Emergency",
                pickupLocation: loc,
                destinationLocation: "ER Main Entrance",
                dispatchTime: new Date().toISOString()
            };
            this.fleet.dispatch(payload).subscribe(() => {
                this.toast.success(this.translate.instant('AMBULANCE_DISPATCHED'));
                this.loadAmbulances();
                this.loadDispatches();
            });
        }
    }

    updateAmbStatus(amb: any, status: string) {
        this.fleet.updateStatus(amb.id, status).subscribe(() => {
            this.toast.success("Ambulance status updated");
            this.loadAmbulances();
        });
    }
}
