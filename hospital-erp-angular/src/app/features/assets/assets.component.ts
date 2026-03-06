import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AssetService, PagedResult } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-assets',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0 fw-bold text-gradient-primary">
            <i class="fas fa-tools me-2"></i>{{ 'ASSETS.TITLE' | translate }}
          </h2>
          <p class="text-muted mb-0 small">Manage hospital equipment and maintenance lifecycle</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary shadow-sm rounded-pill px-4" (click)="loadInitialData()">
            <i class="fas fa-sync-alt me-2"></i>{{ 'REFRESH' | translate }}
          </button>
          <button class="btn btn-primary shadow-sm rounded-pill px-4" (click)="openAddModal()">
            <i class="fas fa-plus me-2"></i>{{ 'ASSETS.NEW_ASSET' | translate }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-pills mb-4 gap-2 bg-light p-2 rounded-4 shadow-sm d-inline-flex border">
        <li class="nav-item">
          <button class="nav-link rounded-pill px-4 py-2" [class.active]="activeTab === 'inventory'" (click)="setTab('inventory')">
            <i class="fas fa-boxes me-2"></i>{{ 'INVENTORY' | translate }}
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link rounded-pill px-4 py-2" [class.active]="activeTab === 'tickets'" (click)="setTab('tickets')">
            <i class="fas fa-clipboard-list me-2"></i>{{ 'ASSETS.TICKETS' | translate }}
          </button>
        </li>
      </ul>

      <!-- Asset Inventory Content -->
      <div *ngIf="activeTab === 'inventory'">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div class="card-header bg-white p-3 border-0">
            <div class="input-group search-box rounded-pill overflow-hidden bg-light border-0 px-3">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control bg-transparent border-0 py-2 shadow-none" 
                     placeholder="Search assets by name, code or serial..." [(ngModel)]="searchQuery" (input)="loadAssets()">
              <select class="form-select bg-transparent border-0 shadow-none border-start ps-3" [(ngModel)]="filterCategory" (change)="loadAssets()">
                <option value="">All Categories</option>
                <option value="Bio-Medical">Bio-Medical</option>
                <option value="IT">IT Hardware</option>
                <option value="Facility">Facility/Building</option>
              </select>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-table">
              <thead class="bg-light text-muted small text-uppercase fw-bold">
                <tr>
                  <th class="ps-4">{{ 'ASSETS.ASSET_NAME' | translate }}</th>
                  <th>{{ 'ASSETS.ASSET_CODE' | translate }}</th>
                  <th>{{ 'CATEGORY' | translate }}</th>
                  <th>{{ 'LOCATION' | translate }}</th>
                  <th>{{ 'STATUS' | translate }}</th>
                  <th>{{ 'ASSETS.NEXT_MAINTENANCE' | translate }}</th>
                  <th class="text-end pe-4">{{ 'ACTIONS' | translate }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let asset of assets.items">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="avatar-soft rounded-circle me-3" [class.bg-info-soft]="asset.isBioMedical" [class.bg-secondary-soft]="!asset.isBioMedical">
                        <i [class]="asset.isBioMedical ? 'fas fa-heartbeat' : 'fas fa-desktop'"></i>
                      </div>
                      <div>
                        <div class="fw-bold mb-0">{{ asset.assetName }}</div>
                        <div class="text-muted x-small">{{ asset.manufacturer }} {{ asset.modelNumber }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge bg-light text-dark font-monospace">{{ asset.assetCode }}</span></td>
                  <td>{{ asset.category }}</td>
                  <td>{{ asset.location }}</td>
                  <td>
                    <span class="badge rounded-pill" 
                          [class.bg-success-soft]="asset.status === 'Active'" 
                          [class.bg-warning-soft]="asset.status === 'Maintenance'"
                          [class.bg-danger-soft]="asset.status === 'Out of Service'">
                      {{ asset.status }}
                    </span>
                  </td>
                  <td>
                   <div *ngIf="asset.nextMaintenanceDate">
                      <span class="small" [class.text-danger]="isOverdue(asset.nextMaintenanceDate)">
                        {{ asset.nextMaintenanceDate | date:'mediumDate' }}
                      </span>
                      <i *ngIf="isOverdue(asset.nextMaintenanceDate)" class="fas fa-exclamation-triangle text-danger ms-1 x-small" title="Maintenance Overdue!"></i>
                   </div>
                   <span class="text-muted small" *ngIf="!asset.nextMaintenanceDate">N/A</span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="dropdown">
                      <button class="btn btn-icon btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                        <li><a class="dropdown-item py-2" href="javascript:void(0)" (click)="openEditModal(asset)"><i class="fas fa-edit me-2"></i>{{ 'EDIT' | translate }}</a></li>
                        <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" (click)="openAddTicketModal(asset)"><i class="fas fa-ambulance me-2"></i>{{ 'ASSETS.REPORT_ISSUE' | translate }}</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="assets.items.length === 0">
                  <td colspan="7" class="text-center py-5 text-muted">
                    <i class="fas fa-search-minus fa-3x mb-3 opacity-25"></i>
                    <p>No assets found matching your search.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tickets Content -->
      <div *ngIf="activeTab === 'tickets'">
        <div class="row g-4 mb-4">
          <div class="col-md-3" *ngFor="let stat of ticketStats">
             <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div class="d-flex align-items-center justify-content-between mb-2">
                   <div class="avatar-soft rounded-pill p-3" [class]="stat.colorCls">
                      <i [class]="stat.icon"></i>
                   </div>
                   <span class="h4 mb-0 fw-bold">{{ stat.value }}</span>
                </div>
                <div class="text-muted small fw-bold">{{ stat.label | translate }}</div>
             </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div class="card-header bg-white p-3 border-0 d-flex justify-content-between">
            <div class="input-group search-box rounded-pill overflow-hidden bg-light border-0 px-3 w-50">
              <span class="input-group-text bg-transparent border-0 text-muted"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control bg-transparent border-0 py-2 shadow-none" 
                     placeholder="Search tickets..." [(ngModel)]="ticketSearch" (input)="loadTickets()">
            </div>
            <select class="form-select rounded-pill w-auto border-0 bg-light px-3" [(ngModel)]="ticketFilterStatus" (change)="loadTickets()">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-table">
              <thead class="bg-light text-muted small text-uppercase fw-bold">
                <tr>
                  <th class="ps-4">{{ 'ASSETS.TICKET_NUMBER' | translate }}</th>
                  <th>{{ 'ASSETS.ASSET_NAME' | translate }}</th>
                  <th>{{ 'ASSETS.ISSUE_TYPE' | translate }}</th>
                  <th>{{ 'ASSETS.PRIORITY' | translate }}</th>
                  <th>{{ 'STATUS' | translate }}</th>
                  <th>{{ 'DATE' | translate }}</th>
                  <th class="text-end pe-4">{{ 'ACTIONS' | translate }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ticket of tickets.items">
                  <td class="ps-4 fw-bold font-monospace">{{ ticket.ticketNumber }}</td>
                  <td>{{ ticket.assetName }}</td>
                  <td>
                     <span class="badge bg-light text-dark rounded-pill">
                        <i class="fas me-1" [class]="getTicketTypeIcon(ticket.type)"></i>{{ ticket.type }}
                     </span>
                  </td>
                  <td>
                    <span class="badge rounded-pill" 
                          [class.bg-danger]="ticket.priority === 'Emergency'"
                          [class.bg-warning]="ticket.priority === 'High'"
                          [class.bg-info]="ticket.priority === 'Medium'"
                          [class.bg-secondary]="ticket.priority === 'Low'">
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td>
                     <div class="d-flex align-items-center">
                        <span class="status-indicator me-2" [class.bg-success]="ticket.status === 'Completed'" [class.bg-warning]="ticket.status === 'In Progress'" [class.bg-danger]="ticket.status === 'Open'"></span>
                        <span class="small">{{ ticket.status }}</span>
                     </div>
                  </td>
                  <td>{{ ticket.reportedDate | date:'shortDate' }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" (click)="openTicketDetails(ticket)">
                       {{ 'VIEW' | translate }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Add Asset, Add Ticket, etc) -->
    <!-- Simplified Modal Structure for clarity -->
    <div class="modal fade" id="assetModal" tabindex="-1">
       <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
             <div class="modal-header border-0 bg-light p-4 rounded-top-4">
                <h5 class="modal-title fw-bold">
                  <i class="fas fa-plus-circle me-2 text-primary"></i>{{ (selectedAsset ? 'ASSETS.EDIT_ASSET' : 'ASSETS.NEW_ASSET') | translate }}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
             </div>
             <div class="modal-body p-4">
                <form #assetForm="ngForm">
                   <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-bold small">{{ 'ASSETS.ASSET_NAME' | translate }}</label>
                        <input type="text" class="form-control rounded-3" name="assetName" [(ngModel)]="assetFormDto.assetName" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold small">{{ 'CATEGORY' | translate }}</label>
                        <select class="form-select rounded-3" name="category" [(ngModel)]="assetFormDto.category" required>
                           <option value="Bio-Medical">Bio-Medical</option>
                           <option value="IT">IT Hardware</option>
                           <option value="Facility">Facility/Building</option>
                           <option value="Furniture">Furniture</option>
                        </select>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold small">{{ 'ASSETS.MANUFACTURER' | translate }}</label>
                        <input type="text" class="form-control rounded-3" name="manufacturer" [(ngModel)]="assetFormDto.manufacturer">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold small">{{ 'ASSETS.SERIAL_NUMBER' | translate }}</label>
                        <input type="text" class="form-control rounded-3" name="serialNumber" [(ngModel)]="assetFormDto.serialNumber">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold small">{{ 'ASSETS.PURCHASE_COST' | translate }}</label>
                        <input type="number" class="form-control rounded-3" name="purchaseCost" [(ngModel)]="assetFormDto.purchaseCost">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold small">{{ 'ASSETS.PURCHASE_DATE' | translate }}</label>
                        <input type="date" class="form-control rounded-3" name="purchaseDate" [(ngModel)]="assetFormDto.purchaseDate">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold small">{{ 'ASSETS.WARRANTY_EXPIRY' | translate }}</label>
                        <input type="date" class="form-control rounded-3" name="warrantyExpiryDate" [(ngModel)]="assetFormDto.warrantyExpiryDate">
                      </div>
                      <div class="col-12">
                         <div class="form-check form-switch p-3 bg-light rounded-3">
                            <input class="form-check-input ms-0 me-3" type="checkbox" name="isBioMedical" [(ngModel)]="assetFormDto.isBioMedical">
                            <label class="form-check-label fw-bold small">This is a specialized Bio-medical equipment</label>
                         </div>
                      </div>
                      <div class="col-md-6" *ngIf="assetFormDto.isBioMedical">
                        <label class="form-label fw-bold small text-primary">{{ 'ASSETS.MAINTENANCE_INTERVAL' | translate }}</label>
                        <input type="number" class="form-control border-primary rounded-3" name="mInt" [(ngModel)]="assetFormDto.maintenanceIntervalDays" placeholder="e.g. 90 days">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold small">{{ 'ASSETS.LOCATION' | translate }}</label>
                        <input type="text" class="form-control rounded-3" name="loc" [(ngModel)]="assetFormDto.location">
                      </div>
                   </div>
                </form>
             </div>
             <div class="modal-footer border-0 p-4 pt-0">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">{{ 'CANCEL' | translate }}</button>
                <button type="button" class="btn btn-primary rounded-pill px-4" (click)="saveAsset()">{{ 'SAVE' | translate }}</button>
             </div>
          </div>
       </div>
    </div>
  `,
    styles: [`
    .avatar-soft { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .bg-info-soft { background: rgba(13, 202, 240, 0.15); color: #0dcaf0; }
    .bg-secondary-soft { background: rgba(108, 117, 125, 0.15); color: #6c757d; }
    .bg-success-soft { background: rgba(25, 135, 84, 0.15); color: #198754; }
    .bg-warning-soft { background: rgba(255, 193, 7, 0.15); color: #856404; }
    .bg-danger-soft { background: rgba(220, 53, 69, 0.15); color: #dc3545; }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .x-small { font-size: 0.75rem; }
    .text-gradient-primary { background: linear-gradient(45deg, #0d6efd, #0dcaf0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .search-box { box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .custom-table th { background: #f8f9fa; }
  `]
})
export class AssetsComponent implements OnInit {
    activeTab = 'inventory';
    assets: PagedResult<any> = { items: [], totalCount: 0, page: 1, pageSize: 15, totalPages: 0, hasPrevious: false, hasNext: false };
    tickets: PagedResult<any> = { items: [], totalCount: 0, page: 1, pageSize: 15, totalPages: 0, hasPrevious: false, hasNext: false };
    searchQuery = '';
    filterCategory = '';
    ticketSearch = '';
    ticketFilterStatus = '';

    selectedAsset: any = null;
    assetFormDto: any = {};

    ticketStats = [
        { label: 'ASSETS.TICKETS', icon: 'fas fa-clipboard-list', value: 0, colorCls: 'bg-primary-soft' },
        { label: 'STATUS_BREAKDOWN', icon: 'fas fa-hourglass-half text-warning', value: 0, colorCls: 'bg-warning-soft' },
        { label: 'ASSETS.CORRECTIVE', icon: 'fas fa-exclamation-circle text-danger', value: 0, colorCls: 'bg-danger-soft' },
        { label: 'COMPLETED', icon: 'fas fa-check-circle text-success', value: 0, colorCls: 'bg-success-soft' }
    ];

    constructor(private service: AssetService, private toast: ToastService) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        this.loadAssets();
        this.loadTickets();
    }

    loadAssets() {
        this.service.getAssets({ page: 1, pageSize: 50, search: this.searchQuery }, this.filterCategory).subscribe(res => {
            this.assets = res;
        });
    }

    loadTickets() {
        this.service.getTickets({ page: 1, pageSize: 50, search: this.ticketSearch }, undefined, this.ticketFilterStatus).subscribe(res => {
            this.tickets = res;
            this.updateTicketStats();
        });
    }

    setTab(tab: string) {
        this.activeTab = tab;
    }

    saveAsset() {
        if (this.selectedAsset) {
            this.service.updateAsset(this.selectedAsset.id, this.assetFormDto).subscribe(() => {
                this.toast.success('Asset updated successfully');
                this.loadAssets();
                (window as any).bootstrap.Modal.getInstance(document.getElementById('assetModal')).hide();
            });
        } else {
            this.service.createAsset(this.assetFormDto).subscribe(() => {
                this.toast.success('Asset created successfully');
                this.loadAssets();
                (window as any).bootstrap.Modal.getInstance(document.getElementById('assetModal')).hide();
            });
        }
    }

    openAddModal() {
        this.selectedAsset = null;
        this.assetFormDto = { category: 'Bio-Medical', isBioMedical: true, purchaseDate: new Date().toISOString().split('T')[0] };
        new (window as any).bootstrap.Modal(document.getElementById('assetModal')).show();
    }

    openEditModal(asset: any) {
        this.selectedAsset = asset;
        this.assetFormDto = { ...asset };
        if (asset.purchaseDate) this.assetFormDto.purchaseDate = asset.purchaseDate.split('T')[0];
        if (asset.warrantyExpiryDate) this.assetFormDto.warrantyExpiryDate = asset.warrantyExpiryDate.split('T')[0];
        new (window as any).bootstrap.Modal(document.getElementById('assetModal')).show();
    }

    openAddTicketModal(asset: any) {
        // Logic for reporting an issue
        const desc = prompt("Describe the issue for " + asset.assetName);
        if (desc) {
            const dto = { assetId: asset.id, type: 'Corrective', priority: 'High', description: desc };
            this.service.createTicket(dto).subscribe(() => {
                this.toast.info('Maintenance ticket created and Bio-medical team notified.');
                this.loadAssets();
                this.loadTickets();
            });
        }
    }

    openTicketDetails(ticket: any) {
        if (ticket.status === 'Completed') {
            alert(`Ticket ${ticket.ticketNumber} resolution: ${ticket.resolution || 'Resolved'}`);
            return;
        }
        const proceed = confirm(`Move ticket ${ticket.ticketNumber} to Completed status?`);
        if (proceed) {
            const res = prompt("Enter resolution details:");
            this.service.updateTicketStatus(ticket.id, { status: 'Completed', resolution: res, completedDate: new Date().toISOString() }).subscribe(() => {
                this.toast.success('Ticket completed');
                this.loadTickets();
                this.loadAssets();
            });
        }
    }

    updateTicketStats() {
        this.ticketStats[0].value = this.tickets.totalCount;
        this.ticketStats[1].value = this.tickets.items.filter(t => t.status !== 'Completed').length;
        this.ticketStats[2].value = this.tickets.items.filter(t => t.type === 'Corrective').length;
        this.ticketStats[3].value = this.tickets.items.filter(t => t.status === 'Completed').length;
    }

    getTicketTypeIcon(type: string) {
        switch (type) {
            case 'Preventive': return 'fa-shield-alt text-info';
            case 'Corrective': return 'fa-tools text-danger';
            case 'Calibration': return 'fa-tachometer-alt text-warning';
            default: return 'fa-info-circle';
        }
    }

    isOverdue(date: string) {
        return new Date(date) < new Date() && date !== null;
    }
}
