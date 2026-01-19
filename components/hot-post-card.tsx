'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, Flame } from 'lucide-react'

interface HotPostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string | null
    featured_image: string | null
    view_count: number
    reading_time: number | null
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

export function HotPostCard({ post }: HotPostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border">
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
          <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
            <Flame className="mr-1 h-3 w-3" />
            Hot
          </Badge>
        </div>
        
        <div className="p-4">
          {post.categories && (
            <Badge variant="secondary" className="mb-2 text-xs">
              {post.categories.name}
            </Badge>
          )}
          
          <h3 className="mb-2 line-clamp-2 font-bold leading-tight text-balance group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {post.profiles?.avatar_url && (
                <img
                  src={post.profiles.avatar_url || "/placeholder.svg"}
                  alt={post.profiles.full_name}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <span className="truncate">{post.profiles?.full_name}</span>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
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
      </div>
    </Link>
  )
}
