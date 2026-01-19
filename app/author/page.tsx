import { getAuthorStats, getAuthorPosts } from '@/lib/actions/author'
import { getUser } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, Heart, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'

export default async function AuthorDashboard() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const stats = await getAuthorStats(user.id)
  const posts = await getAuthorPosts(user.id)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'outline',
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    }
    const labels: Record<string, string> = {
      draft: 'খসড়া',
      pending: 'পর্যালোচনাধীন',
      approved: 'অনুমোদিত',
      rejected: 'প্রত্যাখ্যাত',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">লেখক ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">আপনার পোস্ট এবং পরিসংখ্যান</p>
        </div>
        <Button asChild>
          <Link href="/author/posts/new">নতুন পোস্ট লিখুন</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট পোস্ট</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অনুমোদিত</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">পর্যালোচনাধীন</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ভিউ</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট লাইক</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>আমার পোস্ট ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">আপনার কোন পোস্ট নেই</p>
              <Button asChild>
                <Link href="/author/posts/new">প্রথম পোস্ট লিখুন</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.view_count || 0} ভিউ
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post._count_likes?.[0]?.count || 0} লাইক
                      </span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    {post.rejection_reason && (
                      <p className="text-sm text-destructive">
                        প্রত্যাখ্যানের কারণ: {post.rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {post.status === 'approved' && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/posts/${post.slug}`}>দেখুন</Link>
                      </Button>
                    )}
                    {(post.status === 'draft' || post.status === 'rejected') && (
                      <Button asChild size="sm">
                        <Link href={`/author/posts/${post.id}/edit`}>সম্পাদনা</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
