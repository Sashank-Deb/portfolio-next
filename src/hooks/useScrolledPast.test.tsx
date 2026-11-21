import { act, renderHook } from '@testing-library/react';
import { useScrolledPast } from './useScrolledPast';

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  window.dispatchEvent(new Event('scroll'));
};

describe('useScrolledPast', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(0); return 0; });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  it('is false at the top and true once past the threshold', () => {
    const { result } = renderHook(() => useScrolledPast(12));
    expect(result.current).toBe(false);
    act(() => scrollTo(13));
    expect(result.current).toBe(true);
    act(() => scrollTo(5));
    expect(result.current).toBe(false);
  });

  it('is already true when the page loads scrolled down', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 900 });
    const { result } = renderHook(() => useScrolledPast(640));
    expect(result.current).toBe(true);
  });

  it('throttles scroll work to one read per animation frame', () => {
    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
    renderHook(() => useScrolledPast(12));
    act(() => { scrollTo(20); scrollTo(30); scrollTo(40); });
    expect(frames).toHaveLength(1);
  });
});
