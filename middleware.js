import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// This function runs on every request that matches the 'matcher'
export async function middleware(request) {
  const sessionCookie = request.cookies.get('session');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (!sessionCookie) {
    // If no cookie, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the cookie is valid
    await jwtVerify(sessionCookie.value, secret);
    // All good, let the user proceed
    return NextResponse.next();

  } catch (error) {
    // Invalid or expired cookie, redirect to login
    console.warn('Session verification failed:', error.code);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session-expired'); // Optional error
    
    // Delete the invalid cookie by setting a new one that expires immediately
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('session', '', { maxAge: 0, path: '/' });
    return response;
  }
}

// Config to define which routes are protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};