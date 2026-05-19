import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/auth')
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  let role = 'student';
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);
      role = payload.role || 'student';
    } catch (e) {
      // ignore parsing errors
    }
  }

  // If user is trying to access protected route without a token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Admin route protection: Block students from /admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Student route protection: Block admins from /dashboard
  if (pathname.startsWith('/dashboard') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // If user has token and is on login page, redirect to their respective dashboard
  if (isAuthPage && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
