import { act, fireEvent, render, screen } from '@testing-library/react';
import { CONTACT_SUBJECT, EMAIL } from '@/content/site';
import { gmailIosUrl, gmailWebUrl } from '@/lib/gmail';
import { navigateTo } from '@/lib/navigate';
import { EmailPill } from './EmailPill';

jest.mock('@/lib/navigate', () => ({ navigateTo: jest.fn() }));

const WEB = gmailWebUrl(EMAIL, CONTACT_SUBJECT);
const pill = () => screen.getByRole('link', { name: 'Email Sashank' });

const asDevice = (ua: string, touchPoints = 0) => {
  jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua);
  Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: touchPoints });
};
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/131.0 Mobile';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0';

const renderPill = () =>
  render(<EmailPill className="pill--nav" label="Contact" avatarSize={36} />);

describe('EmailPill', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('links to a pre-filled Gmail compose window in a new tab', () => {
    renderPill();
    expect(pill()).toHaveAttribute('href', WEB);
    expect(pill()).toHaveAttribute('target', '_blank');
    expect(pill()).toHaveAttribute('rel', 'noopener noreferrer');
    expect(pill()).toHaveClass('pill', 'pill--nav');
  });

  it('lets the link open Gmail on the web on desktop', () => {
    asDevice(MAC);
    renderPill();
    expect(fireEvent.click(pill())).toBe(true); // default not prevented
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('opens the Gmail app on Android (Android falls back to the web by itself)', () => {
    asDevice(ANDROID, 5);
    renderPill();
    expect(fireEvent.click(pill())).toBe(false);
    expect(navigateTo).toHaveBeenCalledWith(
      expect.stringMatching(/^intent:.+#Intent;scheme=mailto;package=com\.google\.android\.gm;/),
    );
  });

  it('opens the Gmail app on iPhone, and Gmail on the web if the app did not open', () => {
    asDevice(IPHONE, 5);
    renderPill();
    expect(fireEvent.click(pill())).toBe(false);
    expect(navigateTo).toHaveBeenLastCalledWith(gmailIosUrl(EMAIL, CONTACT_SUBJECT));
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(navigateTo).toHaveBeenLastCalledWith(WEB);
  });

  it('does not fall back once the Gmail app has taken over', () => {
    asDevice(IPHONE, 5);
    renderPill();
    fireEvent.click(pill());
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(navigateTo).toHaveBeenCalledTimes(1);
  });
});
