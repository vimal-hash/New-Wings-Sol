'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * Thin convenience wrapper over NextAuth's useSession for admin components.
 * Requires a <SessionProvider> ancestor (provided by the admin layout).
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'admin',
    isAuthenticated: status === 'authenticated',
    signIn,
    signOut,
  };
}

export default useAuth;
