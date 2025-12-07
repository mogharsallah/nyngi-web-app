import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

const baseURL = `https://${process.env.HOST}`
/**
 * Playwright configuration for E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory (AC-1.9.8)
  testDir: './tests/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: process.env.CI ? 'github' : 'html',

  // Shared settings for all projects
  use: {
    // Base URL points to dev server (AC-1.9.6)
    baseURL,

    // Collect trace when retrying a failed test (AC-1.9.7)
    trace: 'on-first-retry',

    // Screenshot on failure (AC-1.9.7)
    screenshot: 'only-on-failure',

    // Ignore HTTPS errors for local development with self-signed certs
    ignoreHTTPSErrors: true,
  },

  // Configure projects for multi-browser testing (AC-1.9.5)
  projects: [
    // Setup project for authentication (runs first, saves auth state)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    // Mobile viewports for responsive testing
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
    timeout: 120 * 1000, // 2 minutes for dev server startup
  },

  // Output directory for test artifacts
  outputDir: 'test-results',

  // Timeout for each test
  timeout: 30 * 1000, // 30 seconds
})
