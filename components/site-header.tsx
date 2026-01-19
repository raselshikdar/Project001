"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Search, PenSquare, Home, BookOpen, MessageSquare, Sparkles } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setProfile(data)
      }
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!profile) return "/auth/login"
    switch (profile.role) {
      case "admin":
        return "/admin"
      case "moderator":
        return "/moderator"
      case "author":
        return "/author"
      case "contributor":
        return "/author"
      default:
        return "/"
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full max-w-[100vw] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              বাংলা টেক
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/" ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              হোম
            </Link>
            <Link
              href="/posts"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/posts") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              পোস্ট
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/categories") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              বিভাগ
            </Link>
            <Link
              href="/forum"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/forum") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              ফোরাম
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="খুঁজুন..."
                  className="pl-9 rounded-full border-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <Button size="icon" variant="ghost" className="lg:hidden bg-transparent">
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button asChild size="sm" className="hidden md:flex rounded-full">
                  <Link href="/author/posts/new">
                    <PenSquare className="mr-2 h-4 w-4" />
                    লিখুন
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="bg-transparent">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt={profile.full_name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                        <p className="text-xs text-muted-foreground">{profile?.role || "user"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>ড্যাশবোর্ড</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">প্রোফাইল</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      লগ আউট
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                  <Link href="/auth/login">লগইন</Link>
                </Button>
                <Button asChild size="sm" className="hidden md:flex rounded-full">
                  <Link href="/auth/signup">সাইন আপ</Link>
                </Button>
              </>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden bg-transparent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <nav className="container flex flex-col gap-2 py-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                হোম
              </Link>
              <Link
                href="/posts"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                পোস্ট
              </Link>
              <Link
                href="/forum"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                ফোরাম
              </Link>
              {!user && (
                <>
                  <DropdownMenuSeparator />
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    সাইন আপ
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-[100vw] border-t bg-background/95 backdrop-blur md:hidden supports-[backdrop-filter]:bg-background/60">
        <nav className="flex items-center justify-around py-3 px-2 max-w-full">
          <Link href="/" className="flex flex-col items-center gap-1 text-xs">
            <Home className={`h-5 w-5 ${pathname === "/" ? "text-primary" : ""}`} />
            <span className={pathname === "/" ? "text-primary font-medium" : ""}>হোম</span>
          </Link>
          <Link href="/posts" className="flex flex-col items-center gap-1 text-xs">
            <BookOpen className={`h-5 w-5 ${pathname?.startsWith("/posts") ? "text-primary" : ""}`} />
            <span className={pathname?.startsWith("/posts") ? "text-primary font-medium" : ""}>পোস্ট</span>
          </Link>
          <Link href={user ? "/author/posts/new" : "/auth/login"}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-secondary shadow-lg">
              <PenSquare className="h-6 w-6 text-white" />
            </div>
          </Link>
          <Link href="/forum" className="flex flex-col items-center gap-1 text-xs">
            <MessageSquare className={`h-5 w-5 ${pathname?.startsWith("/forum") ? "text-primary" : ""}`} />
            <span className={pathname?.startsWith("/forum") ? "text-primary font-medium" : ""}>ফোরাম</span>
          </Link>
          <Link href={user ? "/profile" : "/auth/login"} className="flex flex-col items-center gap-1 text-xs">
            <User className={`h-5 w-5 ${pathname?.startsWith("/profile") ? "text-primary" : ""}`} />
            <span className={pathname?.startsWith("/profile") ? "text-primary font-medium" : ""}>প্রোফাইল</span>
          </Link>
        </nav>
      </div>
    </>
  )
}
