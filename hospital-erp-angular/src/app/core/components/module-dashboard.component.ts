import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

interface KpiDto { label: string; value: string; hint?: string; }
interface GroupDto { label: string; value: number; secondary?: number; }
interface TrendDto { label: string; value: number; }
interface TableDto { title: string; columns: string[]; rows: string[][]; }
interface DashDto { module: string; title: string; kpis: KpiDto[]; breakdownTitle?: string; breakdown?: GroupDto[]; trendTitle?: string; trend?: TrendDto[]; tables?: TableDto[]; lang: string; }

@Component({
  selector: 'app-module-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
  <div class="mdsh" *ngIf="d">
    <div class="mdsh-head">
      <div>
        <h2 class="mdsh-title">{{ d.title }}</h2>
        <div class="range">
          <label>{{ 'FROM' | translate }}</label>
          <input type="date" [(ngModel)]="from" (ngModelChange)="load()">
          <label>{{ 'TO' | translate }}</label>
          <input type="date" [(ngModel)]="to" (ngModelChange)="load()">
        </div>
      </div>
      <div class="acts">
        <button class="btn ghost" (click)="print()"><span class="material-icons-round">print</span>{{ 'PRINT' | translate }}</button>
        <button class="btn ghost" (click)="csv()"><span class="material-icons-round">download</span>CSV</button>
        <button class="btn ghost" (click)="pdf()"><span class="material-icons-round">picture_as_pdf</span>PDF</button>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi" *ngFor="let k of d.kpis">
        <div class="kl">{{ k.label }}</div>
        <div class="kv">{{ k.value }}</div>
        <div class="kh" *ngIf="k.hint">{{ k.hint }}</div>
      </div>
    </div>

    <div class="two" *ngIf="d.breakdown?.length || d.trend?.length">
      <section class="card" *ngIf="d.breakdown?.length">
        <h3>{{ d.breakdownTitle }}</h3>
        <table class="mini">
          <tr *ngFor="let g of d.breakdown">
            <td class="lbl">{{ g.label }}</td>
            <td>
              <div class="bar"><span [style.width.%]="g.value / max(d.breakdown!) * 100"></span></div>
            </td>
            <td class="val">{{ g.value | number:'1.0-2' }}</td>
            <td class="val2" *ngIf="g.secondary != null">{{ g.secondary | number:'1.0-2' }}</td>
          </tr>
        </table>
      </section>
      <section class="card" *ngIf="d.trend?.length">
        <h3>{{ d.trendTitle }}</h3>
        <table class="mini">
          <tr *ngFor="let t of d.trend">
            <td class="lbl">{{ t.label }}</td>
            <td><div class="bar"><span [style.width.%]="t.value / max(d.trend!) * 100"></span></div></td>
            <td class="val">{{ t.value | number:'1.0-2' }}</td>
          </tr>
        </table>
      </section>
    </div>

    <section class="card" *ngFor="let tb of d.tables">
      <h3>{{ tb.title }}</h3>
      <div class="scroll">
        <table>
          <thead><tr><th *ngFor="let c of tb.columns">{{ c }}</th></tr></thead>
          <tbody><tr *ngFor="let r of tb.rows"><td *ngFor="let cell of r">{{ cell }}</td></tr></tbody>
        </table>
      </div>
    </section>

    <div class="empty" *ngIf="!d.kpis.length">{{ 'No data in selected period' | translate }}</div>
  </div>
  <div class="load" *ngIf="!d && !err"><span class="material-icons-round spin">sync</span>{{ 'LOADING_ANALYTICS' | translate }}</div>
  <div class="load err" *ngIf="err">{{ err }}</div>`,
  styles: [`
  .mdsh { display:flex; flex-direction:column; gap:14px; }
  .mdsh-head { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; }
  .mdsh-title { margin:0; font-size:1.05rem; font-weight:900; }
  .range { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:.72rem; color:var(--text-muted); }
  .range input { background:transparent; color:var(--text-primary); border:1px solid var(--border); border-radius:8px; padding:3px 6px; }
  .acts { display:flex; gap:6px; }
  .btn.ghost { display:inline-flex; align-items:center; gap:5px; border:1px solid var(--border); background:transparent; color:var(--text-primary); border-radius:9px; padding:7px 11px; cursor:pointer; font-size:.72rem; font-weight:800; }
  .btn.ghost:hover { background:rgba(var(--primary-rgb),.12); }
  .btn.ghost .material-icons-round { font-size:1rem; }
  .kpis { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:8px; }
  .kpi { background:var(--border); border-radius:12px; padding:9px 11px; border:1px solid var(--border); }
  .kl { font-size:.62rem; font-weight:900; text-transform:uppercase; color:var(--text-muted); }
  .kv { font-weight:900; font-size:1.05rem; margin-top:2px; }
  .kh { font-size:.6rem; color:var(--text-muted); }
  .two { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  @media(max-width:900px){ .two{ grid-template-columns:1fr; } }
  .card { border:1px solid var(--border); border-radius:14px; padding:10px 12px; }
  .card h3 { margin:0 0 8px; font-size:.78rem; text-transform:uppercase; letter-spacing:.4px; color:var(--text-muted); }
  .mini { width:100%; border-collapse:collapse; font-size:.73rem; }
  .mini td { padding:3px 4px; vertical-align:middle; }
  .lbl { width:32%; color:var(--text-muted); font-weight:700; }
  .val { width:12%; text-align:right; font-weight:800; white-space:nowrap; }
  .val2 { width:12%; text-align:right; color:var(--text-muted); }
  .bar { height:8px; background:rgba(var(--primary-rgb),.18); border-radius:99px; overflow:hidden; }
  .bar>span { display:block; height:100%; background:var(--primary); border-radius:99px; min-width:2px; }
  table { width:100%; border-collapse:collapse; font-size:.68rem; }
  th { text-align:start; padding:4px 6px; border-bottom:1px solid var(--border); opacity:.75; }
  td { padding:3px 6px; border-bottom:1px solid rgba(var(--primary-rgb),.08); white-space:nowrap; }
  .scroll { max-height:240px; overflow:auto; }
  .empty { color:var(--text-muted); font-size:.75rem; }
  .load { display:flex; gap:8px; align-items:center; color:var(--text-muted); font-size:.8rem; }
  .err { color:#ff6b6b; }
  .spin { animation:sp 1s linear infinite; }
  @keyframes sp { to { transform:rotate(360deg);} }
  `]
})
export class ModuleDashboardComponent implements OnInit, OnChanges {
  @Input() name = 'patients';
  d: DashDto | null = null; err = ''; from = ''; to = '';
  private _ready = false;
  constructor(private http: HttpClient, private tr: TranslateService) {}
  get lang() { return this.tr.currentLang || this.tr.getDefaultLang() || 'en'; }
  ngOnChanges(ch: SimpleChanges) { if (ch['name'] && this._ready && this.d) { this.d = null; this.load(); } if (ch['name'] && this._ready && !this.d) this.load(); }
  ngOnInit() {
    const t = new Date(); const f = new Date(); f.setMonth(f.getMonth() - 12);
    this.from = f.toISOString().slice(0, 10); this.to = t.toISOString().slice(0, 10);
    this.tr.onLangChange.subscribe(() => { this.d = null; this.load(); });
    this._ready = true;
    this.load();
  }
  private qs() { return `from=${this.from}&to=${this.to}&lang=${this.lang}`; }
  load() {
    this.err = '';
    this.http.get<DashDto>(`${environment.apiUrl}/Reporting/module/${this.name}/dashboard?${this.qs()}`)
      .subscribe({ next: d => this.d = d, error: () => this.err = 'Failed to load report' });
  }
  max(a: { value: number }[]) { return Math.max(1, ...a.map(x => Math.abs(x.value))); }
  print() {
    const w = window.open('', '_blank'); if (!w) return;
    const dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    const html = document.querySelector('.mdsh')?.outerHTML || '';
    w.document.write(`<html dir="${dir}" lang="${this.lang}"><head><title>${this.d?.title ?? ''}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&family=Inter:wght@600;800&display=swap" rel="stylesheet"><style>body{font-family:${this.lang === 'ar' ? 'Cairo' : 'Inter'};font-size:12px}.kpi{border:1px solid #ccc;border-radius:8px;padding:6px 9px;display:inline-block;margin:3px}.kv{font-weight:800;font-size:15px}.bar{height:6px;background:#eee}.bar span{display:block;background:#6366f1;height:100%}table{border-collapse:collapse;width:100%;font-size:11px}td,th{border-bottom:1px solid #ddd;padding:3px 6px;text-align:${this.lang === 'ar' ? 'right' : 'left'}}</style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 400);
  }
  csv() { this.dl('csv'); } pdf() { this.dl('pdf'); }
  private dl(kind: 'csv' | 'pdf') {
    this.http.get(`${environment.apiUrl}/Reporting/module/${this.name}/${kind}?${this.qs()}`, { responseType: 'blob' })
      .subscribe(b => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(b);
        a.download = `Report_${this.name}.${kind}`; a.click(); URL.revokeObjectURL(a.href);
      });
  }
}
