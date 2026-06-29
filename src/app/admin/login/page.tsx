'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Security note: we show ONE generic error ("Invalid email or password") for
// every failure mode so the form never lets an attacker enumerate accounts.
// Credentials are never logged. Do not add console.log of email/password.

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError('Invalid email or password');
      return;
    }

    // Success — go to the originally requested page (or /admin).
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 flex items-center justify-center font-bold text-white text-xl mb-4">
            N
          </div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-white/50 mt-1">New Wings Solutions</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-cobalt-500 transition-colors disabled:opacity-50"
              placeholder="admin@newwingssolutions.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-white/70">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 pr-11 text-sm outline-none focus:border-cobalt-500 transition-colors disabled:opacity-50"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cobalt-500 to-coral-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  // useSearchParams requires a Suspense boundary for static prerender.
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginForm />
    </Suspense>
  );
}
