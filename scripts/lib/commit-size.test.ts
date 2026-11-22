import { MAX_CHANGED_LINES, measureCommit, parseNumstat } from './commit-size.ts';

const NUMSTAT = [
  '12\t3\tsrc/components/ui/Pill.tsx',
  '40\t0\tsrc/components/ui/Pill.test.tsx',
  '900\t850\tpackage-lock.json',
  '-\t-\tpublic/assets/img/hero.webp',
  '5\t5\tsrc/fonts/x.woff2',
].join('\n');

describe('commit size', () => {
  it('parses git --numstat output, treating binaries as zero lines', () => {
    expect(parseNumstat(NUMSTAT)).toEqual([
      { file: 'src/components/ui/Pill.tsx', added: 12, deleted: 3 },
      { file: 'src/components/ui/Pill.test.tsx', added: 40, deleted: 0 },
      { file: 'package-lock.json', added: 900, deleted: 850 },
      { file: 'public/assets/img/hero.webp', added: 0, deleted: 0 },
      { file: 'src/fonts/x.woff2', added: 5, deleted: 5 },
    ]);
  });

  it('ignores lockfiles, assets and fonts when counting', () => {
    expect(measureCommit(parseNumstat(NUMSTAT))).toEqual({ lines: 55, files: 2, ok: true });
  });

  it('flags commits over the line budget', () => {
    const big = parseNumstat(`${MAX_CHANGED_LINES}\t1\tsrc/a.ts`);
    expect(measureCommit(big)).toEqual({ lines: MAX_CHANGED_LINES + 1, files: 1, ok: false });
  });

  it('keeps an empty commit fine', () => {
    expect(measureCommit(parseNumstat(''))).toEqual({ lines: 0, files: 0, ok: true });
  });
});
