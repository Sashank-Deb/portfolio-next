'use client';

import Image from 'next/image';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { Project } from '@/content/projects';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import { useInView } from '@/hooks/useInView';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import { mergeRefs } from '@/lib/refs';
import { Chips } from '../ui/Chips';

const HOVER_DELAY_MS = 120;

/**
 * Expanding project cards. On wide screens one card is open at a time; a progress bar
 * auto-advances while the section is on screen, pausing on hover or focus.
 * Below 901px the cards are a plain stacked list.
 */
export function FeatureCards({
  projects,
  revealIndex = 0,
}: {
  projects: Project[];
  revealIndex?: number;
}) {
  const wide = useMediaQuery('(min-width: 901px)');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  // Bumped on every change so each progress bar remounts and its animation restarts.
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimer = useRef(0);
  const cards = useRef<(HTMLElement | null)[]>([]);

  const [revealRef, revealed, revealStyle] = useReveal<HTMLDivElement>(revealIndex);
  const [playRef, onScreen] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const [loopRef, nearScreen] = useInView<HTMLDivElement>({ rootMargin: '100px 0px' }, false, true);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const open = (index: number) => {
    const next = (index + projects.length) % projects.length;
    if (next === active) return;
    setActive(next);
    setCycle((c) => c + 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>, i: number) => {
    if (!wide) return;
    if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      open(i);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + projects.length) % projects.length;
      open(next);
      cards.current[next]?.focus();
    }
  };

  return (
    <div
      className={cx(
        'feat',
        revealed && 'is-in',
        onScreen && !reduced && 'is-playing',
        paused && 'is-paused',
        !nearScreen && 'is-offscreen',
      )}
      id="feat"
      data-reveal="self"
      style={revealStyle}
      ref={mergeRefs(revealRef, playRef, loopRef)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="feat__cards">
        {projects.map((p, i) => {
          const on = i === active;
          return (
            // A roving, carousel-style card: focusable, activated by click, hover, Enter/Space and the arrow keys.
            // It holds real links, so it can't itself be a button.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <article
              key={p.name}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={`feat__card${on ? ' is-active' : ''}`}
              data-index={i}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              aria-label={p.name}
              onClick={() => {
                if (wide) open(i);
              }}
              onMouseEnter={() => {
                if (!wide) return;
                clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => open(i), HOVER_DELAY_MS);
              }}
              onMouseLeave={() => clearTimeout(hoverTimer.current)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <header className="feat__label">
                <span className="feat__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="feat__lead">{p.name}</span>
                <span className="feat__rest">{p.kind}</span>
              </header>
              <div className="feat__track">
                <span
                  key={cycle}
                  className="feat__fill"
                  onAnimationEnd={() => {
                    if (wide && on) open(active + 1);
                  }}
                />
              </div>
              <div className="feat__body">
                <a
                  className="feat__media"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                >
                  <Image
                    src={p.image}
                    alt={p.alt}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 900px) 92vw, 760px"
                  />
                </a>
                <div className="feat__info">
                  <p>{p.description}</p>
                  <div className="feat__foot">
                    <Chips items={p.chips} />
                    <a
                      className="link-arrow"
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={on || !wide ? 0 : -1}
                    >
                      Visit site <i className="uil uil-arrow-up-right" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
