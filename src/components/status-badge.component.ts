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
  `]
})
export class StatusBadgeComponent {
  @Input() status: 'Active' | 'Unverified' = 'Unverified';

  getBadgeClasses(): string {
    const classes = ['status-badge'];
    if (this.status === 'Active') {
      classes.push('status-active');
    } else {
      classes.push('status-unverified');
    }
    return classes.join(' ');
  }
}
