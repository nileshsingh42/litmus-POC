import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserPermissions } from '../types/user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'users_permissions_data';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const users = JSON.parse(stored);
        this.usersSubject.next(users);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        this.createMockData();
      }
    } else {
      this.createMockData();
    }
  }

  private createMockData(): void {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@company.com',
        emailVerified: true,
        access: 'Full Access',
        userType: 'Admin',
        addedVia: 'Admin Panel',
        addedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: true,
          adr: true,
          mobile: true
        }
      },
      {
        id: '2',
        name: 'Michael Chen',
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@company.com',
        emailVerified: true,
        access: 'Full Access',
        userType: 'Admin',
        addedVia: 'Import',
        addedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: true,
          adr: true,
          mobile: false
        }
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        phone: '+1 (555) 345-6789',
        email: 'emily.rodriguez@company.com',
        emailVerified: false,
        access: 'Limited Access',
        userType: 'User',
        addedVia: 'Invitation',
        addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Unverified',
        permissions: {
          dashboard: true,
          reply: false,
          adr: false,
          mobile: false
        }
      },
      {
        id: '4',
        name: 'David Kim',
        phone: '+1 (555) 456-7890',
        email: 'david.kim@company.com',
        emailVerified: true,
        access: 'Moderate Access',
        userType: 'Manager',
        addedVia: 'Admin Panel',
        addedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: true,
          adr: false,
          mobile: true
        }
      },
      {
        id: '5',
        name: 'Jessica Brown',
        phone: '+1 (555) 567-8901',
        email: 'jessica.brown@company.com',
        emailVerified: true,
        access: 'Limited Access',
        userType: 'User',
        addedVia: 'Import',
        addedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: false,
          adr: true,
          mobile: false
        }
      },
      {
        id: '6',
        name: 'Alex Thompson',
        phone: '+1 (555) 678-9012',
        email: 'alex.thompson@company.com',
        emailVerified: false,
        access: 'Limited Access',
        userType: 'User',
        addedVia: 'Invitation',
        addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Unverified',
        permissions: {
          dashboard: false,
          reply: false,
          adr: false,
          mobile: false
        }
      },
      {
        id: '7',
        name: 'Maria Garcia',
        phone: '+1 (555) 789-0123',
        email: 'maria.garcia@company.com',
        emailVerified: true,
        access: 'Full Access',
        userType: 'Manager',
        addedVia: 'Admin Panel',
        addedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: true,
          adr: true,
          mobile: true
        }
      },
      {
        id: '8',
        name: 'James Wilson',
        phone: '+1 (555) 890-1234',
        email: 'james.wilson@company.com',
        emailVerified: true,
        access: 'Moderate Access',
        userType: 'User',
        addedVia: 'Import',
        addedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        permissions: {
          dashboard: true,
          reply: true,
          adr: false,
          mobile: false
        }
      }
    ];

    this.saveUsers(mockUsers);
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  loadUsers(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const users = JSON.parse(stored);
        this.usersSubject.next(users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
  }

  updateUserPermission(userId: string, permission: keyof UserPermissions, value: boolean): void {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].permissions[permission] = value;
      this.saveUsers([...users]);
    }
  }

  bulkUpdatePermissions(
    userIds: string[],
    updates: Partial<Record<keyof UserPermissions, boolean>>
  ): void {
    const users = this.usersSubject.value;
    const updatedUsers = users.map(user => {
      if (userIds.includes(user.id)) {
        const updatedPermissions = { ...user.permissions };

        if (updates.dashboard !== undefined) {
          updatedPermissions.dashboard = updates.dashboard;
        }
        if (updates.reply !== undefined) {
          updatedPermissions.reply = updates.reply;
        }
        if (updates.adr !== undefined) {
          updatedPermissions.adr = updates.adr;
        }
        if (updates.mobile !== undefined) {
          updatedPermissions.mobile = updates.mobile;
        }

        return { ...user, permissions: updatedPermissions };
      }
      return user;
    });

    this.saveUsers(updatedUsers);
  }
}
