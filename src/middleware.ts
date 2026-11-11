import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/** Guards /portal and /admin: refreshes the Supabase session and sends signed-out visitors to the login page. */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return NextResponse.next()

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const onLogin = path.startsWith('/portal/login')

  if (!user && !onLogin) {
    const login = request.nextUrl.clone()
    login.pathname = '/portal/login'
    login.search = ''
    login.searchParams.set('next', path)
    return NextResponse.redirect(login)
  }
  if (user && onLogin) {
    const home = request.nextUrl.clone()
    home.pathname = '/portal'
    home.search = ''
    return NextResponse.redirect(home)
  }
  return response
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
}
