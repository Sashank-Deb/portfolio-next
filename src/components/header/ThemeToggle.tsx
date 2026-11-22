'use client';

import { toggleTheme } from '@/lib/theme';

/**
 * The theme lives on <html> (set before paint by the inline script), and CSS swaps the icons,
 * so this button needs no React state and can never mismatch during hydration.
 */
export function ThemeToggle() {
  return (
    <button
      className="icon-btn"
      id="theme-button"
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => toggleTheme(document.documentElement)}
    >
      <i className="uil uil-moon theme-icon theme-icon--moon" />
      <i className="uil uil-sun theme-icon theme-icon--sun" />
    </button>
  );
}
