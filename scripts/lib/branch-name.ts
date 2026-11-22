/** Branch types mirror the conventional commit types, so a branch name says what its PR will do. */
export const BRANCH_TYPES = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'test',
  'docs',
  'build',
  'ci',
  'chore',
  'deps',
  'revert',
] as const;

const PROTECTED = new Set(['main']);
const AUTOMATION = /^(dependabot|renovate)\//;
const SHAPE = /^([^/]+)\/([^/]+)$/;
const SLUG = /^[a-z0-9][a-z0-9.-]*$/;

export type BranchCheck = { ok: true } | { ok: false; message: string };

export const checkBranchName = (name: string): BranchCheck => {
  if (PROTECTED.has(name)) {
    return {
      ok: false,
      message: `"${name}" is protected: create a branch (e.g. feat/short-description) and open a PR.`,
    };
  }
  if (AUTOMATION.test(name)) return { ok: true };

  const match = SHAPE.exec(name);
  if (!match)
    return { ok: false, message: `Branch "${name}" must look like type/short-description.` };
  const [, type = '', slug = ''] = match;
  if (!(BRANCH_TYPES as readonly string[]).includes(type)) {
    return {
      ok: false,
      message: `Unknown type "${type}" in "${name}". Use one of: ${BRANCH_TYPES.join(', ')}.`,
    };
  }
  if (!SLUG.test(slug)) {
    return {
      ok: false,
      message: `"${slug}" should be lowercase words joined by hyphens (e.g. ${type}/pill-peek).`,
    };
  }
  return { ok: true };
};
