'use client';

import { useScrolledPast } from '@/hooks/useScrolledPast';

export function ScrollUp() {
  const show = useScrolledPast(640);
  return (
    <a href="#home" className={`scrollup${show ? ' show-scroll' : ''}`} id="scroll-up" aria-label="Back to top">
      <i className="uil uil-arrow-up" />
    </a>
  );
}
