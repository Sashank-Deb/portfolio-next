import { act, fireEvent, render, screen } from '@testing-library/react';
import { setMediaQuery } from '@/test/browser-mocks';
import { NavContactPill } from './NavContactPill';

const pill = () => screen.getByRole('link', { name: 'Email Sashank' });

describe('header contact pill', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', { configurable: true, get: () => document.body });
  });
  afterEach(() => { jest.useRealTimers(); });

  it('links to email', () => {
    render(<NavContactPill />);
    expect(pill()).toHaveAttribute('href', 'mailto:sashankdebrgu7@gmail.com?subject=Hi%20Sashank');
    expect(pill()).toHaveClass('pill', 'pill--nav');
  });

  it('peeks its hover state at 2s and then every 5s, for 1.1s each time', () => {
    render(<NavContactPill />);
    act(() => { jest.advanceTimersByTime(1999); });
    expect(pill()).not.toHaveClass('is-peek');
    act(() => { jest.advanceTimersByTime(1); });
    expect(pill()).toHaveClass('is-peek');
    act(() => { jest.advanceTimersByTime(1100); });
    expect(pill()).not.toHaveClass('is-peek');
    act(() => { jest.advanceTimersByTime(3900); });
    expect(pill()).toHaveClass('is-peek');
  });

  it('stops for the session after a real hover', () => {
    render(<NavContactPill />);
    fireEvent.pointerEnter(pill());
    act(() => { jest.advanceTimersByTime(10000); });
    expect(pill()).not.toHaveClass('is-peek');
    expect(sessionStorage.getItem('pill-peek-off')).toBe('1');
  });

  it('stops after focus or a click too', () => {
    render(<NavContactPill />);
    act(() => { jest.advanceTimersByTime(2000); });
    fireEvent.click(pill());
    expect(pill()).not.toHaveClass('is-peek');
    expect(sessionStorage.getItem('pill-peek-off')).toBe('1');
  });

  it('never peeks once stopped this session, or with reduced motion', () => {
    sessionStorage.setItem('pill-peek-off', '1');
    const { unmount } = render(<NavContactPill />);
    act(() => { jest.advanceTimersByTime(8000); });
    expect(pill()).not.toHaveClass('is-peek');
    unmount();
    sessionStorage.clear();
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    render(<NavContactPill />);
    act(() => { jest.advanceTimersByTime(8000); });
    expect(pill()).not.toHaveClass('is-peek');
  });

  it('waits while the name intro is covering the page', () => {
    document.documentElement.setAttribute('data-intro', 'play');
    render(<NavContactPill />);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(pill()).not.toHaveClass('is-peek');
  });
});
