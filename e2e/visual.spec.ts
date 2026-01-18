import { test, expect } from '@chromatic-com/playwright'
import { figmaConfig } from './figma.config'

test.describe('Figma VRT', () => {
  // テストのタイムアウトを延長
  test.setTimeout(120000)

  for (const frame of figmaConfig.frames) {
    test(`${frame.name} matches Figma baseline`, async ({ page }) => {
      // Figmaベースラインは@2x解像度 (3840x14040)
      // deviceScaleFactor=2なので、論理ピクセルで設定
      await page.setViewportSize({
        width: frame.viewport.width,
        height: Math.ceil(frame.viewport.height),
      })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // 背景画像のロードを待つ
      await page.waitForTimeout(3000)

      await expect(page).toHaveScreenshot(`${frame.name}.png`, {
        fullPage: true,
        timeout: 60000,
        scale: 'device', // deviceScaleFactorを使用して@2xでキャプチャ
      })
    })
  }
})
