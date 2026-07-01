import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';

// The shared `authOptions` (provider, callbacks, rate limiting) live in
// `src/lib/auth.ts` so server components can reuse them via getServerSession.
const handler = NextAuth(authOptions);

// ---------------------------------------------------------------------------
// TEMPORARY DIAGNOSTIC WRAPPER
//
// Symptom under investigation: the credentials login returns
//   "Error: Callback for provider type credentials not supported"
// That exact NextAuth error is ONLY produced when the credentials callback is
// reached with a NON-POST method (next-auth/core/routes/callback.ts). In other
// words, a POST to /api/auth/callback/credentials is arriving here as a GET —
// which means something UPSTREAM of this function (a www<->apex or http->https
// redirect, a proxy, etc.) is rewriting the method (301/302/303 downgrade a
// POST to a GET).
//
// These logs surface the ground truth in Vercel logs on the NEXT login attempt.
// Remove this wrapper (revert to `export { handler as GET, handler as POST }`)
// once the root cause is confirmed.
// ---------------------------------------------------------------------------
function logRequest(tag: 'GET' | 'POST', req: NextRequest) {
  try {
    console.error(
      `[auth-route] ${tag} hit`,
      JSON.stringify({
        method: req.method,
        url: req.url,
        pathname: req.nextUrl.pathname,
        host: req.headers.get('host'),
        xfHost: req.headers.get('x-forwarded-host'),
        xfProto: req.headers.get('x-forwarded-proto'),
        origin: req.headers.get('origin'),
        referer: req.headers.get('referer'),
        hasCookie: Boolean(req.headers.get('cookie')),
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? '(unset)',
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? '(unset)',
        NODE_ENV: process.env.NODE_ENV,
      }),
    );
  } catch {
    // Never let logging break auth.
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: { nextauth: string[] } },
) {
  logRequest('GET', req);
  // A GET reaching /callback/credentials is the smoking gun for the method
  // downgrade described above — flag it loudly.
  if (req.nextUrl.pathname.includes('/callback/credentials')) {
    console.error(
      '[auth-route] !!! GET on /callback/credentials — the login POST was ' +
        'downgraded to GET before reaching this function (redirect upstream). ' +
        'This is the cause of "Callback for provider type credentials not supported".',
    );
  }
  return handler(req, ctx);
}

export async function POST(
  req: NextRequest,
  ctx: { params: { nextauth: string[] } },
) {
  logRequest('POST', req);
  return handler(req, ctx);
}
