'use client';

import { useEffect } from 'react';
import { getSiteSound, soundForElement } from '@/lib/sound';

/** One delegated, capture-phase listener gives every button and link its subtle click sound. */
export function ClickSounds() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const sound = soundForElement(e.target);
      if (sound) getSiteSound().play(sound);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
