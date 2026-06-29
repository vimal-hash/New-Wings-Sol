'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

/**
 * Client wrapper so the server-rendered admin layout can still provide a
 * NextAuth session context to every admin component (useSession, useAuth).
 */
export default function AdminSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
