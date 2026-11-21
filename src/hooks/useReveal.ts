'use client';

import type { CSSProperties, RefCallback } from 'react';
import { REVEAL_OPTIONS, revealDelay } from '@/lib/reveal';
import { useInView } from './useInView';

/**
 * Reveal-on-scroll for elements whose className React owns (client islands).
 * Server-rendered blocks are revealed by <ViewportEffects /> instead; these opt out with data-reveal="self".
 */
export const useReveal = <T extends Element>(index = 0): [RefCallback<T>, boolean, CSSProperties | undefined] => {
  const [ref, isIn] = useInView<T>(REVEAL_OPTIONS, true);
  const delay = revealDelay(index);
  return [ref, isIn, delay ? ({ '--d': delay } as CSSProperties) : undefined];
};
