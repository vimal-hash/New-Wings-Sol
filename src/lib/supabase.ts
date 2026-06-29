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
 * Browser/anon Supabase client used by the contact form and (temporarily)
 * the admin dashboard. Reads use the public anon key, so access is governed
 * by Row Level Security policies on the `quotes` table.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
