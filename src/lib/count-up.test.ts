import { countAt, easeOutCubic } from './count-up';

describe('count-up', () => {
  it('eases out: fast at first, settling at the end', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875);
  });

  it('counts whole numbers from zero to the target over the duration', () => {
    expect(countAt(0, 1200, 20)).toBe(0);
    expect(countAt(600, 1200, 20)).toBe(18);
    expect(countAt(1200, 1200, 20)).toBe(20);
    expect(countAt(5000, 1200, 20)).toBe(20);
  });

  it('never goes backwards', () => {
    const values = Array.from({ length: 13 }, (_, i) => countAt(i * 100, 1200, 5));
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });
});
