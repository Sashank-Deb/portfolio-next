import { detectPlatform, gmailAndroidUrl, gmailIosUrl, gmailWebUrl } from './gmail';

const TO = 'someone@example.com';
const SUBJECT = 'Hello Sashank';
const WEB =
  'https://mail.google.com/mail/?view=cm&fs=1&to=someone%40example.com&su=Hello%20Sashank';

describe('Gmail compose links', () => {
  it('opens a pre-filled compose window in Gmail on the web', () => {
    expect(gmailWebUrl(TO, SUBJECT)).toBe(WEB);
  });

  it('opens compose in the Gmail app on iPhone and iPad', () => {
    expect(gmailIosUrl(TO, SUBJECT)).toBe(
      'googlegmail:///co?to=someone%40example.com&subject=Hello%20Sashank',
    );
  });

  it('opens compose in the Gmail app on Android, falling back to Gmail on the web', () => {
    expect(gmailAndroidUrl(TO, SUBJECT)).toBe(
      'intent:someone@example.com?subject=Hello%20Sashank' +
        '#Intent;scheme=mailto;package=com.google.android.gm;' +
        `S.browser_fallback_url=${encodeURIComponent(WEB)};end`,
    );
  });

  it('encodes characters that would break the links', () => {
    expect(gmailWebUrl(TO, "Let's talk & build")).toContain('su=Let%27s%20talk%20%26%20build');
  });
});

describe('detectPlatform', () => {
  it.each([
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15', 5, 'ios'],
    // iPadOS asks for desktop sites by default and reports itself as a Mac with touch
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.1 Safari',
      5,
      'ios',
    ],
    [
      'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/131.0 Mobile',
      5,
      'android',
    ],
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0',
      0,
      'desktop',
    ],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0', 0, 'desktop'],
  ])('%s → %s', (ua, touchPoints, expected) => {
    expect(detectPlatform(ua, touchPoints as number)).toBe(expected);
  });
});
