import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AuthorPostsPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      categories (name, slug),
      post_tags (tags (name))
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">খসড়া</Badge>
      case "pending":
        return <Badge variant="secondary">পর্যালোচনায়</Badge>
      case "approved":
        return <Badge className="bg-green-500">অনুমোদিত</Badge>
      case "rejected":
        return <Badge variant="destructive">প্রত্যাখ্যাত</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">আমার পোস্ট</h1>
          <p className="text-muted-foreground">আপনার সব পোস্ট দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Button asChild>
          <Link href="/author/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            নতুন পোস্ট
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(post.status)}
                    {post.categories && (
                      <Badge variant="secondary">{post.categories.name}</Badge>
                    )}
                  </div>
                  <CardTitle>
                    <Link href={`/author/posts/edit/${post.id}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </CardTitle>
                  {post.excerpt && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  )}
                </div>
                {post.featured_image && (
                  <img
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{post.view_count} ভিউ</span>
                  {post.reading_time && <span>{post.reading_time} মিনিট পড়ার সময়</span>}
                  {post.post_tags && post.post_tags.length > 0 && (
                    <span>{post.post_tags.length} ট্যাগ</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/author/posts/edit/${post.id}`}>সম্পাদনা</Link>
                  </Button>
                  {post.status === "approved" && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/posts/${post.slug}`}>দেখুন</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!posts || posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>কোন পোস্ট নেই</CardTitle>
            <CardDescription>
              আপনার প্রথম পোস্ট তৈরি করে শুরু করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/author/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                নতুন পোস্ট তৈরি করুন
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
