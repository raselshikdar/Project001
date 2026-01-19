import React from "react"
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  Flag,
  MessageSquare, 
  MessageCircle
} from 'lucide-react'

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || (user.profile?.role !== 'moderator' && user.profile?.role !== 'admin')) {
    redirect('/')
  }

  const navigation = [
    { name: 'ড্যাশবোর্ড', href: '/moderator', icon: LayoutDashboard },
    { name: 'পোস্ট পর্যালোচনা', href: '/moderator/posts', icon: FileText },
    { name: 'রিপোর্ট', href: '/moderator/reports', icon: Flag },
    { name: 'কমেন্ট', href: '/moderator/comments', icon: MessageCircle },
    { name: 'ফোরাম', href: '/moderator/forum', icon: MessageSquare },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">মডারেটর প্যানেল</h2>
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
            <Link href="/">হোমে ফিরে যান</Link>
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
