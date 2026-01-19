'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getAuthorPosts(authorId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(name_bn),
      _count_likes:likes(count),
      _count_comments:comments(count)
    `)
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAuthorStats(authorId: string) {
  const supabase = await createClient()
  
  const [
    { count: totalPosts },
    { count: approvedPosts },
    { count: pendingPosts },
    { count: draftPosts },
    { data: viewsData },
    { data: likesData },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', authorId),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', authorId).eq('status', 'approved'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', authorId).eq('status', 'pending'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', authorId).eq('status', 'draft'),
    supabase.from('posts').select('view_count').eq('author_id', authorId),
    supabase.from('likes').select('id', { count: 'exact', head: true }).in('post_id', 
      supabase.from('posts').select('id').eq('author_id', authorId)
    ),
  ])

  const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

  return {
    totalPosts: totalPosts || 0,
    approvedPosts: approvedPosts || 0,
    pendingPosts: pendingPosts || 0,
    draftPosts: draftPosts || 0,
    totalViews,
    totalLikes: likesData?.length || 0,
  }
}

export async function createPost(formData: FormData, authorId: string) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('category_id') as string
  const status = formData.get('status') as 'draft' | 'pending'
  const featuredImage = formData.get('featured_image') as string
  
  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now()

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      slug,
      content,
      excerpt,
      category_id: categoryId || null,
      author_id: authorId,
      status,
      featured_image: featuredImage || null,
      reading_time: readingTime,
    })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/author')
  return data
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('category_id') as string
  const status = formData.get('status') as 'draft' | 'pending'
  const featuredImage = formData.get('featured_image') as string

  // Calculate reading time
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      excerpt,
      category_id: categoryId || null,
      status,
      featured_image: featuredImage || null,
      reading_time: readingTime,
    })
    .eq('id', postId)

  if (error) throw error
  
  revalidatePath('/author')
  return { success: true }
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
  
  revalidatePath('/author')
  return { success: true }
}

export async function getCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
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
