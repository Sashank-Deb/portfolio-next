'use client';

import {
  type ReactNode,
  type RefObject,
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface NavState {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

const NavContext = createContext<NavState | null>(null);

export const useNav = (): NavState => {
  const ctx = use(NavContext);
  if (!ctx) throw new Error('useNav must be used inside <NavProvider>');
  return ctx;
};

/** Mobile menu state and the scroll-spy for the active section, shared by the nav islands. */
export function NavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !toggleRef.current?.contains(target))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      activeId,
      menuRef,
      toggleRef,
    }),
    [open, activeId],
  );

  return <NavContext value={value}>{children}</NavContext>;
}
