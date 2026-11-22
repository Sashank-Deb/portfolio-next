'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { useInView } from '@/hooks/useInView';
import { countAt } from '@/lib/count-up';

const DURATION_MS = 1400;

const noopSubscribe = () => () => {};
/** False while rendering on the server and during hydration, true in the browser after that. */
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

/**
 * A number that counts up from zero the first time it scrolls into view.
 * The server renders the final number (so it reads right without JavaScript); in the browser it
 * starts from zero, still hidden by the section's reveal, and counts once seen.
 * Screen readers only ever get the final value.
 */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.5 }, true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return undefined;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const next = countAt(now - start, DURATION_MS, to);
      setCount(next);
      if (next < to) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to]);

  const shown = !hydrated || reduced ? to : count;
  return (
    <span className="about__info-title" ref={ref}>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}
