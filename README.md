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

## VRT（Visual Regression Testing）

### Playwright VRT

```bash
# 初回実行（ベースラインスナップショット作成）
pnpm test:e2e:update

# テスト実行
pnpm test:e2e
```

### Figma比較

`e2e/baselines/figma/` にFigmaからエクスポートした画像を配置し、実装のスクリーンショットと比較できます。

```bash
# 比較スクリプト実行
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
│   │   └── figma/           # Figmaエクスポート画像
│   ├── utils/
│   │   └── figma-compare.ts # Figma比較ユーティリティ
│   └── visual.spec.ts       # VRTテスト
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
