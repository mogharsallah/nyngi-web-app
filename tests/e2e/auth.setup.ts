import { test as setup, expect } from '@playwright/test'
import { createAdminClient } from '@/server/lib/supabase/admin'

const authFile = 'playwright/.auth/user.json'

/**
 * Generate a magic link for test authentication using Supabase Admin API.
 */
async function generateMagicLink(email: string): Promise<string> {
  const client = createAdminClient()
  const { error, data } = await client.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (error) {
    throw new Error(`Failed to generate magic link: ${error.message}`)
  }
  return `/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink`
}

/**
 * Authentication setup test.
 * This runs before all other tests and saves the authenticated state.
 */
setup('authenticate', async ({ page }) => {
  const testEmail = process.env.E2E_TEST_USER_1_EMAIL

  if (!testEmail) {
    throw new Error('E2E_TEST_USER_1_EMAIL environment variable is required')
  }

  // Generate the magic link
  const magicLink = await generateMagicLink(testEmail)

  // Navigate to the magic link to complete authentication
  await page.goto(magicLink)

  // Wait for redirect to complete (should end up at studio or dashboard)
  await page.waitForURL(/\/(studio|dashboard|orders|reports)/)

  // Verify we're authenticated
  await expect(page.locator('body')).toBeVisible()

  // Save the authenticated state
  await page.context().storageState({ path: authFile })
})
