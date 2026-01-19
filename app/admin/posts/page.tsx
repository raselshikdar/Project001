import { getPendingPosts } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostReviewClient } from './post-review-client'

export default async function PostsReviewPage() {
  const posts = await getPendingPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">পোস্ট পর্যালোচনা</h1>
        <p className="text-muted-foreground">অপেক্ষমাণ পোস্ট অনুমোদন বা প্রত্যাখ্যান করুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>অপেক্ষমাণ পোস্ট ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              কোন অপেক্ষমাণ পোস্ট নেই
            </p>
          ) : (
            <PostReviewClient posts={posts} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
