import { supabase } from "./supabase";
import rtGeoJson from "../data/rtGeoJson";

// ============================================================
// Data Service Layer
// ============================================================
// Handles fetching and inserting data from Supabase.
// ============================================================

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== "YOUR_SUPABASE_URL" && url !== "https://your-project.supabase.co";
};

const normalizeRTNumber = (value) => String(value).trim().padStart(2, "0");

const toGeometry = (geometry) => (
  typeof geometry === "string" ? JSON.parse(geometry) : geometry
);

const toGeoJson = (boundaries = [], cases = [], fallbackKelurahan) => {
  const casesByRT = new Map(
    cases.map((row) => [normalizeRTNumber(row.rt_number), row])
  );

  return {
    type: "FeatureCollection",
    features: boundaries.map((boundary) => {
      const rtNumber = normalizeRTNumber(boundary.rt_number);
      const caseData = casesByRT.get(rtNumber);

      return {
        type: "Feature",
        properties: {
          rt_number: boundary.rt_number,
          stunting_count: caseData?.stunting_count ?? 0,
          kelurahan: boundary.kelurahan || fallbackKelurahan || "Gunung Sari Ulu",
          period: caseData?.period,
          updated_at: caseData?.updated_at,
        },
        geometry: toGeometry(boundary.geometry),
      };
    }),
  };
};

/**
 * Fetch RT data with stunting counts for a specific period (month/year).
 * Returns GeoJSON FeatureCollection format.
 *
 * @param {string|undefined} kelurahan - Wilayah kerja akun yang login
 *   (dari user.user_metadata.kelurahan). Kalau diisi, data akan difilter
 *   hanya untuk kelurahan itu -- ini yang bikin peta "dinamis" per akun.
 *   Kalau kosong (mis. saat dev tanpa login), semua data ikut tampil
 *   seperti sebelumnya.
 * @param {string|undefined} period - Periode 'YYYY-MM' yang mau ditampilkan
 *   di peta (mis. '2026-01'). Kalau kosong, default ke bulan berjalan.
 *   RT yang belum ada data di periode ini otomatis dianggap 0 kasus (hijau).
 */
export async function fetchRTData(kelurahan, period) {
  const activePeriod = period || getCurrentPeriod();

  if (!isSupabaseConfigured()) {
    console.warn("[DataService] Supabase belum dikonfigurasi, pakai data lokal.");
    return rtGeoJson;
  }

  try {
    // `stunting_data.kelurahan` sekarang beneran ada (lewat migration yang
    // backfill dari rt_boundaries via rt_number) -- jadi filter langsung
    // di sini aman & lebih sederhana daripada fetch boundaries dulu buat
    // dapetin daftar rt_number-nya.
    let boundariesQuery = supabase
      .from("rt_boundaries")
      .select("rt_number, kelurahan, geometry")
      .order("rt_number");
    let casesQuery = supabase
      .from("stunting_data")
      .select("rt_number, stunting_count, period, updated_at")
      .eq("period", activePeriod)
      .order("rt_number");

    if (kelurahan) {
      boundariesQuery = boundariesQuery.eq("kelurahan", kelurahan);
      casesQuery = casesQuery.eq("kelurahan", kelurahan);
    }

    const [{ data: boundaries, error: boundariesError }, { data: cases, error: casesError }] =
      await Promise.all([boundariesQuery, casesQuery]);

    if (boundariesError) throw boundariesError;
    if (casesError) throw casesError;

    if (!boundaries || boundaries.length === 0) {
      if (kelurahan) {
        // Supabase sudah aktif tapi memang belum ada batas RT untuk
        // kelurahan akun ini -- JANGAN fallback ke data lokal (itu data
        // Gunung Sari Ulu), nanti kelurahan lain jadi ikut lihat data
        // yang bukan miliknya. Tampilkan kosong saja.
        console.warn(`[DataService] rt_boundaries kosong untuk kelurahan "${kelurahan}".`);
        return { type: "FeatureCollection", features: [] };
      }
      console.warn("[DataService] rt_boundaries kosong di Supabase, pakai data lokal.");
      return rtGeoJson;
    }

    return toGeoJson(boundaries, cases, kelurahan);
  } catch (err) {
    console.error("[DataService] Error fetching data:", err.message);
    return kelurahan ? { type: "FeatureCollection", features: [] } : rtGeoJson;
  }
}

export async function submitStuntingData({ rtNumber, stuntingCount, period, notes, kelurahan }) {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase belum dikonfigurasi. Tambahkan URL & key di file .env",
    };
  }

  try {
    const { error } = await supabase.from("stunting_data").insert({
      rt_number: rtNumber,
      stunting_count: stuntingCount,
      period: period,
      notes: notes || null,
      kelurahan: kelurahan || "Gunung Sari Ulu",
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Get list of RT numbers from Supabase boundaries (for the dropdown),
 * difilter per kelurahan akun yang login kalau tersedia.
 */
export async function getRTNumbers(kelurahan) {
  if (!isSupabaseConfigured()) {
    return rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  let query = supabase.from("rt_boundaries").select("rt_number").order("rt_number");
  if (kelurahan) query = query.eq("kelurahan", kelurahan);

  const { data, error } = await query;

  if (error) {
    console.error("[DataService] Error fetching RT numbers:", error.message);
    return kelurahan ? [] : rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  if (!data || data.length === 0) {
    return kelurahan ? [] : rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  return data.map((row) => row.rt_number);
}

/**
 * Get current period string (YYYY-MM).
 */
export function getCurrentPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}