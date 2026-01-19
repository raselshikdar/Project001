import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Refresh session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/admin', '/moderator', '/author']
    const isProtectedPath = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Role-based access control
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Admin-only routes
      if (
        request.nextUrl.pathname.startsWith('/admin') &&
        profile?.role !== 'admin'
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Moderator routes (moderators and admins)
      if (
        request.nextUrl.pathname.startsWith('/moderator') &&
        profile?.role !== 'moderator' &&
        profile?.role !== 'admin'
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Author routes
      if (
        request.nextUrl.pathname.startsWith('/author') &&
        !['admin', 'moderator', 'author', 'contributor'].includes(
          profile?.role || ''
        )
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  } catch (error) {
    console.error('[v0] Middleware error:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
