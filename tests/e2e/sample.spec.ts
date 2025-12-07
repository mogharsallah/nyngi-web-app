import { test, expect } from '@playwright/test'

/**
 * Sample E2E test to verify Playwright configuration works correctly.
 * These tests run against the actual dev server.
 */
test.describe('Sample E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    // Verify the page loads
    await expect(page).toHaveTitle(/Name Your Next Great Idea/i)
  })
})

test.describe('Health Check', () => {
  test('should return healthy status from API', async ({ request }) => {
    const response = await request.get('/api/health/ready', {
      headers: {
        'x-api-key': process.env.API_KEY!,
      },
    })

    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body).toHaveProperty('checks.database.status', 'UP')
  })
})
