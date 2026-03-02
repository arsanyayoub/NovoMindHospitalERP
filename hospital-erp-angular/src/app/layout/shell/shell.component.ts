import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/language.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <!-- Sidebar -->
    <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
      <div class="sidebar-brand">
        <span class="material-icons-round brand-icon">local_hospital</span>
        <span class="brand-text" *ngIf="!sidebarCollapsed">{{ 'APP_NAME' | translate }}</span>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [title]="item.label | translate">
          <span class="material-icons-round nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!sidebarCollapsed">{{ item.label | translate }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item" (click)="auth.logout()">
          <span class="material-icons-round nav-icon">logout</span>
          <span class="nav-label" *ngIf="!sidebarCollapsed">{{ 'LOGOUT' | translate }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper" [class.sidebar-collapsed]="sidebarCollapsed">
      <!-- Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="btn-icon toggle-btn" (click)="sidebarCollapsed = !sidebarCollapsed">
            <span class="material-icons-round">{{ sidebarCollapsed ? 'menu' : 'menu_open' }}</span>
          </button>
          <div class="welcome-text">
            <span class="text-muted text-sm">{{ 'WELCOME' | translate }},</span>
            <span class="font-semibold">{{ auth.currentUser?.fullName }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Language Toggle -->
          <button class="header-btn" (click)="langService.toggleLanguage()" title="Toggle Language">
            <span class="material-icons-round">translate</span>
            <span class="btn-label">{{ langService.getCurrentLang() === 'en' ? 'العربية' : 'EN' }}</span>
          </button>

          <!-- Notifications -->
          <button class="header-btn notification-btn" (click)="showNotifications = !showNotifications">
            <span class="material-icons-round">notifications</span>
            <span class="notif-badge" *ngIf="(notificationService.unreadCount$ | async) as count">
              {{ count > 9 ? '9+' : count }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="user-avatar">
            {{ auth.currentUser?.fullName?.charAt(0) || 'A' }}
          </div>
        </div>
      </header>

      <!-- Notifications Panel -->
      <div class="notification-panel" *ngIf="showNotifications" (click)="$event.stopPropagation()">
        <div class="notif-header">
          <h4>{{ 'NOTIFICATIONS' | translate }}</h4>
          <button class="btn btn-sm btn-secondary" (click)="markAllRead()">{{ 'MARK_ALL_READ' | translate }}</button>
        </div>
        <div class="notif-list">
          <div *ngFor="let n of (notificationService.notifications$ | async)"
               class="notif-item" [class.unread]="!n.isRead" (click)="readNotif(n)">
            <span class="material-icons-round notif-type-icon" [ngClass]="getNotifClass(n.notificationType)">
              {{ getNotifIcon(n.notificationType) }}
            </span>
            <div class="notif-content">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-msg">{{ n.message }}</div>
              <div class="notif-time">{{ n.createdDate | date:'short' }}</div>
            </div>
          </div>
          <div class="empty-state" *ngIf="(notificationService.notifications$ | async)?.length === 0">
            <span class="material-icons-round empty-icon">notifications_off</span>
            <span class="text-muted text-sm">{{ 'NO_NOTIFICATIONS' | translate }}</span>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="page-content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Toasts -->
    <div class="toast-container">
      <div *ngFor="let t of toastService.toasts" class="toast" [ngClass]="t.type">
        <span class="material-icons-round">{{ t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info' }}</span>
        <span>{{ t.message }}</span>
        <button class="toast-close" (click)="toastService.remove(t.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; min-height: 100vh; }

    /* ── Sidebar ──────────────────────────── */
    .sidebar {
      position: fixed; top: 0; bottom: 0; inset-inline-start: 0;
      width: var(--sidebar-width); background: var(--bg-sidebar);
      border-inline-end: 1px solid var(--border);
      display: flex; flex-direction: column; z-index: 100;
      transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
      overflow: hidden;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed); }
    .sidebar-brand {
      height: var(--header-height); display: flex; align-items: center;
      gap: 12px; padding: 0 20px; border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .brand-icon { font-size: 28px; color: var(--primary-light); }
    .brand-text { font-size: 1rem; font-weight: 800; white-space: nowrap;
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
    .sidebar-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: 10px; cursor: pointer;
      color: var(--text-secondary); transition: var(--transition);
      border: none; background: none; width: 100%; text-align: start;
      font-family: var(--font-family); font-size: 0.875rem;
      text-decoration: none; white-space: nowrap;
    }
    .nav-item:hover { background: rgba(99,102,241,0.08); color: var(--text-primary); }
    .nav-item.active { background: rgba(99,102,241,0.12); color: var(--primary-light); font-weight: 600; }
    .nav-item.active .nav-icon { color: var(--primary-light); }
    .nav-icon { font-size: 20px; flex-shrink: 0; }
    .nav-label { overflow: hidden; text-overflow: ellipsis; }

    /* ── Main ──────────────────────────────── */
    .main-wrapper {
      margin-inline-start: var(--sidebar-width);
      flex: 1; display: flex; flex-direction: column;
      transition: margin 0.25s cubic-bezier(0.4,0,0.2,1);
      min-height: 100vh;
    }
    .main-wrapper.sidebar-collapsed { margin-inline-start: var(--sidebar-collapsed); }

    /* ── Header ─────────────────────────────── */
    .top-header {
      height: var(--header-height); display: flex; align-items: center;
      justify-content: space-between; padding: 0 24px;
      background: rgba(15,17,23,0.8); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 50;
    }
    .header-left, .header-right { display: flex; align-items: center; gap: 12px; }
    .toggle-btn {
      width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--border);
      background: var(--bg-card); color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: var(--transition);
    }
    .toggle-btn:hover { color: var(--primary-light); border-color: var(--primary); }
    .welcome-text { display: flex; flex-direction: column; line-height: 1.3; }
    .header-btn {
      display: flex; align-items: center; gap: 6px; padding: 8px 14px;
      border-radius: 10px; border: 1px solid var(--border);
      background: var(--bg-card); color: var(--text-secondary);
      cursor: pointer; font-family: var(--font-family); font-size: 0.8rem;
      transition: var(--transition);
    }
    .header-btn:hover { border-color: var(--primary); color: var(--primary-light); }
    .btn-label { font-weight: 600; }
    .notification-btn { position: relative; padding: 8px; }
    .notif-badge {
      position: absolute; top: 2px; inset-inline-end: 2px;
      background: var(--danger); color: white; border-radius: 20px;
      font-size: 0.65rem; font-weight: 700; min-width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 4px; line-height: 1;
    }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem;
    }

    /* ── Notification Panel ────────────────── */
    .notification-panel {
      position: fixed; top: var(--header-height); inset-inline-end: 16px;
      width: 380px; max-height: 480px; background: var(--bg-card);
      border: 1px solid var(--border); border-radius: 16px;
      box-shadow: var(--shadow-lg); z-index: 200; overflow: hidden;
      animation: slideUp 0.2s ease;
    }
    .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid var(--border); }
    .notif-list { overflow-y: auto; max-height: 400px; }
    .notif-item { display: flex; gap: 12px; padding: 14px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .notif-item:hover { background: rgba(99,102,241,0.06); }
    .notif-item.unread { background: rgba(99,102,241,0.04); }
    .notif-type-icon { font-size: 22px; margin-top: 2px; flex-shrink: 0; }
    .notif-type-icon.appointment { color: var(--info); }
    .notif-type-icon.payment { color: var(--success); }
    .notif-type-icon.invoice { color: var(--warning); }
    .notif-type-icon.stock { color: var(--accent); }
    .notif-content { flex: 1; min-width: 0; }
    .notif-title { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
    .notif-msg { font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .notif-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
    .toast-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; margin-inline-start: auto; }

    .page-content { flex: 1; padding: 24px; }

    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.collapsed { transform: translateX(-100%); }
      .main-wrapper, .main-wrapper.sidebar-collapsed { margin-inline-start: 0; }
      .notification-panel { width: calc(100vw - 32px); inset-inline-end: 16px; }
      .welcome-text { display: none; }
    }
  `]
})
export class ShellComponent implements OnInit {
  sidebarCollapsed = false;
  showNotifications = false;

  navItems: NavItem[] = [
    { label: 'DASHBOARD', icon: 'dashboard', route: '/dashboard' },
    { label: 'PATIENTS', icon: 'personal_injury', route: '/patients' },
    { label: 'DOCTORS', icon: 'medical_services', route: '/doctors' },
    { label: 'APPOINTMENTS', icon: 'calendar_month', route: '/appointments' },
    { label: 'INVOICES', icon: 'receipt_long', route: '/invoices' },
    { label: 'ACCOUNTING', icon: 'account_balance', route: '/accounting' },
    { label: 'INVENTORY', icon: 'inventory_2', route: '/inventory' },
    { label: 'PURCHASES', icon: 'shopping_cart', route: '/purchases' },
    { label: 'SALES', icon: 'point_of_sale', route: '/sales' },
    { label: 'HR', icon: 'people', route: '/hr' },
  ];

  constructor(
    public auth: AuthService,
    public notificationService: NotificationService,
    public langService: LanguageService,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.notificationService.startConnection();
    this.notificationService.loadNotifications().subscribe();
    this.notificationService.getUnreadCount().subscribe();
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  readNotif(n: any) {
    if (!n.isRead) this.notificationService.markAsRead(n.id).subscribe();
  }

  getNotifIcon(type: string): string {
    if (type.includes('Appointment')) return 'event';
    if (type.includes('Payment')) return 'payment';
    if (type.includes('Invoice')) return 'receipt_long';
    if (type.includes('Stock')) return 'inventory';
    return 'notifications';
  }

  getNotifClass(type: string): string {
    if (type.includes('Appointment')) return 'appointment';
    if (type.includes('Payment')) return 'payment';
    if (type.includes('Invoice')) return 'invoice';
    if (type.includes('Stock')) return 'stock';
    return '';
  }
}
