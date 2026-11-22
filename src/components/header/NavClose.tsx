'use client';

import { useNav } from './NavProvider';

export function NavClose() {
  const { setOpen } = useNav();
  return (
    <button
      className="nav__close"
      id="nav-close"
      type="button"
      aria-label="Close menu"
      onClick={() => setOpen(false)}
    >
      <i className="uil uil-times" />
    </button>
  );
}
