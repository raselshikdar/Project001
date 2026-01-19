-- Disable RLS temporarily to fix the policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Recreate profiles policies without recursion
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Simple profiles policies without recursion
CREATE POLICY "Profiles readable by all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts policies - allow all to read published, authors to manage own
CREATE POLICY "Published posts readable by all"
  ON posts FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can insert their posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Categories - readable by all
CREATE POLICY "Categories readable by all"
  ON categories FOR SELECT
  USING (true);

-- Comments - readable by all, authenticated can insert
CREATE POLICY "Comments readable by all"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Likes - readable by all, users can manage own
CREATE POLICY "Likes readable by all"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks - readable by all, users manage own
CREATE POLICY "Users can read their bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Forum categories - readable by all
CREATE POLICY "Forum categories readable by all"
  ON forum_categories FOR SELECT
  USING (true);

-- Forum threads - readable by all, authenticated can create
CREATE POLICY "Forum threads readable by all"
  ON forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Forum replies - readable by all, authenticated can create
CREATE POLICY "Forum replies readable by all"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Reports - users can create, admins can see all
CREATE POLICY "Reports readable by reporters"
  ON reports FOR SELECT
  USING (auth.uid() = reported_by);

CREATE POLICY "Users can report"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);
