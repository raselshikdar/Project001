'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllUsers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function suspendUser(userId: string, duration: number) {
  const supabase = await createClient()
  
  const suspendedUntil = new Date()
  suspendedUntil.setDate(suspendedUntil.getDate() + duration)

  const { error } = await supabase
    .from('profiles')
    .update({ 
      is_suspended: true,
      suspended_until: suspendedUntil.toISOString()
    })
    .eq('id', userId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function unsuspendUser(userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      is_suspended: false,
      suspended_until: null
    })
    .eq('id', userId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function getPendingPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(username, full_name),
      category:categories(name_bn)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function approvePost(postId: string, adminId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('posts')
    .update({ 
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    })
    .eq('id', postId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function rejectPost(postId: string, reason: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('posts')
    .update({ 
      status: 'rejected',
      rejection_reason: reason
    })
    .eq('id', postId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  
  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: pendingPosts },
    { count: totalThreads },
    { count: totalComments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('forum_threads').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalUsers: totalUsers || 0,
    totalPosts: totalPosts || 0,
    pendingPosts: pendingPosts || 0,
    totalThreads: totalThreads || 0,
    totalComments: totalComments || 0,
  }
}

export async function createCategory(data: { 
  name: string
  name_bn: string
  slug: string
  description?: string
  parent_id?: string
}) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .insert(data)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}

export async function getAllReports() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reports_reporter_id_fkey(username, full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function resolveReport(reportId: string, reviewerId: string, note: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reports')
    .update({ 
      status: 'resolved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      resolution_note: note
    })
    .eq('id', reportId)

  if (error) throw error
  
  revalidatePath('/admin')
  return { success: true }
}
