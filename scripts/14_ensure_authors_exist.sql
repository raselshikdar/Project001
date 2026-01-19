-- Script to ensure at least one author/admin user exists for testing
-- This script promotes the first registered user to admin if no authors exist

DO $$
DECLARE
  v_user_id UUID;
  v_has_authors BOOLEAN;
BEGIN
  -- Check if any authors/admins exist
  SELECT EXISTS(
    SELECT 1 FROM profiles WHERE role IN ('admin', 'author', 'moderator')
  ) INTO v_has_authors;

  -- If no authors exist, promote the first user to admin
  IF NOT v_has_authors THEN
    -- Get the first user
    SELECT id INTO v_user_id FROM profiles ORDER BY created_at LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
      UPDATE profiles
      SET role = 'admin', updated_at = NOW()
      WHERE id = v_user_id;
      
      RAISE NOTICE 'Promoted user % to admin', v_user_id;
    ELSE
      RAISE NOTICE 'No users found in database';
    END IF;
  ELSE
    RAISE NOTICE 'Authors already exist';
  END IF;
END $$;

COMMIT;
