"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { createThread } from "@/lib/actions/forum"
import { useToast } from "@/hooks/use-toast"

interface NewThreadFormProps {
  categories: any[]
}

export function NewThreadForm({ categories }: NewThreadFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createThread(title, content, categoryId)

      if (result.error) {
        toast({
          title: "ত্রুটি",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "সফল!",
          description: "থ্রেড তৈরি হয়েছে",
        })
        router.push(`/forum/thread/${result.slug}`)
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "একটি ত্রুটি ঘটেছে",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>থ্রেড বিবরণ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">বিভাग</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="একটি বিভাগ নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">শিরোনাম</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="আপনার প্রশ্ন বা বিষয়..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">বিবরণ</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="বিস্তারিত লিখুন..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !title || !content || !categoryId}>
              {loading ? "তৈরি হচ্ছে..." : "থ্রেড তৈরি করুন"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              বাতিল
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
