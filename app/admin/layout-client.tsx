'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderTree,
  MessageSquare,
  Flag,
  Settings,
  Menu,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
  { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
  { name: 'পোস্ট পর্যালোচনা', href: '/admin/posts', icon: FileText },
  { name: 'ক্যাটাগরি', href: '/admin/categories', icon: FolderTree },
  { name: 'ফোরাম', href: '/admin/forum', icon: MessageSquare },
  { name: 'রিপোর্ট', href: '/admin/reports', icon: Flag },
  { name: 'সেটিংস', href: '/admin/settings', icon: Settings },
]

export function AdminLayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode
  userName?: string
}) {
  const [open, setOpen] = useState(false)

  const Sidebar = () => (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold">অ্যাডমিন প্যানেল</h2>
        <p className="text-sm text-muted-foreground">{userName}</p>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setOpen(false)}
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
          <Link href="/" onClick={() => setOpen(false)}>
            হোমে ফিরে যান
          </Link>
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-muted/40 p-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  )
}
