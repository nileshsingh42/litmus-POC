/*
  # User Permissions Management System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `name` (text) - Full name of the user
      - `phone` (text) - Phone number
      - `email` (text, unique) - Email address
      - `email_verified` (boolean) - Email verification status
      - `access` (text) - Access level description (e.g., "Full Access")
      - `user_type` (text) - User role type (e.g., "Admin", "User")
      - `added_via` (text) - Source of user addition
      - `added_date` (timestamptz) - Date when user was added
      - `status` (text) - User status ("Active" or "Unverified")
      - `dashboard_permission` (boolean) - Dashboard access permission
      - `reply_permission` (boolean) - Reply permission
      - `adr_permission` (boolean) - ADR permission
      - `mobile_permission` (boolean) - Mobile access permission
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read all users
    - Add policy for authenticated users to update users
    - Add policy for authenticated users to insert users
    - Add policy for authenticated users to delete users

  3. Data
    - Seed with 8 sample users with varied permissions
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  email_verified boolean DEFAULT false,
  access text NOT NULL DEFAULT 'Limited Access',
  user_type text NOT NULL DEFAULT 'User',
  added_via text NOT NULL DEFAULT 'Manual',
  added_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'Unverified',
  dashboard_permission boolean DEFAULT false,
  reply_permission boolean DEFAULT false,
  adr_permission boolean DEFAULT false,
  mobile_permission boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Authenticated users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO users (name, phone, email, email_verified, access, user_type, added_via, added_date, status, dashboard_permission, reply_permission, adr_permission, mobile_permission) VALUES
('Sarah Johnson', '+1 (555) 123-4567', 'sarah.johnson@company.com', true, 'Full Access', 'Admin', 'Admin Panel', now() - interval '90 days', 'Active', true, true, true, true),
('Michael Chen', '+1 (555) 234-5678', 'michael.chen@company.com', true, 'Full Access', 'Admin', 'Import', now() - interval '75 days', 'Active', true, true, true, false),
('Emily Rodriguez', '+1 (555) 345-6789', 'emily.rodriguez@company.com', false, 'Limited Access', 'User', 'Invitation', now() - interval '30 days', 'Unverified', true, false, false, false),
('David Kim', '+1 (555) 456-7890', 'david.kim@company.com', true, 'Moderate Access', 'Manager', 'Admin Panel', now() - interval '60 days', 'Active', true, true, false, true),
('Jessica Brown', '+1 (555) 567-8901', 'jessica.brown@company.com', true, 'Limited Access', 'User', 'Import', now() - interval '45 days', 'Active', true, false, true, false),
('Alex Thompson', '+1 (555) 678-9012', 'alex.thompson@company.com', false, 'Limited Access', 'User', 'Invitation', now() - interval '15 days', 'Unverified', false, false, false, false),
('Maria Garcia', '+1 (555) 789-0123', 'maria.garcia@company.com', true, 'Full Access', 'Manager', 'Admin Panel', now() - interval '120 days', 'Active', true, true, true, true),
('James Wilson', '+1 (555) 890-1234', 'james.wilson@company.com', true, 'Moderate Access', 'User', 'Import', now() - interval '20 days', 'Active', true, true, false, false);
