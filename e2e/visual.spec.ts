import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('homepage matches baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-full.png', { fullPage: true })
  })

  test('hero section matches baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const hero = page.locator('main section').first()
    await expect(hero).toHaveScreenshot('hero-section.png')
  })

  test('navigation header matches baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const nav = page.locator('nav')
    await expect(nav).toHaveScreenshot('nav-header.png')
  })

  test('footer matches baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const footer = page.locator('main').locator('div').last()
    await expect(footer).toHaveScreenshot('footer.png')
  })
})

test.describe('Responsive Visual Tests', () => {
  test('homepage on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-mobile.png', { fullPage: true })
  })

  test('homepage on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-tablet.png', { fullPage: true })
  })
})
