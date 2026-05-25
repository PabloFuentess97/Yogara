import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('should show login prompt when trying to book without auth', async ({ page }) => {
    await page.goto('/horarios')
    const bookButton = page.getByRole('button', { name: /reservar/i }).first()
    if (await bookButton.isVisible()) {
      await bookButton.click()
      await expect(page).toHaveURL(/login/)
    }
  })

  test('should show membership requirement page', async ({ page }) => {
    await page.goto('/membresias')
    await expect(page.locator('text=/mensual|mes/i').first()).toBeVisible()
  })
})
