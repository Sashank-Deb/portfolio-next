'use client';

import { useNav } from './NavProvider';

export function NavLink({ id, label, icon }: { id: string; label: string; icon: string }) {
  const { activeId, setOpen } = useNav();
  return (
    <a
      href={`#${id}`}
      className={`nav__link${activeId === id ? ' active-link' : ''}`}
      onClick={() => setOpen(false)}
    >
      <i className={`uil ${icon} nav__icon`} /> {label}
    </a>
  );
}
