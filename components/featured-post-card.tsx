'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { bn } from 'date-fns/locale'

interface FeaturedPostCardProps {
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

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="aspect-[16/9] overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary via-accent to-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {post.categories && (
            <Badge className="mb-4 w-fit bg-primary/90 backdrop-blur-sm hover:bg-primary">
              {post.categories.name}
            </Badge>
          )}
          
          <h3 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl text-balance">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 text-sm text-white/90 md:text-base text-pretty">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 md:text-sm">
            <div className="flex items-center gap-2">
              {post.profiles?.avatar_url && (
                <img
                  src={post.profiles.avatar_url || "/placeholder.svg"}
                  alt={post.profiles.full_name}
                  className="h-8 w-8 rounded-full border-2 border-white/20"
                />
              )}
              <span className="font-medium">{post.profiles?.full_name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {post.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} মিনিট</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.view_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
