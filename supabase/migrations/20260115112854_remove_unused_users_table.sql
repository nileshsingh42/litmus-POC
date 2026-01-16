/*
  # Remove unused users table
  
  1. Changes
    - Drop the `users` table and all associated policies
    - This eliminates security warnings for unused database resources
  
  2. Reason
    - Application uses local storage instead of database
    - Removing unused tables improves security posture
*/

DROP TABLE IF EXISTS public.users CASCADE;
