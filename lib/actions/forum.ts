'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getForumCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getThreads(categorySlug?: string, limit?: number) {
  const supabase = await createClient()
  
  let query = supabase
    .from('forum_threads')
    .select(`
      *,
      user:profiles!forum_threads_user_id_fkey(username, full_name, avatar_url),
      category:forum_categories(name_bn, slug)
    `)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  if (categorySlug) {
    const { data: category } = await supabase
      .from('forum_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getThreadBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forum_threads')
    .select(`
      *,
      user:profiles!forum_threads_user_id_fkey(username, full_name, avatar_url, bio),
      category:forum_categories(name_bn, slug)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error

  // Increment view count
  await supabase
    .from('forum_threads')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data
}

export async function getReplies(threadId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forum_replies')
    .select(`
      *,
      user:profiles!forum_replies_user_id_fkey(username, full_name, avatar_url)
    `)
    .eq('thread_id', threadId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createThread(formData: FormData, userId: string) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const categoryId = formData.get('category_id') as string
  
  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now()

  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      title,
      slug,
      content,
      category_id: categoryId,
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/forum')
  return data
}

export async function createReply(threadId: string, userId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      thread_id: threadId,
      user_id: userId,
      content,
      parent_id: parentId || null,
    })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/forum')
  return data
}

export async function voteReply(replyId: string, userId: string, voteType: 1 | -1) {
  const supabase = await createClient()
  
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('forum_reply_votes')
    .select('*')
    .eq('reply_id', replyId)
    .eq('user_id', userId)
    .single()

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote
      await supabase
        .from('forum_reply_votes')
        .delete()
        .eq('id', existingVote.id)
    } else {
      // Change vote
      await supabase
        .from('forum_reply_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)
    }
  } else {
    // New vote
    await supabase
      .from('forum_reply_votes')
      .insert({
        reply_id: replyId,
        user_id: userId,
        vote_type: voteType,
      })
  }

  revalidatePath('/forum')
  return { success: true }
}

export async function acceptAnswer(replyId: string, threadId: string) {
  const supabase = await createClient()
  
  // Mark reply as accepted
  await supabase
    .from('forum_replies')
    .update({ is_accepted: true })
    .eq('id', replyId)

  // Mark thread as having accepted answer
  await supabase
    .from('forum_threads')
    .update({ has_accepted_answer: true })
    .eq('id', threadId)

  revalidatePath('/forum')
  return { success: true }
}

export async function getUserVote(replyId: string, userId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('forum_reply_votes')
    .select('vote_type')
    .eq('reply_id', replyId)
    .eq('user_id', userId)
    .single()

  return data?.vote_type || null
}
