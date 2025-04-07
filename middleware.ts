import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Optional: You could keep lang extraction if needed for other purposes,
  // but it's not needed for the removed header logic.
  // const pathname = request.nextUrl.pathname;
  // const lang = request.nextUrl.searchParams.get('lang') || 'fr';

  // Simply pass the request through
  return NextResponse.next();
}

// Update the config to be more specific about which paths to match
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 