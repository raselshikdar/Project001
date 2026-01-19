# বাংলা টেক - Bengali Content Platform

A production-ready, full-stack Bengali content platform similar to TrickBD.com with modern architecture and comprehensive features.

## Features

### User Roles & Permissions

#### Admin
- Full system access
- User management (create, edit, delete, assign roles)
- Post approval/rejection
- Category and tag management
- Forum moderation
- Site settings and analytics

#### Moderator
- Approve/reject posts
- Edit/remove comments
- Moderate forum threads and replies
- Temporary user suspension

#### Author
- Create and edit own posts
- Upload images
- Submit posts for review
- View post statistics
- Reply to comments

#### Contributor
- Create draft posts only
- Cannot publish directly
- Submit for author/admin review

### Content Management System

- **Rich Text Editor** with code blocks, images, embeds
- **Categories** (nested support)
- **Tags** for content organization
- **SEO-optimized** slugs and metadata
- **Featured images** via Supabase Storage
- **Reading time** calculation
- **View counter**
- **Like/bookmark system**
- **Threaded comments**
- **Admin approval workflow**
- **Author profiles**
- **Related posts**

### Forum / Q&A System

- Forum categories
- Thread creation
- Nested replies
- Upvote/downvote system
- Accept answers
- User reputation points
- Report system
- Moderator tools

### Role-Based Dashboards

Each role has a dedicated dashboard with relevant features:

- **Admin Dashboard**: User management, post approval, analytics
- **Moderator Dashboard**: Content moderation, reports
- **Author Dashboard**: My posts, stats, comments
- **Contributor Dashboard**: Draft editor, submission history

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Security**: Row Level Security (RLS)
- **Language**: TypeScript

## Database Schema

### Core Tables

- `profiles` - User profiles with roles and reputation
- `posts` - Blog posts with approval workflow
- `categories` - Nested categories
- `tags` - Content tags
- `post_tags` - Many-to-many relationship
- `comments` - Threaded comments on posts
- `likes` - Post likes
- `bookmarks` - User bookmarks
- `forum_categories` - Forum sections
- `forum_threads` - Forum discussions
- `forum_replies` - Thread responses with voting
- `reports` - Content reporting system
- `notifications` - User notifications

All tables use UUID primary keys and have proper foreign key relationships and RLS policies.

## Security

### Row Level Security (RLS)

Every table has RLS enabled with policies based on user roles:

- **Public read** for approved content
- **Role-based write** permissions
- **Owner-based** edit/delete for authors
- **Admin override** for all operations

### Authentication

- Email/password authentication via Supabase
- Server-side session validation
- Protected routes via middleware
- Role-based access control

## Project Structure

```
/app
  /admin              # Admin dashboard
  /moderator          # Moderator dashboard  
  /author             # Author dashboard
  /auth               # Login/signup pages
  /posts              # Blog post pages
  /forum              # Forum system
  /categories         # Category pages
  /profile            # User profile
  layout.tsx          # Root layout with navigation
  page.tsx            # Homepage

/components
  site-header.tsx     # Main navigation
  post-editor.tsx     # Post creation form
  rich-text-editor.tsx # WYSIWYG editor
  comment-section.tsx  # Comments UI
  post-interactions.tsx # Like/bookmark buttons
  thread-replies.tsx   # Forum replies
  /ui                  # shadcn/ui components

/lib
  /actions            # Server actions
    admin.ts
    moderator.ts
    author.ts
    posts.ts
    forum.ts
  /supabase           # Supabase clients
    client.ts
    server.ts
  /utils              # Utility functions
    helpers.ts
  types.ts            # TypeScript types

/scripts              # Database migrations
  01_create_tables.sql
  02_create_rls_policies.sql
  03_seed_data.sql

middleware.ts         # Auth & role verification
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Environment Variables

Required environment variables (automatically configured via Supabase integration):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Database Setup

The database is automatically set up via the SQL scripts:

1. `01_create_tables.sql` - Creates all tables
2. `02_create_rls_policies.sql` - Sets up security policies
3. `03_seed_data.sql` - Seeds initial categories and forum sections

These scripts have been executed automatically.

### First Admin User

To create your first admin user:

1. Sign up via `/auth/signup`
2. Manually update the user's role in Supabase SQL Editor by running:
   - `UPDATE profiles SET role = 'admin' WHERE email = 'your_email@example.com';`

### Local Development

Install dependencies and run the development server:
- `npm install`
- `npm run dev`
- Visit `http://localhost:3000`

## Deployment

### Deploy to Vercel

1. Click "Publish" button in v0
2. Or push to GitHub and connect to Vercel
3. Environment variables are automatically configured

### Production Checklist

- [ ] Database migrations executed
- [ ] First admin user created
- [ ] Categories and tags configured
- [ ] Forum categories set up
- [ ] SEO metadata configured
- [ ] Email settings configured in Supabase

## Key Features Implementation

### Post Approval Workflow

1. Author creates post (status: draft)
2. Author submits for review (status: pending)
3. Admin/Moderator reviews
4. Approved → visible to public
5. Rejected → author notified

### Forum Reputation System

- Create thread: +5 points
- Reply marked as accepted: +15 points
- Reply upvoted: +2 points
- Reply downvoted: -1 point

### Image Upload

Images are uploaded to Supabase Storage:
- Bucket: `post-images`
- Public access for approved content
- Automatic URL generation

### Search & Filtering

- Full-text search on posts
- Filter by category
- Filter by tags
- Sort by latest/popular

## Customization

### Adding New Roles

1. Add role to `user_role` enum in database
2. Update RLS policies
3. Create role-specific dashboard
4. Update navigation logic

### Adding New Post Types

1. Add `post_type` column to posts table
2. Create custom editor for new type
3. Update display logic
4. Add filters

### Bengali Font Support

The platform uses Geist font which has good Unicode support for Bengali characters. To use a Bengali-specific font:

1. Import font in `app/layout.tsx`
2. Update `globals.css` theme
3. Apply via `font-sans` class

## Performance

- Server-side rendering for SEO
- Image optimization via Next.js
- Database query optimization
- Caching strategies
- Lazy loading for heavy components

## SEO

- Dynamic meta tags per page
- Open Graph support
- Clean, semantic URLs
- Sitemap ready
- Bengali language meta tags

## Support

For issues or questions:
- Check the code comments
- Review Supabase documentation
- Check Next.js documentation

## License

MIT License - feel free to use for your own projects.

---

**Built with ❤️ for the Bengali tech community**
