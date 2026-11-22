/**
 * Prints the before/after Core Web Vitals table (markdown) from lighthouse-run.ts outputs.
 * Usage: node scripts/lighthouse-compare.ts <dir>   (expects {base,head}-{mobile,desktop}.json)
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { type Vitals, compareVitals } from './lib/vitals.ts';

const dir = process.argv[2] ?? '.lighthouse';
const load = (name: string): Vitals | undefined => {
  const file = path.join(dir, `${name}.json`);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')).median as Vitals) : undefined;
};

const comparison: Parameters<typeof compareVitals>[0] = {};
(['mobile', 'desktop'] as const).forEach((device) => {
  const before = load(`base-${device}`);
  const after = load(`head-${device}`);
  if (before && after) comparison[device] = { before, after };
});

console.log(
  [
    '## 🔦 Lighthouse: Core Web Vitals before and after this PR',
    '',
    compareVitals(comparison),
    '',
    '<sub>Median of 3 Lighthouse runs per build against `next start`, simulated throttling. ' +
      'Lab data: INP needs real users, so Total Blocking Time stands in for it. ' +
      '🟢 good · 🟠 needs improvement · 🔴 poor (web.dev thresholds).</sub>',
  ].join('\n'),
);
