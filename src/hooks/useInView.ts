'use client';

import { type RefCallback, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Observe an element with IntersectionObserver.
 * With `once`, the value latches to true the first time the element is seen (reveal-on-scroll).
 * `initial` is the value before the observer first reports (and during server rendering).
 */
export const useInView = <T extends Element>(
  options: IntersectionObserverInit,
  once = false,
  initial = false,
): [RefCallback<T>, boolean] => {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(initial);
  const { rootMargin, threshold } = options;
  const optionsRef = useRef({ rootMargin, threshold });

  useEffect(() => {
    if (!node) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (once) {
          if (!entry.isIntersecting) return;
          setInView(true);
          io.unobserve(entry.target);
          return;
        }
        setInView(entry.isIntersecting);
      });
    }, optionsRef.current);
    io.observe(node);
    return () => io.disconnect();
  }, [node, once]);

  return [setNode, inView];
};
