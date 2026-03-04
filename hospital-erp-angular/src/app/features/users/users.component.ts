import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/api.services';
import { ToastService } from '../../core/services/language.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ 'USERS_AND_ROLES' | translate || 'Users & Roles' }}</h1>
        <p class="page-subtitle">Manage system access and permissions</p>
      </div>
      <button class="btn btn-primary" (click)="openForm()">
        <span class="material-icons-round">person_add</span>
        New User
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid mb-4">
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(99,102,241,0.1); color: var(--primary)">
          <span class="material-icons-round">people</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ data?.totalCount || 0 }}</div>
          <div class="stat-label">Total Users</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: rgba(16,185,129,0.1); color: var(--success)">
          <span class="material-icons-round">check_circle</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ getActiveCount() }}</div>
          <div class="stat-label">Active Users</div>
        </div>
      </div>
    </div>

    <div class="card animate-fade-in">
      <div class="filters-row mb-4">
        <div class="search-box">
          <span class="material-icons-round">search</span>
          <input type="text" class="form-control" [placeholder]="'SEARCH' | translate" 
                 [(ngModel)]="request.search" (keyup.enter)="load()">
        </div>
        <button class="btn btn-secondary" (click)="load()">
          <span class="material-icons-round">refresh</span>
        </button>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="7" class="text-center py-4">
                <div class="spinner"></div>
              </td>
            </tr>
            <tr *ngIf="!loading && (!data?.items || data.items.length === 0)">
              <td colspan="7" class="text-center py-4 text-muted">No users found.</td>
            </tr>
            <tr *ngFor="let u of data?.items">
              <td class="font-semibold">{{ u.username }}</td>
              <td>{{ u.fullName }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge badge-primary">{{ u.roleName }}</span></td>
              <td>
                <span class="badge" [class.badge-success]="u.isActive" [class.badge-danger]="!u.isActive">
                  {{ u.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-muted text-sm">{{ u.createdDate | date }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-icon btn-secondary" title="Edit" (click)="openForm(u)">
                    <span class="material-icons-round" style="font-size:18px">edit</span>
                  </button>
                  <button class="btn btn-icon" 
                          [class.btn-danger]="u.isActive" [class.btn-success]="!u.isActive" 
                          [title]="u.isActive ? 'Deactivate' : 'Activate'" 
                          (click)="toggleStatus(u)">
                    <span class="material-icons-round" style="font-size:18px">
                      {{ u.isActive ? 'block' : 'check_circle' }}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="pagination mt-4" *ngIf="data?.totalPages > 1">
        <button class="btn btn-secondary btn-sm" [disabled]="!data.hasPrevious" (click)="request.page = request.page - 1; load()">Previous</button>
        <span class="px-2 text-sm text-muted">Page {{ data.page }} of {{ data.totalPages }}</span>
        <button class="btn btn-secondary btn-sm" [disabled]="!data.hasNext" (click)="request.page = request.page + 1; load()">Next</button>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal" [class.show]="showForm" *ngIf="showForm">
      <div class="modal-backdrop" (click)="closeForm()"></div>
      <div class="modal-content animate-fade-in" style="max-width: 500px">
        <div class="modal-header">
          <h2 class="modal-title">{{ (form.id ? 'Edit User' : 'New User') | translate }}</h2>
          <button class="btn btn-icon text-muted" (click)="closeForm()">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Username *</label>
              <input type="text" class="form-control" [(ngModel)]="form.username" [disabled]="form.id > 0">
            </div>
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-control" [(ngModel)]="form.fullName">
            </div>
          </div>
          
          <div class="form-row mt-3">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" class="form-control" [(ngModel)]="form.email">
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" class="form-control" [(ngModel)]="form.phoneNumber">
            </div>
          </div>

          <div class="form-row mt-3">
            <div class="form-group">
              <label class="form-label">Role *</label>
              <select class="form-control form-select" [(ngModel)]="form.roleId">
                <option [value]="r.id" *ngFor="let r of roles">{{ r.name }}</option>
              </select>
            </div>
            <div class="form-group" *ngIf="!form.id">
              <label class="form-label">Password *</label>
              <input type="password" class="form-control" [(ngModel)]="form.password">
            </div>
          </div>

          <div class="form-group mt-3" *ngIf="form.id">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="form.isActive">
              <span>Account is Active</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeForm()">Cancel</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving">
            <div class="spinner-sm" *ngIf="saving"></div>
            {{ (form.id ? 'UPDATE' : 'CREATE') | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .filters-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .search-box { position: relative; flex: 1; min-width: 250px; }
    .search-box .material-icons-round { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 20px; }
    .search-box input { padding-left: 40px; border-radius: 20px; }
    .btn-group { display: flex; gap: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .stat-card { background: var(--bg-card); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .stat-info .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
    .stat-info .stat-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
  `]
})
export class UsersComponent implements OnInit {
    request = { page: 1, pageSize: 20, search: '' };
    data: any;
    roles: any[] = [];
    loading = false;
    showForm = false;
    saving = false;
    form: any = {};

    constructor(private service: UserService, private toast: ToastService) { }

    ngOnInit() {
        this.loadRoles();
        this.load();
    }

    load() {
        this.loading = true;
        this.service.getUsers(this.request).subscribe({
            next: res => { this.data = res; this.loading = false; },
            error: () => { this.toast.error('Failed to load users'); this.loading = false; }
        });
    }

    loadRoles() {
        this.service.getRoles().subscribe({
            next: res => this.roles = res,
            error: () => this.toast.error('Failed to load roles')
        });
    }

    getActiveCount() {
        return this.data?.items?.filter((u: any) => u.isActive).length || 0;
    }

    openForm(user?: any) {
        if (user) {
            this.form = { ...user };
        } else {
            this.form = { isActive: true, roleId: this.roles.length ? this.roles[0].id : null };
        }
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.form = {};
    }

    save() {
        if (!this.form.username || !this.form.email || !this.form.fullName || !this.form.roleId || (!this.form.id && !this.form.password)) {
            this.toast.error('Please fill all required fields');
            return;
        }

        this.saving = true;
        const req = this.form.id
            ? this.service.updateUser(this.form.id, this.form)
            : this.service.createUser(this.form);

        req.subscribe({
            next: () => {
                this.toast.success(`User ${this.form.id ? 'updated' : 'created'} successfully`);
                this.saving = false;
                this.closeForm();
                this.load();
            },
            error: (e) => {
                this.toast.error(e.error?.message || `Failed to ${this.form.id ? 'update' : 'create'} user`);
                this.saving = false;
            }
        });
    }

    toggleStatus(u: any) {
        if (confirm(`Are you sure you want to ${u.isActive ? 'deactivate' : 'activate'} this user?`)) {
            this.service.toggleStatus(u.id).subscribe({
                next: () => {
                    this.toast.success(`User status updated`);
                    this.load();
                },
                error: () => this.toast.error('Failed to update status')
            });
        }
    }
}
