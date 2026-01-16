import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../types/user.types';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
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
