/**
 * Runs on staged files only, so commits stay fast. Tests run in pre-push rather than here,
 * so a TDD "red" commit (the failing spec) can be committed before the fix.
 */
const config = {
  '*.{ts,tsx,mjs}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{json,md,yml,yaml}': 'prettier --write',
};

export default config;
