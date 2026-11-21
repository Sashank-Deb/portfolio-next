import { writeStorage } from './storage';

export const THEME_KEY = 'selected-theme';

/**
 * Inlined in <head> so the right theme is applied before the first paint (no flash).
 * Dark is the default; only an explicit "light" choice turns it off.
 */
export const themeScript = `document.documentElement.classList.add('js');
try {
  if (localStorage.getItem('${THEME_KEY}') !== 'light') document.documentElement.classList.add('dark-theme');
} catch (e) {}`;

/** Flip the theme on the root element and remember it. Returns true when dark is now on. */
export const toggleTheme = (root: HTMLElement): boolean => {
  const dark = root.classList.toggle('dark-theme');
  writeStorage('local', THEME_KEY, dark ? 'dark' : 'light');
  return dark;
};
