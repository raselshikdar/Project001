'use client'

import React from "react"
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Loading from './loading'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile to determine redirect
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        // Role-based redirect
        switch (profile?.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'moderator':
            router.push('/moderator')
            break
          case 'author':
          case 'contributor':
            router.push('/author')
            break
          default:
            router.push('/')
        }
        router.refresh()
      }
    } catch (error: any) {
      console.error('[v0] Login error:', error)
      setError(error.message || 'একটি ত্রুটি ঘটেছে')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-card/80 border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">লগইন করুন</CardTitle>
            <CardDescription className="text-center">
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loading />}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                </Button>
              </form>
            </Suspense>
            <div className="mt-4 text-center text-sm">
              অ্যাকাউন্ট নেই?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                সাইন আপ করুন
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
