import { getThreadBySlug, getReplies } from '@/lib/actions/forum'
import { getUser } from '@/lib/actions/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Eye, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { ThreadReplies } from '@/components/thread-replies'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const thread = await getThreadBySlug(params.slug)
  
  return {
    title: thread.title,
    description: thread.content.substring(0, 160),
  }
}

export default async function ThreadPage({ params }: { params: { slug: string } }) {
  const thread = await getThreadBySlug(params.slug)
  const user = await getUser()
  const replies = await getReplies(thread.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/forum" className="hover:text-foreground">
            ফোরাম
          </Link>
          <span>/</span>
          {thread.category && (
            <>
              <Link
                href={`/forum/category/${thread.category.slug}`}
                className="hover:text-foreground"
              >
                {thread.category.name_bn}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{thread.title}</span>
        </div>

        {/* Thread */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-2">
              <h1 className="text-3xl font-bold flex-1 text-balance">{thread.title}</h1>
              {thread.has_accepted_answer && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  সমাধান হয়েছে
                </Badge>
              )}
              {thread.is_locked && (
                <Badge variant="secondary">লক করা</Badge>
              )}
            </div>

            {/* Thread Meta */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href={`/user/${thread.user.username}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Avatar>
                  <AvatarImage src={thread.user.avatar_url || undefined} />
                  <AvatarFallback>
                    {thread.user.full_name?.[0] || thread.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {thread.user.full_name || thread.user.username}
                  </p>
                  <p className="text-xs">@{thread.user.username}</p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(thread.created_at).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {thread.view_count || 0} বার দেখা হয়েছে
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {thread.reply_count} উত্তর
                </span>
              </div>
            </div>

            {/* Thread Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert pt-4 border-t">
              <div dangerouslySetInnerHTML={{ __html: thread.content }} />
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <ThreadReplies
          threadId={thread.id}
          threadUserId={thread.user_id}
          replies={replies}
          currentUser={user}
          isLocked={thread.is_locked}
        />
      </div>
    </div>
  )
}
