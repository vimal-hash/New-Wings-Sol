import type { ReactNode } from 'react';
import AdminSessionProvider from '@/components/admin/AdminSessionProvider';

// Standalone admin shell — intentionally renders no marketing Navbar/Footer.
// Wrapped in SessionProvider so all admin components can read the session.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">{children}</div>
    </AdminSessionProvider>
  );
}
