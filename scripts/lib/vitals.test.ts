import { compareVitals, extractVitals, medianVitals, rate } from './vitals.ts';

const lhr = (overrides: Partial<Record<string, number>> = {}) => ({
  categories: { performance: { score: overrides.score ?? 0.93 } },
  audits: {
    'largest-contentful-paint': { numericValue: overrides.lcp ?? 2100 },
    'cumulative-layout-shift': { numericValue: overrides.cls ?? 0.02 },
    'total-blocking-time': { numericValue: overrides.tbt ?? 120 },
    'first-contentful-paint': { numericValue: overrides.fcp ?? 900 },
    'speed-index': { numericValue: overrides.si ?? 1500 },
  },
});

describe('Lighthouse vitals', () => {
  it('extracts the performance score and Core Web Vitals from a Lighthouse result', () => {
    expect(extractVitals(lhr())).toEqual({
      score: 93,
      lcp: 2100,
      cls: 0.02,
      tbt: 120,
      fcp: 900,
      si: 1500,
    });
  });

  it('takes the median of each metric across runs to tame noise', () => {
    const runs = [
      lhr({ lcp: 3000, score: 0.8 }),
      lhr({ lcp: 2000, score: 0.95 }),
      lhr({ lcp: 2200, score: 0.9 }),
    ].map(extractVitals);
    expect(medianVitals(runs)).toMatchObject({ lcp: 2200, score: 90 });
  });

  it('rates metrics against the web.dev thresholds', () => {
    expect(rate('lcp', 2500)).toBe('good');
    expect(rate('lcp', 2501)).toBe('needs-improvement');
    expect(rate('lcp', 4001)).toBe('poor');
    expect(rate('cls', 0.1)).toBe('good');
    expect(rate('tbt', 700)).toBe('poor');
    expect(rate('score', 90)).toBe('good');
    expect(rate('score', 49)).toBe('poor');
  });

  it('renders a before/after markdown table with deltas', () => {
    const before = extractVitals(lhr());
    const after = extractVitals(lhr({ lcp: 1800, cls: 0.02, tbt: 260, score: 0.95 }));
    const md = compareVitals({ mobile: { before, after } });
    expect(md).toContain('| Metric | Before (main) | After (PR) | Change |');
    expect(md).toMatch(/Largest Contentful Paint \| 🟢 2\.10 s \| 🟢 1\.80 s \| -300 ms ✅/);
    expect(md).toMatch(
      /Total Blocking Time \(lab proxy for INP\) \| 🟢 120 ms \| 🟠 260 ms \| \+140 ms ⚠️/,
    );
    expect(md).toMatch(/Cumulative Layout Shift \| 🟢 0\.020 \| 🟢 0\.020 \| no change/);
    expect(md).toMatch(/Performance score \| 🟢 93 \| 🟢 95 \| \+2 ✅/);
  });

  it('ignores changes inside the noise margin', () => {
    const before = extractVitals(lhr());
    const after = extractVitals(lhr({ lcp: 2130 }));
    expect(compareVitals({ desktop: { before, after } })).toMatch(
      /Largest Contentful Paint .*\| \+30 ms \|/,
    );
  });

  it('warns when a metric regresses past the noise margin', () => {
    const md = compareVitals({
      mobile: { before: extractVitals(lhr()), after: extractVitals(lhr({ lcp: 2900 })) },
    });
    expect(md).toContain('⚠️ **Regression**');
  });
});
