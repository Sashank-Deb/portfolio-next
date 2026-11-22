import { act, render, screen } from '@testing-library/react';
import { setIntersecting, setMediaQuery } from '@/test/browser-mocks';
import { CountUp } from './CountUp';

const shown = (container: HTMLElement) =>
  container.querySelector('[aria-hidden="true"]')?.textContent;

describe('CountUp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps the real value for screen readers', () => {
    render(<CountUp to={20} suffix="+" />);
    expect(screen.getByText('20+')).toHaveClass('sr-only');
  });

  it('waits at zero, then counts up once it scrolls into view', () => {
    const { container } = render(<CountUp to={20} suffix="+" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('about__info-title');
    expect(shown(container)).toBe('0+');
    act(() => setIntersecting(el, true));
    act(() => {
      jest.advanceTimersByTime(600);
    });
    const mid = Number(shown(container)?.replace('+', ''));
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(20);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(shown(container)).toBe('20+');
  });

  it('counts only once', () => {
    const { container } = render(<CountUp to={3} />);
    const el = container.firstElementChild as HTMLElement;
    act(() => setIntersecting(el, true));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => setIntersecting(el, false));
    act(() => setIntersecting(el, true));
    expect(shown(container)).toBe('3');
  });

  it('shows the final number straight away with reduced motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { container } = render(<CountUp to={5} suffix="+" />);
    expect(shown(container)).toBe('5+');
  });
});
