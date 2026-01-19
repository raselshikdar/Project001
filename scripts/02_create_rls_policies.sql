-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reply_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is moderator or admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is author, moderator, or admin
CREATE OR REPLACE FUNCTION is_author_or_above()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'author')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Everyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = role -- Cannot change own role
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can insert profiles (for user management)
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (is_admin());

-- Users can insert their own profile on signup
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CATEGORIES & TAGS POLICIES
-- ============================================

-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Everyone can view tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- Admins and moderators can create tags
CREATE POLICY "Moderators can create tags"
  ON tags FOR INSERT
  WITH CHECK (is_moderator_or_admin());

-- Admins can manage tags
CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Everyone can view approved posts
CREATE POLICY "Approved posts are viewable by everyone"
  ON posts FOR SELECT
  USING (
    status = 'approved' OR
    author_id = auth.uid() OR
    is_moderator_or_admin()
  );

-- Authors and contributors can create posts
CREATE POLICY "Authors can create posts"
  ON posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    (
      get_user_role() IN ('author', 'contributor', 'admin', 'moderator')
    )
  );

-- Authors can update their own draft/pending posts
CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (
    author_id = auth.uid() AND
    status IN ('draft', 'pending')
  )
  WITH CHECK (
    author_id = auth.uid() AND
    status IN ('draft', 'pending')
  );

-- Moderators and admins can update any post
CREATE POLICY "Moderators can update any post"
  ON posts FOR UPDATE
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- Authors can delete their own draft posts
CREATE POLICY "Authors can delete own drafts"
  ON posts FOR DELETE
  USING (
    author_id = auth.uid() AND
    status = 'draft'
  );

-- Admins can delete any post
CREATE POLICY "Admins can delete any post"
  ON posts FOR DELETE
  USING (is_admin());

-- ============================================
-- POST TAGS POLICIES
-- ============================================

CREATE POLICY "Post tags viewable by everyone"
  ON post_tags FOR SELECT
  USING (true);

CREATE POLICY "Authors can manage tags on own posts"
  ON post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Moderators can manage all post tags"
  ON post_tags FOR ALL
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- ============================================
-- LIKES POLICIES
-- ============================================

CREATE POLICY "Likes viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKMARKS POLICIES
-- ============================================

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS POLICIES
-- ============================================

CREATE POLICY "Comments viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Moderators can manage all comments"
  ON comments FOR ALL
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- ============================================
-- FORUM CATEGORIES POLICIES
-- ============================================

CREATE POLICY "Forum categories viewable by everyone"
  ON forum_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage forum categories"
  ON forum_categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- FORUM THREADS POLICIES
-- ============================================

CREATE POLICY "Forum threads viewable by everyone"
  ON forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads"
  ON forum_threads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Moderators can manage all threads"
  ON forum_threads FOR UPDATE
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

CREATE POLICY "Users can delete own threads"
  ON forum_threads FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any thread"
  ON forum_threads FOR DELETE
  USING (is_admin());

-- ============================================
-- FORUM REPLIES POLICIES
-- ============================================

CREATE POLICY "Forum replies viewable by everyone"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON forum_replies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Thread authors can accept answers"
  ON forum_replies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM forum_threads
      WHERE forum_threads.id = forum_replies.thread_id
      AND forum_threads.user_id = auth.uid()
    )
  );

CREATE POLICY "Moderators can manage all replies"
  ON forum_replies FOR ALL
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

CREATE POLICY "Users can delete own replies"
  ON forum_replies FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FORUM REPLY VOTES POLICIES
-- ============================================

CREATE POLICY "Vote counts viewable by everyone"
  ON forum_reply_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote on replies"
  ON forum_reply_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON forum_reply_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON forum_reply_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (
    auth.uid() = reporter_id OR
    is_moderator_or_admin()
  );

CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Moderators can manage reports"
  ON reports FOR UPDATE
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

COMMIT;
