import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="bg-gradient"></div>
        <div class="bg-shapes">
          <div class="shape shape1"></div>
          <div class="shape shape2"></div>
          <div class="shape shape3"></div>
        </div>
      </div>

      <div class="login-card animate-slide-up">
        <div class="login-header">
          <div class="logo-wrapper">
            <span class="material-icons-round logo-icon">local_hospital</span>
          </div>
          <h1>{{ 'APP_NAME' | translate }}</h1>
          <p class="text-muted">{{ 'LOGIN' | translate }}</p>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="alert alert-danger" *ngIf="error">
            <span class="material-icons-round">error</span>
            {{ error }}
          </div>

          <div class="form-group">
            <label class="form-label">{{ 'USERNAME' | translate }}</label>
            <div class="input-with-icon">
              <span class="material-icons-round input-icon">person</span>
              <input type="text" class="form-control" [(ngModel)]="username" name="username"
                     placeholder="admin" required autocomplete="username">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ 'PASSWORD' | translate }}</label>
            <div class="input-with-icon">
              <span class="material-icons-round input-icon">lock</span>
              <input [type]="showPassword ? 'text' : 'password'" class="form-control"
                     [(ngModel)]="password" name="password" placeholder="••••••••"
                     required autocomplete="current-password">
              <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                <span class="material-icons-round">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            <span class="spinner spinner-sm" *ngIf="loading"></span>
            <span *ngIf="!loading">{{ 'LOGIN' | translate }}</span>
          </button>
        </form>

        <div class="login-footer">
          <button class="lang-toggle" (click)="langService.toggleLanguage()">
            <span class="material-icons-round">translate</span>
            {{ langService.getCurrentLang() === 'en' ? 'العربية' : 'English' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 20px; position: relative; overflow: hidden;
    }
    .login-bg { position: fixed; inset: 0; z-index: 0; }
    .bg-gradient {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 50%),
                  var(--bg-body);
    }
    .bg-shapes { position: absolute; inset: 0; overflow: hidden; }
    .shape {
      position: absolute; border-radius: 50%; opacity: 0.03;
      background: linear-gradient(135deg, var(--primary), var(--accent));
    }
    .shape1 { width: 400px; height: 400px; top: -100px; right: -100px; animation: float 12s ease-in-out infinite; }
    .shape2 { width: 300px; height: 300px; bottom: -50px; left: -50px; animation: float 15s ease-in-out infinite reverse; }
    .shape3 { width: 200px; height: 200px; top: 40%; left: 60%; animation: float 10s ease-in-out infinite; }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    .login-card {
      position: relative; z-index: 1;
      background: rgba(26,29,46,0.8); backdrop-filter: blur(20px);
      border: 1px solid var(--border); border-radius: 24px;
      padding: 48px 40px; width: 100%; max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .login-header { text-align: center; margin-bottom: 36px; }
    .logo-wrapper {
      width: 64px; height: 64px; margin: 0 auto 16px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 18px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(99,102,241,0.3);
    }
    .logo-icon { font-size: 32px; color: white; }
    .login-header h1 { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
    .login-header p { font-size: 0.9rem; }

    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .input-with-icon { position: relative; }
    .input-with-icon .form-control { padding-inline-start: 42px; padding-inline-end: 42px; }
    .input-icon { position: absolute; top: 50%; inset-inline-start: 12px; transform: translateY(-50%); color: var(--text-muted); font-size: 20px; }
    .toggle-pass {
      position: absolute; top: 50%; inset-inline-end: 10px; transform: translateY(-50%);
      background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px;
    }
    .toggle-pass:hover { color: var(--text-primary); }

    .login-footer { text-align: center; margin-top: 24px; }
    .lang-toggle {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1px solid var(--border); border-radius: 8px;
      padding: 6px 14px; color: var(--text-secondary); cursor: pointer;
      font-family: var(--font-family); font-size: 0.8rem; transition: var(--transition);
    }
    .lang-toggle:hover { border-color: var(--primary); color: var(--primary-light); }
    .lang-toggle .material-icons-round { font-size: 16px; }

    .w-full { width: 100%; justify-content: center; }
  `]
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    loading = false;
    showPassword = false;

    constructor(
        private auth: AuthService,
        private router: Router,
        public langService: LanguageService
    ) {
        if (auth.isLoggedIn) this.router.navigate(['/dashboard']);
    }

    login() {
        if (!this.username || !this.password) { this.error = 'Please enter username and password'; return; }
        this.loading = true;
        this.error = '';
        this.auth.login({ username: this.username, password: this.password }).subscribe({
            next: () => { this.router.navigate(['/dashboard']); },
            error: (err) => { this.loading = false; this.error = err.error?.message || 'Invalid credentials'; }
        });
    }
}
