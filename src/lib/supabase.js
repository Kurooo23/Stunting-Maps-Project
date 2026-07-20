import { createClient } from "@supabase/supabase-js";

// ============================================================
// Supabase Client Configuration
// ============================================================
// Ganti URL dan anon key di bawah dengan milikmu dari:
// https://supabase.com/dashboard → Settings → API
//
// Buat file .env di root project dan isi:
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
