export interface UserPermissions {
  dashboard: boolean;
  reply: boolean;
  adr: boolean;
  mobile: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  access: string;
  userType: string;
  addedVia: string;
  addedDate: string;
  status: 'Active' | 'Unverified' | 'Inactive' | 'Disabled';
  permissions: UserPermissions;
  loginType: string;
  lastLogin: string | null;
  passwordExpiryDate: string;
}

export interface DatabaseUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  email_verified: boolean;
  access: string;
  user_type: string;
  added_via: string;
  added_date: string;
  status: 'Active' | 'Unverified';
  dashboard_permission: boolean;
  reply_permission: boolean;
  adr_permission: boolean;
  mobile_permission: boolean;
}

export type BulkAction = 'enable' | 'disable' | 'keep';

export interface BulkActionState {
  dashboard: BulkAction;
  reply: BulkAction;
  adr: BulkAction;
  mobile: BulkAction;
}

export interface BulkUpdatePreview {
  enableCount: number;
  disableCount: number;
}
