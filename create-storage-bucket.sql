-- ============================================
-- 建立 Storage Buckets
-- ============================================
-- 請在 Supabase Dashboard > SQL Editor 中執行此腳本
-- ============================================

-- 建立 workout-videos bucket（公開）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'workout-videos', 
  'workout-videos', 
  true,  -- 設為公開，這樣可以直接透過 URL 存取影片
  52428800,  -- 50 MB (50 * 1024 * 1024)
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska', 'video/x-m4v']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska', 'video/x-m4v'];

-- 建立 inbody-photos bucket（公開）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'inbody-photos', 
  'inbody-photos', 
  true,  -- 設為公開，這樣可以直接透過 URL 存取照片
  10485760,  -- 10 MB (10 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 設定公開讀取策略（任何人都可以讀取影片）
-- 如果政策已存在，先刪除再建立
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'workout-videos');

-- 設定上傳策略（允許任何人上傳）
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
CREATE POLICY "Allow uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'workout-videos');

-- 設定更新策略（允許更新）
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
CREATE POLICY "Allow updates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'workout-videos');

-- 設定刪除策略（允許刪除）
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;
CREATE POLICY "Allow deletes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'workout-videos');

-- ============================================
-- inbody-photos bucket 政策
-- ============================================

-- 設定公開讀取策略（任何人都可以讀取照片）
DROP POLICY IF EXISTS "Public Access InBody" ON storage.objects;
CREATE POLICY "Public Access InBody" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'inbody-photos');

-- 設定上傳策略（允許任何人上傳）
DROP POLICY IF EXISTS "Allow uploads InBody" ON storage.objects;
CREATE POLICY "Allow uploads InBody" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'inbody-photos');

-- 設定更新策略（允許更新）
DROP POLICY IF EXISTS "Allow updates InBody" ON storage.objects;
CREATE POLICY "Allow updates InBody" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'inbody-photos');

-- 設定刪除策略（允許刪除）
DROP POLICY IF EXISTS "Allow deletes InBody" ON storage.objects;
CREATE POLICY "Allow deletes InBody" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'inbody-photos');

-- ============================================
-- 完成！
-- ============================================
-- 現在你可以在應用程式中上傳訓練影片和 InBody 照片了
-- ============================================

