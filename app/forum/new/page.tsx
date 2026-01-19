import { redirect } from "next/navigation"
import { NewThreadForm } from "./new-thread-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function NewThreadPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: categories } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name")

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">নতুন থ্রেড তৈরি করুন</h1>
        <p className="text-muted-foreground mt-2">
          একটি প্রশ্ন জিজ্ঞাসা করুন বা আলোচনা শুরু করুন
        </p>
      </div>

      <NewThreadForm categories={categories || []} />
    </div>
  )
}
