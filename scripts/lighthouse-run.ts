/**
 * Runs the Lighthouse CLI several times against a URL and writes the median vitals as JSON.
 * Usage: node scripts/lighthouse-run.ts <url> <mobile|desktop> <out.json> [runs=3]
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { type Vitals, extractVitals, medianVitals } from './lib/vitals.ts';

const [url, device = 'mobile', out, runsArg = '3'] = process.argv.slice(2);
if (!url || !out) {
  console.error('Usage: node scripts/lighthouse-run.ts <url> <mobile|desktop> <out.json> [runs]');
  process.exit(1);
}

const dir = mkdtempSync(path.join(tmpdir(), 'lh-'));
const runs: Vitals[] = [];
for (let i = 0; i < Number(runsArg); i += 1) {
  const report = path.join(dir, `${device}-${i}.json`);
  execFileSync(
    'npx',
    [
      'lighthouse',
      url,
      '--only-categories=performance',
      '--output=json',
      `--output-path=${report}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
      ...(device === 'desktop' ? ['--preset=desktop'] : []),
    ],
    { stdio: 'inherit' },
  );
  runs.push(extractVitals(JSON.parse(readFileSync(report, 'utf8'))));
}

const median = medianVitals(runs);
writeFileSync(out, `${JSON.stringify({ device, url, runs, median }, null, 2)}\n`);
console.log(`${device}: median of ${runs.length} runs →`, median);
