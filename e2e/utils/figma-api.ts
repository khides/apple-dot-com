import fs from 'fs'
import path from 'path'

interface FigmaImageResponse {
  err: string | null
  images: Record<string, string | null>
}

export class FigmaClient {
  private token: string
  private baseUrl = 'https://api.figma.com/v1'

  constructor(token: string) {
    this.token = token
  }

  async getImageUrls(fileKey: string, nodeIds: string[]): Promise<Record<string, string>> {
    const ids = nodeIds.join(',')
    const url = `${this.baseUrl}/images/${fileKey}?ids=${ids}&format=png&scale=1`

    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    })

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
    }

    const data: FigmaImageResponse = await response.json()

    if (data.err) {
      throw new Error(`Figma API error: ${data.err}`)
    }

    // Filter out null values
    const images: Record<string, string> = {}
    for (const [nodeId, url] of Object.entries(data.images)) {
      if (url) {
        images[nodeId] = url
      }
    }

    return images
  }

  async downloadImage(imageUrl: string, outputPath: string): Promise<void> {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()

    // Ensure directory exists
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(outputPath, Buffer.from(buffer))
  }
}
