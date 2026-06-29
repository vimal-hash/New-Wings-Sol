'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  layoutId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<Tabs.${component}> must be used inside <Tabs>`);
  }
  return ctx;
}

let tabsCounter = 0;

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
}

function Tabs({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  // Unique layoutId per Tabs instance so multiple Tabs on a page don't share
  // the same animated indicator.
  const [layoutId] = useState(() => `tabs-indicator-${tabsCounter++}`);

  const value = controlledValue ?? internal;
  const setValue = (v: string) => {
    if (controlledValue === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue, layoutId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-soft ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function Trigger({ value, children }: { value: string; children: ReactNode }) {
  const { value: active, setValue, layoutId } = useTabs('Trigger');
  const isActive = active === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
        isActive ? 'text-cobalt-500' : 'text-muted hover:text-fg'
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId={layoutId}
          className="absolute left-0 right-0 -bottom-px h-0.5 bg-cobalt-500"
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  );
}

function Content({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { value: active } = useTabs('Content');
  if (active !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="tabpanel"
      className={className}
    >
      {children}
    </motion.div>
  );
}

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;

export default Tabs;
