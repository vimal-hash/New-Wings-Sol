'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker on mount. Renders nothing.
 * Registration is skipped in development to avoid SW caching interfering with
 * hot reload, and only runs when the browser supports service workers.
 */
export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('[PWA] Service worker registration failed:', err);
      });
    };

    // Register after the window load event so it never competes with the
    // critical rendering path.
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
