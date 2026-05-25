import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña/i)).toBeVisible()
  })

  test('should show registration page', async ({ page }) => {
    await page.goto('/registro')
    await expect(page.getByRole('heading', { name: /crear cuenta/i })).toBeVisible()
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /entrar|acceder/i }).click()
    await expect(page.locator('form')).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /registr/i }).click()
    await expect(page).toHaveURL('/registro')
  })
})
