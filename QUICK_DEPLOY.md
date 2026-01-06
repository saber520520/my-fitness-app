# 快速部署指南

## 🚀 5 分鐘快速部署到 Vercel

### 方法 1: 使用 Vercel CLI（最快）

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署專案**
   ```bash
   # 在專案根目錄執行
   vercel
   ```
   
   按照提示：
   - 是否要部署？輸入 `Y`
   - 是否要連結現有專案？輸入 `N`（第一次部署）
   - 專案名稱：直接按 Enter（使用預設）
   - 目錄：直接按 Enter（使用當前目錄）

4. **設定環境變數**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # 貼上你的 Supabase URL
   
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # 貼上你的 Supabase Anon Key
   ```

5. **重新部署**
   ```bash
   vercel --prod
   ```

6. **取得網址**
   - 部署完成後會顯示網址，例如：`https://my-fitness-app.vercel.app`
   - 這個網址可以從任何裝置訪問！

### 方法 2: 使用 GitHub + Vercel Dashboard

1. **將程式碼推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # 在 GitHub 建立新 repository，然後：
   git remote add origin https://github.com/你的用戶名/my-fitness-app.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 前往 https://vercel.com/new
   - 使用 GitHub 登入
   - 選擇你的 repository
   - 點擊 **Import**

3. **設定環境變數**
   - 在專案設定中，前往 **Settings** > **Environment Variables**
   - 新增：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 點擊 **Save**

4. **重新部署**
   - 前往 **Deployments**
   - 點擊最新部署右側的 **...** > **Redeploy**

## ✅ 完成！

部署完成後，你會得到一個類似這樣的網址：
```
https://my-fitness-app.vercel.app
```

這個網址可以：
- ✅ 從手機瀏覽器訪問
- ✅ 從平板電腦訪問
- ✅ 從任何有網路的裝置訪問
- ✅ 自動使用 HTTPS（安全連線）

## 🔧 後續設定

### 自訂網域（可選）

1. 在 Vercel Dashboard > **Settings** > **Domains**
2. 輸入你的網域
3. 按照指示設定 DNS

### 自動部署

如果你使用 GitHub：
- 每次 `git push` 到 main 分支
- Vercel 會自動重新部署
- 非常方便！

## 💡 提示

- 免費方案就足夠個人使用
- 部署速度通常很快（1-2 分鐘）
- 可以隨時重新部署
- 支援自動 HTTPS

