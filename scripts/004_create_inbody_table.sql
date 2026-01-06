-- Create inbody_photos table for storing InBody measurement photos
CREATE TABLE IF NOT EXISTS inbody_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  measurement_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on measurement_date for faster queries
CREATE INDEX IF NOT EXISTS idx_inbody_measurement_date ON inbody_photos(measurement_date DESC);

-- Enable Row Level Security
ALTER TABLE inbody_photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we don't have auth yet)
CREATE POLICY "Allow all operations on inbody_photos" ON inbody_photos
  FOR ALL
  USING (true)
  WITH CHECK (true);
