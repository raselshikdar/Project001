import { getPostBySlug, getComments, getRelatedPosts } from '@/lib/actions/posts'
import { getUser } from '@/lib/actions/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Eye, Clock, Heart } from 'lucide-react'
import Link from 'next/link'
import { PostInteractions } from '@/components/post-interactions'
import { CommentSection } from '@/components/comment-section'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const user = await getUser()
  const comments = await getComments(post.id)
  const relatedPosts = post.category_id 
    ? await getRelatedPosts(post.id, post.category_id) 
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Post Header */}
        <article className="space-y-6">
          {post.category && (
            <Link href={`/category/${post.category.slug}`}>
              <Badge>{post.category.name_bn}</Badge>
            </Link>
          )}

          <h1 className="text-4xl font-bold leading-tight text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground text-pretty">
              {post.excerpt}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link 
              href={`/author/${post.author.username}`}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {post.author.full_name?.[0] || post.author.username[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {post.author.full_name || post.author.username}
                </p>
                <p className="text-xs">@{post.author.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.view_count || 0} বার দেখা হয়েছে
              </span>
              {post.reading_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.reading_time} মিনিট পড়তে
                </span>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Post Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {post.post_tags && post.post_tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">ট্যাগ:</span>
              {post.post_tags.map((pt: any) => (
                <Link key={pt.tag.slug} href={`/tag/${pt.tag.slug}`}>
                  <Badge variant="outline">{pt.tag.name_bn}</Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Interactions */}
          <PostInteractions postId={post.id} userId={user?.id} />

          {/* Author Bio */}
          {post.author.bio && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">লেখক সম্পর্কে</h3>
                <p className="text-muted-foreground">{post.author.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <CommentSection 
            postId={post.id} 
            comments={comments} 
            currentUser={user}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">সম্পর্কিত পোস্ট</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/posts/${related.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {related.excerpt}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {related.author.full_name || related.author.username}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
