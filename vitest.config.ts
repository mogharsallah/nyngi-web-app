import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Environment for React component testing (AC-1.9.4)
    environment: 'jsdom',

    // Test file patterns (AC-1.9.2)
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],

    // Exclude E2E tests from unit test runs
    exclude: ['node_modules', '.next', 'tests/e2e/**'],

    // Global test setup
    setupFiles: ['./tests/setup.ts'],

    // Coverage configuration (AC-1.9.3, AC-1.9.10)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['server/services/**/*.ts', 'server/actions/**/*.ts', 'components/**/*.tsx', 'components/**/*.ts'],
      exclude: [
        'node_modules',
        '.next',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.ts',
        'components/ui/**', // Exclude shadcn/ui components from coverage
      ],
      // Minimum coverage thresholds per directory (AC-1.9.10)
      thresholds: {
        // Services: 80%
        'server/services/**/*.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        // Actions: 70%
        'server/actions/**/*.ts': {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70,
        },
        // Components: 50%
        'components/**/*.tsx': {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },

    // Enable globals for cleaner test syntax
    globals: true,
  },
})
