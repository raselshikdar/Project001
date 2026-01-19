import { getDashboardStats, getPendingPosts } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Clock, MessageSquare, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const pendingPosts = await getPendingPosts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground">প্ল্যাটফর্ম পরিচালনা এবং পর্যবেক্ষণ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ব্যবহারকারী</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">অপেক্ষমাণ পোস্ট</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ফোরাম থ্রেড</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalThreads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মন্তব্য</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>দ্রুত অ্যাকশন</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/users">ব্যবহারকারী পরিচালনা</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/posts">পোস্ট পর্যালোচনা</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/categories">ক্যাটাগরি পরিচালনা</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reports">রিপোর্ট দেখুন</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/forum">ফোরাম সেটিংস</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Pending Posts */}
      <Card>
        <CardHeader>
          <CardTitle>অপেক্ষমাণ পোস্ট ({pendingPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">কোন অপেক্ষমাণ পোস্ট নেই</p>
          ) : (
            <div className="space-y-4">
              {pendingPosts.slice(0, 5).map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      লেখক: {post.author?.full_name || post.author?.username}
                      {post.category && ` • ${post.category.name_bn}`}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/admin/posts/${post.id}`}>পর্যালোচনা করুন</Link>
                  </Button>
                </div>
              ))}
              {pendingPosts.length > 5 && (
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/admin/posts">সব দেখুন ({pendingPosts.length})</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
