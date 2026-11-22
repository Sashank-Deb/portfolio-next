/**
 * Fails when the current branch doesn't follow type/short-description, or is main.
 * Usage: node scripts/check-branch.ts [branch]   (defaults to the checked-out branch)
 */
import { execFileSync } from 'node:child_process';
import { checkBranchName } from './lib/branch-name.ts';

const branch =
  process.argv[2] ??
  process.env.GITHUB_HEAD_REF ??
  execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();

const result = checkBranchName(branch);
if (!result.ok) {
  console.error(`✖ ${result.message}`);
  process.exit(1);
}
console.log(`✔ Branch "${branch}" follows the naming policy.`);
