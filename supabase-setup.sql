-- ============================================================
-- SQL Setup untuk Peta Stunting — Supabase
-- Reset + UUID + Security Invoker
-- ============================================================

-- Aktifkan extension UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Hapus object lama (aman dijalankan berulang kali)
-- ============================================================

DROP VIEW IF EXISTS public.stunting_by_period;
DROP VIEW IF EXISTS public.latest_stunting;

DROP TRIGGER IF EXISTS trigger_stunting_updated_at
ON public.stunting_data;

DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.check_email_exists(text);

DROP TABLE IF EXISTS public.stunting_data CASCADE;
DROP TABLE IF EXISTS public.rt_boundaries CASCADE;

-- ============================================================
-- 1. Tabel batas RT (Polygon GeoJSON)
-- ============================================================

CREATE TABLE public.rt_boundaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rt_number TEXT NOT NULL,
    kelurahan TEXT NOT NULL DEFAULT 'Gunung Sari Ulu',
    geometry JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Tabel data stunting
-- ============================================================
-- Catatan soal kolom `kelurahan` di sini: nilainya SELALU harus sinkron
-- dengan rt_boundaries.kelurahan untuk rt_number yang sama (diisi lewat
-- app di src/lib/dataService.js -> submitStuntingData, dan dibackfill
-- di bawah untuk baris lama). Kalau ada RT yang dipindah ke kelurahan
-- lain, baris stunting_data historisnya PERLU di-backfill ulang juga
-- (lihat query UPDATE di bagian bawah file ini) -- kolom ini denormalized
-- demi kesederhanaan query, jadi gampang "basi" kalau lupa disinkron.

CREATE TABLE public.stunting_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rt_number TEXT NOT NULL,
    stunting_count INT NOT NULL DEFAULT 0,
    period TEXT NOT NULL,       -- Format: YYYY-MM (contoh: 2026-07)
    notes TEXT,
    kelurahan TEXT,             -- diisi di step 2b di bawah (backfill dulu, baru NOT NULL)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2b. Isi kelurahan di stunting_data dari rt_boundaries (via rt_number),
--     BUKAN asal disamain default -- backfill ini cuma relevan kalau
--     tabel di atas gak di-DROP (mis. kamu comment-out bagian DROP demi
--     nyimpen data lama). Untuk instalasi baru/kosong ini gak ngapa-ngapain.
-- ============================================================

UPDATE public.stunting_data sd
SET kelurahan = rb.kelurahan
FROM public.rt_boundaries rb
WHERE sd.rt_number = rb.rt_number
  AND sd.kelurahan IS NULL;

ALTER TABLE public.stunting_data
  ALTER COLUMN kelurahan SET DEFAULT 'Gunung Sari Ulu',
  ALTER COLUMN kelurahan SET NOT NULL;

-- ============================================================
-- 3. View: Data stunting terbaru per RT
-- ============================================================

CREATE OR REPLACE VIEW public.latest_stunting AS
SELECT DISTINCT ON (sd.rt_number)
    sd.rt_number,
    sd.stunting_count,
    sd.period,
    sd.updated_at,
    rb.kelurahan,
    rb.geometry
FROM public.stunting_data sd
LEFT JOIN public.rt_boundaries rb
    ON sd.rt_number = rb.rt_number
ORDER BY
    sd.rt_number,
    sd.updated_at DESC;

ALTER VIEW public.latest_stunting
SET (security_invoker = true);

-- ============================================================
-- 3b. View: Semua data stunting berdasarkan periode
-- ============================================================

CREATE OR REPLACE VIEW public.stunting_by_period AS
SELECT
    sd.rt_number,
    sd.stunting_count,
    sd.period,
    sd.updated_at,
    rb.kelurahan
FROM public.stunting_data sd
LEFT JOIN public.rt_boundaries rb
    ON sd.rt_number = rb.rt_number;

ALTER VIEW public.stunting_by_period
SET (security_invoker = true);

-- ============================================================
-- 4. Index
-- ============================================================

CREATE INDEX idx_stunting_rt
ON public.stunting_data(rt_number);

CREATE INDEX idx_stunting_period
ON public.stunting_data(period);

CREATE INDEX idx_stunting_kelurahan
ON public.stunting_data(kelurahan);

CREATE INDEX idx_boundaries_rt
ON public.rt_boundaries(rt_number);

-- ============================================================
-- 5. Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.rt_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stunting_data ENABLE ROW LEVEL SECURITY;

-- Public Read
CREATE POLICY "Public read rt_boundaries"
ON public.rt_boundaries
FOR SELECT
USING (true);

CREATE POLICY "Public read stunting_data"
ON public.stunting_data
FOR SELECT
USING (true);

-- Authenticated Insert
CREATE POLICY "Auth insert stunting_data"
ON public.stunting_data
FOR INSERT
WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- Authenticated Update
CREATE POLICY "Auth update stunting_data"
ON public.stunting_data
FOR UPDATE
USING ((SELECT auth.role()) = 'authenticated');

-- ============================================================
-- 6. Auto update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_stunting_updated_at
BEFORE UPDATE
ON public.stunting_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 7. check_email_exists
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_email_exists(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM auth.users
        WHERE LOWER(email) = LOWER(p_email)
    );
$$;

REVOKE ALL
ON FUNCTION public.check_email_exists(text)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.check_email_exists(text)
TO anon, authenticated;

-- ============================================================
-- Contoh Insert RT
-- ============================================================
-- INSERT INTO public.rt_boundaries (rt_number, kelurahan, geometry)
-- VALUES
-- ('01','Gunung Sari Ulu','{"type":"Polygon","coordinates":[[[116.827,-1.255],[116.829,-1.255],[116.829,-1.2565],[116.827,-1.2565],[116.827,-1.255]]]}'),
-- ('02','Gunung Sari Ulu','{"type":"Polygon","coordinates":[[[116.829,-1.255],[116.831,-1.255],[116.831,-1.2565],[116.829,-1.2565],[116.829,-1.255]]]}');

-- ============================================================
-- Contoh Insert Data Stunting
-- ============================================================
-- INSERT INTO public.stunting_data (rt_number, stunting_count, period, kelurahan)
-- VALUES
-- ('01',0,'2026-07','Gunung Sari Ulu'),
-- ('02',2,'2026-07','Gunung Sari Ulu'),
-- ('04',4,'2026-07','Gunung Sari Ulu');
