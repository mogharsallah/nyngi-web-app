import { createAdminClient } from '@/server/lib/supabase/admin'
import { Page } from '@playwright/test'

export interface TestUser {
  email: string
}

/**
 * Generate a magic link for test authentication using Supabase Admin API.
 * This bypasses the normal email flow for faster E2E tests.
 *
 * @param email - The email address to generate a link for
 * @returns The magic link URL that can be used to authenticate
 */
export async function generateMagicLink(email: string): Promise<string> {
  const client = createAdminClient()
  const { error, data } = await client.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      // redirectTo: process.env.HOST + '/',
    },
  })

  if (error) {
    throw new Error(`Failed to generate magic link: ${error.message}`)
  }
  return data.properties.action_link
}

/**
 * Authenticate a Playwright page using a magic link.
 * This creates a test user session without needing to go through the email flow.
 *
 * @param page - The Playwright page to authenticate
 * @param email - The email address to authenticate as
 */
export async function authenticate(page: Page, email = process.env.E2E_TEST_USER_1_EMAIL!): Promise<void> {
  // Generate the magic link
  const magicLink = await generateMagicLink(email)

  // Navigate to the magic link to complete authentication
  await page.goto(magicLink)

  // Wait for redirect to complete (should end up at studio or dashboard)
  await page.waitForURL(/\/(studio|dashboard)/)
}

/**
 * Create a test user with a unique email for isolated tests.
 *
 * @param prefix - Optional prefix for the email (default: "test")
 * @returns A TestUser object with a unique email
 */
export function createTestUser(prefix = 'test'): TestUser {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return {
    email: `${prefix}-${timestamp}-${random}@test.nyngi.local`,
  }
}

/**
 * Sign out the current user by clearing cookies and local storage.
 *
 * @param page - The Playwright page to sign out
 */
export async function signOut(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.context().clearCookies()
}
