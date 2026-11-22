/*
 * Links that open a pre-filled Gmail compose screen. A plain mailto: link only works when the
 * visitor has a mail app set up, which many Gmail-on-the-web users don't.
 */

export type Platform = 'ios' | 'android' | 'desktop';

/** encodeURIComponent leaves ' unescaped, which some mail handlers trip over. */
const encode = (value: string) => encodeURIComponent(value).replace(/'/g, '%27');

/** Gmail on the web, compose window open with the recipient and subject filled in. */
export const gmailWebUrl = (to: string, subject: string): string =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encode(to)}&su=${encode(subject)}`;

/** The Gmail app's own URL scheme on iPhone and iPad. */
export const gmailIosUrl = (to: string, subject: string): string =>
  `googlegmail:///co?to=${encode(to)}&subject=${encode(subject)}`;

/**
 * An Android intent link: opens the mailto: in the Gmail app specifically, and the browser follows
 * the fallback URL by itself (Gmail on the web) when the app isn't installed.
 */
export const gmailAndroidUrl = (to: string, subject: string): string =>
  `intent:${to}?subject=${encode(subject)}` +
  '#Intent;scheme=mailto;package=com.google.android.gm;' +
  `S.browser_fallback_url=${encodeURIComponent(gmailWebUrl(to, subject))};end`;

/** iPadOS reports a desktop Mac user agent by default, so touch support tells it apart. */
export const detectPlatform = (userAgent: string, maxTouchPoints: number): Platform => {
  if (/android/i.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  if (/macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'ios';
  return 'desktop';
};
