import { execSync } from 'child_process'
import { FigmaClient } from '../utils/figma-api'
import { figmaConfig } from '../figma.config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env file from project root
dotenv.config({ path: path.join(__dirname, '../../.env') })

const FIGMA_DIR = path.join(__dirname, '../baselines/figma')
const PLAYWRIGHT_SNAPSHOTS_DIR = path.join(__dirname, '../baselines/visual.spec.ts-snapshots')

function checkCachedImages(): { cached: string[]; missing: string[] } {
  const cached: string[] = []
  const missing: string[] = []

  for (const frame of figmaConfig.frames) {
    const imagePath = path.join(FIGMA_DIR, `${frame.name}.png`)
    if (fs.existsSync(imagePath)) {
      cached.push(frame.name)
    } else {
      missing.push(frame.name)
    }
  }

  return { cached, missing }
}

async function fetchFigmaImages(client: FigmaClient, forceRefresh: boolean = false): Promise<boolean> {
  const { cached, missing } = checkCachedImages()

  if (!forceRefresh && cached.length > 0 && missing.length === 0) {
    console.log('📦 Using cached Figma images:\n')
    cached.forEach(name => console.log(`   ✅ ${name}.png (cached)`))
    console.log('\n   💡 Use --force-fetch to refresh from Figma API')
    return true
  }

  if (!forceRefresh && cached.length > 0) {
    console.log('📦 Some images cached, fetching missing:\n')
    cached.forEach(name => console.log(`   ✅ ${name}.png (cached)`))
  } else {
    console.log('📥 Fetching images from Figma API...\n')
  }

  const framesToFetch = forceRefresh
    ? figmaConfig.frames
    : figmaConfig.frames.filter(f => missing.includes(f.name))

  if (framesToFetch.length === 0) {
    return true
  }

  try {
    const nodeIds = framesToFetch.map(f => f.nodeId)
    const imageUrls = await client.getImageUrls(figmaConfig.fileKey, nodeIds)

    if (!fs.existsSync(FIGMA_DIR)) {
      fs.mkdirSync(FIGMA_DIR, { recursive: true })
    }

    for (const frame of framesToFetch) {
      const url = imageUrls[frame.nodeId]
      if (!url) {
        console.warn(`⚠️  No image URL for ${frame.name} (${frame.nodeId})`)
        continue
      }

      const outputPath = path.join(FIGMA_DIR, `${frame.name}.png`)
      await client.downloadImage(url, outputPath)
      console.log(`✅ Downloaded: ${frame.name}.png`)
    }

    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes('429')) {
      console.error('\n⚠️  Figma API rate limit reached (429 Too Many Requests)')
      console.error('   This is a Figma API limitation that applies to all users.')
      console.error('\n   Options:')
      console.error('   1. Wait a few minutes and try again')
      console.error('   2. Manually export images from Figma UI')
      console.error(`   3. Place images in: ${FIGMA_DIR}`)

      if (cached.length > 0) {
        console.log(`\n📦 Continuing with ${cached.length} cached image(s)...`)
        return true
      }
    } else {
      console.error('❌ Error fetching Figma images:', error)
    }
    return false
  }
}

function copyToPlaywrightBaselines() {
  console.log('\n📋 Copying Figma images to Playwright baselines...\n')

  if (!fs.existsSync(PLAYWRIGHT_SNAPSHOTS_DIR)) {
    fs.mkdirSync(PLAYWRIGHT_SNAPSHOTS_DIR, { recursive: true })
  }

  // Playwright snapshot naming: {name}-{project}-linux.png
  const projects = ['chromium', 'mobile']

  for (const frame of figmaConfig.frames) {
    const figmaPath = path.join(FIGMA_DIR, `${frame.name}.png`)

    if (!fs.existsSync(figmaPath)) {
      console.warn(`⚠️  Figma image not found: ${frame.name}`)
      continue
    }

    for (const project of projects) {
      const targetName = `${frame.name}-${project}-linux.png`
      const targetPath = path.join(PLAYWRIGHT_SNAPSHOTS_DIR, targetName)
      fs.copyFileSync(figmaPath, targetPath)
      console.log(`✅ Copied: ${frame.name}.png → ${targetName}`)
    }
  }
}

function runPlaywrightTests(): boolean {
  console.log('\n🎭 Running Playwright tests...\n')

  try {
    execSync('pnpm exec playwright test', {
      cwd: path.join(__dirname, '../..'),
      stdio: 'inherit',
    })
    console.log('\n✅ Playwright tests completed')
    return true
  } catch {
    console.error('\n❌ Playwright tests failed')
    return false
  }
}

function runChromatic(): boolean {
  console.log('\n🎨 Uploading to Chromatic...\n')

  try {
    execSync('pnpm exec chromatic --playwright', {
      cwd: path.join(__dirname, '../..'),
      stdio: 'inherit',
    })
    console.log('\n✅ Chromatic upload completed')
    return true
  } catch {
    console.error('\n❌ Chromatic upload failed')
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const shouldFetch = args.includes('--fetch') || args.includes('-f')
  const shouldBaseline = args.includes('--baseline') || args.includes('-b')
  const shouldPlaywright = args.includes('--playwright') || args.includes('-p')
  const shouldChromatic = args.includes('--chromatic') || args.includes('-ch')
  const forceRefresh = args.includes('--force-fetch') || args.includes('--force')
  const skipFetch = args.includes('--skip-fetch') || args.includes('--no-fetch')
  const runAll = !shouldFetch && !shouldBaseline && !shouldPlaywright && !shouldChromatic

  console.log('🎨 Figma VRT Tool\n')
  console.log(`📁 File Key: ${figmaConfig.fileKey}`)
  console.log(`📐 Frames: ${figmaConfig.frames.length}\n`)

  // Check if we need Figma token
  const needsFetch = (shouldFetch || runAll) && !skipFetch
  const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN

  if (needsFetch && !token) {
    const { cached } = checkCachedImages()
    if (cached.length === figmaConfig.frames.length) {
      console.log('💡 No Figma token, but all images are cached. Continuing...\n')
    } else {
      console.error('❌ Figma token is required for fetching images')
      console.error('   Set FIGMA_ACCESS_TOKEN in .env file')
      console.error('   Or use --skip-fetch if images are already available')
      process.exit(1)
    }
  }

  // Step 1: Fetch Figma images (with caching)
  if ((shouldFetch || runAll) && !skipFetch) {
    const client = token ? new FigmaClient(token) : null
    if (client) {
      const success = await fetchFigmaImages(client, forceRefresh)
      if (!success && checkCachedImages().cached.length === 0) {
        console.error('\n❌ No Figma images available. Exiting.')
        process.exit(1)
      }
    }
  }

  // Step 2: Copy Figma images to Playwright baselines
  if (shouldBaseline || runAll) {
    copyToPlaywrightBaselines()
  }

  // Step 3: Run Playwright VRT tests
  if (shouldPlaywright || runAll) {
    runPlaywrightTests()
  }

  // Step 4: Upload to Chromatic (optional)
  if (shouldChromatic) {
    runChromatic()
  }
}

main().catch(console.error)
