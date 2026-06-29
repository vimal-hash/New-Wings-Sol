'use client';

import { useUIStore } from '@/store/ui-store';
import type { Locale } from '@/i18n';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' },
];

export default function LanguageSwitcher() {
  const locale = useUIStore((s) => s.locale);
  const setLocale = useUIStore((s) => s.setLocale);

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-soft bg-elev p-0.5">
      {LOCALES.map((l) => {
        const active = locale === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={active}
            aria-label={`Switch language to ${l.label}`}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              active
                ? 'bg-cobalt-500 text-white'
                : 'text-muted hover:text-fg'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
