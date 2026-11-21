'use client';

import type { ReactNode } from 'react';
import { useNav } from './NavProvider';

export function NavMenu({ children }: { children: ReactNode }) {
  const { open, menuRef } = useNav();
  return <div className={`nav__menu${open ? ' show-menu' : ''}`} id="nav-menu" ref={menuRef}>{children}</div>;
}
