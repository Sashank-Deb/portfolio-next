'use client';

import { type ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import { Pill } from './Pill';

const PEEK_EVERY_MS = 5000;
const PEEK_FOR_MS = 1100;

type PeekingPillProps = ComponentProps<typeof Pill> & {
  /** When the first peek happens; offset pills so they take turns. */
  firstPeekMs?: number;
};

const isOnScreen = (el: HTMLElement) => {
  if (el.offsetParent === null) return false; // display: none at this breakpoint
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};

/**
 * The contact pill, which every 5s briefly shows its hover state (Gmail slides in) with a subtle buzz.
 * It holds off while the visitor is hovering or focusing it (the real hover state is showing),
 * and picks up again once they leave.
 */
export function PeekingPill({
  firstPeekMs = 2000,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...pill
}: PeekingPillProps) {
  const reduced = useReducedMotion();
  const [peek, setPeek] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const engaged = useRef({ hover: false, focus: false });

  useEffect(() => {
    if (reduced) return undefined;
    let interval = 0;
    let hide = 0;
    const doPeek = () => {
      const el = ref.current;
      const { hover, focus } = engaged.current;
      const covered = document.documentElement.getAttribute('data-intro') === 'play';
      if (!el || hover || focus || document.hidden || covered || !isOnScreen(el)) return;
      setPeek(true);
      hide = window.setTimeout(() => setPeek(false), PEEK_FOR_MS);
    };
    const first = window.setTimeout(() => {
      doPeek();
      interval = window.setInterval(doPeek, PEEK_EVERY_MS);
    }, firstPeekMs);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, [reduced, firstPeekMs]);

  const engage = useCallback((key: 'hover' | 'focus', on: boolean) => {
    engaged.current[key] = on;
    if (on) setPeek(false);
  }, []);

  return (
    <Pill
      {...pill}
      ref={ref}
      className={cx(className, peek && 'is-peek')}
      onPointerEnter={(e) => {
        engage('hover', true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        engage('hover', false);
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        engage('focus', true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        engage('focus', false);
        onBlur?.(e);
      }}
    />
  );
}
