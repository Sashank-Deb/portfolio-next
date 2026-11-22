'use client';

import { type CSSProperties, useEffect, useMemo, useRef } from 'react';
import {
  FIRST_HOLD_MS,
  FLIP_MS,
  HOLD_MS,
  LAND_MS,
  parseScreens,
  randomGlyph,
  screenChars,
  spinSteps,
  tileDelay,
} from '@/lib/flap';
import { getSiteSound } from '@/lib/sound';

const BLANK = ' ';
const CLICK_GAP_MS = 28;
const HALVES = [
  'flap__half flap__half--top',
  'flap__half flap__half--bottom',
  'flap__half flap__half--top flap__leaf flap__leaf--top',
  'flap__half flap__half--bottom flap__leaf flap__leaf--bottom',
];

interface Tile {
  cur: string;
  faces: HTMLSpanElement[];
  leafTop: HTMLElement;
  leafBottom: HTMLElement;
}

const setFace = (span: HTMLSpanElement | undefined, ch: string) => {
  if (!span) return;
  span.textContent = ch === ' ' ? BLANK : ch;
  span.classList.toggle('is-dot', ch === '.');
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Hand-built split-flap board: each tile has two static halves and two hinged leaves animated with
 * the Web Animations API. It starts when it scrolls into view and only clatters while visible.
 * The tiles are rendered (and server-rendered) by React; the flipping writes to them directly,
 * since dozens of glyph changes a second shouldn't go through React renders.
 */
export function Flapboard({ lines, cols = 8 }: { lines: string; cols?: number }) {
  const board = useRef<HTMLSpanElement>(null);
  const screens = useMemo(() => parseScreens(lines), [lines]);
  const rows = Math.max(...screens.map((s) => s.length));

  useEffect(() => {
    const el = board.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiles: Tile[] = Array.from(el.querySelectorAll<HTMLElement>('.flap')).map((t) => {
      const halves = Array.from(t.children) as HTMLElement[];
      return {
        cur: ' ',
        faces: halves.map((h) => h.firstElementChild as HTMLSpanElement),
        leafTop: halves[2] as HTMLElement,
        leafBottom: halves[3] as HTMLElement,
      };
    });

    let alive = true;
    let visible = false;
    let lastClick = 0;
    const click = () => {
      if (!visible || document.hidden) return;
      const now = performance.now();
      if (now - lastClick < CLICK_GAP_MS) return;
      lastClick = now;
      getSiteSound().play('flap');
    };

    const flipOnce = async (t: Tile, next: string, dur: number) => {
      const [sTop, sBot, lTop, lBot] = t.faces;
      setFace(sTop, next);
      setFace(lTop, t.cur);
      setFace(lBot, next);
      await t.leafTop.animate(
        [
          { transform: 'rotateX(0deg)', filter: 'brightness(1)' },
          { transform: 'rotateX(-90deg)', filter: 'brightness(.55)' },
        ],
        { duration: dur * 0.5, easing: 'cubic-bezier(.55, 0, 1, .45)', fill: 'forwards' },
      ).finished;
      await t.leafBottom.animate(
        [
          { transform: 'rotateX(90deg)', filter: 'brightness(1.5)' },
          { transform: 'rotateX(0deg)', filter: 'brightness(1)' },
        ],
        { duration: dur * 0.5, easing: 'cubic-bezier(0, .55, .45, 1)', fill: 'forwards' },
      ).finished;
      click();
      setFace(sBot, next);
      setFace(lTop, next);
      t.leafTop.getAnimations().forEach((a) => a.cancel());
      t.leafBottom.getAnimations().forEach((a) => a.cancel());

      t.cur = next;
    };

    const spin = async (t: Tile, target: string, delay: number) => {
      if (t.cur === target) return;
      await wait(delay);
      const steps = spinSteps(Math.random);
      for (let i = 0; i < steps && alive; i += 1) {
        await flipOnce(t, randomGlyph(Math.random, [target, t.cur]), FLIP_MS);
      }
      if (alive) await flipOnce(t, target, LAND_MS);
    };

    const show = (i: number) => {
      const chars = screenChars(screens[i] ?? [], rows, cols);
      if (reduced) {
        tiles.forEach((t, k) => {
          const ch = chars[k] ?? ' ';
          t.faces.forEach((f) => setFace(f, ch));

          t.cur = ch;
        });
        return Promise.resolve();
      }
      return Promise.all(
        tiles.map((t, k) => spin(t, chars[k] ?? ' ', tileDelay(Math.floor(k / cols), k % cols))),
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const waitVisible = async () => {
      while (alive && (!visible || document.hidden)) await wait(250);
    };

    (async () => {
      let idx = 0;
      await waitVisible(); // the first flip happens when the footer comes into view
      if (!alive) return;
      await show(idx);
      if (reduced || screens.length < 2) return;
      while (alive) {
        await wait(idx === 0 ? FIRST_HOLD_MS : HOLD_MS);

        await waitVisible();
        if (!alive) return;
        idx = (idx + 1) % screens.length;

        await show(idx);
      }
    })();

    return () => {
      alive = false;
      io.disconnect();
    };
  }, [screens, rows, cols]);

  return (
    <span
      className="flapboard flapboard--footer"
      data-flap
      aria-hidden="true"
      ref={board}
      style={{ '--cols': cols } as CSSProperties}
    >
      {Array.from({ length: rows * cols }, (_, k) => (
        <span className="flap" key={k}>
          {HALVES.map((cls) => (
            <span className={cls} key={cls}>
              <span>{BLANK}</span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
