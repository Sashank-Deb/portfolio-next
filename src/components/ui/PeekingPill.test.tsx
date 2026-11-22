import { act, fireEvent, render, screen } from '@testing-library/react';
import { setMediaQuery } from '@/test/browser-mocks';
import { PeekingPill } from './PeekingPill';

const pill = () => screen.getByRole('link', { name: 'Email Sashank' });
const tick = (ms: number) =>
  act(() => {
    jest.advanceTimersByTime(ms);
  });

const onScreen = (visible: boolean) => {
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ top: visible ? 100 : 5000, bottom: visible ? 150 : 5050 } as DOMRect);
};

const renderNav = () =>
  render(<PeekingPill className="pill--nav" href="mailto:a@b.c" label="Contact" avatarSize={36} />);

describe('PeekingPill', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    });
    onScreen(true);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the contact pill', () => {
    renderNav();
    expect(pill()).toHaveClass('pill', 'pill--nav');
    expect(pill()).toHaveAttribute('href', 'mailto:a@b.c');
  });

  it('peeks its hover state at 2s and then every 5s, for 1.1s each time', () => {
    renderNav();
    tick(1999);
    expect(pill()).not.toHaveClass('is-peek');
    tick(1);
    expect(pill()).toHaveClass('is-peek');
    tick(1100);
    expect(pill()).not.toHaveClass('is-peek');
    tick(3900);
    expect(pill()).toHaveClass('is-peek');
  });

  it('pauses while hovered, then carries on after the pointer leaves', () => {
    renderNav();
    fireEvent.pointerEnter(pill());
    tick(7000);
    expect(pill()).not.toHaveClass('is-peek');
    fireEvent.pointerLeave(pill());
    tick(5000);
    expect(pill()).toHaveClass('is-peek');
  });

  it('pauses while focused, and drops a peek in progress', () => {
    renderNav();
    tick(2000);
    expect(pill()).toHaveClass('is-peek');
    fireEvent.focus(pill());
    expect(pill()).not.toHaveClass('is-peek');
    tick(10000);
    expect(pill()).not.toHaveClass('is-peek');
    fireEvent.blur(pill());
    tick(5000);
    expect(pill()).toHaveClass('is-peek');
  });

  it('keeps peeking in later visits after a hover (nothing is remembered)', () => {
    const { unmount } = renderNav();
    fireEvent.pointerEnter(pill());
    unmount();
    renderNav();
    tick(2000);
    expect(pill()).toHaveClass('is-peek');
  });

  it('only peeks while it is on screen', () => {
    onScreen(false);
    render(
      <PeekingPill
        className="pill--lg"
        href="mailto:a@b.c"
        label="Send me an email"
        avatarSize={44}
        arrow
        firstPeekMs={4500}
      />,
    );
    tick(10000);
    expect(pill()).not.toHaveClass('is-peek');
    onScreen(true);
    tick(5000);
    expect(pill()).toHaveClass('pill--lg', 'is-peek');
  });

  it('can start later so two pills take turns', () => {
    render(
      <PeekingPill
        className="pill--lg"
        href="mailto:a@b.c"
        label="Send me an email"
        avatarSize={44}
        firstPeekMs={4500}
      />,
    );
    tick(4499);
    expect(pill()).not.toHaveClass('is-peek');
    tick(1);
    expect(pill()).toHaveClass('is-peek');
  });

  it('never peeks with reduced motion, or while the name intro covers the page', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { unmount } = renderNav();
    tick(8000);
    expect(pill()).not.toHaveClass('is-peek');
    unmount();
    setMediaQuery('(prefers-reduced-motion: reduce)', false);
    document.documentElement.setAttribute('data-intro', 'play');
    renderNav();
    tick(2000);
    expect(pill()).not.toHaveClass('is-peek');
  });
});
