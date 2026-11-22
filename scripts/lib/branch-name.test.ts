import { BRANCH_TYPES, checkBranchName } from './branch-name.ts';

describe('branch naming', () => {
  it.each([
    'feat/pill-peek',
    'fix/intro-flash',
    'chore/dev-workflow',
    'docs/readme',
    'perf/lcp-hero-image',
    'deps/next-16.1',
  ])('accepts %s', (name) => {
    expect(checkBranchName(name)).toEqual({ ok: true });
  });

  it('covers the conventional commit types', () => {
    expect(BRANCH_TYPES).toEqual(
      expect.arrayContaining([
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'test',
        'perf',
        'ci',
        'build',
        'style',
        'revert',
      ]),
    );
  });

  it.each([
    ['my-branch', /type\/short-description/],
    ['feature/thing', /Unknown type "feature"/],
    ['feat/Some_Thing', /lowercase/],
    ['feat/', /type\/short-description/],
    ['feat/a/b', /type\/short-description/],
  ])('rejects %s', (name, message) => {
    const result = checkBranchName(name);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.message).toMatch(message);
  });

  it('refuses work directly on main', () => {
    const result = checkBranchName('main');
    expect(result).toEqual({ ok: false, message: expect.stringMatching(/protected/) });
  });

  it('lets automation branches through', () => {
    expect(checkBranchName('dependabot/npm_and_yarn/next-16.1.0')).toEqual({ ok: true });
  });
});
