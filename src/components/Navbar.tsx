'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Search } from 'lucide-react';
import { NAV_LINKS } from '@/lib/data';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './ui/LanguageSwitcher';
import { useUIStore } from '@/store/ui-store';
import { useTranslation } from '@/i18n';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);
  const { t } = useTranslation();

  // NAV_LINKS labels map 1:1 to nav.* translation keys (e.g. "Home" → nav.home).
  const navLabel = (label: string) => t(`nav.${label.toLowerCase()}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-soft py-3 backdrop-saturate-150'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 flex items-center justify-center font-display font-bold text-white text-lg shadow-md">
            N
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-cobalt-500 to-coral-500 blur opacity-40 group-hover:opacity-70 transition -z-10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold text-base md:text-lg">
              New Wings
            </span>
            <span className="text-[12px] tracking-[0.2em] text-soft mt-1">
              Solutions
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-muted hover:text-fg transition-colors group"
            >
              {navLabel(link.label)}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-cobalt-500 to-coral-500 group-hover:w-3/4 transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger */}
          <button
            type="button"
            onClick={toggleCommandPalette}
            aria-label="Open command palette"
            className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-2 rounded-full border border-soft bg-elev text-muted hover:text-fg hover:border-strong transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-soft text-muted">
              {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full  text-bg font-semibold text-sm hover:scale-105 transition-transform bg-[rgb(84,211,128)]"
            style={{ color: 'var(--bg)' }}
          >
            <Phone className="w-4 h-4" />
            {t('nav.getQuote')}
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-fg"
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden glass border-t border-soft"
          >
            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-muted hover:text-cobalt-500 hover:bg-soft rounded-lg transition-colors"
                >
                  {navLabel(link.label)}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 text-center rounded-lg bg-fg text-bg font-semibold"
                style={{ color: 'var(--bg)' }}
              >
                {t('nav.getQuote')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
