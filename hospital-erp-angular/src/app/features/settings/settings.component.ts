import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/language.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'SETTINGS' | translate }}</h1>
        <p class="page-subtitle">{{ 'ACCOUNT_SETTINGS' | translate }}</p>
      </div>
    </div>

    <div class="settings-layout">
      <!-- Sidebar Tabs -->
      <div class="settings-sidebar">
        <button class="settings-tab" [class.active]="tab === 'profile'" (click)="tab='profile'">
          <span class="material-icons-round">person</span>
          <span>{{ 'PROFILE' | translate }}</span>
        </button>
        <button class="settings-tab" [class.active]="tab === 'password'" (click)="tab='password'">
          <span class="material-icons-round">lock</span>
          <span>{{ 'CHANGE_PASSWORD' | translate }}</span>
        </button>
        <button class="settings-tab" [class.active]="tab === 'system'" (click)="tab='system'">
          <span class="material-icons-round">tune</span>
          <span>{{ 'SYSTEM_SETTINGS' | translate }}</span>
        </button>
      </div>

      <!-- Content Area -->
      <div class="settings-content animate-fade-in">

        <!-- Profile Tab -->
        <div *ngIf="tab === 'profile'">
          <!-- Profile Card -->
          <div class="profile-hero card mb-4">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar">{{ auth.currentUser?.fullName?.charAt(0) || 'A' }}</div>
              <div class="profile-avatar-overlay">
                <span class="material-icons-round">photo_camera</span>
              </div>
            </div>
            <div class="profile-info">
              <h2 class="profile-name">{{ auth.currentUser?.fullName }}</h2>
              <div class="profile-meta">
                <span class="badge badge-primary">
                  <span class="material-icons-round" style="font-size:12px">shield</span>
                  {{ auth.currentUser?.role }}
                </span>
                <span class="text-muted text-sm">@{{ auth.currentUser?.username }}</span>
              </div>
              <div class="profile-stats mt-4">
                <div class="profile-stat">
                  <span class="material-icons-round" style="color:var(--primary-light)">email</span>
                  <span>{{ auth.currentUser?.username }}</span>
                </div>
                <div class="profile-stat">
                  <span class="material-icons-round" style="color:var(--success)">verified_user</span>
                  <span>ID: {{ auth.currentUser?.userId }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <div class="card">
            <h3 class="mb-4" style="display:flex;align-items:center;gap:8px">
              <span class="material-icons-round" style="color:var(--primary-light)">edit</span>
              Edit Profile
            </h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ 'FULL_NAME' | translate }}</label>
                <input class="form-control" [(ngModel)]="profileForm.fullName" [placeholder]="'FULL_NAME' | translate">
              </div>
              <div class="form-group">
                <label class="form-label">{{ 'EMAIL' | translate }}</label>
                <input class="form-control" type="email" [(ngModel)]="profileForm.email" [placeholder]="'EMAIL' | translate">
              </div>
            </div>
            <div class="form-row mt-4">
              <div class="form-group">
                <label class="form-label">{{ 'PHONE' | translate }}</label>
                <input class="form-control" [(ngModel)]="profileForm.phoneNumber" [placeholder]="'PHONE' | translate">
              </div>
              <div class="form-group">
                <label class="form-label">{{ 'USERNAME' | translate }}</label>
                <input class="form-control" [(ngModel)]="profileForm.username" disabled style="opacity:0.5;cursor:not-allowed">
              </div>
            </div>
            <div class="modal-footer" style="padding:16px 0 0">
              <button class="btn btn-primary" (click)="saveProfile()" [disabled]="saving">
                <span class="material-icons-round" *ngIf="!saving">save</span>
                <div class="spinner-sm" *ngIf="saving"></div>
                {{ 'SAVE' | translate }}
              </button>
            </div>
          </div>
        </div>

        <!-- Password Tab -->
        <div *ngIf="tab === 'password'">
          <div class="card">
            <h3 class="mb-4" style="display:flex;align-items:center;gap:8px">
              <span class="material-icons-round" style="color:var(--primary-light)">lock_reset</span>
              {{ 'CHANGE_PASSWORD' | translate }}
            </h3>

            <div class="password-strength-info mb-4 alert alert-info">
              <span class="material-icons-round">info</span>
              <span>Use at least 8 characters with a mix of letters, numbers and symbols for a strong password.</span>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ 'CURRENT_PASSWORD' | translate }}</label>
              <div class="input-password">
                <input class="form-control" [type]="showCurrent ? 'text' : 'password'" [(ngModel)]="pwForm.currentPassword" autocomplete="current-password">
                <button class="pw-toggle" (click)="showCurrent = !showCurrent">
                  <span class="material-icons-round">{{ showCurrent ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
            <div class="form-group mb-4">
              <label class="form-label">{{ 'NEW_PASSWORD' | translate }}</label>
              <div class="input-password">
                <input class="form-control" [type]="showNew ? 'text' : 'password'" [(ngModel)]="pwForm.newPassword" autocomplete="new-password" (input)="checkStrength()">
                <button class="pw-toggle" (click)="showNew = !showNew">
                  <span class="material-icons-round">{{ showNew ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <div class="strength-bar mt-2" *ngIf="pwForm.newPassword">
                <div class="strength-fill" [style.width.%]="strength * 25" [class]="strengthClass"></div>
              </div>
              <span class="text-xs mt-1" [ngClass]="strengthClass" *ngIf="pwForm.newPassword">{{ strengthLabel }}</span>
            </div>
            <div class="form-group mb-4">
              <label class="form-label">{{ 'CONFIRM_PASSWORD' | translate }}</label>
              <div class="input-password">
                <input class="form-control" [type]="showConfirm ? 'text' : 'password'" [(ngModel)]="pwForm.confirmPassword" autocomplete="new-password">
                <button class="pw-toggle" (click)="showConfirm = !showConfirm">
                  <span class="material-icons-round">{{ showConfirm ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <span class="text-xs mt-1 text-danger"
                *ngIf="pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword">
                {{ 'PASSWORDS_DONT_MATCH' | translate }}
              </span>
            </div>
            <div class="modal-footer" style="padding:0">
              <button class="btn btn-primary" (click)="changePassword()"
                [disabled]="!pwForm.currentPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmPassword || saving">
                <span class="material-icons-round" *ngIf="!saving">lock_reset</span>
                <div class="spinner-sm" *ngIf="saving"></div>
                {{ 'CHANGE_PASSWORD' | translate }}
              </button>
            </div>
          </div>
        </div>

        <!-- System Settings Tab -->
        <div *ngIf="tab === 'system'">
          <div class="card mb-4">
            <h3 class="mb-4" style="display:flex;align-items:center;gap:8px">
              <span class="material-icons-round" style="color:var(--primary-light)">palette</span>
              {{ 'APPEARANCE' | translate }}
            </h3>
            <div class="setting-row">
              <div>
                <div class="font-semibold">Dark Mode</div>
                <div class="text-sm text-muted">Always-on dark interface (cannot be changed)</div>
              </div>
              <div class="toggle-pill active">
                <span class="material-icons-round" style="font-size:16px;color:var(--success)">check</span>
                Enabled
              </div>
            </div>
            <div class="divider"></div>
            <div class="setting-row">
              <div>
                <div class="font-semibold">Language</div>
                <div class="text-sm text-muted">Interface language and text direction (RTL/LTR)</div>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm" [class.btn-primary]="lang === 'en'" [class.btn-secondary]="lang !== 'en'" (click)="setLang('en')">EN</button>
                <button class="btn btn-sm" [class.btn-primary]="lang === 'ar'" [class.btn-secondary]="lang !== 'ar'" (click)="setLang('ar')">عربي</button>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="mb-4" style="display:flex;align-items:center;gap:8px">
              <span class="material-icons-round" style="color:var(--primary-light)">info</span>
              System Information
            </h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Application</span>
                <span class="info-value">Hospital ERP v2.0</span>
              </div>
              <div class="info-item">
                <span class="info-label">Backend</span>
                <span class="info-value">.NET 8 / ASP.NET Core</span>
              </div>
              <div class="info-item">
                <span class="info-label">Frontend</span>
                <span class="info-value">Angular 17 (Standalone)</span>
              </div>
              <div class="info-item">
                <span class="info-label">Database</span>
                <span class="info-value">SQL Server + EF Core</span>
              </div>
              <div class="info-item">
                <span class="info-label">Real-time</span>
                <span class="info-value">SignalR</span>
              </div>
              <div class="info-item">
                <span class="info-label">Auth</span>
                <span class="info-value">JWT Bearer Tokens</span>
              </div>
            </div>
          </div>

          <div class="card" *ngIf="auth.hasRole('Admin')">
            <h3 class="mb-4" style="display:flex;align-items:center;gap:8px">
              <span class="material-icons-round" style="color:var(--warning)">admin_panel_settings</span>
              Admin Tools
            </h3>
            <div class="setting-row">
              <div>
                <div class="font-semibold">Clear Local Cache</div>
                <div class="text-sm text-muted">Clears stored user session data</div>
              </div>
              <button class="btn btn-sm btn-danger" (click)="clearCache()">
                <span class="material-icons-round" style="font-size:16px">delete_sweep</span>
                Clear
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .settings-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 768px) {
      .settings-layout { grid-template-columns: 1fr; }
      .settings-sidebar { display: flex; gap: 8px; overflow-x: auto; }
    }

    .settings-sidebar { display: flex; flex-direction: column; gap: 4px; }
    .settings-tab {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 12px;
      border: none; background: none; color: var(--text-secondary);
      font-family: var(--font-family); font-size: 0.875rem; font-weight: 500;
      cursor: pointer; width: 100%; text-align: start;
      transition: var(--transition); white-space: nowrap;
    }
    .settings-tab:hover { background: rgba(99,102,241,0.08); color: var(--text-primary); }
    .settings-tab.active { background: rgba(99,102,241,0.15); color: var(--primary-light); font-weight: 700; }
    .settings-tab .material-icons-round { font-size: 20px; }

    /* Profile Hero */
    .profile-hero { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
    .profile-avatar-wrap { position: relative; flex-shrink: 0; }
    .profile-avatar {
      width: 80px; height: 80px; border-radius: 20px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800;
    }
    .profile-avatar-overlay {
      position: absolute; inset: 0; border-radius: 20px;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; opacity: 0; transition: var(--transition); cursor: pointer;
    }
    .profile-avatar-wrap:hover .profile-avatar-overlay { opacity: 1; }
    .profile-name { font-size: 1.5rem; font-weight: 800; }
    .profile-meta { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
    .profile-stats { display: flex; gap: 20px; flex-wrap: wrap; }
    .profile-stat { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--text-secondary); }

    /* Password */
    .input-password { position: relative; }
    .pw-toggle {
      position: absolute; inset-inline-end: 12px; top: 50%; transform: translateY(-50%);
      border: none; background: none; color: var(--text-muted); cursor: pointer;
      display: flex; padding: 0;
    }
    .pw-toggle:hover { color: var(--text-primary); }

    .strength-bar { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 2px; transition: width 0.4s, background 0.4s; }
    .strength-fill.text-danger { background: var(--danger); }
    .strength-fill.text-warning { background: var(--warning); }
    .strength-fill.text-success { background: var(--success); }
    .strength-fill.text-info { background: var(--info); }

    /* System */
    .setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .toggle-pill {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
    }
    .toggle-pill.active { background: rgba(16,185,129,0.1); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .info-value { font-weight: 600; color: var(--text-primary); }
  `]
})
export class SettingsComponent implements OnInit {
    tab = 'profile';
    saving = false;
    lang = 'en';
    showCurrent = false; showNew = false; showConfirm = false;
    strength = 0;
    strengthClass = '';
    strengthLabel = '';

    profileForm: any = {};
    pwForm: any = { currentPassword: '', newPassword: '', confirmPassword: '' };

    constructor(
        public auth: AuthService,
        private http: HttpClient,
        private toast: ToastService
    ) { }

    ngOnInit() {
        const u = this.auth.currentUser;
        this.profileForm = { fullName: u?.fullName, email: '', phoneNumber: '', username: u?.username };
        this.lang = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
    }

    saveProfile() {
        this.saving = true;
        this.http.put(`${environment.apiUrl}/auth/profile`, this.profileForm).subscribe({
            next: () => { this.toast.success('Profile updated'); this.saving = false; },
            error: () => { this.toast.error('Failed to update profile'); this.saving = false; }
        });
    }

    changePassword() {
        if (this.pwForm.newPassword !== this.pwForm.confirmPassword) {
            this.toast.error('Passwords do not match'); return;
        }
        this.saving = true;
        this.http.post(`${environment.apiUrl}/auth/change-password`, {
            currentPassword: this.pwForm.currentPassword,
            newPassword: this.pwForm.newPassword
        }).subscribe({
            next: () => {
                this.toast.success('Password changed successfully');
                this.pwForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
                this.saving = false;
            },
            error: (e: any) => { this.toast.error(e.error?.message || 'Failed to change password'); this.saving = false; }
        });
    }

    checkStrength() {
        const pw = this.pwForm.newPassword;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        this.strength = score;
        if (score <= 1) { this.strengthClass = 'text-danger'; this.strengthLabel = 'Weak'; }
        else if (score === 2) { this.strengthClass = 'text-warning'; this.strengthLabel = 'Fair'; }
        else if (score === 3) { this.strengthClass = 'text-info'; this.strengthLabel = 'Good'; }
        else { this.strengthClass = 'text-success'; this.strengthLabel = 'Strong'; }
    }

    setLang(lang: string) {
        this.lang = lang;
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('lang', lang);
        location.reload();
    }

    clearCache() {
        const token = this.auth.token;
        localStorage.clear();
        if (token) localStorage.setItem('auth_user', JSON.stringify(this.auth.currentUser));
        this.toast.success('Cache cleared');
    }
}
