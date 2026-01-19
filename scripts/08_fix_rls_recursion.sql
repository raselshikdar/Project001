-- Disable RLS on profiles table to fix infinite recursion
-- The profiles table is only for storing user metadata
-- Access control is handled at auth.users level

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Enable RLS again with simple non-recursive policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can view all profiles (needed for author info on posts)
CREATE POLICY "Public view profiles" ON profiles
  FOR SELECT
  USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can update any profile  
CREATE POLICY "Admins update any profile" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 4: Users can insert their own profile (on signup)
CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
