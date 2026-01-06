# Vercel 部署步驟指南

## 📍 你現在在 Deployments 頁面

### 步驟 1: 清除篩選（先試試這個）

1. **點擊 "Clear Filters" 連結**
   - 在 "No Results" 訊息下方
   - 這會清除所有篩選條件
   - 看看是否有隱藏的部署記錄

### 步驟 2: 如果還是空的，觸發第一次部署

#### 方法 A: 使用右上角的選單（推薦）

1. **找到右上角的 "..." 三個點圖示**
   - 在頁面右上角，filter bar 上方

2. **點擊 "..." 選單**
   - 應該會看到選項如：
     - "Redeploy"
     - "Deploy"
     - "Create Deployment"

3. **選擇 "Deploy" 或 "Create Deployment"**
   - 選擇分支：`main` 或 `master`
   - 點擊確認

#### 方法 B: 前往 Settings > Git

1. **點擊頂部導航列的 "Settings"**
2. **在左側選單選擇 "Git"**
3. **找到 "Production Branch"**
4. **點擊 "Redeploy" 按鈕**（如果有）

#### 方法 C: 推送程式碼到 GitHub（最可靠）

如果上述方法都不行，需要先推送程式碼：

1. **使用 GitHub Desktop**（如果已安裝）
   - 開啟 GitHub Desktop
   - 選擇你的專案
   - 點擊 "Publish repository" 或 "Push origin"
   - Vercel 會自動偵測並部署

2. **或使用命令列**（如果已安裝 Git）
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

## ✅ 部署開始後

部署開始後，你會看到：

1. **部署列表出現**
   - 顯示部署狀態（Building... / Ready / Error）

2. **點擊部署項目**
   - 可以查看詳細的建置日誌
   - 查看部署進度

3. **部署完成**
   - 狀態變為 "Ready"
   - 會顯示部署網址（例如：`https://my-fitness-app.vercel.app`）

## 🎯 快速檢查清單

- [ ] 已點擊 "Clear Filters"
- [ ] 已檢查右上角 "..." 選單
- [ ] 已檢查 Settings > Git
- [ ] 已確認環境變數已設定
- [ ] 已推送程式碼到 GitHub（如果需要）

## 💡 提示

- 第一次部署可能需要 2-3 分鐘
- 部署完成後，網址會自動生成
- 之後每次推送程式碼，Vercel 會自動部署

