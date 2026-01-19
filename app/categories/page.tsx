import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { FolderOpen } from "lucide-react"

export default async function CategoriesPage() {
  const supabase = await createServerClient()

  const { data: categories } = await supabase
    .from("categories")
    .select(`
      *,
      posts (count)
    `)
    .is("parent_id", null)
    .order("name")

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/40 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">সব বিভাগ</h1>
          <p className="text-muted-foreground">
            বিষয় অনুযায়ী পোস্ট ব্রাউজ করুন
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      <Link href={`/categories/${category.slug}`} className="hover:text-primary">
                        {category.name}
                      </Link>
                    </CardTitle>
                    {category.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {category.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {category.posts?.[0]?.count || 0}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {!categories || categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">কোন বিভাগ পাওয়া যায়নি</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
