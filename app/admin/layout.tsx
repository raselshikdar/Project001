import React from "react"
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FolderTree, 
  MessageSquare, 
  Flag,
  Settings
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const navigation = [
    { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
    { name: 'পোস্ট পর্যালোচনা', href: '/admin/posts', icon: FileText },
    { name: 'ক্যাটাগরি', href: '/admin/categories', icon: FolderTree },
    { name: 'ফোরাম', href: '/admin/forum', icon: MessageSquare },
    { name: 'রিপোর্ট', href: '/admin/reports', icon: Flag },
    { name: 'সেটিংস', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">অ্যাডমিন প্যানেল</h2>
          <p className="text-sm text-muted-foreground">{user.profile?.full_name}</p>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="mt-8">
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/dashboard">ড্যাশবোর্ডে ফিরে যান</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
