'use client'

import { useState } from 'react'
import { updateUserRole, suspendUser, unsuspendUser } from '@/lib/actions/admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

type User = {
  id: string
  username: string
  full_name: string | null
  role: string
  is_suspended: boolean
  suspended_until: string | null
  created_at: string
}

export function UserManagementClient({ users }: { users: User[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsLoading(userId)
    try {
      await updateUserRole(userId, newRole)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error updating role:', error)
      alert('রোল আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(null)
    }
  }

  const handleSuspend = async (userId: string) => {
    const days = prompt('কত দিনের জন্য সাসপেন্ড করবেন?', '7')
    if (!days) return

    setIsLoading(userId)
    try {
      await suspendUser(userId, parseInt(days))
      router.refresh()
    } catch (error) {
      console.error('[v0] Error suspending user:', error)
      alert('ব্যবহারকারী সাসপেন্ড করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(null)
    }
  }

  const handleUnsuspend = async (userId: string) => {
    setIsLoading(userId)
    try {
      await unsuspendUser(userId)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error unsuspending user:', error)
      alert('ব্যবহারকারী আনসাসপেন্ড করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      admin: 'destructive',
      moderator: 'default',
      author: 'secondary',
      contributor: 'outline',
      user: 'outline',
    }
    return <Badge variant={variants[role] || 'outline'}>{role}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="ইউজারনেম বা নাম দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-sm text-muted-foreground">
          {filteredUsers.length} জন ব্যবহারকারী পাওয়া গেছে
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ইউজারনেম</TableHead>
              <TableHead>পূর্ণ নাম</TableHead>
              <TableHead>রোল</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>যোগদান</TableHead>
              <TableHead>অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={isLoading === user.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="author">Author</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {user.is_suspended ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('bn-BD')}
                </TableCell>
                <TableCell>
                  {user.is_suspended ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnsuspend(user.id)}
                      disabled={isLoading === user.id}
                    >
                      আনসাসপেন্ড
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuspend(user.id)}
                      disabled={isLoading === user.id}
                    >
                      সাসপেন্ড
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
