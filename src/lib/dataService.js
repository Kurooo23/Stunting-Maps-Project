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

const TABLE_CANDIDATES = {
  boundaries: ["mapping_rt_boundaries", "rt_boundaries"],
  cases: ["mapping_case_data", "stunting_data"],
  diseaseDefinitions: ["mapping_disease_definitions"],
};

const tableExistenceCache = new Map();

const SUPABASE_QUERY_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const isMissingTableError = (error) => {
  if (!error) return false;
  const message = String(error.message || error.details || "").toLowerCase();
  const code = String(error.code || "");
  return (
    message.includes("does not exist") ||
    message.includes("relation") ||
    message.includes("could not find") ||
    code === "42P01"
  );
};

async function tableExists(table) {
  const cacheKey = `${table}`;
  const cached = tableExistenceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SUPABASE_QUERY_CACHE_TTL) {
    return cached.exists;
  }

  const { error } = await supabase.from(table).select("id").limit(1);
  const exists = !error || !isMissingTableError(error);

  tableExistenceCache.set(cacheKey, { exists, timestamp: Date.now() });

  if (!exists && !isMissingTableError(error)) {
    console.warn(`[DataService] Table existence check for "${table}" failed:`, error.message || error.details);
  }

  return exists;
}

async function resolveTable(candidates = []) {
  for (const table of candidates) {
    if (await tableExists(table)) {
      return table;
    }
  }
  return null;
}

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

  const tableName = await resolveTable(TABLE_CANDIDATES.diseaseDefinitions);
  if (!tableName) {
    return DEFAULT_DISEASES;
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
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
    const boundariesTable = await resolveTable(TABLE_CANDIDATES.boundaries);
    if (!boundariesTable) {
      console.warn("[DataService] Tidak ditemukan tabel batas RT di Supabase.");
      return rtGeoJson;
    }

    const caseTable = await resolveTable(TABLE_CANDIDATES.cases);

    let boundariesQuery = supabase
      .from(boundariesTable)
      .select("rt_number, kelurahan, geometry")
      .order("rt_number");

    if (kelurahan) {
      boundariesQuery = boundariesQuery.eq("kelurahan", kelurahan);
    }

    let cases = [];
    let casesError = null;

    if (caseTable === "mapping_case_data") {
      let casesQuery = supabase
        .from(caseTable)
        .select("rt_number, disease_slug, case_count, period, updated_at, kelurahan")
        .eq("period", activePeriod)
        .eq("disease_slug", activeDisease)
        .order("rt_number");

      if (kelurahan) {
        casesQuery = casesQuery.eq("kelurahan", kelurahan);
      }

      const result = await casesQuery;
      cases = result.data || [];
      casesError = result.error;
    } else if (caseTable === "stunting_data") {
      if (activeDisease === "stunting") {
        let casesQuery = supabase
          .from(caseTable)
          .select("rt_number, stunting_count, period, updated_at, kelurahan")
          .eq("period", activePeriod)
          .order("rt_number");

        if (kelurahan) {
          casesQuery = casesQuery.eq("kelurahan", kelurahan);
        }

        const result = await casesQuery;
        cases = result.data || [];
        casesError = result.error;
      } else {
        cases = [];
      }
    }

    const { data: boundaries, error: boundariesError } = await boundariesQuery;

    if (boundariesError) throw boundariesError;
    if (casesError) throw casesError;

    if (!boundaries || boundaries.length === 0) {
      if (kelurahan) {
        console.warn(`[DataService] ${boundariesTable} kosong untuk kelurahan "${kelurahan}".`);
        return { type: "FeatureCollection", features: [] };
      }
      console.warn(`[DataService] ${boundariesTable} kosong di Supabase, pakai data lokal.`);
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
    const mappingCaseTableExists = await tableExists("mapping_case_data");
    const legacyStuntingTableExists = await tableExists("stunting_data");

    if (mappingCaseTableExists) {
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
    }

    if (legacyStuntingTableExists) {
      if (diseaseSlug !== "stunting") {
        return {
          success: false,
          error: "Supabase saat ini hanya mendukung schema stunting lama. Jalankan SQL multi-case atau gunakan penyakit 'stunting'.",
        };
      }

      const normalizedKelurahan = kelurahan || "Gunung Sari Ulu";
      const { data: existingRows, error: fetchError } = await supabase
        .from("stunting_data")
        .select("id")
        .eq("rt_number", rtNumber)
        .eq("period", period)
        .eq("kelurahan", normalizedKelurahan)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingRows && existingRows.length > 0) {
        const { error } = await supabase
          .from("stunting_data")
          .update({
            stunting_count: Number(caseCount),
            notes: notes || null,
          })
          .eq("id", existingRows[0].id);

        if (error) throw error;
        return { success: true, error: null };
      }

      const { error } = await supabase.from("stunting_data").insert({
        rt_number: rtNumber,
        stunting_count: Number(caseCount),
        period,
        notes: notes || null,
        kelurahan: normalizedKelurahan,
      });

      if (error) throw error;
      return { success: true, error: null };
    }

    return {
      success: false,
      error: "Backend Supabase tidak memiliki tabel data kasus yang diperlukan. Periksa skema Supabase dan jalankan setup SQL yang sesuai.",
    };
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

  const boundariesTable = await resolveTable(TABLE_CANDIDATES.boundaries);
  if (!boundariesTable) {
    return kelurahan ? [] : rtGeoJson.features.map((f) => f.properties.rt_number).sort();
  }

  let query = supabase.from(boundariesTable).select("rt_number").order("rt_number");
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