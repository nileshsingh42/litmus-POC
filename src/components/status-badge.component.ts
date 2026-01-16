import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      {{ status }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-active {
      background-color: var(--success);
      color: white;
    }

    .status-unverified {
      background-color: var(--muted);
      color: var(--muted-foreground);
    }

    .status-inactive {
      background-color: rgba(234, 179, 8, 0.15);
      color: rgb(234, 179, 8);
    }

    .status-disabled {
      background-color: rgba(239, 68, 68, 0.15);
      color: rgb(239, 68, 68);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: 'Active' | 'Unverified' | 'Inactive' | 'Disabled' = 'Unverified';

  getBadgeClasses(): string {
    const classes = ['status-badge'];
    if (this.status === 'Active') {
      classes.push('status-active');
    } else if (this.status === 'Inactive') {
      classes.push('status-inactive');
    } else if (this.status === 'Disabled') {
      classes.push('status-disabled');
    } else {
      classes.push('status-unverified');
    }
    return classes.join(' ');
  }
}
