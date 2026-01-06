# 部署指南

本指南說明如何將健身紀錄應用程式部署到 Vercel，讓你可以從任何裝置訪問。

## 🚀 部署到 Vercel（推薦）

### 前置需求

1. **GitHub 帳號**（如果還沒有）
2. **Vercel 帳號**（免費註冊：https://vercel.com）
3. **Supabase 專案**（已設定完成）

### 步驟 1: 將程式碼推送到 GitHub

1. **在 GitHub 建立新 Repository**
   - 前往 https://github.com/new
   - 建立一個新的 repository（例如：`my-fitness-app`）
   - 不要勾選 "Initialize this repository with a README"

2. **在本地端初始化 Git 並推送**
   ```bash
   # 在專案根目錄執行
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用戶名/my-fitness-app.git
   git push -u origin main
   ```

### 步驟 2: 在 Vercel 部署

1. **登入 Vercel**
   - 前往 https://vercel.com
   - 使用 GitHub 帳號登入

2. **匯入專案**
   - 點擊 **Add New** > **Project**
   - 選擇你剛才建立的 GitHub repository
   - 點擊 **Import**

3. **設定專案**
   - **Framework Preset**: Next.js（應該會自動偵測）
   - **Root Directory**: `./`（預設）
   - **Build Command**: `npm run build`（預設）
   - **Output Directory**: `.next`（預設）
   - 點擊 **Deploy**

### 步驟 3: 設定環境變數

部署完成後，需要設定環境變數：

1. **在 Vercel Dashboard 中**
   - 前往你的專案
   - 點擊 **Settings** > **Environment Variables**

2. **新增以下環境變數**
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
   ```

3. **重新部署**
   - 點擊 **Deployments** 標籤
   - 找到最新的部署
   - 點擊右側的 **...** > **Redeploy**

### 步驟 4: 取得網址

部署完成後，你會得到：
- **生產環境網址**：`https://你的專案名稱.vercel.app`
- 這個網址可以從任何裝置訪問！

## 🔧 其他部署選項

### Netlify

1. 前往 https://netlify.com
2. 使用 GitHub 登入
3. 匯入專案
4. 設定環境變數
5. 部署

### Railway

1. 前往 https://railway.app
2. 使用 GitHub 登入
3. 建立新專案
4. 連接 GitHub repository
5. 設定環境變數
6. 部署

### 自架伺服器

如果你有自己的伺服器，可以：

1. **建置專案**
   ```bash
   npm run build
   ```

2. **啟動生產伺服器**
   ```bash
   npm start
   ```

3. **使用反向代理**（如 Nginx）設定網域

## ⚙️ 部署後的重要設定

### 1. 確保 Supabase 允許跨域請求

在 Supabase Dashboard > Settings > API：
- 確認 **Site URL** 包含你的 Vercel 網址
- 或在 **Additional Redirect URLs** 中新增你的網址

### 2. 檢查 Storage Bucket 政策

確認 `workout-videos` 和 `inbody-photos` bucket 的政策允許公開存取。

### 3. 測試功能

部署完成後，測試以下功能：
- ✅ 新增訓練記錄
- ✅ 上傳影片
- ✅ 查看歷史記錄
- ✅ 上傳 InBody 照片

## 📱 從不同裝置訪問

部署完成後，你可以：
- 在手機瀏覽器中輸入你的 Vercel 網址
- 在平板電腦上訪問
- 在任何有網路的裝置上使用

## 🔒 安全性提醒

1. **不要將 `.env.local` 提交到 Git**
   - 已在 `.gitignore` 中排除
   - 環境變數只在 Vercel Dashboard 中設定

2. **使用 HTTPS**
   - Vercel 自動提供 HTTPS
   - 確保所有連線都是加密的

3. **定期更新依賴**
   ```bash
   npm update
   ```

## 🆘 疑難排解

### 問題：部署失敗
- 檢查 `package.json` 中的 build 腳本
- 確認所有依賴都已安裝
- 查看 Vercel 的部署日誌

### 問題：環境變數未生效
- 確認環境變數名稱正確（注意大小寫）
- 重新部署專案
- 檢查 Vercel 的環境變數設定

### 問題：Supabase 連線失敗
- 確認 Supabase URL 和 Key 正確
- 檢查 Supabase 的 Site URL 設定
- 確認 Supabase 專案沒有暫停

## 📚 相關資源

- [Vercel 文件](https://vercel.com/docs)
- [Next.js 部署文件](https://nextjs.org/docs/deployment)
- [Supabase 文件](https://supabase.com/docs)

