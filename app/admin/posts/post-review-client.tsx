'use client'

import { useState } from 'react'
import { approvePost, rejectPost } from '@/lib/actions/admin'
import { getUser } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Calendar, User } from 'lucide-react'

type Post = {
  id: string
  title: string
  excerpt: string | null
  content: string
  created_at: string
  author: {
    username: string
    full_name: string | null
  }
  category: {
    name_bn: string
  } | null
}

export function PostReviewClient({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleApprove = async (postId: string) => {
    setIsLoading(true)
    try {
      // Get current user ID (admin)
      const adminId = 'temp-admin-id' // This will be replaced with actual user ID
      await approvePost(postId, adminId)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error approving post:', error)
      alert('পোস্ট অনুমোদন করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (postId: string) => {
    if (!rejectReason.trim()) {
      alert('প্রত্যাখ্যানের কারণ লিখুন')
      return
    }

    setIsLoading(true)
    try {
      await rejectPost(postId, rejectReason)
      setDialogOpen(false)
      setRejectReason('')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error rejecting post:', error)
      alert('পোস্ট প্রত্যাখ্যান করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              {post.category && (
                <Badge variant="secondary">{post.category.name_bn}</Badge>
              )}
            </div>
            {post.excerpt && (
              <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.full_name || post.author.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString('bn-BD')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setSelectedPost(post)}
            >
              বিস্তারিত দেখুন
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleApprove(post.id)}
              disabled={isLoading}
            >
              অনুমোদন করুন
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={isLoading}>
                  প্রত্যাখ্যান করুন
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>পোস্ট প্রত্যাখ্যান করুন</DialogTitle>
                  <DialogDescription>
                    প্রত্যাখ্যানের কারণ লিখুন। এটি লেখককে জানানো হবে।
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="প্রত্যাখ্যানের কারণ..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={isLoading}
                    >
                      বাতিল
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(post.id)}
                      disabled={isLoading}
                    >
                      প্রত্যাখ্যান করুন
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}

      {/* Post Preview Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
              <DialogDescription>
                লেখক: {selectedPost.author.full_name || selectedPost.author.username}
              </DialogDescription>
            </DialogHeader>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
