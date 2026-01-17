import { chromium } from '@playwright/test'
import { compareFigmaToImplementation } from '../utils/figma-compare'
import fs from 'fs'
import path from 'path'

const BASELINES_DIR = path.join(__dirname, '../baselines/figma')
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots')
const DIFF_DIR = path.join(__dirname, '../diff')

interface ComparisonResult {
  viewport: string
  figmaFile: string
  matchPercentage: number
  diffPixels: number
  diffFile: string
}

async function captureImplementationScreenshots() {
  const browser = await chromium.launch()
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 },
  ]

  // Ensure directories exist
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    })
    const page = await context.newPage()

    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    const screenshotPath = path.join(SCREENSHOTS_DIR, `homepage-${viewport.width}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: true })

    console.log(`📸 Captured ${viewport.name} (${viewport.width}px): ${screenshotPath}`)

    await context.close()
  }

  await browser.close()
}

async function compareFigmaBaselines(): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = []

  // Ensure diff directory exists
  if (!fs.existsSync(DIFF_DIR)) {
    fs.mkdirSync(DIFF_DIR, { recursive: true })
  }

  const figmaFiles = fs.readdirSync(BASELINES_DIR).filter(f => f.endsWith('.png'))

  if (figmaFiles.length === 0) {
    console.log('⚠️  No Figma baseline images found in', BASELINES_DIR)
    console.log('   Place your Figma exports as:')
    console.log('   - homepage-1440.png (Desktop)')
    console.log('   - homepage-768.png (Tablet)')
    console.log('   - homepage-375.png (Mobile)')
    return results
  }

  for (const figmaFile of figmaFiles) {
    const match = figmaFile.match(/homepage-(\d+)\.png/)
    if (!match) continue

    const width = match[1]
    const figmaPath = path.join(BASELINES_DIR, figmaFile)
    const implPath = path.join(SCREENSHOTS_DIR, `homepage-${width}.png`)
    const diffPath = path.join(DIFF_DIR, `diff-${width}.png`)

    if (!fs.existsSync(implPath)) {
      console.log(`⚠️  No implementation screenshot for ${width}px. Run capture first.`)
      continue
    }

    try {
      const result = await compareFigmaToImplementation(figmaPath, implPath, diffPath)

      results.push({
        viewport: `${width}px`,
        figmaFile,
        matchPercentage: result.matchPercentage,
        diffPixels: result.diffPixels,
        diffFile: diffPath,
      })

      const emoji = result.matchPercentage >= 95 ? '✅' : result.matchPercentage >= 80 ? '⚠️' : '❌'
      console.log(`${emoji} ${width}px: ${result.matchPercentage.toFixed(2)}% match (${result.diffPixels} diff pixels)`)
    } catch (error) {
      console.error(`❌ Error comparing ${width}px:`, error)
    }
  }

  return results
}

async function main() {
  const args = process.argv.slice(2)
  const shouldCapture = args.includes('--capture') || args.includes('-c')
  const shouldCompare = args.includes('--compare') || args.includes('-C')
  const runAll = !shouldCapture && !shouldCompare

  console.log('🎨 Figma Comparison Tool\n')

  if (shouldCapture || runAll) {
    console.log('📸 Capturing implementation screenshots...\n')
    await captureImplementationScreenshots()
    console.log('')
  }

  if (shouldCompare || runAll) {
    console.log('🔍 Comparing with Figma baselines...\n')
    const results = await compareFigmaBaselines()

    if (results.length > 0) {
      console.log('\n📊 Summary:')
      const avgMatch = results.reduce((sum, r) => sum + r.matchPercentage, 0) / results.length
      console.log(`   Average match: ${avgMatch.toFixed(2)}%`)
      console.log(`   Diff images saved to: ${DIFF_DIR}`)
    }
  }
}

main().catch(console.error)
