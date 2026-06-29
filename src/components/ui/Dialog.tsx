'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DialogContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(component: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(`<Dialog.${component}> must be used inside <Dialog>`);
  }
  return ctx;
}

function Dialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function Trigger({
  children,
  className,
  asChild,
}: {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const { setOpen } = useDialog('Trigger');

  // asChild lets callers wrap an existing element without nesting buttons.
  if (asChild) {
    return (
      <span onClick={() => setOpen(true)} className={className}>
        {children}
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setOpen(true)} className={className}>
      {children}
    </button>
  );
}

function Content({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { open, setOpen } = useDialog('Content');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, setOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-elev border border-strong shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-soft">
              <h2 className="font-display text-2xl text-fg leading-tight">{title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-soft hover:bg-soft/70 transition-colors"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

Dialog.Trigger = Trigger;
Dialog.Content = Content;

export default Dialog;
