'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mailto } from '@/content/site';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { readStorage, writeStorage } from '@/lib/storage';
import { Pill } from '../ui/Pill';

const PEEK_OFF_KEY = 'pill-peek-off';
const FIRST_PEEK_MS = 2000;
const PEEK_EVERY_MS = 5000;
const PEEK_FOR_MS = 1100;

/**
 * Every 5s the header pill briefly shows its hover state (the Gmail icon slides in) with a subtle buzz.
 * Once the visitor really hovers, focuses or clicks it, peeking stops for the rest of the session.
 */
export function NavContactPill() {
  const reduced = useReducedMotion();
  const [peek, setPeek] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (reduced || stopped || readStorage('session', PEEK_OFF_KEY) === '1') return undefined;
    let interval = 0;
    let hide = 0;
    const doPeek = () => {
      const el = ref.current;
      const covered = document.documentElement.getAttribute('data-intro') === 'play';
      if (!el || document.hidden || covered || el.offsetParent === null) return;
      setPeek(true);
      hide = window.setTimeout(() => setPeek(false), PEEK_FOR_MS);
    };
    const first = window.setTimeout(() => {
      doPeek();
      interval = window.setInterval(doPeek, PEEK_EVERY_MS);
    }, FIRST_PEEK_MS);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, [reduced, stopped]);

  const stop = useCallback(() => {
    if (stopped) return;
    setStopped(true);
    setPeek(false);
    writeStorage('session', PEEK_OFF_KEY, '1');
  }, [stopped]);

  return (
    <Pill
      ref={ref}
      className={`pill--nav${peek ? ' is-peek' : ''}`}
      href={mailto('Hi Sashank')}
      label="Contact"
      avatarSize={36}
      onPointerEnter={stop}
      onFocus={stop}
      onClick={stop}
    />
  );
}
