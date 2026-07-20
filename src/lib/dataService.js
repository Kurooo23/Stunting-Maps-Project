import { supabase } from "./supabase";
import rtGeoJsonLocal from "../data/rtGeoJson";

// ============================================================
// Data Service Layer
// ============================================================
// Handles fetching and inserting data.
// Falls back to local GeoJSON when Supabase isn't configured.
// ============================================================

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== "YOUR_SUPABASE_URL" && url !== "https://your-project.supabase.co";
};

/**
 * Fetch RT data with latest stunting counts.
 * Returns GeoJSON FeatureCollection format.
 * Falls back to local data if Supabase is not configured.
 */
export async function fetchRTData() {
  if (!isSupabaseConfigured()) {
    console.log("[DataService] Supabase not configured, using local GeoJSON data.");
    return rtGeoJsonLocal;
  }

  try {
    const { data, error } = await supabase
      .from("latest_stunting")
      .select("*")
      .order("rt_number");

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log("[DataService] No data from Supabase, using local fallback.");
      return rtGeoJsonLocal;
    }

    // Convert Supabase rows to GeoJSON FeatureCollection
    const features = data.map((row) => ({
      type: "Feature",
      properties: {
        rt_number: row.rt_number,
        stunting_count: row.stunting_count,
        kelurahan: row.kelurahan || "Damai",
        period: row.period,
        updated_at: row.updated_at,
      },
      geometry: typeof row.geometry === "string"
        ? JSON.parse(row.geometry)
        : row.geometry,
    }));

    return { type: "FeatureCollection", features };
  } catch (err) {
    console.error("[DataService] Error fetching data:", err.message);
    return rtGeoJsonLocal;
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
 * Get list of all RT numbers (for the dropdown).
 */
export function getRTNumbers() {
  return rtGeoJsonLocal.features.map((f) => f.properties.rt_number).sort(
    (a, b) => Number(a) - Number(b)
  );
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
