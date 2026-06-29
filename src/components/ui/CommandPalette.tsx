'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Home,
  Package,
  Phone,
  FileText,
  MessageCircle,
  Sun,
  Settings,
  Monitor,
  Projector,
  Search,
  CornerDownLeft,
  type LucideIcon,
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  category: string;
  action: () => void;
}

function scrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function CommandPalette() {
  const isOpen = useUIStore((s) => s.isCommandPaletteOpen);
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);
  const toggleChat = useUIStore((s) => s.toggleChat);
  const isChatOpen = useUIStore((s) => s.isChatOpen);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const close = () => {
    if (isOpen) toggleCommandPalette();
  };

  const commands: Command[] = useMemo(() => {
    const toggleTheme = () => {
      const next = (resolvedTheme ?? theme) === 'dark' ? 'light' : 'dark';
      setTheme(next);
    };
    return [
      { id: 'home', label: 'Go to Home', icon: Home, category: 'Navigate', action: () => scrollTo('#home') },
      { id: 'products', label: 'Browse Products', icon: Package, category: 'Navigate', action: () => scrollTo('#products') },
      { id: 'contact', label: 'Contact Us', icon: Phone, category: 'Navigate', action: () => scrollTo('#contact') },
      { id: 'quote', label: 'Get a Quote', icon: FileText, category: 'Actions', action: () => scrollTo('#contact') },
      {
        id: 'chat',
        label: 'Open AI Assistant',
        icon: MessageCircle,
        category: 'Actions',
        action: () => {
          if (!isChatOpen) toggleChat();
        },
      },
      { id: 'theme', label: 'Toggle Dark Mode', icon: Sun, category: 'Settings', action: toggleTheme },
      { id: 'admin', label: 'Admin Panel', icon: Settings, category: 'Admin', action: () => window.open('/admin', '_blank') },
      { id: 'galalite', label: 'Galalite Screens', icon: Monitor, category: 'Products', action: () => scrollTo('#products') },
      { id: 'christie', label: 'Christie Projectors', icon: Projector, category: 'Products', action: () => scrollTo('#products') },
    ];
  }, [theme, resolvedTheme, setTheme, toggleChat, isChatOpen]);

  // Fuzzy-ish filter: case-insensitive substring match on the label.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  // Group filtered results by category, preserving command order.
  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of filtered) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Reset state & focus the input each time the palette opens.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      // Focus after the open animation frame.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Keep the selected index in range as results change.
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  // Global Cmd/Ctrl+K listener to open the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleCommandPalette]);

  const runCommand = (cmd: Command) => {
    close();
    // Defer the action slightly so the modal can unmount first.
    setTimeout(() => cmd.action(), 60);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[selected];
      if (cmd) runCommand(cmd);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl rounded-2xl bg-elev border border-strong shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-soft">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, products, actions..."
                aria-label="Search commands"
                className="flex-1 bg-transparent text-fg placeholder:text-muted focus:outline-none text-sm"
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-soft text-muted">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                groups.map(([category, items]) => (
                  <div key={category} className="px-2 py-1">
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted font-semibold">
                      {category}
                    </div>
                    {items.map((cmd) => {
                      const globalIndex = filtered.indexOf(cmd);
                      const isSelected = globalIndex === selected;
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          onClick={() => runCommand(cmd)}
                          onMouseEnter={() => setSelected(globalIndex)}
                          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                            isSelected
                              ? 'bg-cobalt-500 text-white'
                              : 'text-fg hover:bg-soft'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? 'text-white' : 'text-muted'
                            }`}
                          />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-white/80" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
