'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChevronUp, ChevronDown, CheckCircle } from 'lucide-react'
import { createReply, voteReply, acceptAnswer } from '@/lib/actions/forum'
import { useRouter } from 'next/navigation'

type Reply = {
  id: string
  content: string
  created_at: string
  upvotes: number
  downvotes: number
  is_accepted: boolean
  user: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  user_id: string
}

export function ThreadReplies({
  threadId,
  threadUserId,
  replies,
  currentUser,
  isLocked,
}: {
  threadId: string
  threadUserId: string
  replies: Reply[]
  currentUser: any
  isLocked: boolean
}) {
  const router = useRouter()
  const [newReply, setNewReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReply = async () => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (!newReply.trim()) return

    setIsSubmitting(true)
    try {
      await createReply(threadId, currentUser.id, newReply)
      setNewReply('')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error adding reply:', error)
      alert('উত্তর যোগ করতে সমস্যা হয়েছে')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (replyId: string, voteType: 1 | -1) => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    try {
      await voteReply(replyId, currentUser.id, voteType)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error voting:', error)
    }
  }

  const handleAcceptAnswer = async (replyId: string) => {
    if (!currentUser || currentUser.id !== threadUserId) {
      return
    }

    try {
      await acceptAnswer(replyId, threadId)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error accepting answer:', error)
      alert('উত্তর গ্রহণ করতে সমস্যা হয়েছে')
    }
  }

  const sortedReplies = [...replies].sort((a, b) => {
    // Accepted answer first
    if (a.is_accepted) return -1
    if (b.is_accepted) return 1
    // Then by vote score
    const scoreA = a.upvotes - a.downvotes
    const scoreB = b.upvotes - b.downvotes
    return scoreB - scoreA
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{replies.length} টি উত্তর</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Reply Form */}
        {!isLocked && (
          <div className="space-y-4">
            <Textarea
              placeholder="আপনার উত্তর লিখুন..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleSubmitReply}
              disabled={isSubmitting || !newReply.trim()}
            >
              উত্তর পোস্ট করুন
            </Button>
          </div>
        )}

        {isLocked && (
          <p className="text-muted-foreground text-center py-4 bg-muted rounded-lg">
            এই থ্রেড লক করা হয়েছে। নতুন উত্তর পোস্ট করা যাবে না।
          </p>
        )}

        {/* Replies List */}
        <div className="space-y-6">
          {sortedReplies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              কোন উত্তর নেই। প্রথম উত্তর দিন!
            </p>
          ) : (
            sortedReplies.map((reply) => (
              <div
                key={reply.id}
                className={`flex gap-4 p-4 rounded-lg ${
                  reply.is_accepted ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' : 'border'
                }`}
              >
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-2 w-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(reply.id, 1)}
                    className="p-0 h-8 w-8"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                  <span className="font-semibold">
                    {reply.upvotes - reply.downvotes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(reply.id, -1)}
                    className="p-0 h-8 w-8"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                  {reply.is_accepted && (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-2" />
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-3">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar_url || undefined} />
                        <AvatarFallback>
                          {reply.user.full_name?.[0] || reply.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {reply.user.full_name || reply.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>

                    {currentUser?.id === threadUserId && !reply.is_accepted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcceptAnswer(reply.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        উত্তর গ্রহণ করুন
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
