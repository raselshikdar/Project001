'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPublishedPosts(limit?: number) {
  const supabase = await createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name, avatar_url),
      category:categories(name_bn, slug),
      likes:likes(count)
    `)
    .eq('status', 'approved')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name, avatar_url, bio),
      category:categories(name_bn, slug),
      post_tags(
        tag:tags(name, name_bn, slug)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error) throw error

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data
}

export async function getPostsByCategory(categorySlug: string, limit?: number) {
  const supabase = await createClient()
  
  // First get the category
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name),
      category:categories(name_bn, slug)
    `)
    .eq('category_id', category.id)
    .eq('status', 'approved')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function likePost(postId: string, userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: userId })

  if (error) {
    // If already liked, remove the like
    if (error.code === '23505') {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
    } else {
      throw error
    }
  }

  revalidatePath('/posts')
  return { success: true }
}

export async function bookmarkPost(postId: string, userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('bookmarks')
    .insert({ post_id: postId, user_id: userId })

  if (error) {
    // If already bookmarked, remove it
    if (error.code === '23505') {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
    } else {
      throw error
    }
  }

  revalidatePath('/posts')
  return { success: true }
}

export async function addComment(postId: string, userId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
      parent_id: parentId || null,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/posts')
  return data
}

export async function getComments(postId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles!comments_user_id_fkey(username, full_name, avatar_url)
    `)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getRelatedPosts(postId: string, categoryId: string, limit: number = 3) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name),
      category:categories(name_bn, slug)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'approved')
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function searchPosts(query: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name),
      category:categories(name_bn, slug)
    `)
    .eq('status', 'approved')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

export async function getLikeStatus(postId: string, userId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}

export async function getBookmarkStatus(postId: string, userId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}
