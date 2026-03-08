import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DietaryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-dietary',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'DIETARY' | translate }}</h1>
        <p class="page-subtitle">{{ 'KITCHEN_AND_PATIENT_MEALS' | translate }}</p>
      </div>
    </div>

    <div class="card p-0 overflow-hidden mb-6">
      <div class="flex border-bottom bg-glass">
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'queue'"
                [class.text-primary]="activeTab === 'queue'"
                (click)="activeTab = 'queue'">
          {{ 'KITCHEN_QUEUE' | translate }}
        </button>
        <button class="flex-1 p-4 font-black transition-all border-bottom-3" 
                [class.border-primary]="activeTab === 'plans'"
                [class.text-primary]="activeTab === 'plans'"
                (click)="activeTab = 'plans'">
          {{ 'DIET_PLANS' | translate }}
        </button>
      </div>

      <div class="p-4" *ngIf="activeTab === 'queue'">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let order of mealOrders" class="p-4 bg-glass border-2 rounded-2xl animate-in"
                   [class.border-warning]="order.status === 'Ordered'"
                   [class.border-primary]="order.status === 'Preparing'"
                   [class.border-success]="order.status === 'Delivered'">
                  <div class="flex justify-between items-start mb-2">
                      <span class="badge text-[0.6rem]">{{ order.mealType }}</span>
                      <span class="text-[0.6rem] font-black opacity-40">{{ order.orderDate | date:'shortTime' }}</span>
                  </div>
                  <div class="font-black mb-1">{{ order.patientName }}</div>
                  <div class="text-xs opacity-70 mb-4 line-clamp-2">Regular Diet &bull; No Salt</div>
                  
                  <div class="flex gap-2">
                      <button class="btn btn-xs btn-outline btn-block" *ngIf="order.status === 'Ordered'" (click)="updateStatus(order, 'Preparing')">Start Cooking</button>
                      <button class="btn btn-xs btn-primary btn-block" *ngIf="order.status === 'Preparing'" (click)="updateStatus(order, 'Delivered')">Mark Delivered</button>
                  </div>
              </div>
          </div>
      </div>

      <div class="p-0" *ngIf="activeTab === 'plans'">
          <table class="table mb-0">
              <thead>
                  <tr>
                      <th>{{ 'PATIENT' | translate }}</th>
                      <th>{{ 'DIET_TYPE' | translate }}</th>
                      <th>{{ 'STATUS' | translate }}</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let p of mealOrders"> <!-- Demo reuse -->
                      <td class="font-black">{{ p.patientName }}</td>
                      <td>Regular / Cardiac</td>
                      <td><span class="badge badge-success">Active</span></td>
                      <td><button class="btn btn-xs btn-secondary">View Plan</button></td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>
    `
})
export class DietaryComponent implements OnInit {
    activeTab = 'queue';
    mealOrders: any[] = [];

    constructor(
        private dietary: DietaryService,
        private toast: ToastService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.dietary.getMealOrders({ pageSize: 50 }).subscribe(res => this.mealOrders = res.items);
    }

    updateStatus(order: any, status: string) {
        this.dietary.updateOrderStatus(order.id, status).subscribe(() => {
            this.toast.success("Order updated");
            this.loadOrders();
        });
    }
}
