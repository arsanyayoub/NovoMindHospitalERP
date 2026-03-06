import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InventoryService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
   selector: 'app-inventory',
   standalone: true,
   imports: [CommonModule, FormsModule, TranslateModule],
   styles: [`
    .inv-tab-nav { display: flex; gap: 4px; background: rgba(0,0,0,0.15); padding: 5px; border-radius: 14px; margin-bottom: 24px; width: fit-content; border: 1px solid var(--border); overflow-x: auto; max-width: 100%; }
    .inv-tab-btn { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; cursor: pointer; transition: 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .inv-tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .inv-tab-btn:hover:not(.active) { color: var(--text-primary); background: rgba(255,255,255,0.05); }

    .expiry-chip { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; text-transform: uppercase; }
    .expiry-safe { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .expiry-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .expiry-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .warehouse-card { background: rgba(var(--card-bg-rgb), 0.3); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: 0.25s; }
    .warehouse-card:hover { border-color: var(--primary); transform: translateY(-3px); }
    
    .scan-display { background: rgba(var(--primary-rgb), 0.05); border: 2px dashed var(--primary); border-radius: 24px; padding: 40px; text-align: center; }
  `],
   template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'INVENTORY_MANAGEMENT' | translate }}</h1>
        <p class="page-subtitle">{{ 'INVENTORY_SUBTITLE' | translate }}</p>
      </div>
      <div class="flex gap-3">
        <button *ngIf="tab==='items'" class="btn btn-primary px-4 shadow-primary" (click)="openItemForm()">
          <span class="material-icons-round mr-1">add_box</span> {{ 'NEW_ITEM' | translate }}
        </button>
        <button *ngIf="tab==='batches'" class="btn btn-secondary px-4 shadow-sm" (click)="downloadBatchReport()">
          <span class="material-icons-round mr-1">picture_as_pdf</span> {{ 'BATCH_REPORT' | translate }}
        </button>
        <button *ngIf="tab==='batches'" class="btn btn-primary px-4 shadow-primary" (click)="openBatchForm()">
          <span class="material-icons-round mr-1">trolley</span> {{ 'NEW_BATCH' | translate }}
        </button>
        <button *ngIf="tab==='stock'" class="btn btn-primary px-4 shadow-primary" (click)="showTransfer=true">
          <span class="material-icons-round mr-1">swap_horiz</span> {{ 'TRANSFER' | translate }}
        </button>
      </div>
    </div>

    <div class="inv-tab-nav animate-in">
      <button class="inv-tab-btn" [class.active]="tab==='items'" (click)="tab='items'; loadItems()">
        <span class="material-icons-round">inventory_2</span> {{ 'ITEMS' | translate }}
      </button>
      <button class="inv-tab-btn" [class.active]="tab==='batches'" (click)="tab='batches'; loadBatches()">
        <span class="material-icons-round">local_shipping</span> {{ 'BATCHES' | translate }}
      </button>
      <button class="inv-tab-btn" [class.active]="tab==='stock'" (click)="tab='stock'; loadStock()">
        <span class="material-icons-round">widgets</span> {{ 'STOCK_LEVELS' | translate }}
      </button>
      <button class="inv-tab-btn" [class.active]="tab==='warehouses'" (click)="tab='warehouses'; loadWarehouses()">
        <span class="material-icons-round">warehouse</span> {{ 'WAREHOUSES' | translate }}
      </button>
      <button class="inv-tab-btn" [class.active]="tab==='scan'" (click)="tab='scan'">
        <span class="material-icons-round">qr_code_scanner</span> {{ 'BARCODE_SCAN' | translate }}
      </button>
      <button class="inv-tab-btn" [class.active]="tab==='reports'" (click)="tab='reports'; loadTransactions()">
        <span class="material-icons-round">analytics</span> {{ 'ANALYTICS' | translate }}
      </button>
    </div>

    <!-- ITEMS TAB -->
    <div *ngIf="tab==='items'" class="animate-in">
      <div class="card p-0 overflow-hidden">
        <div class="p-4 border-bottom bg-glass flex justify-between items-center">
          <div class="search-bar" style="max-width:350px">
            <span class="material-icons-round search-icon">search</span>
            <input class="form-control" [placeholder]="'SEARCH_CATALOG' | translate" [(ngModel)]="search" (input)="loadItems()">
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'CODE' | translate }}</th>
                <th>{{ 'ITEM_NAME' | translate }}</th>
                <th>{{ 'CATEGORY' | translate }}</th>
                <th class="text-end">{{ 'SALE_PRICE' | translate }}</th>
                <th>{{ 'TRACKING' | translate }}</th>
                <th class="text-end">{{ 'ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let i of items" class="hover-row">
                <td><span class="badge badge-secondary font-mono">{{ i.itemCode }}</span></td>
                <td><div class="font-bold text-lg">{{ i.itemName }}</div><div class="text-xs text-muted">{{ i.unit }}</div></td>
                <td><span class="badge badge-info uppercase text-xs font-bold">{{ i.category }}</span></td>
                <td class="text-end font-black text-primary">{{ i.salePrice | currency }}</td>
                <td>
                  <span class="badge" [ngClass]="i.trackBatches ? 'badge-success' : 'badge-secondary'">
                    {{ (i.trackBatches ? 'BATCH_TRACKED' : 'SERIAL_ONLY') | translate }}
                  </span>
                </td>
                <td class="text-end">
                   <div class="flex justify-end gap-1">
                      <button class="btn btn-icon btn-xs text-primary" (click)="editItem(i)"><span class="material-icons-round">edit</span></button>
                      <button class="btn btn-icon btn-xs text-info" (click)="openPackagingUnits(i)"><span class="material-icons-round">layers</span></button>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- BATCHES TAB -->
    <div *ngIf="tab==='batches'" class="animate-in">
       <div class="flex gap-3 mb-6">
          <div class="search-bar flex-grow" style="max-width:350px">
             <span class="material-icons-round search-icon">filter_alt</span>
             <input class="form-control" [placeholder]="'FILTER_BATCHES' | translate" [(ngModel)]="batchSearch" (input)="loadBatches()">
          </div>
          <button class="btn btn-secondary flex items-center gap-2" [class.btn-primary]="batchFilterExpired" (click)="batchFilterExpired=!batchFilterExpired;loadBatches()">
             <span class="material-icons-round">event_busy</span> {{ 'HIDE_EXPIRED' | translate }}
          </button>
       </div>

       <div class="card p-0 overflow-hidden">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'BATCH' | translate }}</th>
                      <th>{{ 'ITEM' | translate }}</th>
                      <th>{{ 'WAREHOUSE' | translate }}</th>
                      <th>{{ 'EXPIRY' | translate }}</th>
                      <th>{{ 'QUANTITY' | translate }}</th>
                      <th>{{ 'STATUS' | translate }}</th>
                      <th class="text-end">{{ 'ACTIONS' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let b of batches" class="hover-row">
                      <td><span class="badge badge-primary font-mono">{{ b.batchNumber }}</span></td>
                      <td><div class="font-bold">{{ b.itemName }}</div><div class="text-xs text-muted">Lot: {{ b.lotNumber || 'N/A' }}</div></td>
                      <td><div class="text-sm font-semibold">{{ b.warehouseName }}</div></td>
                      <td>
                         <span class="expiry-chip" [ngClass]="b.isExpired ? 'expiry-danger' : (b.isExpiringSoon ? 'expiry-warning' : 'expiry-safe')">
                            <span class="material-icons-round" style="font-size:14px">{{ b.isExpired ? 'gpp_bad' : 'verified_user' }}</span>
                            {{ b.expiryDate | date:'MMM yyyy' }}
                         </span>
                      </td>
                      <td>
                         <div class="flex flex-col gap-1 w-32">
                            <div class="flex justify-between text-xs font-bold"><span>{{ b.quantityRemaining }}</span><span class="text-muted">{{ b.quantityReceived }}</span></div>
                            <div class="progress-bar mini"><div class="progress-fill" [style.width.%]="(b.quantityRemaining/b.quantityReceived)*100"></div></div>
                         </div>
                      </td>
                      <td><span class="badge uppercase text-xs font-black" [ngClass]="'badge-' + (b.status==='Active'?'success':b.status==='Expired'?'danger':'secondary')">{{ b.status }}</span></td>
                      <td class="text-end">
                         <button class="btn btn-icon btn-xs text-danger" (click)="deleteBatch(b.id)"><span class="material-icons-round">delete_outline</span></button>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- STOCK LEVELS -->
    <div *ngIf="tab==='stock'" class="animate-in">
       <div class="card p-0 overflow-hidden">
          <div class="table-container">
             <table class="table">
                <thead>
                   <tr>
                      <th>{{ 'ITEM' | translate }}</th>
                      <th>{{ 'WAREHOUSE' | translate }}</th>
                      <th class="text-center">{{ 'ON_HAND' | translate }}</th>
                      <th class="text-center">{{ 'REORDER' | translate }}</th>
                      <th>{{ 'STATUS' | translate }}</th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let s of stock" class="hover-row">
                      <td class="font-bold">{{ s.itemName }}</td>
                      <td><span class="badge badge-secondary">{{ s.warehouseName }}</span></td>
                      <td class="text-center"><span class="text-xl font-black text-primary">{{ s.quantity }}</span></td>
                      <td class="text-center font-bold text-muted">{{ s.reorderLevel }}</td>
                      <td>
                         <span class="badge" [ngClass]="s.isLowStock ? 'badge-danger animate-pulse' : 'badge-success'">
                            {{ (s.isLowStock ? 'LOW_STOCK' : 'HEALTHY') | translate }}
                         </span>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- WAREHOUSES -->
    <div *ngIf="tab==='warehouses'" class="animate-in grid grid-cols-1 md:grid-cols-3 gap-6">
       <div *ngFor="let w of warehouses" class="warehouse-card">
          <div class="flex justify-between mb-6">
             <div class="w-12 h-12 rounded-2xl bg-primary bg-opacity-10 flex items-center justify-center text-primary shadow-inner">
                <span class="material-icons-round" style="font-size:28px">warehouse</span>
             </div>
             <span class="badge" [ngClass]="w.isActive ? 'badge-success' : 'badge-secondary'">{{ (w.isActive ? 'OPERATIONAL' : 'CLOSED') | translate }}</span>
          </div>
          <h3 class="font-black text-xl mb-1">{{ w.warehouseName }}</h3>
          <p class="text-muted text-sm font-semibold mb-6 flex items-center gap-2"><span class="material-icons-round text-xs">location_on</span> {{ w.location }}</p>
          <div class="flex items-center gap-2">
             <span class="text-xs font-black p-1 px-3 bg-glass border rounded-full uppercase tracking-widest text-primary">{{ w.warehouseCode }}</span>
          </div>
       </div>
       <div class="warehouse-card border-dashed flex flex-col items-center justify-center text-muted cursor-pointer hover:border-primary hover:text-primary transition-all" (click)="showWhForm=true;whForm={}">
          <span class="material-icons-round text-4xl mb-2">add_circle_outline</span>
          <span class="font-bold uppercase tracking-widest text-xs">{{ 'ADD_WAREHOUSE' | translate }}</span>
       </div>
    </div>

    <!-- BARCODE SCANNER -->
    <div *ngIf="tab==='scan'" class="animate-in flex justify-center py-10">
       <div class="w-full max-w-xl">
          <div class="scan-display mb-8">
             <span class="material-icons-round text-6xl text-primary mb-4 opacity-50">barcode_reader</span>
             <h2 class="font-black text-2xl uppercase tracking-tighter mb-6">{{ 'READY_FOR_SCAN' | translate }}</h2>
             <input class="form-control text-2xl font-black text-center h-16 rounded-2xl shadow-inner border-primary border-opacity-30" 
                    [placeholder]="'ENTER_OR_SCAN_CODE' | translate" 
                    [(ngModel)]="scanBarcode" (keyup.enter)="scan()" autofocus>
             <button class="btn btn-primary w-full mt-4 h-14 rounded-2xl shadow-primary font-black uppercase tracking-widest" (click)="scan()">{{ 'IDENTIFY_ITEM' | translate }}</button>
          </div>

          <div class="animate-in" *ngIf="scanResult">
             <div *ngIf="!scanResult.found" class="p-6 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-3xl text-center text-danger font-bold">
                {{ scanResult.errorMessage || ('NOT_FOUND_SYSTEM' | translate) }}
             </div>
             
             <div *ngIf="scanResult.found" class="card p-8 border-primary border-opacity-20 shadow-2xl">
                <div class="flex items-center gap-4 mb-8">
                   <div class="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg"><span class="material-icons-round text-3xl">inventory</span></div>
                   <div>
                      <h4 class="font-black text-2xl m-0">{{ scanResult.batch?.itemName || scanResult.packagingUnit?.itemName }}</h4>
                      <div class="text-xs font-black uppercase text-primary tracking-widest">{{ 'ITEM_IDENTIFIED' | translate }}</div>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                   <div class="p-4 bg-glass border rounded-2xl" *ngIf="scanResult.batch">
                      <div class="text-[0.6rem] font-bold text-muted uppercase mb-1">{{ 'BATCH_ID' | translate }}</div>
                      <div class="font-black text-lg">{{ scanResult.batch.batchNumber }}</div>
                   </div>
                   <div class="p-4 bg-glass border rounded-2xl" *ngIf="scanResult.batch">
                      <div class="text-[0.6rem] font-bold text-muted uppercase mb-1">{{ 'QUANTITY' | translate }}</div>
                      <div class="font-black text-lg text-primary">{{ scanResult.batch.quantityRemaining }} units</div>
                   </div>
                   <div class="p-4 bg-glass border rounded-2xl" *ngIf="scanResult.batch">
                      <div class="text-[0.6rem] font-bold text-muted uppercase mb-1">{{ 'EXPIRY' | translate }}</div>
                      <div class="font-black text-lg text-danger">{{ scanResult.batch.expiryDate | date:'mediumDate' }}</div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- ANALYTICS/REPORTS -->
    <div *ngIf="tab==='reports'" class="animate-in">
       <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="card p-6 glass-success text-center">
             <div class="text-xs font-black uppercase text-success tracking-widest mb-2">{{ 'TOTAL_INVENTORY_VALUE' | translate }}</div>
             <div class="text-3xl font-black text-success">{{ getTotalValuation() | currency }}</div>
          </div>
          <div class="card p-6 glass-danger text-center">
             <div class="text-xs font-black uppercase text-danger tracking-widest mb-2">{{ 'EXPIRED_ITEMS' | translate }}</div>
             <div class="text-3xl font-black text-danger">{{ batches.length }}</div>
          </div>
          <div class="card p-6 glass-primary text-center">
             <div class="text-xs font-black uppercase text-primary tracking-widest mb-2">{{ 'TOTAL_SKU' | translate }}</div>
             <div class="text-3xl font-black text-primary">{{ items.length }}</div>
          </div>
       </div>

       <div class="card p-0 overflow-hidden">
          <div class="p-4 border-bottom bg-glass flex items-center gap-2"><span class="material-icons-round text-primary">history</span> <h3 class="font-black text-lg">{{ 'RECENT_MOVEMENTS'|translate }}</h3></div>
          <div class="table-container">
             <table class="table">
                <thead><tr><th>{{ 'TIMESTAMP'|translate }}</th><th>{{ 'ITEM'|translate }}</th><th>{{ 'TYPE'|translate }}</th><th>{{ 'QUANTITY'|translate }}</th><th>{{ 'WAREHOUSE'|translate }}</th></tr></thead>
                <tbody>
                   <tr *ngFor="let t of transactions" class="hover-row">
                      <td class="text-xs font-mono">{{ t.transactionDate | date:'short' }}</td>
                      <td class="font-bold">{{ t.itemName }}</td>
                      <td><span class="badge font-black text-[0.6rem]" [ngClass]="t.transactionType==='IN'?'badge-success':'badge-danger'">{{ t.transactionType }}</span></td>
                      <td class="font-black">{{ t.quantity }}</td>
                      <td class="text-xs font-bold text-muted">{{ t.warehouseName }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <!-- MODALS (Simplified for speed but keeping high-fidelity inputs) -->
    <!-- ITEM MODAL -->
    <div class="modal-overlay" *ngIf="showItemForm" (click)="showItemForm=false">
       <div class="modal animate-in" (click)="$event.stopPropagation()" style="max-width:650px">
          <div class="modal-header"><h3 class="modal-title font-black uppercase tracking-tighter">{{ 'ITEM_EDITOR'|translate }}</h3><button (click)="showItemForm=false" class="btn-close">×</button></div>
          <div class="modal-body">
             <div class="grid grid-cols-2 gap-4">
                <div class="form-group col-span-2"><label class="form-label font-bold text-xs">{{ 'ITEM_NAME'|translate }}*</label><input class="form-control" [(ngModel)]="itemForm.itemName"></div>
                <div class="form-group"><label class="form-label font-bold text-xs">{{ 'CATEGORY'|translate }}</label><input class="form-control" [(ngModel)]="itemForm.category"></div>
                <div class="form-group"><label class="form-label font-bold text-xs">{{ 'BASE_UNIT'|translate }}</label><input class="form-control" [(ngModel)]="itemForm.unit"></div>
                <div class="form-group"><label class="form-label font-bold text-xs text-primary">{{ 'SALE_PRICE'|translate }}</label><input class="form-control font-black text-primary" type="number" [(ngModel)]="itemForm.salePrice"></div>
                <div class="form-group"><label class="form-label font-bold text-xs text-danger">{{ 'PURCHASE_COST'|translate }}</label><input class="form-control font-black text-danger" type="number" [(ngModel)]="itemForm.purchasePrice"></div>
                <div class="form-group col-span-2 flex items-center gap-3 p-4 bg-glass border rounded-2xl">
                   <input type="checkbox" id="trk-btch" [(ngModel)]="itemForm.trackBatches" style="width:20px;height:20px">
                   <div><label for="trk-btch" class="m-0 font-black cursor-pointer">{{ 'ENABLE_BATCH_TRACKING'|translate }}</label><p class="m-0 text-[0.65rem] text-muted">{{ 'BATCH_TRACKING_DESC'|translate }}</p></div>
                </div>
             </div>
          </div>
          <div class="modal-footer"><button class="btn btn-primary w-full py-4 font-black shadow-primary rounded-2xl" (click)="saveItem()">{{ 'SAVE_CHANGES'|translate }}</button></div>
       </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
   tab = 'items';
   items: any[] = [];
   search = '';
   showItemForm = false;
   itemForm: any = {};
   batches: any[] = [];
   batchSearch = '';
   batchFilterExpired = false;
   batchFilterExhausted = false;
   showBatchForm = false;
   batchForm: any = {};
   stock: any[] = [];
   showTransfer = false;
   transForm: any = {};
   warehouses: any[] = [];
   showWhForm = false;
   whForm: any = {};
   showPkgModal = false;
   pkgItem: any = null;
   pkgUnits: any[] = [];
   pkgForm: any = {};
   scanBarcode = '';
   scanResult: any = null;
   transactions: any[] = [];

   constructor(
      private svc: InventoryService,
      private toast: ToastService,
      private translate: TranslateService,
      private notifService: NotificationService
   ) { }

   ngOnInit() {
      this.loadItems();
      this.loadWarehouses();

      this.notifService.stockUpdate$.subscribe(data => {
         // Refresh relevant data
         if (this.tab === 'stock') this.loadStock();
         if (this.tab === 'batches') this.loadBatches();
         if (this.tab === 'reports') this.loadTransactions();
      });
   }

   loadItems() { this.svc.getItems({ search: this.search }).subscribe(r => this.items = r.items); }
   openItemForm() { this.showItemForm = true; this.itemForm = { trackBatches: false }; }
   editItem(i: any) { this.showItemForm = true; this.itemForm = { ...i }; }
   saveItem() {
      const obs = this.itemForm.id ? this.svc.updateItem(this.itemForm.id, this.itemForm) : this.svc.createItem(this.itemForm);
      obs.subscribe({
         next: () => { this.toast.success(this.translate.instant('SUCCESS_SAVE')); this.showItemForm = false; this.loadItems(); },
         error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
      });
   }

   loadBatches() {
      this.svc.getBatches(
         { search: this.batchSearch },
         { excludeExpired: this.batchFilterExpired || undefined, excludeExhausted: this.batchFilterExhausted || undefined }
      ).subscribe(r => this.batches = r.items);
   }
   openBatchForm() { this.showBatchForm = true; this.batchForm = {}; }
   editBatch(b: any) { this.showBatchForm = true; this.batchForm = { id: b.id, warehouseId: b.warehouseId, quantityRemaining: b.quantityRemaining, status: b.status, notes: b.notes }; }
   saveBatch() {
      const obs = this.batchForm.id ? this.svc.updateBatch(this.batchForm.id, this.batchForm) : this.svc.createBatch(this.batchForm);
      obs.subscribe({
         next: () => { this.toast.success(this.translate.instant('SUCCESS_SAVE')); this.showBatchForm = false; this.loadBatches(); },
         error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
      });
   }
   deleteBatch(id: number) {
      if (!confirm(this.translate.instant('CONFIRM_DELETE'))) return;
      this.svc.deleteBatch(id).subscribe({ next: () => { this.toast.success(this.translate.instant('SUCCESS_DELETE')); this.loadBatches(); }, error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED')) });
   }

   loadStock() { this.svc.getStock().subscribe(s => this.stock = s); }
   transfer() {
      this.svc.transferStock(this.transForm).subscribe({
         next: () => { this.toast.success(this.translate.instant('SUCCESS_SAVE')); this.showTransfer = false; this.loadStock(); },
         error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
      });
   }

   loadWarehouses() { this.svc.getWarehouses().subscribe(w => this.warehouses = w); }
   saveWh() {
      this.svc.createWarehouse(this.whForm).subscribe({
         next: () => { this.toast.success(this.translate.instant('SUCCESS_SAVE')); this.showWhForm = false; this.loadWarehouses(); },
         error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
   }

   openPackagingUnits(item: any) {
      this.pkgItem = item;
      this.pkgForm = { itemId: item.id, unitsPerPackage: 1, baseUnitQty: 1, sortOrder: 0, isBaseUnit: false, salePrice: 0, purchasePrice: 0 };
      this.pkgUnits = [];
      this.showPkgModal = true;
      this.svc.getPackagingUnits(item.id).subscribe(u => this.pkgUnits = u);
   }
   addPkgUnit() {
      this.svc.createPackagingUnit({ ...this.pkgForm, itemId: this.pkgItem.id }).subscribe({
         next: () => {
            this.toast.success(this.translate.instant('SUCCESS_SAVE'));
            this.pkgForm = { itemId: this.pkgItem.id, unitsPerPackage: 1, baseUnitQty: 1, sortOrder: 0, isBaseUnit: false, salePrice: 0, purchasePrice: 0 };
            this.svc.getPackagingUnits(this.pkgItem.id).subscribe(u => this.pkgUnits = u);
         },
         error: (e: any) => this.toast.error(e.error?.message || this.translate.instant('ERROR_OCCURRED'))
      });
   }
   deletePkgUnit(id: number) {
      if (!confirm(this.translate.instant('CONFIRM_DELETE'))) return;
      this.svc.deletePackagingUnit(id).subscribe({
         next: () => { this.toast.success(this.translate.instant('SUCCESS_DELETE')); this.svc.getPackagingUnits(this.pkgItem.id).subscribe(u => this.pkgUnits = u); },
         error: () => this.toast.error(this.translate.instant('ERROR_OCCURRED'))
      });
   }

   scan() {
      if (!this.scanBarcode.trim()) return;
      this.scanResult = null;
      this.svc.scanBarcode(this.scanBarcode.trim()).subscribe({
         next: r => this.scanResult = r,
         error: () => this.scanResult = { found: false, errorMessage: this.translate.instant('SCAN_FAILED') }
      });
   }

   loadTransactions() {
      this.svc.getTransactions().subscribe(t => this.transactions = t);
      this.loadBatches();
      this.loadStock();
   }

   downloadBatchReport() {
      this.svc.downloadBatchReport().subscribe(blob => {
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `Batch_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
         link.click();
      });
   }

   getTotalValuation(): number {
      return this.stock.reduce((sum, s) => sum + (s.quantity * s.purchasePrice), 0);
   }
}
