import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) {
    notFound()
  }

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (full_name, avatar_url),
      categories (name, slug),
      post_tags (tags (name, slug))
    `)
    .eq("status", "approved")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/40 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <div className="mt-4 text-sm text-muted-foreground">
            {posts?.length || 0} টি পোস্ট
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {post.featured_image && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {post.post_tags?.slice(0, 2).map((pt: any) => (
                    <Badge key={pt.tags.slug} variant="outline" className="text-xs">
                      {pt.tags.name}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-balance">
                  <Link href={`/posts/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </CardTitle>
                {post.excerpt && (
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {post.profiles?.avatar_url && (
                      <img
                        src={post.profiles.avatar_url || "/placeholder.svg"}
                        alt={post.profiles.full_name}
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <span>{post.profiles?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{post.view_count} ভিউ</span>
                    {post.reading_time && <span>{post.reading_time} মিনিট</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">এই বিভাগে কোন পোস্ট নেই</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
