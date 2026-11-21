'use client';

import type { ReactNode } from 'react';
import { useScrolledPast } from '@/hooks/useScrolledPast';

export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useScrolledPast(12);
  return <header className={`header${scrolled ? ' scroll-header' : ''}`} id="header">{children}</header>;
}
