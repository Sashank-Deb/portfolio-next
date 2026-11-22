/**
 * Micro commits: every commit in a PR should be one reviewable idea. Generated or binary files
 * (lockfile, images, fonts) don't count towards the budget.
 */
export const MAX_CHANGED_LINES = 400;

const IGNORED = [/^package-lock\.json$/, /^public\//, /^src\/fonts\//, /\.snap$/];

export interface FileChange {
  file: string;
  added: number;
  deleted: number;
}

export const parseNumstat = (numstat: string): FileChange[] =>
  numstat
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [added = '0', deleted = '0', ...rest] = line.split('\t');
      const count = (n: string) => (n === '-' ? 0 : Number(n));
      return { file: rest.join('\t'), added: count(added), deleted: count(deleted) };
    });

export const measureCommit = (changes: FileChange[]) => {
  const counted = changes.filter((c) => !IGNORED.some((re) => re.test(c.file)));
  const lines = counted.reduce((sum, c) => sum + c.added + c.deleted, 0);
  return { lines, files: counted.length, ok: lines <= MAX_CHANGED_LINES };
};
