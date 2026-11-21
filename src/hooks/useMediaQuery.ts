'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Subscribe to a CSS media query. Renders `false` on the server and during hydration. */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

export const useReducedMotion = (): boolean => useMediaQuery('(prefers-reduced-motion: reduce)');
