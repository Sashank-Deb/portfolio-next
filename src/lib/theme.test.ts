import { THEME_KEY, themeScript, toggleTheme } from './theme';

const runInline = (script: string) => new Function(script)();

describe('pre-paint theme script', () => {
  it('marks the document as JS-enabled', () => {
    runInline(themeScript);
    expect(document.documentElement).toHaveClass('js');
  });

  it('defaults to the dark theme when nothing is stored', () => {
    runInline(themeScript);
    expect(document.documentElement).toHaveClass('dark-theme');
  });

  it('keeps the dark theme when it was chosen', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    runInline(themeScript);
    expect(document.documentElement).toHaveClass('dark-theme');
  });

  it('respects a stored light theme', () => {
    localStorage.setItem(THEME_KEY, 'light');
    runInline(themeScript);
    expect(document.documentElement).not.toHaveClass('dark-theme');
  });
});

describe('toggleTheme', () => {
  it('flips the class and persists the choice', () => {
    const root = document.documentElement;
    root.classList.add('dark-theme');
    expect(toggleTheme(root)).toBe(false);
    expect(root).not.toHaveClass('dark-theme');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
    expect(toggleTheme(root)).toBe(true);
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
  });
});
