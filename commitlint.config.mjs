/** Conventional Commits: type(scope): subject, e.g. "feat(pill): pause the peek while hovered". */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-full-stop': [2, 'never', '.'],
  },
};

export default config;
