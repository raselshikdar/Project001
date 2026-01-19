-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- Creates a profile row automatically when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    -- Supreme admin check
    CASE 
      WHEN NEW.id = '017b1885-dd29-4711-b0b3-6e3ff5b8640f' THEN 'admin'::user_role
      ELSE 'user'::user_role
    END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE 
      WHEN NEW.id = '017b1885-dd29-4711-b0b3-6e3ff5b8640f' THEN 'admin'::user_role
      ELSE EXCLUDED.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;
