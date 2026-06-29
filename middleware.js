/**
 * Next.js Middleware — Route Protection
 * 
 * Runs on every request before the page loads.
 * - Unauthenticated users trying to access protected routes → redirect to /login
 * - Authenticated users trying to access /login or /register → redirect to /
 * - Public paths (API, static assets, auth pages) are always accessible
 */
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'pawtrack_session';

// Paths that don't require authentication
const publicPaths = ['/login', '/register'];

// Paths that should be completely ignored by middleware
const ignoredPaths = ['/api/', '/_next/', '/favicon.ico'];

// Static asset extensions to ignore
const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.css', '.js', '.woff', '.woff2', '.ttf'];

function getSecret() {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_pawtrack_2026';
  return new TextEncoder().encode(secret);
}

async function verifyToken(token) {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, Next.js internals, and static files
  if (ignoredPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  if (staticExtensions.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const session = sessionCookie ? await verifyToken(sessionCookie.value) : null;

  const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'));

  // Unauthenticated user trying to access protected route → redirect to login
  if (!session && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login/register → redirect to dashboard
  if (session && isPublicPath) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except API, _next, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
