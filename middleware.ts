import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Get the language from the URL
  const lang = request.nextUrl.searchParams.get('lang') || 'fr';

  // Create a response
  const response = NextResponse.next();

  // Set language-specific metadata
  if (lang === 'en') {
    response.headers.set(
      'x-metadata',
      JSON.stringify({
        title: 'Vocca demos',
        description: 'Demonstration of Vocca use cases - Specialized conversational agents for the medical sector',
        locale: 'en_US',
      })
    );
  } else {
    response.headers.set(
      'x-metadata',
      JSON.stringify({
        title: 'Vocca démos',
        description: 'Démonstration des cas d\'usage Vocca - Agents conversationnels spécialisés pour le secteur médical',
        locale: 'fr_FR',
      })
    );
  }

  return response;
}

export const config = {
  matcher: '/:path*',
}; 