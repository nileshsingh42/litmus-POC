import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserPermissions, BulkActionState } from '../types/user.types';
import { CustomToggleComponent } from './custom-toggle.component';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, CustomToggleComponent, StatusBadgeComponent],
  template: `
    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input
                type="checkbox"
                [checked]="isAllSelected()"
                [indeterminate]="isIndeterminate()"
                (change)="handleSelectAll()"
              />
            </th>
            <th>User</th>
            <th>Email</th>
            <th>Access</th>
            <th>User Type</th>
            <th>Added Via</th>
            <th class="toggle-column">Dashboard</th>
            <th class="toggle-column">Reply</th>
            <th class="toggle-column">ADR</th>
            <th class="toggle-column">Mobile</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let user of users"
            [class.row-selected]="isSelected(user.id)"
          >
            <td class="checkbox-column">
              <input
                type="checkbox"
                [checked]="isSelected(user.id)"
                (change)="handleSelectUser(user.id)"
              />
            </td>
            <td class="user-cell">
              <div class="user-info">
                <div class="avatar">{{ getInitials(user.name) }}</div>
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-phone">{{ user.phone }}</div>
                </div>
              </div>
            </td>
            <td class="email-cell">
              <div class="email-content">
                <span>{{ user.email }}</span>
                <span class="verified-badge" *ngIf="user.emailVerified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </span>
                <a
                  *ngIf="!user.emailVerified"
                  href="#"
                  class="verify-link"
                  (click)="$event.preventDefault()"
                >
                  Verify Email
                </a>
              </div>
            </td>
            <td>{{ user.access }}</td>
            <td>{{ user.userType }}</td>
            <td class="added-via-cell">
              <div>{{ user.addedVia }}</div>
              <div class="added-date">{{ formatDate(user.addedDate) }}</div>
            </td>
            <td class="toggle-column">
              <app-custom-toggle
                [checked]="user.permissions.dashboard"
                [willChange]="getWillChange(user, 'dashboard')"
                (checkedChange)="handlePermissionChange(user.id, 'dashboard', $event)"
              />
            </td>
            <td class="toggle-column">
              <app-custom-toggle
                [checked]="user.permissions.reply"
                [willChange]="getWillChange(user, 'reply')"
                (checkedChange)="handlePermissionChange(user.id, 'reply', $event)"
              />
            </td>
            <td class="toggle-column">
              <app-custom-toggle
                [checked]="user.permissions.adr"
                [willChange]="getWillChange(user, 'adr')"
                (checkedChange)="handlePermissionChange(user.id, 'adr', $event)"
              />
            </td>
            <td class="toggle-column">
              <app-custom-toggle
                [checked]="user.permissions.mobile"
                [willChange]="getWillChange(user, 'mobile')"
                (checkedChange)="handlePermissionChange(user.id, 'mobile', $event)"
              />
            </td>
            <td>
              <app-status-badge [status]="user.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
    }

    .user-table {
      width: 100%;
      border-collapse: collapse;
    }

    .user-table thead {
      background-color: var(--muted);
      border-bottom: 1px solid var(--border);
    }

    .user-table th {
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: var(--foreground);
      white-space: nowrap;
    }

    .user-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
      color: var(--foreground);
    }

    .user-table tbody tr {
      transition: background-color 0.2s;
    }

    .user-table tbody tr:hover {
      background-color: var(--table-hover);
    }

    .row-selected {
      background-color: var(--table-selected) !important;
    }

    .checkbox-column {
      width: 48px;
      text-align: center;
    }

    .checkbox-column input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .user-cell {
      min-width: 220px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-weight: 500;
      color: var(--foreground);
    }

    .user-phone {
      font-size: 13px;
      color: var(--muted-foreground);
    }

    .email-cell {
      min-width: 280px;
    }

    .email-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .verified-badge {
      color: var(--success);
      display: flex;
      align-items: center;
    }

    .verify-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
    }

    .verify-link:hover {
      text-decoration: underline;
    }

    .added-via-cell {
      min-width: 140px;
    }

    .added-date {
      font-size: 13px;
      color: var(--muted-foreground);
      margin-top: 4px;
    }

    .toggle-column {
      text-align: center;
      width: 80px;
    }
  `]
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() selectedUserIds: Set<string> = new Set();
  @Input() bulkActionState: BulkActionState | null = null;
  @Output() selectionChange = new EventEmitter<Set<string>>();
  @Output() permissionChange = new EventEmitter<{ userId: string; permission: keyof UserPermissions; value: boolean }>();

  isSelected(userId: string): boolean {
    return this.selectedUserIds.has(userId);
  }

  isAllSelected(): boolean {
    return this.users.length > 0 && this.selectedUserIds.size === this.users.length;
  }

  isIndeterminate(): boolean {
    return this.selectedUserIds.size > 0 && this.selectedUserIds.size < this.users.length;
  }

  handleSelectUser(userId: string): void {
    const newSelection = new Set(this.selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    this.selectionChange.emit(newSelection);
  }

  handleSelectAll(): void {
    const newSelection = new Set<string>();
    if (!this.isAllSelected()) {
      this.users.forEach(user => newSelection.add(user.id));
    }
    this.selectionChange.emit(newSelection);
  }

  handlePermissionChange(userId: string, permission: keyof UserPermissions, value: boolean): void {
    this.permissionChange.emit({ userId, permission, value });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString();
  }

  getWillChange(user: User, permission: keyof UserPermissions): boolean {
    if (!this.bulkActionState || !this.isSelected(user.id)) {
      return false;
    }

    const action = this.bulkActionState[permission];
    const currentValue = user.permissions[permission];

    if (action === 'enable' && !currentValue) return true;
    if (action === 'disable' && currentValue) return true;

    return false;
  }
}
