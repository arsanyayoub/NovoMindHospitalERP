import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuditLogService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-audit-logs',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ 'AUDIT_LOG' | translate }}</h1>
        <p class="page-subtitle">Track all system activities and data changes</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header border-none pb-0">
        <div class="flex items-center gap-4 w-full">
          <div class="search-box flex-1">
            <span class="material-icons-round search-icon">search</span>
            <input type="text" class="search-input" [(ngModel)]="search" (keyup.enter)="loadLogs()" placeholder="Search by user, action or entity...">
          </div>
          <button class="btn btn-secondary btn-icon" (click)="loadLogs()">
             <span class="material-icons-round">refresh</span>
          </button>
        </div>
      </div>

      <div class="table-container mt-4">
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'TIMESTAMP' | translate }}</th>
              <th>{{ 'USER' | translate }}</th>
              <th>{{ 'ACTION' | translate }}</th>
              <th>{{ 'ENTITY' | translate }}</th>
              <th>{{ 'ID' | translate }}</th>
              <th>{{ 'CHANGES' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of logs">
              <td class="whitespace-nowrap">{{ log.timestamp | date:'medium' }}</td>
              <td class="font-bold">{{ log.username }}</td>
              <td>
                 <span class="badge" [ngClass]="getActionClass(log.action)">{{ log.action }}</span>
              </td>
              <td><code>{{ log.entityName }}</code></td>
              <td>{{ log.entityId }}</td>
              <td class="msg-changes" [title]="log.changes">{{ log.changes }}</td>
            </tr>
            <tr *ngIf="logs.length === 0 && !loading">
              <td colspan="6" class="text-center py-8 text-muted">No audit logs found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer" *ngIf="totalCount > pageSize">
         <div class="flex justify-between items-center w-full">
            <span class="text-xs text-muted">Showing {{ logs.length }} of {{ totalCount }} logs</span>
            <div class="flex gap-2">
               <button class="btn btn-sm btn-secondary" [disabled]="page === 1" (click)="prevPage()">Previous</button>
               <button class="btn btn-sm btn-secondary" [disabled]="page * pageSize >= totalCount" (click)="nextPage()">Next</button>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
    .msg-changes {
      max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-family: monospace; font-size: 0.75rem; color: var(--text-secondary);
    }
    code { background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
    .badge-create { background: rgba(16,185,129,0.1); color: #10b981; }
    .badge-update { background: rgba(245,158,11,0.1); color: #f59e0b; }
    .badge-delete { background: rgba(239,68,68,0.1); color: #ef4444; }
    .badge-login { background: rgba(14,165,233,0.1); color: #0ea5e9; }
  `]
})
export class AuditLogsComponent implements OnInit {
    logs: any[] = [];
    loading = false;
    search = '';
    page = 1;
    pageSize = 50;
    totalCount = 0;

    constructor(private service: AuditLogService, private toast: ToastService) { }

    ngOnInit() {
        this.loadLogs();
    }

    loadLogs() {
        this.loading = true;
        this.service.getLogs({ page: this.page, pageSize: this.pageSize, search: this.search }).subscribe({
            next: (res) => {
                this.logs = res.items;
                this.totalCount = res.totalCount;
                this.loading = false;
            },
            error: () => {
                this.toast.error('Failed to load audit logs');
                this.loading = false;
            }
        });
    }

    getActionClass(action: string): string {
        action = action.toLowerCase();
        if (action.includes('create')) return 'badge-create';
        if (action.includes('update')) return 'badge-update';
        if (action.includes('delete')) return 'badge-delete';
        if (action.includes('login')) return 'badge-login';
        return 'badge-secondary';
    }

    nextPage() { this.page++; this.loadLogs(); }
    prevPage() { if (this.page > 1) { this.page--; this.loadLogs(); } }
}
