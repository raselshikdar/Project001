'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { addComment } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'

type Comment = {
  id: string
  content: string
  created_at: string
  user: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  parent_id: string | null
}

export function CommentSection({
  postId,
  comments,
  currentUser,
}: {
  postId: string
  comments: Comment[]
  currentUser: any
}) {
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = async () => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(postId, currentUser.id, newComment)
      setNewComment('')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error adding comment:', error)
      alert('মন্তব্য যোগ করতে সমস্যা হয়েছে')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(postId, currentUser.id, replyContent, parentId)
      setReplyContent('')
      setReplyTo(null)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error adding reply:', error)
      alert('উত্তর যোগ করতে সমস্যা হয়েছে')
    } finally {
      setIsSubmitting(false)
    }
  }

  const topLevelComments = comments.filter((c) => !c.parent_id)
  const getReplies = (commentId: string) =>
    comments.filter((c) => c.parent_id === commentId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>মন্তব্য ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <div className="space-y-4">
          <Textarea
            placeholder="আপনার মন্তব্য লিখুন..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            মন্তব্য করুন
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {topLevelComments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              কোন মন্তব্য নেই। প্রথম মন্তব্য করুন!
            </p>
          ) : (
            topLevelComments.map((comment) => {
              const replies = getReplies(comment.id)
              return (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar_url || undefined} />
                      <AvatarFallback>
                        {comment.user.full_name?.[0] || comment.user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-medium">
                          {comment.user.full_name || comment.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        উত্তর দিন
                      </Button>

                      {/* Reply Form */}
                      {replyTo === comment.id && (
                        <div className="space-y-2 mt-2">
                          <Textarea
                            placeholder="উত্তর লিখুন..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={isSubmitting || !replyContent.trim()}
                            >
                              উত্তর পাঠান
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReplyTo(null)
                                setReplyContent('')
                              }}
                            >
                              বাতিল
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="ml-6 mt-4 space-y-4 border-l pl-4">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reply.user.avatar_url || undefined} />
                                <AvatarFallback>
                                  {reply.user.full_name?.[0] || reply.user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div>
                                  <p className="font-medium text-sm">
                                    {reply.user.full_name || reply.user.username}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(reply.created_at).toLocaleDateString('bn-BD')}
                                  </p>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
