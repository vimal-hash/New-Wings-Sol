import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import type { Quote } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';
import CSVImport from '@/components/admin/CSVImport';
import RenovationUpload from '@/components/admin/RenovationUpload';

// SSR: admin always fetches fresh data, never cached.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Defence in depth: middleware already gates /admin, but we re-check on the
  // server so a direct render can never leak data without a valid session.
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  // Service-role client bypasses RLS, so reads work even though the anon key is
  // (correctly) denied SELECT on quotes. This is the fix for the security hole:
  // the privileged key stays server-side and never reaches the browser.
  const supabase = createAdminClient();

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
