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

const toGeoJson = (boundaries = [], cases = []) => {
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
          kelurahan: boundary.kelurahan || "Gunung Sari Ulu",
          period: caseData?.period,
          updated_at: caseData?.updated_at,
        },
        geometry: toGeometry(boundary.geometry),
      };
    }),
  };
};

/**
 * Fetch RT data with latest stunting counts.
 * Returns GeoJSON FeatureCollection format.
 */
export async function fetchRTData() {
  if (!isSupabaseConfigured()) {
    console.warn("[DataService] Supabase belum dikonfigurasi, pakai data lokal.");
    return rtGeoJson;
  }

  try {
    const [{ data: boundaries, error: boundariesError }, { data: cases, error: casesError }] =
      await Promise.all([
        supabase
          .from("rt_boundaries")
          .select("rt_number, kelurahan, geometry")
          .order("rt_number"),
        supabase
          .from("latest_stunting")
          .select("rt_number, stunting_count, period, updated_at")
          .order("rt_number"),
      ]);

    if (boundariesError) throw boundariesError;
    if (casesError) throw casesError;

    // Fallback ke data lokal jika Supabase belum berisi data batas RT
    if (!boundaries || boundaries.length === 0) {
      console.warn("[DataService] rt_boundaries kosong di Supabase, pakai data lokal.");
      return rtGeoJson;
    }

    return toGeoJson(boundaries, cases);
  } catch (err) {
    console.error("[DataService] Error fetching data:", err.message);
    return rtGeoJson;
  }
}

/**
 * Submit new stunting data for a specific RT.
 * Returns { success, error }.
 */
export async function submitStuntingData({ rtNumber, stuntingCount, period, notes }) {
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
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Get list of all RT numbers from Supabase boundaries (for the dropdown).
 */
export async function getRTNumbers() {
  if (!isSupabaseConfigured()) {
    return rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  const { data, error } = await supabase
    .from("rt_boundaries")
    .select("rt_number")
    .order("rt_number");

  if (error) {
    console.error("[DataService] Error fetching RT numbers:", error.message);
    return rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  if (!data || data.length === 0) {
    return rtGeoJson.features.map((f) => f.properties.rt_number).sort();
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
