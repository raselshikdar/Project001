-- ============================================
-- SUPREME ADMIN SETUP
-- ============================================
-- Ensures raselshikdar597@gmail.com is always admin
-- UID: 017b1885-dd29-4711-b0b3-6e3ff5b8640f

-- Insert or update supreme admin profile
INSERT INTO profiles (id, username, full_name, role, created_at, updated_at)
VALUES (
  '017b1885-dd29-4711-b0b3-6e3ff5b8640f',
  'supreme_admin',
  'Supreme Admin',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Grant all admin privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

COMMIT;
