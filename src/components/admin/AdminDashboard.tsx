'use client';

import { Fragment, useMemo, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import type { Quote } from '@/lib/supabase';
import { useBroadcastLogout } from '@/hooks/useBroadcastLogout';
import AdminHeader from '@/components/admin/AdminHeader';

const STATUS_DOT: Record<Quote['status'], { color: string; label: string }> = {
  new: { color: '#16A35C', label: 'New' },
  read: { color: '#EAB308', label: 'Read' },
  replied: { color: '#9CA3AF', label: 'Replied' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function AdminDashboard({
  quotes,
  loadError,
}: {
  quotes: Quote[];
  loadError?: string | null;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { status } = useSession();

  // When another tab logs out, drop this tab's session and bounce to login.
  useBroadcastLogout(() => {
    signOut({ callbackUrl: '/admin/login' });
  });

  const stats = useMemo(() => {
    const total = quotes.length;
    const newCount = quotes.filter((q) => q.status === 'new').length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = quotes.filter(
      (q) => new Date(q.created_at).getTime() >= weekAgo,
    ).length;
    return { total, newCount, thisWeek };
  }, [quotes]);

  // While NextAuth resolves the session, show a light skeleton instead of the
  // table (the route is already gated server-side, so this is purely cosmetic).
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-white/5" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 rounded-2xl bg-white/5" />
            <div className="h-24 rounded-2xl bg-white/5" />
            <div className="h-24 rounded-2xl bg-white/5" />
          </div>
          <div className="h-64 rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <AdminHeader />

        {loadError && (
          <div className="mb-8 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            Could not load quotes: {loadError}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Quotes', value: stats.total },
            { label: 'New', value: stats.newCount },
            { label: 'This Week', value: stats.thisWeek },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/5 border border-white/10 px-6 py-5"
            >
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-white/40">
                    No quotes yet.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const dot = STATUS_DOT[q.status] ?? STATUS_DOT.new;
                  const isExpanded = expandedId === q.id;
                  return (
                    <Fragment key={q.id}>
                      <tr
                        onClick={() =>
                          setExpandedId(isExpanded ? null : q.id)
                        }
                        className="border-t border-white/10 cursor-pointer hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{q.name}</td>
                        <td className="px-4 py-3 text-white/70">{q.company}</td>
                        <td className="px-4 py-3 text-white/70">
                          {q.budget ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-white/70">
                          {truncate(q.message)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: dot.color }}
                            />
                            {dot.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                          {formatDate(q.created_at)}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-t border-white/5 bg-white/[0.02]">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">
                              Full message · {q.email}
                              {q.theatre ? ` · ${q.theatre}` : ''}
                            </div>
                            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                              {q.message}
                            </p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
