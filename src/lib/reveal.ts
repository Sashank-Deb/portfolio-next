/** Items that reveal together cascade in 80ms steps, capped so long lists don't drag. */
export const revealDelay = (index: number): string | undefined => (
  index > 0 ? `${(Math.min(index, 6) * 8) / 100}s` : undefined
);

/** Give each [data-reveal] element its stagger delay based on its revealing siblings. */
export const applyRevealStagger = (elements: Iterable<Element>): void => {
  Array.from(elements).forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    const siblings = Array.from(parent.children).filter((c) => c.hasAttribute('data-reveal'));
    const delay = revealDelay(siblings.indexOf(el));
    if (delay && el instanceof HTMLElement) el.style.setProperty('--d', delay);
  });
};

export const REVEAL_OPTIONS: IntersectionObserverInit = { rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
