import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/auth')
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // If user is trying to access protected route without a token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user has token and is on login page, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
