-- Complete Backend Setup Script
-- Run this script to ensure all backend components are properly configured

-- ============================================
-- 1. ENSURE STORAGE BUCKETS EXIST
-- ============================================

-- Create post-images bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- Create avatars bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152;

-- ============================================
-- 2. STORAGE POLICIES (if not exist)
-- ============================================

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public read access for post images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own post images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Post images policies
CREATE POLICY "Public read access for post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own post images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own post images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatar policies
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 3. AUTO-CREATE PROFILE TRIGGER
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  supreme_admin_id UUID := '017b1885-dd29-4711-b0b3-6e3ff5b8640f';
  supreme_admin_email TEXT := 'raselshikdar597@gmail.com';
  user_role public.user_role;
BEGIN
  -- Check if this is the supreme admin
  IF NEW.id = supreme_admin_id OR NEW.email = supreme_admin_email THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    full_name,
    username,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = CASE 
      WHEN profiles.id = supreme_admin_id THEN 'admin'::public.user_role
      ELSE profiles.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. SUPREME ADMIN PROTECTION TRIGGER
-- ============================================

-- Function to protect supreme admin role
CREATE OR REPLACE FUNCTION public.protect_supreme_admin()
RETURNS trigger AS $$
DECLARE
  supreme_admin_id UUID := '017b1885-dd29-4711-b0b3-6e3ff5b8640f';
BEGIN
  -- Prevent changing supreme admin's role
  IF OLD.id = supreme_admin_id AND NEW.role != 'admin' THEN
    RAISE EXCEPTION 'Cannot change supreme admin role';
  END IF;
  
  -- Prevent suspending supreme admin
  IF OLD.id = supreme_admin_id AND NEW.is_suspended = true THEN
    RAISE EXCEPTION 'Cannot suspend supreme admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create protection trigger
DROP TRIGGER IF EXISTS protect_supreme_admin_trigger ON public.profiles;
CREATE TRIGGER protect_supreme_admin_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_supreme_admin();

-- ============================================
-- 5. ENSURE SUPREME ADMIN EXISTS (if user exists in auth)
-- ============================================

-- Update supreme admin if exists
UPDATE public.profiles
SET role = 'admin', is_suspended = false
WHERE id = '017b1885-dd29-4711-b0b3-6e3ff5b8640f';

-- ============================================
-- 6. ADD MISSING RLS POLICIES FOR FULL ACCESS
-- ============================================

-- Ensure admins have full access to all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    -- Drop existing admin policy if exists
    EXECUTE format('DROP POLICY IF EXISTS "Admins have full access" ON public.%I', tbl);
    
    -- Create admin full access policy
    BEGIN
      EXECUTE format(
        'CREATE POLICY "Admins have full access" ON public.%I
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''admin''
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''admin''
          )
        )',
        tbl
      );
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore errors if policy already exists or table has no RLS
    END;
  END LOOP;
END $$;

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if user is moderator or higher
CREATE OR REPLACE FUNCTION public.is_moderator_or_above(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if user can publish posts
CREATE OR REPLACE FUNCTION public.can_publish_posts(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role IN ('admin', 'moderator', 'author')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 8. UPDATE VIEW COUNT FUNCTION
-- ============================================

-- Function to increment post view count
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment thread view count
CREATE OR REPLACE FUNCTION public.increment_thread_views(thread_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.forum_threads
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE
-- ============================================
