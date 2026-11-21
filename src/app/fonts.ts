import localFont from 'next/font/local';

/*
 * Self-hosted copies of the Google Fonts the site has always used (same variable font files),
 * so there's no render-blocking third-party request and next/font can preload them and size the fallback.
 */

export const jost = localFont({
  src: '../fonts/jost-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-jost',
});

export const dmSans = localFont({
  // Variable on weight and optical size, like the Google Fonts "opsz,wght" request it replaces.
  src: '../fonts/dm-sans-latin-opsz-normal.woff2',
  weight: '100 1000',
  style: 'normal',
  display: 'swap',
  variable: '--font-dm-sans',
});

export const spaceMono = localFont({
  src: [
    { path: '../fonts/space-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/space-mono-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-space-mono',
  preload: false,
});
