import type { NextAuthOptions, Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase';
import {
  checkRateLimit,
  registerFailedAttempt,
  resetRateLimit,
} from '@/lib/rate-limit';

// Generic, non-enumerating error surfaced to the client. We never reveal
// whether the email exists or the password was wrong — both map to this.
const INVALID = 'Invalid credentials';

/**
 * www / non-www support.
 *
 * The site serves on both `newwingssolutions.com` and `www.newwingssolutions.com`,
 * and redirects between them. NextAuth's default CSRF/session cookies are
 * host-only, so a redirect mid-login drops them → 401 on the credentials
 * callback. Setting the cookie `domain` to the apex (`.newwingssolutions.com`)
 * makes the cookies valid on BOTH hosts so the login survives the redirect.
 *
 * Enabled only when COOKIE_DOMAIN is set (e.g. `.newwingssolutions.com`), so
 * localhost / preview deployments keep NextAuth's safe host-only defaults.
 * Note: a Domain attribute is illegal on `__Host-` cookies, so in production we
 * use the `__Secure-` prefix instead (still HTTPS-only).
 */
function buildCookieConfig(): NextAuthOptions['cookies'] {
  const domain = process.env.COOKIE_DOMAIN;
  if (!domain) return undefined; // use NextAuth defaults

  const secure = process.env.NODE_ENV === 'production';
  const prefix = secure ? '__Secure-' : '';
  const base = { path: '/', sameSite: 'lax' as const, secure, domain };

  return {
    sessionToken: {
      name: `${prefix}next-auth.session-token`,
      options: { ...base, httpOnly: true },
    },
    callbackUrl: {
      name: `${prefix}next-auth.callback-url`,
      options: { ...base },
    },
    csrfToken: {
      // Must NOT use the __Host- prefix here because we set a Domain.
      name: `${prefix}next-auth.csrf-token`,
      options: { ...base, httpOnly: true },
    },
  };
}

/**
 * Best-effort client IP from the proxy headers Vercel/most hosts set. Used only
 * to rate-limit login attempts, so an imperfect value is acceptable.
 */
function clientIp(headers: Record<string, string> | undefined): string {
  if (!headers) return 'unknown';
  const fwd = headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers['x-real-ip'] ?? 'unknown';
}

export const authOptions: NextAuthOptions = {
  // CredentialsProvider mandates JWT sessions (no DB adapter for sessions).
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  // Share cookies across www + non-www when COOKIE_DOMAIN is configured.
  cookies: buildCookieConfig(),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const ip = clientIp(req?.headers as Record<string, string> | undefined);

        // 1. Rate-limit BEFORE doing any work (cheap, blocks brute force).
        if (!checkRateLimit(ip).allowed) {
          throw new Error('Too many attempts');
        }

        console.error('[auth] attempting login for:', credentials?.email);

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          console.error('[auth] missing email or password in request');
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        // 2. Look up the admin via the service-role client (bypasses RLS).
        //    Wrap creation so a missing/invalid SERVICE_ROLE_KEY is logged
        //    clearly instead of surfacing as a vague failure.
        let admin: ReturnType<typeof createAdminClient>;
        try {
          admin = createAdminClient();
        } catch (e) {
          console.error(
            '[auth] could not create Supabase admin client — check SUPABASE_SERVICE_ROLE_KEY:',
            e instanceof Error ? e.message : e,
          );
          throw new Error(INVALID);
        }

        const { data: user, error } = await admin
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        console.error('[auth] user found:', !!user);

        // 3a. Supabase returned an error (RLS, bad key, table missing, etc.).
        if (error) {
          console.error(
            `[auth] Supabase query error for "${email}":`,
            error.message,
          );
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        // 3b. No matching admin row for this email.
        if (!user) {
          console.error(`[auth] no admin_users row found for email: "${email}"`);
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        // 4. Constant-time password comparison via bcrypt.
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.error('[auth] bcrypt result:', passwordMatch);
        if (!passwordMatch) {
          // 5. Wrong password → generic error (and count the attempt).
          console.error(
            `[auth] bcrypt password mismatch for email: "${email}" ` +
              `(stored hash starts with "${user.password_hash.slice(0, 7)}")`,
          );
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        console.log(`[auth] successful login for: "${email}"`);

        // 6. Success — clear the rate-limit counter and stamp last_login.
        resetRateLimit(ip);
        await admin
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        // 7. Only non-sensitive fields flow into the JWT.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only present on initial sign-in; persist its claims.
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// Trust the incoming Host header so auth works on BOTH www and non-www without
// a hardcoded NEXTAUTH_URL host mismatch. NextAuth v4 auto-trusts host on
// Vercel; we also set it explicitly here (the option isn't in v4's TS type, so
// it's assigned post-definition) for clarity and forward-compat with v5.
(authOptions as { trustHost?: boolean }).trustHost = true;

/**
 * Read the current admin session in a server context (route handlers, server
 * components). Returns null when there is no valid session.
 */
export async function getAdminSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
