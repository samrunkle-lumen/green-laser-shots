import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessLevel = request.cookies.get('access_level')?.value;

  // Protect admin routes - only admin access allowed
  if (pathname.startsWith('/admin')) {
    if (accessLevel !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect partner routes
  if (pathname.startsWith('/partner')) {
    // Need some access level to view partner pages
    if (!accessLevel) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Watershed access can only view watershed pages
    if (accessLevel === 'watershed' && !pathname.startsWith('/partner/watershed')) {
      return NextResponse.redirect(new URL('/partner/watershed', request.url));
    }

    // Gravity access can only view gravity pages
    if (accessLevel === 'gravity' && !pathname.startsWith('/partner/gravity')) {
      return NextResponse.redirect(new URL('/partner/gravity', request.url));
    }

    return NextResponse.next();
  }

  // Watershed customer pages (slug-based URLs)
  if (pathname.startsWith('/watershed')) {
    if (!accessLevel) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Gravity customer pages (slug-based URLs)
  if (pathname.startsWith('/gravity')) {
    if (!accessLevel) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Customer and property pages are accessible with any valid access level
  if (pathname.startsWith('/customer') || pathname.startsWith('/property')) {
    if (!accessLevel) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/partner/:path*',
    '/watershed/:path*',
    '/gravity/:path*',
    '/customer/:path*',
    '/property/:path*'
  ]
};
