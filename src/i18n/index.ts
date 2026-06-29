'use client';

import { useUIStore } from '@/store/ui-store';
import en from './en.json';
import ta from './ta.json';
import hi from './hi.json';

export type Locale = 'en' | 'ta' | 'hi';

const translations: Record<Locale, typeof en> = { en, ta, hi };

export function useTranslation() {
  const locale = useUIStore((state) => state.locale);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale as Locale];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return (value as string) ?? key;
  };

  return { t, locale };
}
