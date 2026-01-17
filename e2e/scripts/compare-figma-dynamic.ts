import { chromium } from '@playwright/test'
import { FigmaClient } from '../utils/figma-api'
import { compareFigmaToImplementation } from '../utils/figma-compare'
import { figmaConfig } from '../figma.config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env file from project root
dotenv.config({ path: path.join(__dirname, '../../.env') })

const FIGMA_DIR = path.join(__dirname, '../baselines/figma')
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots')
const DIFF_DIR = path.join(__dirname, '../diff')

async function fetchFigmaImages(client: FigmaClient) {
  console.log('📥 Fetching images from Figma API...\n')

  const nodeIds = figmaConfig.frames.map(f => f.nodeId)
  const imageUrls = await client.getImageUrls(figmaConfig.fileKey, nodeIds)

  for (const frame of figmaConfig.frames) {
    const url = imageUrls[frame.nodeId]
    if (!url) {
      console.warn(`⚠️  No image URL for ${frame.name} (${frame.nodeId})`)
      continue
    }

    const outputPath = path.join(FIGMA_DIR, `${frame.name}.png`)
    await client.downloadImage(url, outputPath)
    console.log(`✅ Downloaded: ${frame.name}.png`)
  }
}

async function captureImplementation() {
  console.log('\n📸 Capturing implementation screenshots...\n')

  const browser = await chromium.launch()

  for (const frame of figmaConfig.frames) {
    const context = await browser.newContext({
      viewport: frame.viewport
    })
    const page = await context.newPage()

    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    const outputPath = path.join(SCREENSHOTS_DIR, `${frame.name}.png`)

    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    }

    await page.screenshot({ path: outputPath, fullPage: true })
    console.log(`✅ Captured: ${frame.name}.png`)

    await context.close()
  }

  await browser.close()
}

async function compareAll() {
  console.log('\n🔍 Comparing Figma vs Implementation...\n')

  if (!fs.existsSync(DIFF_DIR)) {
    fs.mkdirSync(DIFF_DIR, { recursive: true })
  }

  const results: Array<{ name: string; match: number; diff: number }> = []

  for (const frame of figmaConfig.frames) {
    const figmaPath = path.join(FIGMA_DIR, `${frame.name}.png`)
    const implPath = path.join(SCREENSHOTS_DIR, `${frame.name}.png`)
    const diffPath = path.join(DIFF_DIR, `diff-${frame.name}.png`)

    if (!fs.existsSync(figmaPath)) {
      console.warn(`⚠️  Figma baseline not found: ${frame.name}`)
      continue
    }
    if (!fs.existsSync(implPath)) {
      console.warn(`⚠️  Implementation screenshot not found: ${frame.name}`)
      continue
    }

    try {
      const result = await compareFigmaToImplementation(figmaPath, implPath, diffPath)
      results.push({ name: frame.name, match: result.matchPercentage, diff: result.diffPixels })

      const emoji = result.matchPercentage >= 95 ? '✅' : result.matchPercentage >= 80 ? '⚠️' : '❌'
      console.log(`${emoji} ${frame.name}: ${result.matchPercentage.toFixed(2)}% match`)
    } catch (error) {
      console.error(`❌ Error comparing ${frame.name}:`, error)
    }
  }

  if (results.length > 0) {
    const avg = results.reduce((sum, r) => sum + r.match, 0) / results.length
    console.log(`\n📊 Average match: ${avg.toFixed(2)}%`)
  }
}

async function main() {
  // Support both FIGMA_ACCESS_TOKEN and FIGMA_TOKEN
  const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN
  if (!token) {
    console.error('❌ Figma token is required')
    console.error('   Set FIGMA_ACCESS_TOKEN in .env file or export FIGMA_TOKEN environment variable')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const shouldFetch = args.includes('--fetch') || args.includes('-f')
  const shouldCapture = args.includes('--capture') || args.includes('-c')
  const shouldCompare = args.includes('--compare') || args.includes('-C')
  const runAll = !shouldFetch && !shouldCapture && !shouldCompare

  const client = new FigmaClient(token)

  console.log('🎨 Figma Dynamic Comparison Tool\n')
  console.log(`📁 File Key: ${figmaConfig.fileKey}`)
  console.log(`📐 Frames: ${figmaConfig.frames.length}\n`)

  if (shouldFetch || runAll) {
    await fetchFigmaImages(client)
  }

  if (shouldCapture || runAll) {
    await captureImplementation()
  }

  if (shouldCompare || runAll) {
    await compareAll()
  }
}

main().catch(console.error)
