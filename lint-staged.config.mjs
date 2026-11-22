/** Runs on staged files only, so commits stay fast. */
const config = {
  '*.{ts,tsx,mjs}': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
    'jest --bail --findRelatedTests --passWithNoTests',
  ],
  '*.{json,md,yml,yaml}': 'prettier --write',
};

export default config;
