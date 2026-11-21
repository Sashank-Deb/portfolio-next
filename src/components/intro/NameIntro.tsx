'use client';

import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { INTRO_SEEN_KEY } from '@/lib/intro';
import { introStore } from '@/lib/intro-store';
import { writeStorage } from '@/lib/storage';
import { cx } from '@/lib/cx';

type Phase = 'hidden' | 'play' | 'static';

const BOOT_BEAT_MS = 300;
const FONT_WAIT_MS = 700;
const PLAY_MS = 4300;
const STATIC_MS = 1900;
const SKIP_MARKER_MS = 700;

declare global {
  interface Window { __opClaimed?: boolean }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = () => document.documentElement;

/**
 * First-visit name intro ("S." → "Sashank" → "Deb"). Whether it plays is decided before paint by the
 * inline intro gate; this island claims the curtain, plays it, and lifts it.
 */
export function NameIntro() {
  const [phase, setPhase] = useState<Phase>('hidden');
  // A new run remounts the curtain so every CSS animation starts from frame zero.
  const [run, setRun] = useState(0);
  const op = useRef<HTMLDivElement>(null);

  const done = useCallback(() => {
    setPhase('hidden');
    root().removeAttribute('data-intro');
    root().classList.remove('op-covering');
    introStore.setReplayAvailable(true);
  }, []);

  const play = useCallback(() => {
    writeStorage('local', INTRO_SEEN_KEY, '1');
    setRun((r) => r + 1);
    setPhase(reducedMotion() ? 'static' : 'play');
  }, []);

  // While it plays: the curtain is opaque, so the page can sit ready underneath; Escape or a timeout ends it.
  useLayoutEffect(() => {
    if (phase === 'hidden') return undefined;
    root().classList.add('op-covering');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') done(); };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(done, phase === 'static' ? STATIC_MS : PLAY_MS);
    const fade = phase === 'static'
      ? op.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 400, delay: 1200, easing: 'ease', fill: 'forwards',
      })
      : undefined;
    if (fade) fade.onfinish = done;
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(timer);
      fade?.cancel();
    };
  }, [phase, run, done]);

  useEffect(() => {
    const mode = root().getAttribute('data-intro');
    const url = new URL(window.location.href);
    if (url.searchParams.get('intro') === 'replay') {
      url.searchParams.delete('intro');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }

    let skipTimer = 0;
    let cancelled = false;
    if (mode === 'play') {
      window.__opClaimed = true; // tell the inline safety net the curtain is ours from here
      const fonts = document.fonts?.ready ?? Promise.resolve();
      Promise.all([
        new Promise((r) => { setTimeout(r, BOOT_BEAT_MS); }),
        Promise.race([fonts, new Promise((r) => { setTimeout(r, FONT_WAIT_MS); })]),
      ]).then(() => { if (!cancelled) play(); });
    } else {
      introStore.setReplayAvailable(true);
      if (mode === 'skip') skipTimer = window.setTimeout(() => root().removeAttribute('data-intro'), SKIP_MARKER_MS);
    }

    const offReplay = introStore.onReplay(() => {
      window.scrollTo(0, 0);
      play();
    });
    return () => {
      cancelled = true;
      clearTimeout(skipTimer);
      offReplay();
    };
  }, [play]);

  return (
    // The curtain is a pointer-only shortcut; keyboard users have Escape and the Skip button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      key={run}
      ref={op}
      className={cx('op', phase === 'play' && 'is-play', phase === 'static' && 'is-static')}
      data-opener
      hidden={phase === 'hidden'}
      onClick={done}
      onAnimationEnd={(e) => { if (phase === 'play' && e.target === e.currentTarget) done(); }}
    >
      <div className="op__pre" aria-hidden="true">
        <div className="op__pre-mark">
          S
          <span>.</span>
        </div>
        <div className="op__pre-band">
          <span className="op__pre-red" />
          <span className="op__pre-mustard" />
        </div>
      </div>
      <div className="op__cut op__s1" aria-hidden="true">
        <div className="op__wipe" />
        <div className="op__mark">
          S
          <span>.</span>
        </div>
      </div>
      <div className="op__cut op__s2" aria-hidden="true">
        <div className="op__crop">Sashank</div>
      </div>
      <div className="op__cut op__s3" aria-hidden="true">
        <div className="op__stack">
          <span className="op__off op__off--m">Deb</span>
          <span className="op__off op__off--r">Deb</span>
          <span className="op__word">Deb</span>
        </div>
      </div>
      <button className="op__skip" type="button" data-op-skip>
        Skip intro
        {' '}
        <span className="op__esc">· Esc</span>
      </button>
    </div>
  );
}
