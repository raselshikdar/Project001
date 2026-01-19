'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getModeratorStats() {
  const supabase = await createClient()
  
  const [
    { count: pendingPosts },
    { count: reportedComments },
    { count: reportedThreads },
    { count: totalReports },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_type', 'comment').eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('report_type', 'thread').eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    pendingPosts: pendingPosts || 0,
    reportedComments: reportedComments || 0,
    reportedThreads: reportedThreads || 0,
    totalReports: totalReports || 0,
  }
}

export async function deleteComment(commentId: string, moderatorId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('comments')
    .update({ 
      is_deleted: true,
      deleted_by: moderatorId
    })
    .eq('id', commentId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function deleteForumReply(replyId: string, moderatorId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forum_replies')
    .update({ 
      is_deleted: true,
      deleted_by: moderatorId
    })
    .eq('id', replyId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function lockThread(threadId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forum_threads')
    .update({ is_locked: true })
    .eq('id', threadId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function unlockThread(threadId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forum_threads')
    .update({ is_locked: false })
    .eq('id', threadId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function pinThread(threadId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forum_threads')
    .update({ is_pinned: true })
    .eq('id', threadId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function unpinThread(threadId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forum_threads')
    .update({ is_pinned: false })
    .eq('id', threadId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}

export async function getPendingReports() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reports_reporter_id_fkey(username, full_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateReportStatus(reportId: string, status: string, reviewerId: string, note?: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reports')
    .update({ 
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      resolution_note: note
    })
    .eq('id', reportId)

  if (error) throw error
  
  revalidatePath('/moderator')
  return { success: true }
}
