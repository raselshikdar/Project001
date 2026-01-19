import { getAllUsers } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserManagementClient } from './user-management-client'

export default async function UsersPage() {
  const users = await getAllUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ব্যবহারকারী পরিচালনা</h1>
        <p className="text-muted-foreground">সকল ব্যবহারকারীর তালিকা এবং রোল পরিচালনা</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল ব্যবহারকারী ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagementClient users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
