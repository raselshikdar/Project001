import { getModeratorStats, getPendingReports } from '@/lib/actions/moderator'
import { getPendingPosts } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Flag, MessageCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ModeratorDashboard() {
  const stats = await getModeratorStats()
  const pendingPosts = await getPendingPosts()
  const reports = await getPendingReports()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">মডারেটর ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground">কন্টেন্ট মডারেশন এবং কমিউনিটি পরিচালনা</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অপেক্ষমাণ পোস্ট</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট রিপোর্ট</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">রিপোর্টেড কমেন্ট</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportedComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">রিপোর্টেড থ্রেড</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportedThreads}</div>
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
            <Link href="/moderator/posts">পোস্ট পর্যালোচনা</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/moderator/reports">রিপোর্ট দেখুন</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/moderator/comments">কমেন্ট মডারেশন</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/moderator/forum">ফোরাম মডারেশন</Link>
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
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/moderator/posts/${post.id}`}>পর্যালোচনা করুন</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>সাম্প্রতিক রিপোর্ট ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">কোন রিপোর্ট নেই</p>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{report.report_type}</h3>
                    <p className="text-sm text-muted-foreground">
                      রিপোর্টার: {report.reporter?.username} • কারণ: {report.reason}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/moderator/reports/${report.id}`}>পর্যালোচনা করুন</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
