-- Fix infinite recursion in profiles RLS by simplifying the policy
-- The issue is that the RLS policy for profiles checks auth.uid() which causes
-- recursion when querying through foreign key relationships

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Create simplified policies that don't cause recursion
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure admin can bypass RLS
CREATE POLICY "Admin can manage all profiles"
  ON profiles
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
