import { test, expect } from '@playwright/test'

test.describe('Naming Flow', () => {
  test('should allow user to select a plan and enter chat', async ({ page, isMobile }) => {
    // 1. Navigate to studio page
    await page.goto('/studio')

    // 2. Verify Plan Selection screen
    // Handle responsive layout duplication (StudioLayout renders twice)
    const desktopContainer = page.locator('.md\\:grid')
    const mobileContainer = page.locator('.md\\:hidden')

    const container = isMobile ? mobileContainer : desktopContainer

    if (isMobile) {
      // Switch to Canvas view to see the content
      await page.getByRole('button', { name: 'Canvas Panel' }).click()
    }

    await expect(container.getByText('Choose Your Path')).toBeVisible()
    await expect(container.getByText('Velocity Plan')).toBeVisible()
    await expect(container.getByText('Legacy Plan')).toBeVisible()

    // 3. Select Velocity Plan
    await container.getByText('Select Velocity').click()

    // 4. Verify Chat Interface loads
    await expect(container.getByText('Narrative Architect')).toBeVisible()
    await expect(container.getByText('Current Plan: velocity')).toBeVisible()
  })
})
