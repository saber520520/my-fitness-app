# Vercel 環境變數設定指南

## ⚠️ 問題：No environment variables were created

如果在 Vercel Dashboard 中設定環境變數時出現這個錯誤，請按照以下步驟解決：

## 🔧 解決步驟

### 步驟 1: 確認環境選擇

在 Vercel Dashboard 的 Environment Variables 頁面：

1. **檢查環境下拉選單**
   - 應該選擇 **"All Environments"** 或特定環境（Production/Preview/Development）
   - 如果選擇了 "All Environments"，變數會套用到所有環境

### 步驟 2: 正確填入環境變數

對於每個環境變數：

1. **Key（鍵）**
   - 必須完全正確，注意大小寫
   - `NEXT_PUBLIC_SUPABASE_URL`（注意底線和大小寫）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（注意底線和大小寫）

2. **Value（值）**
   - 不要有多餘的空格
   - 不要有換行符號
   - 直接貼上值，不要加引號

### 步驟 3: 逐個新增（推薦）

不要一次新增多個，建議：

1. **先新增第一個**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://unruyhubfzzaipvhdrkq.supabase.co`
   - 選擇環境：**All Environments**
   - 點擊 **Save**

2. **再新增第二個**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_xhlgcpuCZylJQzo002DR3g_8LtmoxQz`
   - 選擇環境：**All Environments**
   - 點擊 **Save**

### 步驟 4: 使用 Import .env 功能（更簡單）

1. **準備 .env 檔案內容**
   開啟你的 `.env.local` 檔案，複製以下內容（不要包含註解）：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://unruyhubfzzaipvhdrkq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xhlgcpuCZylJQzo002DR3g_8LtmoxQz
   ```

2. **在 Vercel Dashboard**
   - 點擊 **"Import .env"** 按鈕
   - 貼上上面的內容
   - 選擇環境：**All Environments**
   - 點擊 **Save**

## ✅ 驗證設定

設定完成後：

1. **檢查變數列表**
   - 應該可以看到兩個環境變數
   - 確認 Key 和 Value 都正確

2. **重新部署**
   - 前往 **Deployments** 標籤
   - 找到最新的部署
   - 點擊右側的 **...** > **Redeploy**

3. **檢查部署日誌**
   - 在部署頁面查看 **Build Logs**
   - 確認沒有環境變數相關的錯誤

## 🆘 常見問題

### 問題 1: 仍然顯示 "No environment variables were created"

**解決方法：**
- 確認 Key 名稱完全正確（複製貼上，不要手打）
- 確認 Value 沒有多餘空格
- 嘗試清除瀏覽器快取後重試
- 使用不同的瀏覽器試試

### 問題 2: 環境變數已設定但應用程式無法使用

**解決方法：**
- 確認已經重新部署（環境變數變更需要重新部署才會生效）
- 檢查部署日誌確認變數有被讀取
- 確認變數名稱以 `NEXT_PUBLIC_` 開頭（這樣才能在瀏覽器端使用）

### 問題 3: 部署後仍然無法連線 Supabase

**解決方法：**
- 確認 Supabase Dashboard > Settings > API 中的 **Site URL** 包含你的 Vercel 網址
- 或在 **Additional Redirect URLs** 中新增你的 Vercel 網址

## 📝 正確的環境變數格式

```
NEXT_PUBLIC_SUPABASE_URL=https://unruyhubfzzaipvhdrkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xhlgcpuCZylJQzo002DR3g_8LtmoxQz
```

**注意：**
- 不要有空格
- 不要有引號
- 每行一個變數
- Key 和 Value 用 `=` 連接

## 💡 提示

- 使用 **Import .env** 功能通常比手動輸入更可靠
- 設定完成後記得重新部署
- 可以在 Vercel Dashboard 的 **Deployments** > **Build Logs** 中確認環境變數是否正確載入

