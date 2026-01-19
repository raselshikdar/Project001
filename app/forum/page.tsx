import { getForumCategories, getThreads } from '@/lib/actions/forum'
import { getUser } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Eye, Clock, CheckCircle, Pin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ForumPage() {
  const user = await getUser()
  const categories = await getForumCategories()
  const threads = await getThreads()

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">কমিউনিটি ফোরাম</h1>
            <p className="text-muted-foreground">প্রশ্ন করুন, সমাধান খুঁজুন এবং জ্ঞান শেয়ার করুন</p>
          </div>
          {user && (
            <Button asChild>
              <Link href="/forum/new">নতুন থ্রেড তৈরি করুন</Link>
            </Button>
          )}
        </div>

        {/* Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ক্যাটাগরি</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/forum/category/${cat.slug}`}
                  className="p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold mb-1">{cat.name_bn}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threads List */}
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক থ্রেড</CardTitle>
          </CardHeader>
          <CardContent>
            {threads.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                কোন থ্রেড নেই। প্রথম থ্রেড তৈরি করুন!
              </p>
            ) : (
              <div className="space-y-4">
                {threads.map((thread: any) => (
                  <Link
                    key={thread.id}
                    href={`/forum/thread/${thread.slug}`}
                    className="block border-b pb-4 last:border-0 hover:bg-muted/50 -mx-4 px-4 py-4 transition-colors"
                  >
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={thread.user.avatar_url || undefined} />
                        <AvatarFallback>
                          {thread.user.full_name?.[0] || thread.user.username[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          {thread.is_pinned && (
                            <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          )}
                          <h3 className="font-semibold hover:text-primary transition-colors flex-1">
                            {thread.title}
                          </h3>
                          {thread.is_locked && (
                            <Badge variant="secondary">Locked</Badge>
                          )}
                          {thread.has_accepted_answer && (
                            <Badge variant="default" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Solved
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {thread.reply_count} উত্তর
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {thread.view_count || 0} ভিউ
                          </span>
                          <span>{thread.user.full_name || thread.user.username}</span>
                          {thread.category && (
                            <Badge variant="outline">{thread.category.name_bn}</Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(thread.updated_at).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
