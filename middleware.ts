import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect partner pages
  if (request.nextUrl.pathname.startsWith('/partner/')) {
    const accessKey = request.cookies.get('partner_access_key')?.value;
    const urlAccessKey = request.nextUrl.searchParams.get('access');

    const validAccessKey = process.env.PARTNER_ACCESS_KEY || 'lumen2024';

    // Check if access key is valid (from cookie or URL)
    if (accessKey === validAccessKey || urlAccessKey === validAccessKey) {
      // If coming from URL, set cookie
      if (urlAccessKey === validAccessKey && !accessKey) {
        const response = NextResponse.next();
        response.cookies.set('partner_access_key', validAccessKey, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        return response;
      }

      return NextResponse.next();
    }

    // Redirect to access gate if no valid key
    const accessGateUrl = new URL('/access', request.url);
    accessGateUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(accessGateUrl);
  }

  // Customer pages are public (meant to be shared)
  return NextResponse.next();
}

export const config = {
  matcher: ['/partner/:path*']
};
