'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RequestCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryNameBn, setCategoryNameBn] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName || !categoryNameBn) {
      alert('ইংরেজি এবং বাংলা নাম উভয়ই প্রয়োজন')
      return
    }

    setIsLoading(true)
    try {
      // In a real application, this would create a category request
      // For now, we'll just show a success message
      alert(
        'আপনার ক্যাটাগরি অনুরোধ জমা দেওয়া হয়েছে। অ্যাডমিন পর্যালোচনা করবেন।'
      )
      router.push('/author')
    } catch (error) {
      console.error('[v0] Error requesting category:', error)
      alert('ক্যাটাগরি অনুরোধ করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/author/posts/new">
            <ArrowLeft className="mr-2 h-4 w-4" />
            পোস্ট তৈরিতে ফিরে যান
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">নতুন ক্যাটাগরি অনুরোধ করুন</h1>
        <p className="text-muted-foreground">
          যদি আপনার প্রয়োজনীয় ক্যাটাগরি না থাকে, তাহলে নতুন ক্যাটাগরির অনুরোধ করুন
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ক্যাটাগরি তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">ক্যাটাগরি নাম (ইংরেজি) *</Label>
              <Input
                id="name"
                placeholder="e.g., Web Development"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_bn">ক্যাটাগরি নাম (বাংলা) *</Label>
              <Input
                id="name_bn"
                placeholder="যেমন: ওয়েব ডেভেলপমেন্ট"
                value={categoryNameBn}
                onChange={(e) => setCategoryNameBn(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
              <Textarea
                id="description"
                placeholder="এই ক্যাটাগরিটি কেন প্রয়োজন তা ব্যাখ্যা করুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'অনুরোধ পাঠানো হচ্ছে...' : 'অনুরোধ পাঠান'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                বাতিল
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
