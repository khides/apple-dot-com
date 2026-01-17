import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'

export interface ComparisonResult {
  matchPercentage: number
  diffPixels: number
  totalPixels: number
}

/**
 * Compare a Figma-exported image with an implementation screenshot
 * @param figmaPath - Path to the Figma-exported PNG
 * @param implementationPath - Path to the implementation screenshot
 * @param outputPath - Path to save the diff image
 * @param threshold - Matching threshold (0-1, lower is stricter)
 */
export async function compareFigmaToImplementation(
  figmaPath: string,
  implementationPath: string,
  outputPath: string,
  threshold: number = 0.1
): Promise<ComparisonResult> {
  // Read both images
  const figma = PNG.sync.read(fs.readFileSync(figmaPath))
  const impl = PNG.sync.read(fs.readFileSync(implementationPath))

  // Check dimensions match
  if (figma.width !== impl.width || figma.height !== impl.height) {
    console.warn(
      `Image dimensions don't match: Figma (${figma.width}x${figma.height}) vs Implementation (${impl.width}x${impl.height})`
    )
    // Resize to the smaller dimensions for comparison
    const width = Math.min(figma.width, impl.width)
    const height = Math.min(figma.height, impl.height)

    // For now, throw an error - in production you might want to resize
    throw new Error(
      `Image dimensions must match. Figma: ${figma.width}x${figma.height}, Implementation: ${impl.width}x${impl.height}`
    )
  }

  const { width, height } = figma
  const diff = new PNG({ width, height })

  const diffPixels = pixelmatch(
    figma.data,
    impl.data,
    diff.data,
    width,
    height,
    { threshold }
  )

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save diff image
  fs.writeFileSync(outputPath, PNG.sync.write(diff))

  const totalPixels = width * height
  const matchPercentage = ((totalPixels - diffPixels) / totalPixels) * 100

  return {
    matchPercentage,
    diffPixels,
    totalPixels,
  }
}

/**
 * Compare all Figma baselines in a directory with implementation screenshots
 */
export async function compareAllBaselines(
  figmaDir: string,
  implementationDir: string,
  outputDir: string
): Promise<Map<string, ComparisonResult>> {
  const results = new Map<string, ComparisonResult>()

  if (!fs.existsSync(figmaDir)) {
    console.warn(`Figma baseline directory not found: ${figmaDir}`)
    return results
  }

  const figmaFiles = fs.readdirSync(figmaDir).filter(f => f.endsWith('.png'))

  for (const file of figmaFiles) {
    const figmaPath = path.join(figmaDir, file)
    const implPath = path.join(implementationDir, file)
    const diffPath = path.join(outputDir, `diff-${file}`)

    if (!fs.existsSync(implPath)) {
      console.warn(`Implementation screenshot not found: ${implPath}`)
      continue
    }

    try {
      const result = await compareFigmaToImplementation(
        figmaPath,
        implPath,
        diffPath
      )
      results.set(file, result)

      console.log(
        `${file}: ${result.matchPercentage.toFixed(2)}% match (${result.diffPixels} pixels differ)`
      )
    } catch (error) {
      console.error(`Error comparing ${file}:`, error)
    }
  }

  return results
}
