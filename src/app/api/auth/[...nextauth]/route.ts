import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// The shared `authOptions` (provider, callbacks, rate limiting) live in
// `src/lib/auth.ts` so server components can reuse them via getServerSession.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
