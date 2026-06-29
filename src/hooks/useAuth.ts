// Placeholder auth hook. Replaced with real NextAuth in Batch 4.
// Exists now so components that depend on auth can import a stable shape.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  return { user: null, isLoading: false, isAdmin: false };
}

export default useAuth;
