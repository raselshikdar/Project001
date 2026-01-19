'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Bookmark } from 'lucide-react'
import { likePost, bookmarkPost } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'

export function PostInteractions({
  postId,
  userId,
}: {
  postId: string
  userId?: string
}) {
  const router = useRouter()
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)

  const handleLike = async () => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setIsLiking(true)
    try {
      await likePost(postId, userId)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = async () => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setIsBookmarking(true)
    try {
      await bookmarkPost(postId, userId)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error bookmarking post:', error)
    } finally {
      setIsBookmarking(false)
    }
  }

  return (
    <div className="flex items-center gap-2 py-4 border-y">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
      >
        <Heart className="h-4 w-4 mr-2" />
        লাইক করুন
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        disabled={isBookmarking}
      >
        <Bookmark className="h-4 w-4 mr-2" />
        সংরক্ষণ করুন
      </Button>
    </div>
  )
}
