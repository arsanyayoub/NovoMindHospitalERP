import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div><h1 class="page-title">{{ 'INVENTORY' | translate }}</h1></div>
      <div class="flex gap-2">
        <button class="btn" [class.btn-primary]="tab==='items'" [class.btn-secondary]="tab!=='items'" (click)="tab='items'">{{ 'ITEMS' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='stock'" [class.btn-secondary]="tab!=='stock'" (click)="tab='stock';loadStock()">{{ 'STOCK' | translate }}</button>
        <button class="btn" [class.btn-primary]="tab==='warehouses'" [class.btn-secondary]="tab!=='warehouses'" (click)="tab='warehouses';loadWarehouses()">{{ 'WAREHOUSES' | translate }}</button>
      </div>
    </div>

    <!-- Items Tab -->
    <div *ngIf="tab==='items'">
      <div class="flex justify-between items-center mb-4">
        <div class="search-bar"><span class="material-icons-round search-icon">search</span><input class="form-control" [placeholder]="'SEARCH' | translate" [(ngModel)]="search" (input)="loadItems()"></div>
        <button class="btn btn-primary btn-sm" (click)="showItemForm=true;itemForm={}"><span class="material-icons-round">add</span></button>
      </div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Sale Price</th><th>Purchase Price</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let i of items"><td><span class="badge badge-primary">{{ i.itemCode }}</span></td><td class="font-semibold">{{ i.itemName }}</td><td>{{ i.category }}</td><td>{{ i.salePrice | currency }}</td><td>{{ i.purchasePrice | currency }}</td>
          <td><button class="btn btn-sm btn-secondary" (click)="editItem(i)"><span class="material-icons-round" style="font-size:16px">edit</span></button></td></tr>
        </tbody>
      </table></div></div>
    </div>

    <!-- Stock Tab -->
    <div *ngIf="tab==='stock'">
      <div class="flex justify-between items-center mb-4"><h3>{{ 'STOCK' | translate }}</h3>
        <button class="btn btn-primary btn-sm" (click)="showTransfer=true"><span class="material-icons-round">swap_horiz</span> {{ 'STOCK_TRANSFER' | translate }}</button></div>
      <div class="card" style="padding:0"><div class="table-container"><table class="table">
        <thead><tr><th>Item</th><th>Warehouse</th><th>Qty</th><th>Reorder Level</th><th>Status</th></tr></thead>
        <tbody><tr *ngFor="let s of stock"><td class="font-semibold">{{ s.itemName }}</td><td>{{ s.warehouseName }}</td><td>{{ s.quantity }}</td><td>{{ s.reorderLevel }}</td>
          <td><span class="badge" [ngClass]="s.isLowStock ? 'badge-danger' : 'badge-success'">{{ s.isLowStock ? 'Low' : 'OK' }}</span></td></tr></tbody>
      </table></div></div>
    </div>

    <!-- Warehouses Tab -->
    <div *ngIf="tab==='warehouses'">
      <div class="flex justify-between items-center mb-4"><h3>{{ 'WAREHOUSES' | translate }}</h3>
        <button class="btn btn-primary btn-sm" (click)="showWhForm=true;whForm={}"><span class="material-icons-round">add</span></button></div>
      <div class="card-grid"><div *ngFor="let w of warehouses" class="card">
        <h4><span class="material-icons-round" style="color:var(--accent);vertical-align:middle;margin-inline-end:8px">warehouse</span>{{ w.warehouseName }}</h4>
        <p class="text-sm text-muted mt-2">{{ w.location || 'No location' }}</p><span class="badge badge-info mt-2">{{ w.warehouseCode }}</span>
      </div></div>
    </div>

    <!-- Item Modal -->
    <div class="modal-overlay" *ngIf="showItemForm" (click)="showItemForm=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">Item</h3><button class="btn btn-sm btn-secondary" (click)="showItemForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-row"><div class="form-group"><label class="form-label">Name (EN) *</label><input class="form-control" [(ngModel)]="itemForm.itemName"></div><div class="form-group"><label class="form-label">Name (AR)</label><input class="form-control" [(ngModel)]="itemForm.itemNameAr" dir="rtl"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Category</label><input class="form-control" [(ngModel)]="itemForm.category"></div><div class="form-group"><label class="form-label">Unit</label><input class="form-control" [(ngModel)]="itemForm.unit" placeholder="pcs, kg..."></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Sale Price</label><input class="form-control" type="number" [(ngModel)]="itemForm.salePrice"></div><div class="form-group"><label class="form-label">Purchase Price</label><input class="form-control" type="number" [(ngModel)]="itemForm.purchasePrice"></div></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">Tax Rate %</label><input class="form-control" type="number" [(ngModel)]="itemForm.taxRate"></div><div class="form-group"><label class="form-label">Barcode</label><input class="form-control" [(ngModel)]="itemForm.barcode"></div></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showItemForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveItem()">{{ 'SAVE' | translate }}</button></div>
    </div></div>

    <!-- Transfer Modal -->
    <div class="modal-overlay" *ngIf="showTransfer" (click)="showTransfer=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3 class="modal-title">{{ 'STOCK_TRANSFER' | translate }}</h3><button class="btn btn-sm btn-secondary" (click)="showTransfer=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Item</label><select class="form-control" [(ngModel)]="transForm.itemId"><option *ngFor="let i of items" [ngValue]="i.id">{{ i.itemName }}</option></select></div>
        <div class="form-row mt-4"><div class="form-group"><label class="form-label">From Warehouse</label><select class="form-control" [(ngModel)]="transForm.fromWarehouseId"><option *ngFor="let w of warehouses" [ngValue]="w.id">{{ w.warehouseName }}</option></select></div>
        <div class="form-group"><label class="form-label">To Warehouse</label><select class="form-control" [(ngModel)]="transForm.toWarehouseId"><option *ngFor="let w of warehouses" [ngValue]="w.id">{{ w.warehouseName }}</option></select></div></div>
        <div class="form-group mt-4"><label class="form-label">Quantity</label><input class="form-control" type="number" [(ngModel)]="transForm.quantity"></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showTransfer=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="transfer()">{{ 'CONFIRM' | translate }}</button></div>
    </div></div>

    <!-- Warehouse Modal -->
    <div class="modal-overlay" *ngIf="showWhForm" (click)="showWhForm=false"><div class="modal" (click)="$event.stopPropagation()">
      <div class="modal-header"><h3>New Warehouse</h3><button class="btn btn-sm btn-secondary" (click)="showWhForm=false"><span class="material-icons-round">close</span></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Name *</label><input class="form-control" [(ngModel)]="whForm.warehouseName"></div>
        <div class="form-group mt-4"><label class="form-label">Location</label><input class="form-control" [(ngModel)]="whForm.location"></div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" (click)="showWhForm=false">{{ 'CANCEL' | translate }}</button><button class="btn btn-primary" (click)="saveWh()">{{ 'SAVE' | translate }}</button></div>
    </div></div>
  `
})
export class InventoryComponent implements OnInit {
    tab = 'items'; items: any[] = []; stock: any[] = []; warehouses: any[] = [];
    search = ''; showItemForm = false; showTransfer = false; showWhForm = false;
    itemForm: any = {}; transForm: any = {}; whForm: any = {};
    constructor(private svc: InventoryService, private toast: ToastService) { }
    editItem(i: any) { this.showItemForm = true; this.itemForm = { ...i }; }
    ngOnInit() { this.loadItems(); this.loadWarehouses(); }
    loadItems() { this.svc.getItems({ search: this.search }).subscribe(r => this.items = r.items); }
    loadStock() { this.svc.getStock().subscribe(s => this.stock = s); }
    loadWarehouses() { this.svc.getWarehouses().subscribe(w => this.warehouses = w); }
    saveItem() { const obs = this.itemForm.id ? this.svc.updateItem(this.itemForm.id, this.itemForm) : this.svc.createItem(this.itemForm); obs.subscribe({ next: () => { this.toast.success('Saved'); this.showItemForm = false; this.loadItems(); }, error: () => this.toast.error('Error') }); }
    transfer() { this.svc.transferStock(this.transForm).subscribe({ next: () => { this.toast.success('Transferred'); this.showTransfer = false; this.loadStock(); }, error: (e: any) => this.toast.error(e.error?.message || 'Error') }); }
    saveWh() { this.svc.createWarehouse(this.whForm).subscribe({ next: () => { this.toast.success('Saved'); this.showWhForm = false; this.loadWarehouses(); } }); }
}
