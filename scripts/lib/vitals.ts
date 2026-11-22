/*
 * Turns Lighthouse results into a before/after Core Web Vitals table for a PR comment.
 * Lighthouse is a lab tool, so INP can't be measured; Total Blocking Time is its lab proxy.
 */

export type MetricKey = 'score' | 'lcp' | 'cls' | 'tbt' | 'fcp' | 'si';
export type Vitals = Record<MetricKey, number>;
export type Rating = 'good' | 'needs-improvement' | 'poor';

interface LighthouseResult {
  categories: { performance: { score: number | null } };
  audits: Record<string, { numericValue?: number }>;
}

interface MetricInfo {
  label: string;
  audit?: string;
  /** Upper bound for "good" and for "needs improvement" (score: lower bounds). */
  thresholds: [number, number];
  higherIsBetter?: boolean;
  /** Changes smaller than this are run-to-run noise. */
  noise: number;
  format: (v: number) => string;
  formatDelta: (d: number) => string;
}

const ms = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`);
const signed = (s: string, d: number) => (d > 0 ? `+${s}` : s);

export const METRICS: Record<MetricKey, MetricInfo> = {
  score: {
    label: 'Performance score',
    thresholds: [90, 50],
    higherIsBetter: true,
    noise: 2,
    format: (v) => String(Math.round(v)),
    formatDelta: (d) => signed(String(Math.round(d)), d),
  },
  lcp: {
    label: 'Largest Contentful Paint',
    audit: 'largest-contentful-paint',
    thresholds: [2500, 4000],
    noise: 100,
    format: ms,
    formatDelta: (d) => signed(`${Math.round(d)} ms`, d),
  },
  cls: {
    label: 'Cumulative Layout Shift',
    audit: 'cumulative-layout-shift',
    thresholds: [0.1, 0.25],
    noise: 0.01,
    format: (v) => v.toFixed(3),
    formatDelta: (d) => signed(d.toFixed(3), d),
  },
  tbt: {
    label: 'Total Blocking Time (lab proxy for INP)',
    audit: 'total-blocking-time',
    thresholds: [200, 600],
    noise: 50,
    format: ms,
    formatDelta: (d) => signed(`${Math.round(d)} ms`, d),
  },
  fcp: {
    label: 'First Contentful Paint',
    audit: 'first-contentful-paint',
    thresholds: [1800, 3000],
    noise: 100,
    format: ms,
    formatDelta: (d) => signed(`${Math.round(d)} ms`, d),
  },
  si: {
    label: 'Speed Index',
    audit: 'speed-index',
    thresholds: [3400, 5800],
    noise: 150,
    format: ms,
    formatDelta: (d) => signed(`${Math.round(d)} ms`, d),
  },
};

const KEYS = Object.keys(METRICS) as MetricKey[];

export const extractVitals = (lhr: LighthouseResult): Vitals => {
  const audit = (key: MetricKey) => lhr.audits[METRICS[key].audit ?? '']?.numericValue ?? 0;
  return {
    score: Math.round((lhr.categories.performance.score ?? 0) * 100),
    lcp: audit('lcp'),
    cls: audit('cls'),
    tbt: audit('tbt'),
    fcp: audit('fcp'),
    si: audit('si'),
  };
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
};

export const medianVitals = (runs: Vitals[]): Vitals =>
  Object.fromEntries(KEYS.map((k) => [k, median(runs.map((r) => r[k]))])) as Vitals;

export const rate = (key: MetricKey, value: number): Rating => {
  const {
    thresholds: [good, poor],
    higherIsBetter,
  } = METRICS[key];
  if (higherIsBetter) {
    if (value >= good) return 'good';
    return value >= poor ? 'needs-improvement' : 'poor';
  }
  if (value <= good) return 'good';
  return value <= poor ? 'needs-improvement' : 'poor';
};

const DOT: Record<Rating, string> = { good: '🟢', 'needs-improvement': '🟠', poor: '🔴' };

type Comparison = Partial<Record<'mobile' | 'desktop', { before: Vitals; after: Vitals }>>;

export const compareVitals = (comparison: Comparison): string => {
  let regressed = false;
  const sections = Object.entries(comparison).map(([device, pair]) => {
    const rows = KEYS.map((key) => {
      const m = METRICS[key];
      const before = pair.before[key];
      const after = pair.after[key];
      const delta = after - before;
      let change = 'no change';
      if (delta !== 0) {
        const better = m.higherIsBetter ? delta > 0 : delta < 0;
        const significant = Math.abs(delta) >= m.noise;
        if (significant && !better) regressed = true;
        let mark = '';
        if (significant) mark = better ? ' ✅' : ' ⚠️';
        change = `${m.formatDelta(delta)}${mark}`;
      }
      return `| ${m.label} | ${DOT[rate(key, before)]} ${m.format(before)} | ${DOT[rate(key, after)]} ${m.format(after)} | ${change} |`;
    });
    return [
      `### ${device === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}`,
      '',
      '| Metric | Before (main) | After (PR) | Change |',
      '| --- | --- | --- | --- |',
      ...rows,
    ].join('\n');
  });

  const verdict = regressed
    ? '⚠️ **Regression**: at least one metric got worse beyond run-to-run noise.'
    : '✅ No regressions beyond run-to-run noise.';
  return [verdict, '', sections.join('\n\n')].join('\n');
};
