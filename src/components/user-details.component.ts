import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../types/user.types';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>User Details</h3>
          <button class="close-button" (click)="close()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body" *ngIf="user">
          <div class="user-header">
            <div class="avatar">{{ getInitials(user.name) }}</div>
            <div>
              <h4>{{ user.name }}</h4>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <label>Login Type</label>
              <div class="detail-value">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                <span>{{ user.loginType }}</span>
              </div>
            </div>

            <div class="detail-item">
              <label>Last Login</label>
              <div class="detail-value">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{{ formatLastLogin(user.lastLogin) }}</span>
              </div>
            </div>

            <div class="detail-item">
              <label>Password Expires</label>
              <div class="detail-value" [class.warning]="getDaysUntilExpiry(user.passwordExpiryDate) < 15">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>{{ getPasswordExpiryText(user.passwordExpiryDate) }}</span>
              </div>
            </div>

            <div class="detail-item">
              <label>Status</label>
              <div class="detail-value">
                <app-status-badge [status]="user.status" />
              </div>
            </div>

            <div class="detail-item">
              <label>User Type</label>
              <div class="detail-value">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{{ user.userType }}</span>
              </div>
            </div>

            <div class="detail-item">
              <label>Access Level</label>
              <div class="detail-value">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>{{ user.access }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal {
      background: var(--card);
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--foreground);
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--muted-foreground);
      border-radius: 6px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      background-color: var(--muted);
      color: var(--foreground);
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      max-height: calc(90vh - 80px);
    }

    .user-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 20px;
      flex-shrink: 0;
    }

    .user-header h4 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--foreground);
    }

    .email {
      margin: 0;
      font-size: 14px;
      color: var(--muted-foreground);
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item label {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted-foreground);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background-color: var(--muted);
      border-radius: 8px;
      font-size: 14px;
      color: var(--foreground);
      font-weight: 500;
    }

    .detail-value.warning {
      background-color: rgba(234, 179, 8, 0.1);
      color: rgb(234, 179, 8);
    }

    .detail-value .icon {
      flex-shrink: 0;
      opacity: 0.7;
    }

    .detail-value span {
      line-height: 1.4;
    }

    @media (max-width: 640px) {
      .modal {
        width: 95%;
        max-height: 85vh;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserDetailsComponent {
  @Input() user: User | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatLastLogin(lastLogin: string | null): string {
    if (!lastLogin) {
      return 'Never';
    }

    const date = new Date(lastLogin);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  }

  getDaysUntilExpiry(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffInMs = expiry.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  getPasswordExpiryText(expiryDate: string): string {
    const days = this.getDaysUntilExpiry(expiryDate);

    if (days < 0) {
      return 'Expired';
    }
    if (days === 0) {
      return 'Today';
    }
    if (days === 1) {
      return 'In 1 day';
    }
    if (days < 30) {
      return `In ${days} days`;
    }

    const months = Math.floor(days / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  }
}
