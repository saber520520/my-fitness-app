# 第一次部署指南

## 🎯 問題：Deployments 頁面是空的

這表示還沒有進行第一次部署。以下是解決方法：

## 🚀 方法 1: 在 Vercel Dashboard 手動觸發（最快）

1. **在 Vercel Dashboard**
   - 前往你的專案頁面
   - 點擊頂部的 **"Deployments"** 標籤

2. **手動觸發部署**
   - 如果看到 **"Deploy"** 或 **"Redeploy"** 按鈕，點擊它
   - 或者點擊右上角的 **"..."** 選單，選擇 **"Redeploy"**
   - 選擇分支：`main` 或 `master`
   - 點擊 **"Deploy"**

3. **等待部署完成**
   - 通常需要 1-2 分鐘
   - 部署完成後會顯示網址

## 🔄 方法 2: 推送程式碼到 GitHub（推薦）

如果程式碼還沒有推送到 GitHub：

### 步驟 1: 確認 Git 已安裝

在終端機執行：
```bash
git --version
```

如果沒有安裝，請先安裝 Git：
- Windows: https://git-scm.com/download/win
- 或使用 GitHub Desktop: https://desktop.github.com

### 步驟 2: 初始化 Git（如果還沒有）

```bash
# 在專案根目錄執行
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

### 步驟 3: 連接到 GitHub

```bash
# 替換成你的 repository URL
git remote add origin https://github.com/saber520520/my-fitness-app.git
git push -u origin main
```

### 步驟 4: Vercel 會自動部署

- 推送完成後，Vercel 會自動偵測並開始部署
- 在 Vercel Dashboard 的 Deployments 頁面可以看到部署進度

## 📝 方法 3: 使用 Vercel CLI（如果已安裝）

```bash
# 在專案根目錄執行
vercel --prod
```

## ✅ 部署完成後

部署完成後，你會看到：

1. **部署狀態**：顯示 "Ready" 或 "Success"
2. **部署網址**：例如 `https://my-fitness-app.vercel.app`
3. **部署時間**：顯示部署完成的時間

## 🔍 檢查部署狀態

在 Deployments 頁面：

- **綠色勾勾** = 部署成功
- **紅色 X** = 部署失敗（點擊查看錯誤）
- **黃色圓圈** = 部署中

## 🆘 如果部署失敗

1. **點擊失敗的部署**查看詳細日誌
2. **常見問題**：
   - 環境變數未設定 → 前往 Settings > Environment Variables
   - 建置錯誤 → 檢查 Build Logs
   - 依賴問題 → 確認 package.json 正確

## 💡 提示

- 第一次部署可能需要較長時間（2-3 分鐘）
- 部署完成後，網址會自動生成
- 之後每次推送程式碼到 GitHub，Vercel 會自動重新部署

