import { PostEditor } from '@/components/post-editor'
import { getCategories } from '@/lib/actions/author'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

export default async function NewPostPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">নতুন পোস্ট লিখুন</h1>
        <p className="text-muted-foreground">আপনার কন্টেন্ট তৈরি করুন এবং প্রকাশ করুন</p>
      </div>

      <PostEditor categories={categories} authorId={user.id} />
    </div>
  )
}
