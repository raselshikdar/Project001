-- ============================================
-- SEED DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name, name_bn, slug, description, display_order) VALUES
  ('Technology', 'প্রযুক্তি', 'technology', 'Technology news and tutorials', 1),
  ('Programming', 'প্রোগ্রামিং', 'programming', 'Programming guides and tips', 2),
  ('Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-development', 'Web development tutorials', 3),
  ('Mobile Apps', 'মোবাইল অ্যাপ', 'mobile-apps', 'Mobile app development', 4),
  ('Gadgets', 'গ্যাজেট', 'gadgets', 'Latest gadgets and reviews', 5),
  ('Software', 'সফটওয়্যার', 'software', 'Software reviews and guides', 6),
  ('Gaming', 'গেমিং', 'gaming', 'Gaming news and reviews', 7),
  ('Tips & Tricks', 'টিপস ও ট্রিকস', 'tips-tricks', 'Useful tips and tricks', 8),
  ('Security', 'নিরাপত্তা', 'security', 'Cyber security and privacy', 9),
  ('Artificial Intelligence', 'কৃত্রিম বুদ্ধিমত্তা', 'artificial-intelligence', 'AI and machine learning', 10);

COMMIT;

-- Insert default tags
INSERT INTO tags (name, name_bn, slug) VALUES
  ('JavaScript', 'জাভাস্ক্রিপ্ট', 'javascript'),
  ('Python', 'পাইথন', 'python'),
  ('React', 'রিয়্যাক্ট', 'react'),
  ('Next.js', 'নেক্সট.জেএস', 'nextjs'),
  ('Node.js', 'নোড.জেএস', 'nodejs'),
  ('TypeScript', 'টাইপস্ক্রিপ্ট', 'typescript'),
  ('Tutorial', 'টিউটোরিয়াল', 'tutorial'),
  ('Guide', 'গাইড', 'guide'),
  ('Android', 'অ্যান্ড্রয়েড', 'android'),
  ('iOS', 'আইওএস', 'ios'),
  ('Windows', 'উইন্ডোজ', 'windows'),
  ('Linux', 'লিনাক্স', 'linux'),
  ('Database', 'ডাটাবেজ', 'database'),
  ('API', 'এপিআই', 'api'),
  ('Cloud', 'ক্লাউড', 'cloud');

COMMIT;

-- Insert forum categories
INSERT INTO forum_categories (name, name_bn, slug, description, display_order) VALUES
  ('General Discussion', 'সাধারণ আলোচনা', 'general-discussion', 'General technology discussions', 1),
  ('Help & Support', 'সাহায্য ও সহায়তা', 'help-support', 'Get help from the community', 2),
  ('Programming Q&A', 'প্রোগ্রামিং প্রশ্নোত্তর', 'programming-qa', 'Ask programming questions', 3),
  ('Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-dev-forum', 'Discuss web development', 4),
  ('Mobile Development', 'মোবাইল ডেভেলপমেন্ট', 'mobile-dev', 'Mobile app development discussions', 5),
  ('Career & Jobs', 'ক্যারিয়ার ও চাকরি', 'career-jobs', 'Career advice and job postings', 6),
  ('Freelancing', 'ফ্রিল্যান্সিং', 'freelancing', 'Freelancing tips and opportunities', 7),
  ('Showcase', 'প্রদর্শনী', 'showcase', 'Show off your projects', 8);

COMMIT;
