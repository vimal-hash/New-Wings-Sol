'use client';

import { signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { broadcastLogout } from '@/hooks/useBroadcastLogout';

/**
 * Top bar for the admin area: branding on the left, the signed-in user and a
 * logout button on the right.
 */
export default function AdminHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  function handleLogout() {
    // Tell other open admin tabs to drop their session too, then sign out.
    broadcastLogout();
    signOut({ callbackUrl: '/admin/login' });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 flex items-center justify-center font-bold text-white text-lg">
          NW
        </div>
        <h1 className="text-2xl font-semibold">
          NW Solutions —{' '}
          <span className="bg-gradient-to-r from-cobalt-500 to-coral-500 bg-clip-text text-transparent">
            Admin
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right leading-tight">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-white/50">{user.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
