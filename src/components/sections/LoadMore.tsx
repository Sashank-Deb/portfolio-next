'use client';

import {
  type ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { loadMoreLabel, shouldHideLoadMore } from '@/lib/load-more';

interface LoadMoreProps {
  id: string;
  className: string;
  /** Items are server-rendered children; CSS decides how many show per breakpoint. */
  itemSelector: string;
  scrollTargetId: string;
  children: ReactNode;
}

const CASCADE_STEP_S = 0.07;

export function LoadMore({
  id, className, itemSelector, scrollTargetId, children,
}: LoadMoreProps) {
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hiddenCount, setHiddenCount] = useState<number | null>(null);

  const items = useCallback(
    () => Array.from(grid.current?.querySelectorAll<HTMLElement>(itemSelector) ?? []),
    [itemSelector],
  );
  const hiddenItems = useCallback(() => items().filter((el) => getComputedStyle(el).display === 'none'), [items]);

  useEffect(() => {
    const sync = () => setHiddenCount(hiddenItems().length);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [hiddenItems]);

  const toggle = () => {
    if (!open) {
      // The revealed items aren't React-owned (they're server children), so the cascade is applied directly.
      hiddenItems().forEach((el, i) => {
        el.classList.add('is-in', 'is-revealed');
        el.style.setProperty('--wd', `${Math.round(i * CASCADE_STEP_S * 100) / 100}s`);
      });
      setOpen(true);
      return;
    }
    items().forEach((el) => el.classList.remove('is-revealed'));
    setOpen(false);
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  const count = open ? 0 : hiddenCount;
  return (
    <>
      <div className={`${className}${open ? ' is-expanded' : ''}`} id={id} ref={grid}>{children}</div>
      <div className="more-wrap" hidden={count !== null && shouldHideLoadMore(open, count)}>
        <button className="button button--ghost more-btn" type="button" id={id.replace('-grid', '-more')} aria-expanded={open} aria-controls={id} onClick={toggle}>
          <span className="more-btn__label">{count === null ? 'Load more' : loadMoreLabel(open, count)}</span>
          {' '}
          <i className="uil uil-plus" />
        </button>
      </div>
    </>
  );
}
