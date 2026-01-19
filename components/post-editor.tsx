'use client'

import React from "react"

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
import { uploadPostImage } from '@/lib/utils/upload'
import { ImagePlus, Loader2 } from 'lucide-react'

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
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('শুধুমাত্র ইমেজ ফাইল আপলোড করতে পারবেন')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ইমেজের সাইজ ৫MB এর বেশি হতে পারবে না')
      return
    }

    setIsUploadingImage(true)
    setUploadError('')

    try {
      const { url, error } = await uploadPostImage(file, 'thumbnail')
      
      if (error || !url) {
        setUploadError(error || 'ইমেজ আপলোড ব্যর্থ হয়েছে')
        return
      }

      setFeaturedImage(url)
      
      // Create local preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('[v0] Image upload error:', error)
      setUploadError('ইমেজ আপলোড করতে সমস্যা হয়েছে')
    } finally {
      setIsUploadingImage(false)
    }
  }

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">ক্যাটাগরি</Label>
              <a
                href="/author/categories/request"
                className="text-xs text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                নতুন ক্যাটাগরি অনুরোধ করুন
              </a>
            </div>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
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

          <div className="space-y-3">
            <Label>ফিচার্ড ইমেজ</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-border p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage || isLoading}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center justify-center py-8">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">আপলোড হচ্ছে...</p>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">ছবি আপলোড করুন</p>
                        <p className="text-xs text-muted-foreground">বা ক্লিক করে নির্বাচন করুন (৫MB পর্যন্ত)</p>
                      </>
                    )}
                  </div>
                </div>
                {uploadError && (
                  <p className="text-sm text-destructive mt-2">{uploadError}</p>
                )}
              </div>
              {imagePreview && (
                <div className="w-32">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
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
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <p className="w-full">
                HTML, Markdown এবং BB Code সাপোর্ট করে। উদাহরণ:
              </p>
              <code className="bg-muted px-2 py-1 rounded">[b]বোল্ড[/b]</code>
              <code className="bg-muted px-2 py-1 rounded">[i]ইটালিক[/i]</code>
              <code className="bg-muted px-2 py-1 rounded">[img]url[/img]</code>
              <code className="bg-muted px-2 py-1 rounded">[url=link]টেক্সট[/url]</code>
              <code className="bg-muted px-2 py-1 rounded">[code]কোড[/code]</code>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleSubmit('draft')}
              variant="outline"
              disabled={isLoading || isUploadingImage}
            >
              খসড়া হিসেবে সংরক্ষণ করুন
            </Button>
            <Button
              onClick={() => handleSubmit('pending')}
              disabled={isLoading || isUploadingImage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  জমা দিচ্ছি...
                </>
              ) : (
                'পর্যালোচনার জন্য জমা দিন'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading || isUploadingImage}
            >
              বাতিল
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
