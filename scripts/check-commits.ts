/**
 * Micro-commit check for a PR: every non-merge commit in the range must stay within the line budget.
 * A deliberate large commit (a formatter run, a generated file) can opt out with a
 * "Large-Commit: <reason>" trailer, which is reported but not failed.
 * Usage: node scripts/check-commits.ts origin/main..HEAD
 */
import { execFileSync } from 'node:child_process';
import { MAX_CHANGED_LINES, measureCommit, parseNumstat } from './lib/commit-size.ts';

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' });
const range = process.argv[2] ?? 'origin/main..HEAD';
const shas = git('rev-list', '--no-merges', '--reverse', range).split('\n').filter(Boolean);

let failed = 0;
shas.forEach((sha) => {
  const subject = git('log', '-1', '--format=%s', sha).trim();
  const body = git('log', '-1', '--format=%b', sha);
  const size = measureCommit(parseNumstat(git('show', '--numstat', '--format=', sha)));
  const waiver = /^Large-Commit:\s*(.+)$/m.exec(body)?.[1];
  let status = '✔';
  if (!size.ok) status = waiver ? `⚑ waived (${waiver})` : '✖ too large';
  if (!size.ok && !waiver) failed += 1;
  console.log(
    `${sha.slice(0, 7)}  ${String(size.lines).padStart(5)} lines  ${String(size.files).padStart(3)} files  ${status}  ${subject}`,
  );
});

if (failed) {
  console.error(
    `\n✖ ${failed} commit(s) change more than ${MAX_CHANGED_LINES} lines. Split them into smaller commits, ` +
      'or add a "Large-Commit: <reason>" trailer when the size is unavoidable.',
  );
  process.exit(1);
}
console.log(`\n✔ ${shas.length} commit(s) within the ${MAX_CHANGED_LINES}-line budget.`);
