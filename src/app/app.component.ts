import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, UserPermissions, BulkActionState } from '../types/user.types';
import { UserTableComponent } from '../components/user-table.component';
import { BulkActionPanelComponent } from '../components/bulk-action-panel.component';
import { FloatingActionBarComponent } from '../components/floating-action-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserTableComponent,
    BulkActionPanelComponent,
    FloatingActionBarComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>User Permissions Management</h1>
        <p class="subtitle">Manage user access and permissions</p>
      </header>

      <div class="content">
        <div class="toolbar">
          <div class="search-filters">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                [(ngModel)]="searchQuery"
                (input)="applyFilters()"
                class="search-input"
              />
            </div>

            <div class="filter-group">
              <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="filter-select">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Unverified">Unverified</option>
              </select>

              <select [(ngModel)]="userTypeFilter" (change)="applyFilters()" class="filter-select">
                <option value="all">All Types</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>

              <select [(ngModel)]="accessFilter" (change)="applyFilters()" class="filter-select">
                <option value="all">All Access</option>
                <option value="Full Access">Full Access</option>
                <option value="Moderate Access">Moderate Access</option>
                <option value="Limited Access">Limited Access</option>
              </select>
            </div>
          </div>

          <div class="results-info">
            Showing {{ paginatedUsers.length }} of {{ filteredUsers.length }} users
          </div>
        </div>

        <app-user-table
          [users]="paginatedUsers"
          [selectedUserIds]="selectedUserIds"
          [bulkActionState]="showBulkPanel ? currentBulkActionState : null"
          (selectionChange)="handleSelectionChange($event)"
          (permissionChange)="handlePermissionChange($event)"
        />

        <div class="pagination" *ngIf="totalPages > 1">
          <button
            class="pagination-button"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <div class="page-numbers">
            <button
              *ngFor="let page of getPageNumbers()"
              [class]="getPageButtonClass(page)"
              (click)="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="pagination-button"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <app-floating-action-bar
        [selectedCount]="selectedUserIds.size"
        (clear)="clearSelection()"
        (updateBulk)="openBulkPanel()"
      />

      <app-bulk-action-panel
        *ngIf="showBulkPanel"
        [selectedUsers]="getSelectedUsers()"
        (close)="closeBulkPanel()"
        (apply)="applyBulkUpdate($event)"
      />

      <div class="toast" *ngIf="showToast" [class.toast-visible]="showToast">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: var(--background);
      padding: 24px;
    }

    .app-header {
      margin-bottom: 32px;
    }

    .app-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--foreground);
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 16px;
      color: var(--muted-foreground);
      margin: 0;
    }

    .content {
      max-width: 1600px;
      margin: 0 auto;
    }

    .toolbar {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .search-filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: var(--card);
      color: var(--foreground);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--primary);
    }

    .filter-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: var(--card);
      color: var(--foreground);
      font-size: 14px;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s;
    }

    .filter-select:focus {
      border-color: var(--primary);
    }

    .results-info {
      font-size: 14px;
      color: var(--muted-foreground);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
    }

    .pagination-button {
      padding: 10px 20px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: var(--card);
      color: var(--foreground);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-button:hover:not(:disabled) {
      background-color: var(--muted);
    }

    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 8px;
    }

    .page-button {
      width: 40px;
      height: 40px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: var(--card);
      color: var(--foreground);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-button:hover {
      background-color: var(--muted);
    }

    .page-button-active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .toast {
      position: fixed;
      bottom: 100px;
      right: 24px;
      background-color: var(--success);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      font-weight: 500;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease-out;
      z-index: 60;
    }

    .toast-visible {
      transform: translateY(0);
      opacity: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  selectedUserIds: Set<string> = new Set();
  showBulkPanel = false;
  currentBulkActionState: BulkActionState | null = null;

  searchQuery = '';
  statusFilter = 'all';
  userTypeFilter = 'all';
  accessFilter = 'all';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  showToast = false;
  toastMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.allUsers = users;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allUsers];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === this.statusFilter);
    }

    if (this.userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.userType === this.userTypeFilter);
    }

    if (this.accessFilter !== 'all') {
      filtered = filtered.filter(user => user.access === this.accessFilter);
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i);
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  getPageButtonClass(page: number): string {
    const classes = ['page-button'];
    if (page === this.currentPage) {
      classes.push('page-button-active');
    }
    return classes.join(' ');
  }

  handleSelectionChange(newSelection: Set<string>): void {
    this.selectedUserIds = newSelection;
  }

  clearSelection(): void {
    this.selectedUserIds = new Set();
  }

  getSelectedUsers(): User[] {
    return this.allUsers.filter(user => this.selectedUserIds.has(user.id));
  }

  handlePermissionChange(event: { userId: string; permission: keyof UserPermissions; value: boolean }): void {
    try {
      this.userService.updateUserPermission(event.userId, event.permission, event.value);
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  }

  openBulkPanel(): void {
    this.showBulkPanel = true;
    this.currentBulkActionState = {
      dashboard: 'keep',
      reply: 'keep',
      adr: 'keep',
      mobile: 'keep'
    };
  }

  closeBulkPanel(): void {
    this.showBulkPanel = false;
    this.currentBulkActionState = null;
  }

  applyBulkUpdate(actions: BulkActionState): void {
    const updates: Partial<Record<keyof UserPermissions, boolean>> = {};

    if (actions.dashboard === 'enable') updates.dashboard = true;
    if (actions.dashboard === 'disable') updates.dashboard = false;
    if (actions.reply === 'enable') updates.reply = true;
    if (actions.reply === 'disable') updates.reply = false;
    if (actions.adr === 'enable') updates.adr = true;
    if (actions.adr === 'disable') updates.adr = false;
    if (actions.mobile === 'enable') updates.mobile = true;
    if (actions.mobile === 'disable') updates.mobile = false;

    try {
      this.userService.bulkUpdatePermissions(
        Array.from(this.selectedUserIds),
        updates
      );

      const count = this.selectedUserIds.size;
      this.showToastMessage(`Successfully updated permissions for ${count} user${count > 1 ? 's' : ''}`);

      this.closeBulkPanel();
      this.clearSelection();
    } catch (error) {
      console.error('Failed to apply bulk update:', error);
      this.showToastMessage('Failed to update permissions');
    }
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
