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

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        // 2. Look up the admin via the service-role client (bypasses RLS).
        const admin = createAdminClient();
        const { data: user, error } = await admin
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        // 3. No such user → generic error (and count the attempt).
        if (error || !user) {
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

        // 4. Constant-time password comparison via bcrypt.
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
          // 5. Wrong password → generic error (and count the attempt).
          registerFailedAttempt(ip);
          throw new Error(INVALID);
        }

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

/**
 * Read the current admin session in a server context (route handlers, server
 * components). Returns null when there is no valid session.
 */
export async function getAdminSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
