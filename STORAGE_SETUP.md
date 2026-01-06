# Storage Bucket 設定指南

## 🎯 問題：Bucket not found

如果你在上傳影片時看到 "Bucket not found" 錯誤，表示需要在 Supabase 中建立 `workout-videos` Storage bucket。

## 🔧 解決方法（兩種方式）

### 方法 1：使用 SQL 腳本（推薦）

1. **開啟 Supabase Dashboard**
   - 前往 [Supabase Dashboard](https://app.supabase.com)
   - 選擇你的專案

2. **執行 SQL 腳本**
   - 前往 **SQL Editor**
   - 點擊 **New query**
   - 複製 `create-storage-bucket.sql` 檔案中的內容
   - 貼上並點擊 **Run**

3. **驗證**
   - 前往 **Storage** 頁面
   - 確認可以看到 `workout-videos` bucket

### 方法 2：使用 Dashboard 手動建立

1. **前往 Storage**
   - 在 Supabase Dashboard 中，點擊左側選單的 **Storage**

2. **建立新 Bucket**
   - 點擊 **New bucket** 按鈕
   - 填入以下資訊：
     - **Name**: `workout-videos`（必須完全一致）
     - **Public bucket**: 選擇 `Yes`（這樣可以直接透過 URL 存取影片）
     - **File size limit**: `52428800`（50 MB）
     - **Allowed MIME types**: `video/*`（或留空）

3. **設定 Storage 政策**
   - 點擊 `workout-videos` bucket
   - 前往 **Policies** 標籤
   - 點擊 **New Policy**
   - 建立以下政策：

   **允許讀取（Select）：**
   ```sql
   CREATE POLICY "Public Access" 
   ON storage.objects 
   FOR SELECT 
   USING (bucket_id = 'workout-videos');
   ```

   **允許上傳（Insert）：**
   ```sql
   CREATE POLICY "Allow uploads" 
   ON storage.objects 
   FOR INSERT 
   WITH CHECK (bucket_id = 'workout-videos');
   ```

   **允許刪除（Delete）：**
   ```sql
   CREATE POLICY "Allow deletes" 
   ON storage.objects 
   FOR DELETE 
   USING (bucket_id = 'workout-videos');
   ```

## ✅ 驗證設定

完成設定後：

1. **重新整理應用程式頁面**（如果正在運行）
2. **嘗試上傳一個測試影片**
3. **確認上傳成功且沒有錯誤**

## 🔒 安全性說明

- **公開 Bucket**：影片 URL 可以直接存取，適合公開分享
- **私有 Bucket**：需要額外的認證，更安全但設定較複雜

對於個人健身紀錄應用，公開 bucket 通常就足夠了。如果你需要更嚴格的安全性，可以：
- 將 bucket 設為私有
- 使用 Supabase Auth 進行認證
- 設定更細緻的 RLS 政策

## 🆘 疑難排解

### 問題：仍然出現 "Bucket not found"
- 確認 bucket 名稱完全一致：`workout-videos`（注意大小寫和連字號）
- 檢查是否在正確的 Supabase 專案中
- 重新啟動開發伺服器

### 問題：上傳失敗但沒有錯誤訊息
- 檢查檔案大小是否超過 50MB
- 確認檔案格式是否為支援的影片格式（mp4, mov, avi, webm 等）
- 檢查瀏覽器控制台是否有詳細錯誤訊息

### 問題：上傳成功但無法播放
- 確認 bucket 設為公開（Public bucket = Yes）
- 檢查 Storage 政策是否允許讀取（SELECT）
- 確認影片 URL 格式正確

## 📚 相關資源

- [Supabase Storage 文件](https://supabase.com/docs/guides/storage)
- [Storage 政策文件](https://supabase.com/docs/guides/storage/security/access-control)

