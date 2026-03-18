import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  
  // Read the auth hint cookie
  const authHint = request.cookies.get('pentasent_auth_hint')?.value === 'true';

  // If visiting an auth page but already logged in (according to hint), 
  // redirect to the feed instantly.
  if (isAuthPage && authHint) {
    return NextResponse.redirect(new URL('/app/feed', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on the specific auth pages for performance
export const config = {
  matcher: ['/signin', '/signup'],
};
