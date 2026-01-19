-- Seed script for initial data
-- This script adds default categories and fixes any structural issues

-- Insert default categories if they don't exist
INSERT INTO categories (id, name, name_bn, slug, description, icon, display_order, created_at)
VALUES
  (gen_random_uuid(), 'Technology', 'প্রযুক্তি', 'technology', 'Latest technology news and tutorials', '💻', 1, NOW()),
  (gen_random_uuid(), 'Programming', 'প্রোগ্রামিং', 'programming', 'Programming tutorials and tips', '👨‍💻', 2, NOW()),
  (gen_random_uuid(), 'Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-development', 'Web development guides', '🌐', 3, NOW()),
  (gen_random_uuid(), 'Mobile Apps', 'মোবাইল অ্যাপস', 'mobile-apps', 'Mobile app development', '📱', 4, NOW()),
  (gen_random_uuid(), 'Tips & Tricks', 'টিপস ও ট্রিকস', 'tips-tricks', 'Useful tech tips and tricks', '💡', 5, NOW()),
  (gen_random_uuid(), 'Reviews', 'রিভিউ', 'reviews', 'Product and service reviews', '⭐', 6, NOW()),
  (gen_random_uuid(), 'Tutorials', 'টিউটোরিয়াল', 'tutorials', 'Step-by-step tutorials', '📚', 7, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert forum categories
INSERT INTO forum_categories (id, name, name_bn, slug, description, icon, display_order, created_at)
VALUES
  (gen_random_uuid(), 'General Discussion', 'সাধারণ আলোচনা', 'general', 'General tech discussions', '💬', 1, NOW()),
  (gen_random_uuid(), 'Help & Support', 'সহায়তা', 'help-support', 'Get help with your tech problems', '🆘', 2, NOW()),
  (gen_random_uuid(), 'Q&A', 'প্রশ্নোত্তর', 'qa', 'Questions and answers', '❓', 3, NOW()),
  (gen_random_uuid(), 'Show & Tell', 'প্রদর্শনী', 'show-tell', 'Show your projects', '🎨', 4, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Ensure all users have profiles (in case signup didn't create them)
INSERT INTO profiles (id, username, full_name, role, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  COALESCE((raw_user_meta_data->>'role')::user_role, 'user'),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Add sample posts if no posts exist (for testing)
DO $$
DECLARE
  v_category_id UUID;
  v_author_id UUID;
BEGIN
  -- Check if posts table is empty
  IF NOT EXISTS (SELECT 1 FROM posts LIMIT 1) THEN
    -- Get first category
    SELECT id INTO v_category_id FROM categories LIMIT 1;
    
    -- Get first admin or author user
    SELECT id INTO v_author_id FROM profiles WHERE role IN ('admin', 'author') LIMIT 1;
    
    -- Only insert sample post if we have both category and author
    IF v_category_id IS NOT NULL AND v_author_id IS NOT NULL THEN
      INSERT INTO posts (
        id,
        author_id,
        category_id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        status,
        is_featured,
        view_count,
        reading_time,
        published_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        v_author_id,
        v_category_id,
        'স্বাগতম বাংলা টেক-এ',
        'welcome-to-bangla-tech',
        'বাংলা টেক প্ল্যাটফর্মে আপনাকে স্বাগতম। এখানে আপনি প্রযুক্তি সম্পর্কিত সকল তথ্য পাবেন।',
        '{"text": "# স্বাগতম বাংলা টেক-এ\n\nএটি একটি স্বাগত পোস্ট। আপনি এখন নতুন পোস্ট তৈরি করতে পারবেন।\n\n## বৈশিষ্ট্যসমূহ\n\n- পোস্ট লেখা এবং প্রকাশ\n- ফোরাম আলোচনা\n- কমেন্ট ও লাইক\n- বুকমার্ক\n\nআরও অনেক কিছু আসছে শীঘ্রই!", "json": null}',
        NULL,
        'approved',
        true,
        0,
        2,
        NOW(),
        NOW(),
        NOW()
      );
    END IF;
  END IF;
END $$;

-- Update profiles table to ensure all users have usernames
UPDATE profiles 
SET username = COALESCE(username, 'user_' || SUBSTRING(id::text, 1, 8))
WHERE username IS NULL OR username = '';

-- Ensure content column can handle JSON (it's already text, so we're good)
-- The application will store JSON strings in the text column
COMMIT;
