import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // scripts/ run directly on Node with type stripping, so they import with .ts extensions
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/scripts/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'scripts/lib/**/*.ts',
    '!scripts/**/*.test.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/test/**',
    '!src/app/fonts.ts',
  ],
  coverageThreshold: {
    global: { statements: 90, branches: 80, functions: 90, lines: 90 },
  },
  clearMocks: true,
  restoreMocks: true,
};

export default createJestConfig(config);
