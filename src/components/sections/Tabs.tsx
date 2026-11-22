'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  panel: ReactNode;
}

interface Indicator {
  width: number;
  x: number;
}

/** Accessible tabs with a sliding indicator. Panels are server-rendered and passed in. */
export function Tabs({ label, tabs }: { label: string; tabs: TabItem[] }) {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback(() => {
    const btn = buttons.current[active];
    if (btn) setIndicator({ width: btn.offsetWidth, x: btn.offsetLeft });
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={label} data-reveal>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            className={`tabs__btn${i === active ? ' is-active' : ''}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={tab.id}
            id={`tab-${tab.id}`}
            tabIndex={i === active ? undefined : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <i className={`uil ${tab.icon}`} /> {tab.label}
          </button>
        ))}
        <span
          className="tabs__indicator"
          aria-hidden="true"
          style={
            indicator
              ? { width: `${indicator.width}px`, transform: `translateX(${indicator.x}px)` }
              : undefined
          }
        />
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className={`tabs__panel${i === active ? ' is-active' : ''}`}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== active}
        >
          {tab.panel}
        </div>
      ))}
    </>
  );
}
