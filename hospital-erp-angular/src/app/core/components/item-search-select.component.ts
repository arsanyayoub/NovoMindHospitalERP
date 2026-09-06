import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { InventoryService } from '../services/api.services';

export interface PickedItem { id: number; itemName: string; itemCode?: string; itemNameAr?: string; barcode?: string; salePrice?: number; purchasePrice?: number; taxRate?: number; category?: string; }

@Component({
  selector: 'app-item-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="iss-root">
      <div class="iss-search">
        <span class="material-icons-round">search</span>
        <input #box [(ngModel)]="q" (ngModelChange)="onQuery($event)"
          (focus)="open = true"
          [placeholder]="'SEARCH_ITEM_HINT' | translate" />
        <button type="button" class="iss-clear material-icons-round" *ngIf="q" (click)="clear()">close</button>
      </div>

      <div class="iss-selected" *ngIf="current">
        <span class="tag">#{{ current.id }}</span>
        <div class="txt"><span class="nm">{{ current.itemNameAr || current.itemName }}</span>
          <span class="cd">{{ current.itemCode }}<span *ngIf="current.barcode"> · {{ current.barcode }}</span></span></div>
        <button type="button" class="material-icons-round clr" (click)="clear()">highlight_off</button>
      </div>

      <ul class="iss-drop" *ngIf="open && results.length">
        <li *ngFor="let it of results" (click)="choose(it)" [class.active]="current?.id === it.id">
          <div class="row1">
            <span class="nm">{{ it.itemName }}</span>
            <span class="ar" *ngIf="it.itemNameAr && it.itemNameAr !== it.itemName">{{ it.itemNameAr }}</span>
          </div>
          <div class="row2">
            <span class="meta">{{ it.itemCode || '—' }}</span>
            <span class="barcode" *ngIf="it.barcode"><span class="material-icons-round">center_focus_strong</span> {{ it.barcode }}</span>
            <span class="px">{{ (it.salePrice ?? it.purchasePrice ?? 0) | number:'1.0-2' }}</span>
            <span class="tag sm" *ngIf="it.category">{{ it.category }}</span>
          </div>
        </li>
      </ul>
      <div class="iss-empty" *ngIf="open && !loading && q && !results.length">{{ 'No matching items' | translate }}</div>
    </div>`,
  styles: [`
    .iss-root { position: relative; }
    .iss-search { display:flex; align-items:center; gap:6px; border:1px solid var(--border); border-radius:10px; padding:5px 8px; background:var(--card-bg, rgba(0,0,0,.12)); }
    .iss-search input { border:0; outline:0; background:transparent; color:var(--text-primary); flex:1; font-weight:600; min-width:0; }
    .iss-clear{ border:0;background:transparent;color:var(--text-muted);cursor:pointer;font-size:1rem; }
    .iss-drop { position:absolute; top:calc(100% + 4px); left:0; right:0; z-index:60; list-style:none; margin:0; max-height:250px; overflow:auto; background:var(--card-bg-solid, #fff); border:1px solid var(--border); border-radius:12px; padding:6px; box-shadow:0 14px 36px rgba(0,0,0,.28); }
    .iss-drop li { padding:7px 9px; border-radius:9px; cursor:pointer; }
    .iss-drop li:hover, .iss-drop li.active { background: rgba(var(--primary-rgb,.5), .14); }
    .row1 { display:flex; gap:8px; justify-content:space-between; }
    .row1 .nm { font-weight:800; font-size:.84rem; }
    .row1 .ar { font-size:.7rem; color:var(--text-muted); }
    .row2 { display:flex; gap:10px; align-items:center; font-size:.68rem; color:var(--text-muted); margin-top:2px; }
    .barcode { display:flex; align-items:center; gap:3px; }
    .barcode .material-icons-round { font-size:.9rem; }
    .px { margin-left:auto; font-weight:800; }
    .tag { border:1px solid var(--border); border-radius:6px; padding:0 5px; font-weight:700; }
    .iss-selected { display:flex; align-items:center; gap:8px; margin-top:6px; border:1px dashed var(--primary-rgb, #6366f1); border-radius:10px; padding:4px 8px; }
    .iss-selected .txt { display:flex; flex-direction:column; line-height:1.15; flex:1; }
    .iss-selected .cd { font-size:.66rem; color:var(--text-muted); }
    .clr { border:0;background:transparent;color:var(--text-muted);cursor:pointer; }
    .iss-empty { margin-top:4px; font-size:.68rem; color:var(--text-muted); }
  `]
})
export class ItemSearchSelectComponent implements OnInit {
  @Input() category?: string;
  @Input() preselect?: PickedItem | null = null;
  @Output() picked = new EventEmitter<PickedItem | null>();
  q = ''; open = false; loading = false; results: PickedItem[] = [];
  current: PickedItem | null = null;
  private s = new Subject<string>();
  constructor(private inv: InventoryService) {}
  ngOnInit() { this.current = this.preselect ?? null; this.s.pipe(debounceTime(230), distinctUntilChanged()).subscribe(v => this.doSearch(v)); }
  onQuery(v: string) { this.open = true; this.s.next(v); }
  clear() { this.current = null; this.q = ''; this.results = []; this.picked.emit(null); }
  choose(it: PickedItem) { this.current = it; this.picked.emit(it); this.q = ''; this.results = []; this.open = false; }
  private doSearch(term: string) {
    this.loading = true;
    this.inv.getItems({ page: 1, pageSize: 15, search: term || undefined, category: this.category } as any).subscribe({
      next: res => { this.results = res?.items ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
