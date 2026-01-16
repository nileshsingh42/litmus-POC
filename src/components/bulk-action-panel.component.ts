import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkAction, BulkActionState, BulkUpdatePreview, User, UserPermissions } from '../types/user.types';

@Component({
  selector: 'app-bulk-action-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel-overlay" (click)="handleClose()"></div>
    <div class="panel-container">
      <div class="panel-header">
        <div class="header-content">
          <h2>Bulk Update Permissions</h2>
          <span class="selected-badge">{{ selectedUsers.length }} selected</span>
        </div>
        <button class="close-button" (click)="handleClose()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="panel-body">
        <div class="permission-section" *ngFor="let permission of permissionKeys">
          <h3 class="permission-title">{{ getPermissionLabel(permission) }}</h3>
          <div class="action-buttons">
            <button
              [class]="getActionButtonClass('enable', permission)"
              (click)="setAction(permission, 'enable')"
            >
              Enable
            </button>
            <button
              [class]="getActionButtonClass('disable', permission)"
              (click)="setAction(permission, 'disable')"
            >
              Disable
            </button>
            <button
              [class]="getActionButtonClass('keep', permission)"
              (click)="setAction(permission, 'keep')"
            >
              Keep
            </button>
          </div>
        </div>

        <div class="preview-section" *ngIf="preview.enableCount > 0 || preview.disableCount > 0">
          <h3 class="preview-title">Preview Changes</h3>
          <div class="preview-items">
            <div class="preview-item preview-enable" *ngIf="preview.enableCount > 0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>+{{ preview.enableCount }} permissions will be enabled</span>
            </div>
            <div class="preview-item preview-disable" *ngIf="preview.disableCount > 0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span>-{{ preview.disableCount }} permissions will be disabled</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <button class="cancel-button" (click)="handleClose()">
          Cancel
        </button>
        <button
          class="apply-button"
          [disabled]="!hasChanges()"
          (click)="handleApply()"
        >
          Apply Changes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .panel-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 50;
    }

    .panel-container {
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 480px;
      background-color: var(--card);
      border-left: 1px solid var(--border);
      z-index: 51;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .panel-header {
      padding: 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-content h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--foreground);
    }

    .selected-badge {
      background-color: var(--primary);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
    }

    .close-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--muted-foreground);
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-button:hover {
      background-color: var(--muted);
      color: var(--foreground);
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .permission-section {
      margin-bottom: 32px;
    }

    .permission-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--foreground);
      margin: 0 0 12px 0;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .action-button {
      flex: 1;
      padding: 10px 16px;
      border-radius: 8px;
      border: 2px solid var(--border);
      background-color: var(--background);
      color: var(--foreground);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button:hover {
      background-color: var(--muted);
    }

    .action-button-active-enable {
      background-color: var(--success);
      color: white;
      border-color: var(--success);
    }

    .action-button-active-disable {
      background-color: var(--destructive);
      color: white;
      border-color: var(--destructive);
    }

    .action-button-active-keep {
      background-color: var(--muted);
      border-color: var(--border);
    }

    .preview-section {
      margin-top: 32px;
      padding: 20px;
      background-color: var(--muted);
      border-radius: 12px;
    }

    .preview-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--foreground);
      margin: 0 0 16px 0;
    }

    .preview-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .preview-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .preview-enable {
      color: var(--success);
    }

    .preview-disable {
      color: var(--destructive);
    }

    .panel-footer {
      padding: 24px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 12px;
    }

    .cancel-button {
      flex: 1;
      padding: 12px 24px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background-color: var(--background);
      color: var(--foreground);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-button:hover {
      background-color: var(--muted);
    }

    .apply-button {
      flex: 1;
      padding: 12px 24px;
      border-radius: 8px;
      border: none;
      background-color: var(--primary);
      color: white;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .apply-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .apply-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class BulkActionPanelComponent implements OnChanges {
  @Input() selectedUsers: User[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<BulkActionState>();

  permissionKeys: (keyof UserPermissions)[] = ['dashboard', 'reply', 'adr', 'mobile'];

  actions: BulkActionState = {
    dashboard: 'keep',
    reply: 'keep',
    adr: 'keep',
    mobile: 'keep'
  };

  preview: BulkUpdatePreview = {
    enableCount: 0,
    disableCount: 0
  };

  ngOnChanges(): void {
    this.calculatePreview();
  }

  getPermissionLabel(permission: keyof UserPermissions): string {
    const labels: Record<keyof UserPermissions, string> = {
      dashboard: 'Dashboard',
      reply: 'Reply',
      adr: 'ADR',
      mobile: 'Mobile'
    };
    return labels[permission];
  }

  setAction(permission: keyof UserPermissions, action: BulkAction): void {
    this.actions[permission] = action;
    this.calculatePreview();
  }

  getActionButtonClass(action: BulkAction, permission: keyof UserPermissions): string {
    const classes = ['action-button'];
    if (this.actions[permission] === action) {
      classes.push(`action-button-active-${action}`);
    }
    return classes.join(' ');
  }

  calculatePreview(): void {
    let enableCount = 0;
    let disableCount = 0;

    this.selectedUsers.forEach(user => {
      this.permissionKeys.forEach(key => {
        const action = this.actions[key];
        const currentValue = user.permissions[key];

        if (action === 'enable' && !currentValue) {
          enableCount++;
        } else if (action === 'disable' && currentValue) {
          disableCount++;
        }
      });
    });

    this.preview = { enableCount, disableCount };
  }

  hasChanges(): boolean {
    return Object.values(this.actions).some(action => action !== 'keep');
  }

  handleClose(): void {
    this.close.emit();
  }

  handleApply(): void {
    if (this.hasChanges()) {
      this.apply.emit(this.actions);
    }
  }
}
