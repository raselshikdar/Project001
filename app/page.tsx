import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createServerClient } from '@/lib/supabase/server'
import { FeaturedPostCard } from '@/components/featured-post-card'
import { HotPostCard } from '@/components/hot-post-card'
import { PostCard } from '@/components/post-card'
import { TrendingUp, MessageSquare, Users, Sparkles, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createServerClient()

  // Fetch featured posts (2 posts)
  const { data: featuredPosts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (full_name, avatar_url),
      categories (name, slug)
    `)
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(2)

  // Fetch hot/popular posts (4 posts)
  const { data: hotPosts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (full_name, avatar_url),
      categories (name, slug)
    `)
    .eq('status', 'approved')
    .order('view_count', { ascending: false })
    .limit(4)

  // Fetch recent posts (15 posts)
  const { data: recentPosts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (full_name, avatar_url),
      categories (name, slug)
    `)
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .range(2, 16)

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*, posts(count)')
    .order('name')
    .limit(8)

  // Fetch forum activity
  const { data: forumThreads } = await supabase
    .from('forum_threads')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url),
      forum_replies (count)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary/20 backdrop-blur-sm border-primary/30 hover:bg-primary/30">
              <Sparkles className="mr-1 h-3 w-3" />
              বাংলা টেক কমিউনিটি
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent">
              শিখুন, শেয়ার করুন এবং বাড়ুন
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl text-balance">
              প্রযুক্তি, প্রোগ্রামিং, টিপস এবং ট্রিকস। বাংলা ভাষায় সব কিছু।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/posts">
                  পোস্ট দেখুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                <Link href="/forum">ফোরামে যান</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Featured Posts Section */}
            {featuredPosts && featuredPosts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
                  <h2 className="text-2xl font-bold md:text-3xl">ফিচার্ড পোস্ট</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <FeaturedPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Hot/Popular Posts Section */}
            {hotPosts && hotPosts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-orange-500 to-red-500" />
                  <h2 className="text-2xl font-bold md:text-3xl">হট পোস্ট</h2>
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {hotPosts.map((post) => (
                    <HotPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Posts Section */}
            {recentPosts && recentPosts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-accent to-secondary" />
                    <h2 className="text-2xl font-bold md:text-3xl">সাম্প্রতিক পোস্ট</h2>
                  </div>
                  <Button asChild variant="ghost" className="bg-transparent">
                    <Link href="/posts">সব দেখুন</Link>
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories */}
            <Card className="sticky top-4 overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  বিভাগসমূহ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-primary/10"
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.posts?.[0]?.count || 0}
                    </Badge>
                  </Link>
                ))}
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/categories">সব দেখুন</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Forum Activity */}
            <Card className="overflow-hidden border-accent/20 bg-gradient-to-br from-card to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </div>
                  ফোরাম আপডেট
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {forumThreads?.map((thread) => (
                  <div key={thread.id} className="space-y-2">
                    <Link
                      href={`/forum/thread/${thread.slug}`}
                      className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      {thread.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {thread.profiles?.avatar_url && (
                        <img
                          src={thread.profiles.avatar_url || '/placeholder.svg'}
                          alt={thread.profiles.full_name}
                          className="h-5 w-5 rounded-full"
                        />
                      )}
                      <span>{thread.profiles?.full_name}</span>
                      <span>•</span>
                      <span>{thread.forum_replies?.[0]?.count || 0} উত্তর</span>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/forum">সব দেখুন</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="overflow-hidden border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="rounded-lg bg-secondary/10 p-2">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  কমিউনিটি
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">মোট পোস্ট</span>
                    <span className="text-xl font-bold text-primary">১০০+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">সক্রিয় সদস্য</span>
                    <span className="text-xl font-bold text-accent">৫০০+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ফোরাম থ্রেড</span>
                    <span className="text-xl font-bold text-secondary">২০০+</span>
                  </div>
                </div>
                <Button asChild className="w-full rounded-full">
                  <Link href="/auth/signup">যোগ দিন</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
