-- ============================================================
-- SQL Setup untuk Peta Stunting — Supabase
-- ============================================================
-- Jalankan query ini di Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- 1. Tabel batas RT (polygon GeoJSON)
--    Data ini relatif statis, diisi sekali saat setup awal.
CREATE TABLE rt_boundaries (
  id SERIAL PRIMARY KEY,
  rt_number TEXT NOT NULL,
  kelurahan TEXT NOT NULL DEFAULT 'Gunung Sari Ulu',
  geometry JSONB NOT NULL,  -- GeoJSON Polygon
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel data stunting (diisi oleh kader posyandu)
--    Setiap periode, kader input jumlah kasus per RT.
CREATE TABLE stunting_data (
  id SERIAL PRIMARY KEY,
  rt_number TEXT NOT NULL,
  stunting_count INT NOT NULL DEFAULT 0,
  period TEXT NOT NULL,  -- Format: 'YYYY-MM', misal '2026-07'
  notes TEXT,            -- Catatan opsional dari kader
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. View: ambil data stunting TERBARU per RT
--    Ini yang dipakai oleh peta untuk menampilkan warna.
CREATE OR REPLACE VIEW latest_stunting AS
SELECT DISTINCT ON (sd.rt_number)
  sd.rt_number,
  sd.stunting_count,
  sd.period,
  sd.updated_at,
  rb.kelurahan,
  rb.geometry
FROM stunting_data sd
LEFT JOIN rt_boundaries rb ON sd.rt_number = rb.rt_number
ORDER BY sd.rt_number, sd.updated_at DESC;

-- 4. Index untuk performa
CREATE INDEX idx_stunting_rt ON stunting_data(rt_number);
CREATE INDEX idx_stunting_period ON stunting_data(period);
CREATE INDEX idx_boundaries_rt ON rt_boundaries(rt_number);

-- 5. Row Level Security (RLS)
--    Publik bisa baca, hanya authenticated user yang bisa tulis.
ALTER TABLE rt_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stunting_data ENABLE ROW LEVEL SECURITY;

-- Baca: siapa saja bisa
CREATE POLICY "Public read rt_boundaries"
  ON rt_boundaries FOR SELECT
  USING (true);

CREATE POLICY "Public read stunting_data"
  ON stunting_data FOR SELECT
  USING (true);

-- Tulis: hanya authenticated user (kader yang login)
CREATE POLICY "Auth insert stunting_data"
  ON stunting_data FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update stunting_data"
  ON stunting_data FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 6. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stunting_updated_at
  BEFORE UPDATE ON stunting_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CONTOH: Insert data batas RT (ganti koordinat dengan data asli)
-- ============================================================
-- INSERT INTO rt_boundaries (rt_number, kelurahan, geometry) VALUES
-- ('01', 'Gunung Sari Ulu', '{"type":"Polygon","coordinates":[[[116.827,-1.255],[116.829,-1.255],[116.829,-1.2565],[116.827,-1.2565],[116.827,-1.255]]]}'),
-- ('02', 'Gunung Sari Ulu', '{"type":"Polygon","coordinates":[[[116.829,-1.255],[116.831,-1.255],[116.831,-1.2565],[116.829,-1.2565],[116.829,-1.255]]]}');
--
-- CONTOH: Insert data stunting (diisi oleh kader)
-- INSERT INTO stunting_data (rt_number, stunting_count, period) VALUES
-- ('01', 0, '2026-07'),
-- ('02', 2, '2026-07'),
-- ('04', 4, '2026-07');
