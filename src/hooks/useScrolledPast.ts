'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * True once the page is scrolled further than `threshold` pixels.
 * Scroll events are coalesced to one read per animation frame, and the component only
 * re-renders when the boolean flips, not on every scroll.
 */
export const useScrolledPast = (threshold: number): boolean => {
  const subscribe = useCallback((onChange: () => void) => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        onChange();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
};
