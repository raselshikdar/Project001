'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  label?: string
  disabled?: boolean
  bucket?: 'post-images' | 'avatars'
  folder?: string
}

export function ImageUpload({
  value,
  onChange,
  label = 'ছবি আপলোড করুন',
  disabled = false,
  bucket = 'post-images',
  folder = 'thumbnails',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('শুধুমাত্র ছবি ফাইল আপলোড করুন')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ছবির সাইজ সর্বোচ্চ ৫MB হতে পারবে')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে')
      }

      onChange(data.url)
    } catch (error: any) {
      console.error('[v0] Upload error:', error)
      setError(error.message || 'আপলোড ব্যর্থ হয়েছে')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={value || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="hidden"
              id={`image-upload-${bucket}-${folder}`}
            />
            <Button
              type="button"
              variant="outline"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {label}
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, GIF - সর্বোচ্চ ৫MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
