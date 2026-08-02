import { supabase } from "./supabase";
import rtGeoJson from "../data/rtGeoJson";

// ============================================================
// Data Service Layer
// ============================================================
// Handles fetching and inserting mapping data from Supabase.
// ============================================================

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== "YOUR_SUPABASE_URL" && url !== "https://your-project.supabase.co";
};

const DEFAULT_DISEASES = [
  { slug: "stunting", name: "Stunting", display_name: "Stunting" },
  { slug: "pneumonia", name: "Pneumonia", display_name: "Pneumonia" },
  { slug: "tbc", name: "TBC", display_name: "TBC" },
  { slug: "hipertensi", name: "Hipertensi", display_name: "Hipertensi" },
  { slug: "dm", name: "DM", display_name: "DM" },
  { slug: "dbd", name: "DBD", display_name: "DBD" },
  { slug: "diare", name: "Diare", display_name: "Diare" },
  { slug: "pasien_immobilisasi", name: "Pasien Immobilisasi", display_name: "Pasien Immobilisasi" },
  { slug: "ibu_hamil", name: "Ibu Hamil", display_name: "Ibu Hamil" },
];

const normalizeRTNumber = (value) => String(value).trim().padStart(2, "0");

const toGeometry = (geometry) => (
  typeof geometry === "string" ? JSON.parse(geometry) : geometry
);

const toGeoJson = (boundaries = [], cases = [], fallbackKelurahan, diseaseSlug = "stunting") => {
  const casesByRT = new Map(
    cases.map((row) => [normalizeRTNumber(row.rt_number), row])
  );

  return {
    type: "FeatureCollection",
    features: boundaries.map((boundary) => {
      const rtNumber = normalizeRTNumber(boundary.rt_number);
      const caseData = casesByRT.get(rtNumber);
      const caseCount = Number(caseData?.case_count ?? 0);

      return {
        type: "Feature",
        properties: {
          rt_number: boundary.rt_number,
          case_count: caseCount,
          stunting_count: caseCount,
          kelurahan: boundary.kelurahan || fallbackKelurahan || "Gunung Sari Ulu",
          period: caseData?.period,
          updated_at: caseData?.updated_at,
          disease_slug: diseaseSlug,
        },
        geometry: toGeometry(boundary.geometry),
      };
    }),
  };
};

export async function fetchDiseaseDefinitions() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_DISEASES;
  }

  try {
    const { data, error } = await supabase
      .from("mapping_disease_definitions")
      .select("slug, name, display_name")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return (data && data.length > 0 ? data : DEFAULT_DISEASES).map((disease) => ({
      slug: disease.slug,
      name: disease.name,
      display_name: disease.display_name || disease.name,
    }));
  } catch (err) {
    console.error("[DataService] Error fetching disease definitions:", err.message);
    return DEFAULT_DISEASES;
  }
}

/**
 * Fetch RT data for the selected disease and period.
 */
export async function fetchRTData(kelurahan, period, diseaseSlug = "stunting") {
  const activePeriod = period || getCurrentPeriod();
  const activeDisease = diseaseSlug || "stunting";

  if (!isSupabaseConfigured()) {
    console.warn("[DataService] Supabase belum dikonfigurasi, pakai data lokal.");
    return rtGeoJson;
  }

  try {
    let boundariesQuery = supabase
      .from("mapping_rt_boundaries")
      .select("rt_number, kelurahan, geometry")
      .order("rt_number");
    let casesQuery = supabase
      .from("mapping_case_data")
      .select("rt_number, disease_slug, case_count, period, updated_at")
      .eq("period", activePeriod)
      .eq("disease_slug", activeDisease)
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
        console.warn(`[DataService] mapping_rt_boundaries kosong untuk kelurahan "${kelurahan}".`);
        return { type: "FeatureCollection", features: [] };
      }
      console.warn("[DataService] mapping_rt_boundaries kosong di Supabase, pakai data lokal.");
      return rtGeoJson;
    }

    return toGeoJson(boundaries, cases, kelurahan, activeDisease);
  } catch (err) {
    console.error("[DataService] Error fetching data:", err.message);
    return kelurahan ? { type: "FeatureCollection", features: [] } : rtGeoJson;
  }
}

export async function submitCaseData({ rtNumber, diseaseSlug, caseCount, period, notes, kelurahan }) {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase belum dikonfigurasi. Tambahkan URL & key di file .env",
    };
  }

  try {
    const { error } = await supabase.from("mapping_case_data").upsert(
      {
        rt_number: rtNumber,
        disease_slug: diseaseSlug || "stunting",
        case_count: Number(caseCount),
        period,
        notes: notes || null,
        kelurahan: kelurahan || "Gunung Sari Ulu",
      },
      { onConflict: "rt_number,disease_slug,period,kelurahan" }
    );

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function submitStuntingData({ rtNumber, stuntingCount, period, notes, kelurahan }) {
  return submitCaseData({
    rtNumber,
    diseaseSlug: "stunting",
    caseCount: stuntingCount,
    period,
    notes,
    kelurahan,
  });
}

/**
 * Get list of RT numbers from Supabase boundaries (for the dropdown),
 * filtered per kelurahan akun yang login kalau tersedia.
 */
export async function getRTNumbers(kelurahan) {
  if (!isSupabaseConfigured()) {
    return rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  let query = supabase.from("mapping_rt_boundaries").select("rt_number").order("rt_number");
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