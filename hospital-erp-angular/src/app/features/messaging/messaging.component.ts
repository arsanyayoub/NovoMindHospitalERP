import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessagingService, UserService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ 'MESSAGES' | translate }}</h1>
        <p class="page-subtitle">Internal hospital communication and announcements</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary btn-with-icon" (click)="openCompose()">
          <span class="material-icons-round">edit</span>
          {{ 'NEW_MESSAGE' | translate }}
        </button>
      </div>
    </div>

    <div class="messaging-layout">
      <!-- Sidebar / Folders -->
      <div class="messaging-sidebar">
        <div class="folder-list">
          <button class="folder-item" [class.active]="activeFolder === 'inbox'" (click)="setFolder('inbox')">
            <span class="material-icons-round">inbox</span>
            <span class="folder-label">{{ 'INBOX' | translate }}</span>
            <span class="badge badge-primary" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
          </button>
          <button class="folder-item" [class.active]="activeFolder === 'sent'" (click)="setFolder('sent')">
            <span class="material-icons-round">send</span>
            <span class="folder-label">{{ 'SENT' | translate }}</span>
          </button>
        </div>
      </div>

      <!-- Message List -->
      <div class="message-list-panel">
        <div class="panel-header">
          <div class="search-box">
            <span class="material-icons-round search-icon">search</span>
            <input type="text" placeholder="Search conversations..." class="search-input">
          </div>
        </div>

        <div class="message-list">
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
          </div>
          
          <div *ngFor="let msg of messages" 
               class="message-item" 
               [class.unread]="!msg.isRead && activeFolder === 'inbox'"
               [class.active]="selectedMessage?.id === msg.id"
               (click)="selectMessage(msg)">
            <div class="msg-avatar">
              {{ (activeFolder === 'inbox' ? msg.senderName : msg.receiverName)?.charAt(0) }}
            </div>
            <div class="msg-details">
              <div class="msg-header">
                <span class="msg-user">{{ activeFolder === 'inbox' ? msg.senderName : msg.receiverName }}</span>
                <span class="msg-time">{{ msg.sentAt | date:'shortTime' }}</span>
              </div>
              <div class="msg-preview">{{ msg.content }}</div>
            </div>
          </div>

          <div *ngIf="messages.length === 0 && !loading" class="empty-state">
            <span class="material-icons-round empty-icon">mail_outline</span>
            <p>No messages found</p>
          </div>
        </div>
      </div>

      <!-- Message Detail -->
      <div class="message-detail-panel">
        <ng-container *ngIf="selectedMessage; else selectMessageHint">
          <div class="detail-header">
            <div class="detail-user-info">
              <div class="detail-avatar">
                {{ (activeFolder === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName)?.charAt(0) }}
              </div>
              <div>
                <h3 class="detail-sender">{{ activeFolder === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName }}</h3>
                <p class="detail-time">{{ selectedMessage.sentAt | date:'fullDate' }} at {{ selectedMessage.sentAt | date:'shortTime' }}</p>
              </div>
            </div>
            <div class="detail-actions">
               <button class="btn btn-icon text-muted" (click)="reply()"><span class="material-icons-round">reply</span></button>
               <button class="btn btn-icon text-muted"><span class="material-icons-round">archive</span></button>
               <button class="btn btn-icon text-muted text-danger"><span class="material-icons-round">delete_outline</span></button>
            </div>
          </div>
          <div class="detail-body">
            <div class="msg-content">
              {{ selectedMessage.content }}
            </div>
          </div>
        </ng-container>
        <ng-template #selectMessageHint>
          <div class="empty-detail">
            <span class="material-icons-round large-icon">chat_bubble_outline</span>
            <h3>Select a message to read</h3>
            <p>Choose a conversation from the list on the left.</p>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Compose Modal -->
    <div class="modal" [class.show]="showCompose" *ngIf="showCompose">
      <div class="modal-backdrop" (click)="showCompose = false"></div>
      <div class="modal-content" style="max-width: 600px">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'NEW_MESSAGE' | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="showCompose = false">
             <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-4">
            <label class="form-label">To *</label>
            <select class="form-control form-select" [(ngModel)]="composeForm.receiverId">
              <option value="">Select Recipient</option>
              <ng-container *ngFor="let user of users">
                <option *ngIf="user.id !== auth.currentUser?.userId" [value]="user.id">
                  {{ user.fullName }} ({{ user.roleName }})
                </option>
              </ng-container>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Message Content *</label>
            <textarea class="form-control" rows="8" [(ngModel)]="composeForm.content" placeholder="Type your message here..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="showCompose = false">Discard</button>
          <button class="btn btn-primary" (click)="send()" [disabled]="sending || !composeForm.receiverId || !composeForm.content">
            <span class="material-icons-round" *ngIf="!sending">send</span>
            {{ sending ? 'Sending...' : 'Send Message' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messaging-layout {
      display: flex; height: calc(100vh - 220px);
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    /* Folders Sidebar */
    .messaging-sidebar { width: 220px; border-inline-end: 1px solid var(--border); background: rgba(255,255,255,0.02); padding: 20px 12px; }
    .folder-item {
      display: flex; align-items: center; gap: 12px; width: 100%; border: none; background: none;
      padding: 12px 16px; border-radius: 12px; color: var(--text-secondary); cursor: pointer;
      transition: all 0.2s; margin-bottom: 4px;
    }
    .folder-item:hover { background: rgba(99,102,241,0.05); color: var(--text-primary); }
    .folder-item.active { background: rgba(99,102,241,0.1); color: var(--primary-light); font-weight: 600; }
    .folder-label { flex: 1; text-align: left; }

    /* Message List */
    .message-list-panel { width: 350px; border-inline-end: 1px solid var(--border); display: flex; flex-direction: column; }
    .panel-header { padding: 20px; border-bottom: 1px solid var(--border); }
    .message-list { flex: 1; overflow-y: auto; }
    .message-item {
      padding: 16px 20px; display: flex; gap: 14px; cursor: pointer;
      border-bottom: 1px solid var(--border); transition: all 0.15s;
    }
    .message-item:hover { background: rgba(255,255,255,0.03); }
    .message-item.active { background: rgba(99,102,241,0.05); border-inline-start: 3px solid var(--primary); }
    .message-item.unread { font-weight: 700; background: rgba(99,102,241,0.02); }
    .msg-avatar { 
      width: 40px; height: 40px; border-radius: 12px; background: var(--bg-sidebar);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      color: var(--primary-light); font-weight: 700; border: 1px solid var(--border);
    }
    .msg-details { flex: 1; min-width: 0; }
    .msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .msg-user { font-size: 0.9rem; color: var(--text-primary); }
    .msg-time { font-size: 0.75rem; color: var(--text-muted); }
    .msg-preview { font-size: 0.8rem; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Message Detail */
    .message-detail-panel { flex: 1; display: flex; flex-direction: column; background: rgba(255,255,255,0.01); }
    .detail-header { padding: 24px 30px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .detail-user-info { display: flex; gap: 16px; align-items: center; }
    .detail-avatar { width: 48px; height: 48px; border-radius: 16px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; }
    .detail-sender { font-size: 1.1rem; color: var(--text-primary); margin: 0; }
    .detail-time { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
    .detail-body { padding: 30px; flex: 1; overflow-y: auto; }
    .msg-content { line-height: 1.7; color: var(--text-primary); white-space: pre-wrap; font-size: 1rem; }

    .empty-detail { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.7; }
    .large-icon { font-size: 64px; margin-bottom: 20px; }

    .loading-state { padding: 40px; text-align: center; }
    .spinner { border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MessagingComponent implements OnInit {
  messages: any[] = [];
  users: any[] = [];
  unreadCount = 0;
  activeFolder = 'inbox';
  selectedMessage: any = null;
  loading = false;
  sending = false;
  showCompose = false;

  composeForm: any = { receiverId: '', content: '' };

  constructor(
    private service: MessagingService,
    private userService: UserService,
    public auth: AuthService,
    private toast: ToastService,
    private notifService: NotificationService
  ) { }

  ngOnInit() {
    this.refreshInbox();
    this.loadUsers();
    this.refreshUnreadCount();

    // Listen to Real-time SignalR Messages
    this.notifService.newMessage$.subscribe(msg => {
      if (this.activeFolder === 'inbox') {
        this.messages.unshift(msg);
      }
      this.unreadCount++;
    });
  }

  loadUsers() {
    this.userService.getUsers({ pageSize: 100 }).subscribe(res => this.users = res.items);
  }

  setFolder(folder: string) {
    this.activeFolder = folder;
    this.selectedMessage = null;
    if (folder === 'inbox') this.refreshInbox();
    else this.refreshSent();
  }

  refreshInbox() {
    this.loading = true;
    this.service.getInbox({ pageSize: 50 }).subscribe({
      next: (res) => { this.messages = res.items; this.loading = false; },
      error: () => { this.toast.error('Failed to load inbox'); this.loading = false; }
    });
  }

  refreshSent() {
    this.loading = true;
    this.service.getSent({ pageSize: 50 }).subscribe({
      next: (res) => { this.messages = res.items; this.loading = false; },
      error: () => { this.toast.error('Failed to load sent messages'); this.loading = false; }
    });
  }

  refreshUnreadCount() {
    this.service.getUnreadCount().subscribe(count => this.unreadCount = count);
  }

  selectMessage(msg: any) {
    this.selectedMessage = msg;
    if (this.activeFolder === 'inbox' && !msg.isRead) {
      this.service.markAsRead(msg.id).subscribe(() => {
        msg.isRead = true;
        this.refreshUnreadCount();
      });
    }
  }

  openCompose() {
    this.composeForm = { receiverId: '', content: '' };
    this.showCompose = true;
  }

  reply() {
    if (!this.selectedMessage) return;
    this.composeForm = {
      receiverId: this.activeFolder === 'inbox' ? this.selectedMessage.senderId : this.selectedMessage.receiverId,
      content: `\n\n------------------\nOriginal: ${this.selectedMessage.content}`
    };
    this.showCompose = true;
  }

  send() {
    this.sending = true;
    this.service.sendMessage(this.composeForm).subscribe({
      next: () => {
        this.toast.success('Message sent successfully');
        this.sending = false;
        this.showCompose = false;
        if (this.activeFolder === 'sent') this.refreshSent();
      },
      error: (e) => { this.toast.error(e.error?.message || 'Failed to send message'); this.sending = false; }
    });
  }
}
