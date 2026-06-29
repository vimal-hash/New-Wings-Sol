'use client';

import { useEffect, useRef } from 'react';

const CHANNEL_NAME = 'nw-admin-auth';
const LOGOUT_MESSAGE = 'logout';

/**
 * Broadcast a logout to every other admin tab.
 *
 * When admin logs out in one tab, all other admin tabs also log out —
 * this posts the 'logout' message on a shared BroadcastChannel that the
 * hook below listens for.
 */
export function broadcastLogout(): void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return;
  }
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage(LOGOUT_MESSAGE);
  channel.close();
}

/**
 * Subscribe the current tab to cross-tab logout events.
 *
 * @param onLogout - called when another tab broadcasts a logout, so this
 *   tab can clear its own local auth state and redirect.
 */
export function useBroadcastLogout(onLogout?: () => void): void {
  // Keep the latest callback without re-subscribing the channel each render.
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);

    const handleMessage = (event: MessageEvent) => {
      if (event.data === LOGOUT_MESSAGE) {
        onLogoutRef.current?.();
      }
    };

    channel.addEventListener('message', handleMessage);

    // Cleanup: close the channel when the component unmounts.
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, []);
}

export default useBroadcastLogout;
