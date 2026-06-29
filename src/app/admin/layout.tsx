import type { ReactNode } from 'react';

// Standalone admin shell — intentionally renders no marketing Navbar/Footer.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0a0a0a] text-white">{children}</div>;
}
