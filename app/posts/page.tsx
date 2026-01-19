import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import { Search } from "lucide-react"
import { Suspense } from "react"
import Loading from "@/components/loading"

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (full_name, avatar_url),
      categories (name, slug),
      post_tags (tags (name, slug))
    `)
    .eq("status", "approved")

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,content.ilike.%${params.q}%`)
  }

  if (params.category) {
    query = query.eq("category_id", params.category)
  }

  const { data: posts } = await query
    .order("published_at", { ascending: false })
    .limit(50)

  // Fetch all categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Fetch all tags for filter
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name")
    .limit(20)

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/40 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">সব পোস্ট</h1>
          <form className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="পোস্ট খুঁজুন..."
                defaultValue={params.q}
                className="pl-9"
              />
            </div>
            <Button type="submit">খুঁজুন</Button>
          </form>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">বিভাগ</h3>
              <div className="space-y-2">
                <Link
                  href="/posts"
                  className={!params.category ? "block px-3 py-2 rounded-md bg-muted font-medium" : "block px-3 py-2 rounded-md hover:bg-muted"}
                >
                  সব বিভাগ
                </Link>
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/posts?category=${category.id}`}
                    className={params.category === category.id ? "block px-3 py-2 rounded-md bg-muted font-medium" : "block px-3 py-2 rounded-md hover:bg-muted"}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">জনপ্রিয় ট্যাগ</h3>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    asChild
                  >
                    <Link href={`/posts?tag=${tag.id}`}>{tag.name}</Link>
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              {posts?.length || 0} টি পোস্ট পাওয়া গেছে
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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
                      {post.categories && (
                        <Badge variant="secondary" className="text-xs">
                          {post.categories.name}
                        </Badge>
                      )}
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
                <p className="text-muted-foreground">কোন পোস্ট পাওয়া যায়নি</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
