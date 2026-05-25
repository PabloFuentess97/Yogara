import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/yogara/i)
  })

  test('should navigate to clases page', async ({ page }) => {
    await page.goto('/clases')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should navigate to horarios page', async ({ page }) => {
    await page.goto('/horarios')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should navigate to membresias page', async ({ page }) => {
    await page.goto('/membresias')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should navigate to comunidad page', async ({ page }) => {
    await page.goto('/comunidad')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
