-- 創建用於存放訓練影片的 Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('workout-videos', 'workout-videos', true)
ON CONFLICT (id) DO NOTHING;

-- 設定公開讀取的策略
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'workout-videos');

-- 設定上傳策略（允許任何人上傳）
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'workout-videos');

-- 設定刪除策略
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (bucket_id = 'workout-videos');
