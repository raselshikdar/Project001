import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-card/80 border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">ইমেইল যাচাই করুন</CardTitle>
            <CardDescription>
              আপনার ইমেইলে একটি যাচাইকরণ লিংক পাঠানো হয়েছে
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              আপনার অ্যাকাউন্ট সক্রিয় করতে অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং যাচাইকরণ লিংকে ক্লিক করুন।
            </p>
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium mb-2">ইমেইল পাননি?</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>স্প্যাম/জাঙ্ক ফোল্ডার চেক করুন</li>
                <li>কয়েক মিনিট অপেক্ষা করুন</li>
                <li>ইমেইল ঠিকানা সঠিক কিনা নিশ্চিত করুন</li>
              </ul>
            </div>
            <Button asChild className="w-full">
              <Link href="/auth/login">লগইন পেজে ফিরে যান</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
