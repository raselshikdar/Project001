'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, Heart, Bookmark } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string | null
    featured_image: string | null
    view_count: number
    reading_time: number | null
    published_at: string
    profiles: {
      full_name: string
      avatar_url: string | null
    } | null
    categories: {
      name: string
      slug: string
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {post.featured_image ? (
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
          )}
        </div>
        
        <div className="p-5">
          {post.categories && (
            <Badge variant="secondary" className="mb-3 text-xs">
              {post.categories.name}
            </Badge>
          )}
          
          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-balance group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground text-pretty">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.profiles?.avatar_url && (
                <img
                  src={post.profiles.avatar_url || "/placeholder.svg"}
                  alt={post.profiles.full_name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <div className="text-xs">
                <p className="font-medium truncate max-w-[100px]">{post.profiles?.full_name}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {post.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.reading_time}মি</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.view_count}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
