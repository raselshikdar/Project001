import React from 'react'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { AuthorLayoutClient } from './layout-client'

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (
    !user ||
    !['author', 'admin', 'moderator', 'contributor'].includes(user.profile?.role || '')
  ) {
    redirect('/')
  }

  return (
    <AuthorLayoutClient userName={user.profile?.full_name || user.profile?.username}>
      {children}
    </AuthorLayoutClient>
  )
}
