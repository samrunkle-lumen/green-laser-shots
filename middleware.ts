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

    // Tradition access can only view tradition pages
    if (accessLevel === 'tradition' && !pathname.startsWith('/partner/tradition')) {
      return NextResponse.redirect(new URL('/partner/tradition', request.url));
    }

    return NextResponse.next();
  }

  // Customer pages are PUBLIC - no authentication required
  // Partners can share these URLs directly with their customers
  if (pathname.startsWith('/watershed') ||
      pathname.startsWith('/gravity') ||
      pathname.startsWith('/tradition') ||
      pathname.startsWith('/customer') ||
      pathname.startsWith('/property')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/partner/:path*',
  ]
};
