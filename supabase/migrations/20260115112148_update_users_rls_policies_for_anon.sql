/*
  # Update RLS Policies for Anonymous Access

  1. Changes
    - Drop existing RLS policies that require authentication
    - Add new policies that allow anonymous users (using anon key) to access data
    - This enables the dashboard to work without user authentication

  2. Security Note
    - These policies allow anonymous access for demo purposes
    - In production, you would require proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON users;
DROP POLICY IF EXISTS "Authenticated users can delete users" ON users;

-- Create new policies for anonymous access
CREATE POLICY "Allow anonymous read access"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access"
  ON users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access"
  ON users FOR DELETE
  TO anon
  USING (true);
