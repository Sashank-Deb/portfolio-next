'use client';

import { useEffect } from 'react';
import { REVEAL_OPTIONS, applyRevealStagger } from '@/lib/reveal';

const SERVER_REVEALS = '[data-reveal]:not([data-reveal="self"])';
const LOOPS = '.portrait, .post-feature';

/**
 * One observer pair for the whole server-rendered page, so static sections ship no JS of their own:
 * - fades [data-reveal] blocks in as they scroll into view, cascading siblings;
 * - pauses the looping decorations (morphing blobs, spinning ring) while they're off screen.
 * Client islands reveal themselves (data-reveal="self") because React owns their className.
 */
export function ViewportEffects() {
  useEffect(() => {
    const reveals = document.querySelectorAll(SERVER_REVEALS);
    applyRevealStagger(reveals);
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, REVEAL_OPTIONS);
    reveals.forEach((el) => revealer.observe(el));

    const loops = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting));
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll(LOOPS).forEach((el) => loops.observe(el));

    return () => {
      revealer.disconnect();
      loops.disconnect();
    };
  }, []);

  return null;
}
