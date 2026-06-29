import type { DefaultSession } from 'next-auth';

// Augment NextAuth's types so `session.user.id`/`role` and the JWT claims are
// strongly typed everywhere (callbacks, getServerSession, useSession).
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  // Shape returned by `authorize()` / passed to the `jwt` callback as `user`.
  interface User {
    id: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
