'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-soft" />;
  }

  const cycle = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const icon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const Icon = icon;

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${theme}. Click to change.`}
      className="relative w-10 h-10 rounded-full border border-soft bg-elev hover:border-strong transition-colors flex items-center justify-center group overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="w-4 h-4 text-fg group-hover:text-cobalt-500 transition-colors" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
