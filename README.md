# apple-dot-com

ミニマルなデザインシステムを使用したNext.jsアプリケーションです。VRT（Visual Regression Testing）環境を含んでいます。

## 特徴

- [@khides/minimal-ds](https://github.com/khides/minimal-ds) デザインシステムを使用
- Playwright によるVisual Regression Testing
- Figmaデザインとの比較機能

## セットアップ

### 前提条件

GitHub Packagesからパッケージを取得するため、`~/.npmrc`にPersonal Access Token（PAT）の設定が必要です。

```bash
# ~/.npmrc に追加
//npm.pkg.github.com/:_authToken=ghp_xxxxx
```

PATには `read:packages` スコープが必要です。

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

http://localhost:3000 でアプリケーションが起動します。

## コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | プロダクションサーバー起動 |
| `pnpm lint` | ESLintチェック |
| `pnpm typecheck` | TypeScript型チェック |
| `pnpm test:e2e` | Playwright E2Eテスト実行 |
| `pnpm test:e2e:update` | スナップショット更新 |
| `pnpm test:e2e:ui` | Playwright UI起動 |
| `pnpm figma:fetch` | Figma APIから画像取得 |
| `pnpm figma:capture` | 実装スクリーンショット取得 |
| `pnpm figma:compare` | Figmaと実装を比較 |
| `pnpm figma:all` | 全工程を一括実行 |

## VRT（Visual Regression Testing）

### Playwright VRT

```bash
# 初回実行（ベースラインスナップショット作成）
pnpm test:e2e:update

# テスト実行
pnpm test:e2e
```

### Figma API動的比較

Figma REST APIを使用して、デザインと実装を自動比較できます。

#### セットアップ

1. Figma Personal Access Tokenを取得:
   - Figma → Settings → Security → "Generate new token"
   - `file_read` スコープを選択

2. `.env`ファイルを作成:
   ```bash
   FIGMA_ACCESS_TOKEN=figd_xxxxx
   ```

3. `e2e/figma.config.ts` でFigmaファイルとフレームを設定:
   ```typescript
   export const figmaConfig: FigmaConfig = {
     fileKey: 'your-file-key',  // FigmaのURLから取得
     frames: [
       {
         nodeId: '1-591',       // フレームのnodeId
         name: 'homepage-desktop',
         viewport: { width: 1920, height: 900 }
       }
     ]
   }
   ```

#### 使用方法

```bash
# 開発サーバー起動（別ターミナル）
pnpm dev

# 全工程を一括実行
pnpm figma:all

# または個別に実行
pnpm figma:fetch    # Figma APIから画像取得
pnpm figma:capture  # 実装スクリーンショット取得
pnpm figma:compare  # 比較実行
```

#### 出力

- `e2e/baselines/figma/` - Figmaから取得した画像
- `e2e/screenshots/` - 実装のスクリーンショット
- `e2e/diff/` - 差分画像（不一致部分が赤くハイライト）

### 手動Figma比較（従来方式）

`e2e/baselines/figma/` にFigmaからエクスポートした画像を手動配置し、比較することも可能です。

```bash
pnpm tsx e2e/scripts/compare-figma.ts
```

## プロジェクト構成

```
apple-dot-com/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── e2e/
│   ├── baselines/
│   │   └── figma/                    # Figma画像（API取得 or 手動配置）
│   ├── screenshots/                  # 実装スクリーンショット
│   ├── diff/                         # 差分画像
│   ├── scripts/
│   │   └── compare-figma-dynamic.ts  # Figma API動的比較スクリプト
│   ├── utils/
│   │   ├── figma-api.ts              # Figma APIクライアント
│   │   └── figma-compare.ts          # 画像比較ユーティリティ
│   ├── figma.config.ts               # Figma設定（fileKey, nodeId）
│   └── visual.spec.ts                # Playwright VRTテスト
├── .env                              # 環境変数（FIGMA_ACCESS_TOKEN）
└── playwright.config.ts
```

## デザインシステム

このプロジェクトは `@khides/minimal-ds` パッケージのコンポーネントを使用しています。

```tsx
import { NavHeader, HeroSection, ProductCard, Footer } from '@khides/minimal-ds'
import '@khides/minimal-ds/styles'
```

## 注意事項

このプロジェクトは教育・学習目的で作成されました。

## ライセンス

MIT
