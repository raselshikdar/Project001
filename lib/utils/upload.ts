'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadImage(
  file: File,
  bucket: 'post-images' | 'avatars',
  folder: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { url: null, error: 'Unauthorized' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[v0] Upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('[v0] Upload exception:', error)
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function uploadPostImage(file: File, type: 'thumbnail' | 'content') {
  return uploadImage(file, 'post-images', type === 'thumbnail' ? 'thumbnails' : 'content')
}

export async function uploadAvatar(file: File) {
  return uploadImage(file, 'avatars', 'profiles')
}

export async function deleteImage(
  bucket: 'post-images' | 'avatars',
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}
