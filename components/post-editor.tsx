'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { createPost } from '@/lib/actions/author'

type Category = {
  id: string
  name: string
  name_bn: string
  slug: string
}

export function PostEditor({
  categories,
  authorId,
}: {
  categories: Category[]
  authorId: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')

  const handleSubmit = async (status: 'draft' | 'pending') => {
    if (!title || !content) {
      alert('শিরোনাম এবং কন্টেন্ট প্রয়োজন')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('excerpt', excerpt)
      formData.append('content', content)
      formData.append('category_id', categoryId)
      formData.append('status', status)
      formData.append('featured_image', featuredImage)

      await createPost(formData, authorId)
      router.push('/author')
    } catch (error) {
      console.error('[v0] Error creating post:', error)
      alert('পোস্ট তৈরি করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">শিরোনাম *</Label>
            <Input
              id="title"
              placeholder="পোস্টের শিরোনাম লিখুন..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
            <Textarea
              id="excerpt"
              placeholder="পোস্টের সংক্ষিপ্ত বিবরণ (১-২ লাইন)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">ক্যাটাগরি</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name_bn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_image">ফিচার্ড ইমেজ URL</Label>
            <Input
              id="featured_image"
              placeholder="https://..."
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">কন্টেন্ট *</Label>
            <Textarea
              id="content"
              placeholder="আপনার পোস্টের মূল কন্টেন্ট লিখুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="font-mono"
              required
            />
            <p className="text-sm text-muted-foreground">
              HTML এবং Markdown সাপোর্ট করে। কোড ব্লক, লিংক, ইমেজ ইত্যাদি যোগ করতে পারবেন।
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleSubmit('draft')}
              variant="outline"
              disabled={isLoading}
            >
              খসড়া হিসেবে সংরক্ষণ করুন
            </Button>
            <Button
              onClick={() => handleSubmit('pending')}
              disabled={isLoading}
            >
              পর্যালোচনার জন্য জমা দিন
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              বাতিল
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
