import { test, expect } from '@chromatic-com/playwright'
import { figmaConfig } from './figma.config'

test.describe('Figma VRT', () => {
  for (const frame of figmaConfig.frames) {
    test(`${frame.name} matches Figma baseline`, async ({ page }) => {
      // Figmaベースラインは@2x解像度なので、viewportも2倍に設定
      await page.setViewportSize({
        width: frame.viewport.width * 2,
        height: Math.ceil(frame.viewport.height) * 2,
      })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(`${frame.name}.png`, {
        fullPage: true,
        timeout: 30000,  // 大きな画像なのでタイムアウトを延長
      })
    })
  }
})
