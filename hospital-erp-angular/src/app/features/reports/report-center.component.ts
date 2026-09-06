import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { ModuleDashboardComponent } from '../../core/components/module-dashboard.component';

@Component({
  selector: 'app-report-center',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModuleDashboardComponent],
  template: `
    <div class="rc">
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="material-icons-round">query_stats</span> {{ 'REPORT_CENTER' | translate }}</h1>
          <p class="page-subtitle">{{ 'REPORT_CENTER_HINT' | translate }}</p>
        </div>
      </div>
      <div class="bar">
        <label class="lbl">{{ 'SELECT_MODULE' | translate }}</label>
        <select class="sel" [(ngModel)]="current" (ngModelChange)="name = current">
          <option *ngFor="let m of modules" [value]="m">{{ label(m) }}</option>
        </select>
      </div>
      <app-module-dashboard [name]="name" />
    </div>`,
  styles: [`
    .rc { padding: 2px; }
    .page-title { display:flex; align-items:center; gap:8px; }
    .bar { display:flex; align-items:center; gap:10px; margin: 6px 0 14px; }
    .lbl { font-size:.7rem; text-transform:uppercase; font-weight:800; color: var(--text-muted); }
    .sel { min-width: 280px; padding: 9px 12px; border-radius: 10px; border:1px solid var(--border); background: var(--card-bg, rgba(0,0,0,.12)); color: var(--text-primary); font-weight:700; }
  `]
})
export class ReportCenterComponent implements OnInit {
  modules: string[] = [];
  current = 'patients'; name = 'patients';
  constructor(private http: HttpClient, private tr: TranslateService) {}
  ngOnInit() {
    this.http.get<string[]>(`${environment.apiUrl}/Reporting/modules`).subscribe(ms => {
      this.modules = ms ?? []; if (this.modules.length) { this.current = this.modules[0]; this.name = this.modules[0]; }
    });
  }
  private AR: Record<string, string> = { patients:'المرضى', appointments:'المواعيد', invoices:'الفواتير', accounting:'المحاسبة', expenses:'المصروفات', inventory:'المخزون', purchases:'المشتريات', sales:'المبيعات', hr:'شئون العاملين', attendance:'الحضور', payroll:'الرواتب', leave:'الإجازات', lab:'المعمل', radiology:'الأشعة', pharmacy:'الصيدلية', clinical:'سريري', mar:'سجل إعطاء الدواء', beds:'إدارة الأسرّة', ot:'غ العمليات', inpatient:'فواتير التنويم', insurance:'التأمين والهيئات', emergency:'الطوارئ', bloodbank:'بنك الدم', maternity:'نساء/حضانة', dental:'الأسنان', physiotherapy:'العلاج الطبيعي', dietary:'التغذية', fleet:'الأسطول', housekeeping:'المساندة', laundry:'المغسلة', quality:'الجودة', referrals:'التحويلات', cssd:'التعقيم', mortuary:'المشرحة', telehealth:'عن بُعد', messaging:'الرسائل', notifications:'الإشعارات', users:'المستخدمون', roles:'الأدوار', assets:'الأصول', maintenance:'الصيانة', audit:'سجل التدقيق' };
  label(m: string) {
    const pretty = m.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return (this.tr.currentLang === 'ar' && this.AR[m]) ? this.AR[m] : pretty;
  }
}
