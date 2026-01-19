'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getCategories() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching categories:', error)
    return []
  }
}

export async function createPost(formData: FormData, authorId: string) {
  const supabase = await createClient()

  try {
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('category_id') as string
    const status = formData.get('status') as 'draft' | 'pending'
    const featuredImage = formData.get('featured_image') as string

    if (!title || !content) {
      throw new Error('Title and content are required')
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        title,
        slug,
        excerpt,
        content: { text: content, json: null }, // Store as JSON object
        featured_image: featuredImage,
        category_id: categoryId || null,
        status,
        reading_time: readingTime,
        view_count: 0,
        published_at: status === 'approved' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/author')
    return data
  } catch (error) {
    console.error('[v0] Error creating post:', error)
    throw error
  }
}

export async function updatePost(postId: string, formData: FormData, authorId: string) {
  const supabase = await createClient()

  try {
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('category_id') as string
    const status = formData.get('status') as 'draft' | 'pending'
    const featuredImage = formData.get('featured_image') as string

    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        excerpt,
        content: { text: content, json: null },
        featured_image: featuredImage,
        category_id: categoryId || null,
        status,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('author_id', authorId)

    if (error) throw error

    revalidatePath('/author/posts')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error updating post:', error)
    throw error
  }
}

export async function getAuthorPosts(authorId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories (name, name_bn),
      likes (count),
      comments (count)
    `)
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching author posts:', error)
    return []
  }
  return data || []
}

export async function getAuthorStats(authorId: string) {
  const supabase = await createClient()
  
  try {
    const [
      { count: totalPosts },
      { count: approvedPosts },
      { count: pendingPosts },
      { count: draftPosts },
      { data: viewsData },
      { data: likesData },
    ] = await Promise.all([
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', authorId),
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', authorId)
        .eq('status', 'approved'),
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', authorId)
        .eq('status', 'pending'),
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', authorId)
        .eq('status', 'draft'),
      supabase
        .from('posts')
        .select('view_count')
        .eq('author_id', authorId),
      supabase
        .from('posts')
        .select('likes')
        .eq('author_id', authorId),
    ])

    const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0
    const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes?.count || 0), 0) || 0

    return {
      totalPosts: totalPosts || 0,
      approvedPosts: approvedPosts || 0,
      pendingPosts: pendingPosts || 0,
      draftPosts: draftPosts || 0,
      totalViews,
      totalLikes,
    }
  } catch (error) {
    console.error('[v0] Error fetching author stats:', error)
    return {
      totalPosts: 0,
      approvedPosts: 0,
      pendingPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      totalLikes: 0,
    }
  }
}

export async function deletePost(postId: string, authorId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', authorId)

    if (error) throw error

    revalidatePath('/author/posts')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting post:', error)
    throw error
  }
}

export async function getTags() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}
