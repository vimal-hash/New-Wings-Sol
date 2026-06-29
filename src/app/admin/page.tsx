import { createClient } from '@supabase/supabase-js';
import type { Database, Quote } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';
import CSVImport from '@/components/admin/CSVImport';
import RenovationUpload from '@/components/admin/RenovationUpload';

// SSR: admin always fetches fresh data, never cached
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // TODO: replace with service role in production
  // The anon key only works here because of the temporary dev RLS policy
  // ("Temp anon read for dev"). Reads will return [] until that policy exists.
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  const quotes: Quote[] = data ?? [];

  return (
    <>
      <AdminDashboard quotes={quotes} loadError={error?.message ?? null} />
      {/* Browser-API admin tools, below the quotes table */}
      <div className="bg-[#0a0a0a] text-white px-6 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <CSVImport />
          <RenovationUpload />
        </div>
      </div>
    </>
  );
}

