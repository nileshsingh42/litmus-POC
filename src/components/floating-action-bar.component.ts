import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-action-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-bar" *ngIf="selectedCount > 0">
      <div class="bar-content">
        <span class="selected-badge">{{ selectedCount }} selected</span>
        <div class="action-buttons">
          <button class="clear-button" (click)="handleClear()">
            Clear
          </button>
          <button class="update-button" (click)="handleUpdate()">
            Update Bulk Permissions
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .floating-bar {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      padding: 16px 24px;
      z-index: 40;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }

    .bar-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .selected-badge {
      background-color: var(--primary);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .clear-button {
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background-color: var(--background);
      color: var(--foreground);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-button:hover {
      background-color: var(--muted);
    }

    .update-button {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      background-color: var(--primary);
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .update-button:hover {
      opacity: 0.9;
    }
  `]
})
export class FloatingActionBarComponent {
  @Input() selectedCount: number = 0;
  @Output() clear = new EventEmitter<void>();
  @Output() updateBulk = new EventEmitter<void>();

  handleClear(): void {
    this.clear.emit();
  }

  handleUpdate(): void {
    this.updateBulk.emit();
  }
}
