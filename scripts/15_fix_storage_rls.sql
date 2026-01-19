-- Fix storage RLS policies to allow authenticated users to upload
-- This fixes the "new row violates row-level security policy" error

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop all existing storage policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Allow authenticated users to upload to posts-images bucket
CREATE POLICY "Anyone can upload to posts-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posts-images');

-- Allow public access to view posts-images
CREATE POLICY "Anyone can view posts-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts-images');

-- Allow users to update their own uploaded images in posts-images
CREATE POLICY "Users can update own posts-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'posts-images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'posts-images' AND auth.uid() = owner);

-- Allow users to delete their own uploaded images in posts-images
CREATE POLICY "Users can delete own posts-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'posts-images' AND auth.uid() = owner);

-- Allow authenticated users to upload to avatars bucket
CREATE POLICY "Anyone can upload to avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

-- Allow public access to view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Allow authenticated users to upload to forum-images bucket
CREATE POLICY "Anyone can upload to forum-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'forum-images');

-- Allow public access to view forum-images
CREATE POLICY "Anyone can view forum-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'forum-images');

-- Allow users to update their own uploaded forum images
CREATE POLICY "Users can update own forum-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'forum-images' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'forum-images' AND auth.uid() = owner);

-- Allow users to delete their own uploaded forum images
CREATE POLICY "Users can delete own forum-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'forum-images' AND auth.uid() = owner);
