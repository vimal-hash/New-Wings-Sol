import { createClient } from '@supabase/supabase-js';

/**
 * A single quote/lead row as stored in Supabase.
 */
export type Quote = {
  id: string;
  name: string;
  email: string;
  company: string;
  theatre: string | null;
  message: string;
  budget: string | null;
  status: 'new' | 'read' | 'replied';
  created_at: string;
};

/**
 * An admin account row. Only ever read/written through the service-role client
 * (see `createAdminClient`) — RLS denies all access to the anon key.
 */
export type AdminUser = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
  last_login: string | null;
};

/**
 * Typed shape of the Supabase database. Passed to the generic client so
 * `.from('quotes')` is fully typed for reads, inserts, and updates.
 */
export type Database = {
  public: {
    Tables: {
      quotes: {
        Row: Quote;
        // `id`/`created_at` are DB-generated and `status` defaults to 'new'.
        Insert: Omit<Quote, 'id' | 'created_at' | 'status'>;
        Update: Partial<Quote>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id' | 'created_at' | 'last_login' | 'role'> & {
          role?: string;
        };
        Update: Partial<AdminUser>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
  );
}

/**
 * Browser/anon Supabase client used by the public contact form. Access is
 * governed by Row Level Security: the anon key may INSERT quotes but cannot
 * read them, and has no access at all to `admin_users`.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Privileged Supabase client backed by the service-role key, which BYPASSES
 * Row Level Security. Use it only in server components, route handlers, and
 * the NextAuth `authorize` callback for trusted admin operations.
 *
 * NEVER import this into a client component — the service-role key must never
 * reach the browser. (It is read from a non-`NEXT_PUBLIC_` env var, so Next's
 * bundler will throw if you try, but treat this as a hard rule regardless.)
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Set it in .env.local (server-only).',
    );
  }
  return createClient<Database>(supabaseUrl!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default supabase;
