import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import globals from 'globals';

const gitignorePath = path.resolve('.', '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),

  // Airbnb style guide (JS + TypeScript + React + Next.js), flat-config edition.
  plugins.stylistic,
  plugins.importX,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  plugins.next,
  plugins.typescriptEslint,
  ...configs.next.recommended,
  ...configs.next.typescript,

  {
    name: 'project/overrides',
    rules: {
      // Named exports keep imports greppable and refactors safe; Next's special files are the exception below.
      'import-x/prefer-default-export': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': ['error', { html: 'ignore', exceptions: ['Image'] }],
      // window.__opClaimed is the hand-off flag between the inline intro gate and the app.
      'no-underscore-dangle': ['error', { allow: ['__opClaimed'] }],
    },
  },
  {
    name: 'project/next-special-files',
    files: ['src/app/**/{page,layout,not-found,error,opengraph-image,icon}.tsx', '*.config.{ts,mjs}'],
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    name: 'project/tests',
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'jest.setup.ts'],
    languageOptions: { globals: { ...globals.jest } },
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
    },
  },
  {
    name: 'project/config-files',
    files: ['*.config.{ts,mjs}', 'jest.setup.ts'],
    rules: { 'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }] },
  },
];
