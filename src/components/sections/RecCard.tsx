'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { type Recommendation, RECOMMENDATIONS_URL, avatarFor } from '@/content/recommendations';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import { LinkedInMark } from '../ui/icons';

const COLLAPSED_LINES = 6;

/** A tweet-style LinkedIn recommendation that clamps to six lines with a Show more toggle. */
export function RecCard({ rec, revealIndex = 0 }: { rec: Recommendation; revealIndex?: number }) {
  const text = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [short, setShort] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string>();
  const [revealRef, revealed, revealStyle] = useReveal<HTMLElement>(revealIndex);

  useEffect(() => {
    const measure = () => {
      const el = text.current;
      if (!el) return;
      const collapsed = parseFloat(getComputedStyle(el).lineHeight) * COLLAPSED_LINES;
      setShort(el.scrollHeight <= collapsed + 4);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggle = () => {
    const next = !open;
    setMaxHeight(next ? `${text.current?.scrollHeight ?? 0}px` : undefined);
    setOpen(next);
  };

  return (
    <article
      className={cx('rec', revealed && 'is-in', short && 'is-short', open && 'is-open')}
      data-reveal="self"
      style={revealStyle}
      ref={revealRef}
    >
      <header className="rec__head">
        <Image
          className="rec__avatar"
          src={avatarFor(rec.id)}
          alt={rec.name}
          width={96}
          height={96}
          unoptimized
        />
        <div className="rec__who">
          <h3 className="rec__name">{rec.name}</h3>
          <p className="rec__role" title={rec.role}>
            {rec.role}
          </p>
          <p className="rec__rel">{rec.relation}</p>
        </div>
        <LinkedInMark />
      </header>
      <div className="rec__text" ref={text} style={maxHeight ? { maxHeight } : undefined}>
        {rec.paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>
      <footer className="rec__foot">
        <button className="rec__more" type="button" aria-expanded={open} onClick={toggle}>
          {open ? 'Show less' : 'Show more'}
        </button>
        <a
          className="rec__link"
          href={RECOMMENDATIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read on LinkedIn <i className="uil uil-arrow-up-right" />
        </a>
      </footer>
    </article>
  );
}
