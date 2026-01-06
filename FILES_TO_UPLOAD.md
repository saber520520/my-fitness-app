# 需要上傳到 GitHub 的檔案清單

## ✅ 需要上傳的檔案和資料夾

### 必須上傳：
- `app/` - 應用程式頁面
- `components/` - React 元件
- `lib/` - 工具函數
- `public/` - 公開資源
- `package.json` - 依賴設定
- `package-lock.json` - 鎖定版本
- `tsconfig.json` - TypeScript 設定
- `next.config.ts` - Next.js 設定
- `postcss.config.mjs` - PostCSS 設定
- `eslint.config.mjs` - ESLint 設定
- `components.json` - shadcn/ui 設定
- `README.md` - 說明文件
- `*.md` - 所有 Markdown 文件（部署指南等）

### ❌ 不要上傳：
- `node_modules/` - 依賴套件（會自動安裝）
- `.next/` - 建置輸出（會自動產生）
- `.env.local` - 環境變數（已在 Vercel 設定）
- `.vercel/` - Vercel 設定
- `*.tsbuildinfo` - TypeScript 建置資訊

## 📦 快速上傳方法

### 使用 GitHub 網頁上傳：

1. 前往：https://github.com/saber520520/my-fitness-app
2. 如果 repository 是空的，點擊 "uploading an existing file"
3. 上傳以下資料夾和檔案：
   - `app/` 資料夾
   - `components/` 資料夾
   - `lib/` 資料夾
   - `public/` 資料夾
   - `package.json`
   - `package-lock.json`
   - `tsconfig.json`
   - `next.config.ts`
   - `postcss.config.mjs`
   - `eslint.config.mjs`
   - `components.json`
   - 所有 `.md` 檔案

4. 輸入 commit 訊息：`Initial commit`
5. 選擇分支：`main`
6. 點擊 "Commit changes"

完成後，Vercel 會自動偵測並開始部署！

