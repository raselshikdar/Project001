import React from 'react'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from './layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <AdminLayoutClient userName={user.profile?.full_name || user.profile?.username}>
      {children}
    </AdminLayoutClient>
  )
}
