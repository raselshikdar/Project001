import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { User, Mail, Award, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { bn } from "date-fns/locale"

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: posts, count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("author_id", user.id)

  const { data: comments, count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("author_id", user.id)

  const { data: threads, count: threadsCount } = await supabase
    .from("forum_threads")
    .select("*", { count: "exact" })
    .eq("author_id", user.id)

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      admin: { label: "অ্যাডমিন", variant: "destructive" },
      moderator: { label: "মডারেটর", variant: "default" },
      author: { label: "লেখক", variant: "secondary" },
      contributor: { label: "অবদানকারী", variant: "outline" },
    }
    const roleInfo = roleMap[role] || { label: role, variant: "outline" }
    return <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/40 py-8">
        <div className="container">
          <div className="flex items-start gap-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.full_name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile?.full_name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                {profile && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    যোগ দিয়েছেন {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: bn })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {profile && getRoleBadge(profile.role)}
                {profile && profile.reputation_points > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Award className="h-3 w-3" />
                    {profile.reputation_points} পয়েন্ট
                  </Badge>
                )}
              </div>
              {profile?.bio && (
                <p className="mt-4 text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{postsCount || 0}</CardTitle>
              <CardDescription>মোট পোস্ট</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {posts?.filter((p) => p.status === "approved").length || 0} অনুমোদিত
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{commentsCount || 0}</CardTitle>
              <CardDescription>মন্তব্য</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                পোস্টে অবদান
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{threadsCount || 0}</CardTitle>
              <CardDescription>ফোরাম থ্রেড</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                আলোচনা শুরু করেছেন
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts?.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: bn })}
                    </div>
                  </div>
                  <Badge variant={post.status === "approved" ? "default" : "outline"}>
                    {post.status}
                  </Badge>
                </div>
              ))}
              {(!posts || posts.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  কোন কার্যকলাপ নেই
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
