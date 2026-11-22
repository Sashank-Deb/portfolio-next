'use client';

import {
  type CSSProperties,
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import { fitScale } from '@/lib/fit-scale';
import { Pill } from './Pill';

const PEEK_EVERY_MS = 5000;
const PEEK_FOR_MS = 1100;
const EDGE_MARGIN = 20;

type PeekingPillProps = ComponentProps<typeof Pill> & {
  /** When the first peek happens; offset pills so they take turns. */
  firstPeekMs?: number;
  /** Id of a section that has the stage while it's on screen; this pill stays still meanwhile. */
  yieldTo?: string;
  /** Grow up to this factor while peeking, as far as fits on screen (CSS reads --peek-scale). */
  grow?: number;
};

const inViewport = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};

// offsetParent is null when the pill is display: none at this breakpoint.
const isOnScreen = (el: HTMLElement) => el.offsetParent !== null && inViewport(el);

/**
 * While peeking the pill also widens (the Gmail icon slides in) into the margin CSS reserves beside it,
 * so the fit is measured on that footprint: the resting box plus its reserved margins.
 */
const scaleThatFits = (el: HTMLElement, max: number) => {
  const rect = el.getBoundingClientRect();
  const css = getComputedStyle(el);
  const px = (v: string | undefined) => parseFloat(v ?? '') || 0;
  const reservedLeft = px(css.marginLeft);
  const width = rect.width + reservedLeft + px(css.marginRight);
  const origin = parseFloat(css.transformOrigin.split(' ')[0] ?? '');
  const originShare = Number.isNaN(origin) || !rect.width ? 0.5 : origin / rect.width;
  return fitScale({
    left: rect.left - reservedLeft,
    width,
    originX: originShare * width,
    viewport: window.innerWidth,
    margin: EDGE_MARGIN,
    max,
  });
};

/**
 * The contact pill, which every 5s briefly shows its hover state (Gmail slides in) with a subtle buzz.
 * It holds off while the visitor is hovering or focusing it (the real hover state is showing),
 * and picks up again once they leave.
 */
export function PeekingPill({
  firstPeekMs = 2000,
  yieldTo,
  grow,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...pill
}: PeekingPillProps) {
  const reduced = useReducedMotion();
  const [peek, setPeek] = useState(false);
  const [scale, setScale] = useState<number>();
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
      const stage = yieldTo ? document.getElementById(yieldTo) : null;
      if (!el || hover || focus || document.hidden || covered || !isOnScreen(el)) return;
      if (stage && inViewport(stage)) return;
      if (grow) setScale(scaleThatFits(el, grow)); // measured at rest, before the scale applies
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
  }, [reduced, firstPeekMs, yieldTo, grow]);

  const engage = useCallback((key: 'hover' | 'focus', on: boolean) => {
    engaged.current[key] = on;
    if (on) setPeek(false);
  }, []);

  return (
    <Pill
      {...pill}
      ref={ref}
      className={cx(className, peek && 'is-peek')}
      style={scale ? ({ ...style, '--peek-scale': scale } as CSSProperties) : style}
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
