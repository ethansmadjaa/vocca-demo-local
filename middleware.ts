import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Get the language from the URL
  const lang = request.nextUrl.searchParams.get('lang') || 'fr';

  // Create a response
  const response = NextResponse.next();

  // Temporarily commented out header logic for debugging - NOW RE-ENABLING WITH SIMPLE VALUES
  // /*
  // Set language-specific metadata
  if (lang === 'en') {
    response.headers.set(
      'x-metadata',
      JSON.stringify({
        title: 'Vocca demos',
        description: 'Demonstration of Vocca use cases - Specialized conversational agents for the medical sector',
        locale: 'en_US',
      })
      // 'test-en' // Simple value for testing
    );
  } else {
    response.headers.set(
      'x-metadata',
      JSON.stringify({
        title: 'Vocca démos',
        description: "Démonstration des cas d'usage Vocca - Agents conversationnels spécialisés pour le secteur médical", // Use standard apostrophe
        locale: 'fr_FR',
      })
      // 'test-fr' // Simple value for testing
    );
  }
  // */

  return response;
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