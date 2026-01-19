export type UserRole = "admin" | "moderator" | "author" | "contributor"

export type PostStatus = "draft" | "pending" | "approved" | "rejected"

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: UserRole
  reputation_points: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  author_id: string
  category_id: string
  status: PostStatus
  view_count: number
  reading_time?: number
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  parent_id?: string
  content: string
  created_at: string
  updated_at: string
}

export interface ForumCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface ForumThread {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  category_id: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface ForumReply {
  id: string
  thread_id: string
  author_id: string
  parent_id?: string
  content: string
  is_accepted: boolean
  upvotes: number
  downvotes: number
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Bookmark {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  content_type: "post" | "comment" | "thread" | "reply"
  content_id: string
  reason: string
  status: "pending" | "reviewed" | "resolved"
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}
