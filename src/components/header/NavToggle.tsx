'use client';

import { useNav } from './NavProvider';

export function NavToggle() {
  const { open, setOpen, toggleRef } = useNav();
  return (
    <button
      ref={toggleRef}
      className="icon-btn nav__toggle"
      id="nav-toggle"
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="nav-menu"
      onClick={() => setOpen(!open)}
    >
      <i className="uil uil-apps" />
    </button>
  );
}
