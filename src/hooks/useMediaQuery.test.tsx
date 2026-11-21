import { act, renderHook } from '@testing-library/react';
import { setMediaQuery } from '@/test/browser-mocks';
import { useMediaQuery, useReducedMotion } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('reflects the current match and follows changes', () => {
    setMediaQuery('(min-width: 901px)', true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 901px)'));
    expect(result.current).toBe(true);
    act(() => setMediaQuery('(min-width: 901px)', false));
    expect(result.current).toBe(false);
  });

  it('reads prefers-reduced-motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
