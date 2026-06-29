import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes under /admin that must stay public (the login page itself, plus its
// own assets if any). Everything else under /admin requires a valid session.
const ADMIN_PUBLIC_PREFIXES = ['/admin/login'];

function isAdminPublic(pathname: string): boolean {
  return ADMIN_PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // getToken validates the JWT signature/expiry using NEXTAUTH_SECRET.
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthed = Boolean(token);

  // --- Protected upload APIs: respond 401 JSON, never redirect. ---
  if (pathname.startsWith('/api/upload')) {
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // --- Admin area ---
  if (pathname.startsWith('/admin')) {
    // Already-authenticated users should never see the login page.
    if (isAdminPublic(pathname)) {
      if (isAuthed && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // Any other /admin route requires a session.
    if (!isAuthed) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run middleware for the routes we actually gate — keeps it off the
// public marketing site, /api/auth, /api/chat, /api/stock, etc.
export const config = {
  matcher: ['/admin/:path*', '/api/upload/:path*'],
};
