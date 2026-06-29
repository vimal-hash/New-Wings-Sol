import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  // NOTE: corrected from the (invalid) `setupFilesAfterFramework` — the real
  // Jest option is `setupFilesAfterEnv`.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  // NOTE: `testPathPattern` is a CLI flag, not a config key — the config key is
  // `testMatch`. Also match plain `.ts` tests (e.g. performance.test.ts).
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};

export default config;
