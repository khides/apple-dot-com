export interface FigmaFrame {
  nodeId: string
  name: string
  viewport: {
    width: number
    height: number
  }
}

export interface FigmaConfig {
  fileKey: string
  frames: FigmaFrame[]
}

export const figmaConfig: FigmaConfig = {
  // FigmaファイルのURLから取得: figma.com/design/{fileKey}/...
  fileKey: 'cWiDCn3brmySFIcidCmP3E',
  frames: [
    {
      nodeId: '1-591',  // "1920w light" フレーム
      name: 'homepage-desktop',
      viewport: { width: 1920, height: 7019.98 }  
    },
    // 後で追加可能:
    // { nodeId: 'xxx', name: 'homepage-tablet', viewport: { width: 768, height: 1024 } },
    // { nodeId: 'xxx', name: 'homepage-mobile', viewport: { width: 375, height: 812 } },
  ]
}
