import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { AuthContext } from "./AuthContext";

// ============================================================
// AuthProvider
// ============================================================
// Menyediakan status login (user, loading) beserta fungsi
// signIn / signOut ke seluruh aplikasi lewat Supabase Auth.
// ============================================================

// Supabase sengaja mengembalikan pesan "Invalid login credentials" yang
// SAMA baik untuk email yang belum terdaftar maupun password yang salah,
// supaya orang luar tidak bisa menebak-nebak email mana saja yang punya
// akun (mencegah user enumeration). Untuk membedakannya, kita panggil
// fungsi Postgres `check_email_exists` (lihat check_email_exists.sql)
// lewat RPC -- fungsi itu berjalan sebagai SECURITY DEFINER supaya bisa
// membaca auth.users tanpa membuka tabel itu langsung ke klien.
//
// Ini SEDIKIT membuka celah enumerasi (orang bisa tahu suatu email
// terdaftar atau tidak, walau tanpa tahu passwordnya). Untuk aplikasi
// ini -- akun kader dibuatkan admin Puskesmas, bukan pendaftaran publik
// -- risikonya kecil dan diterima demi pesan error yang lebih jelas.
async function checkEmailExists(email) {
  const { data, error } = await supabase.rpc("check_email_exists", {
    p_email: email,
  });

  if (error) {
    console.error("[Auth] Gagal memeriksa keberadaan email:", error.message);
    // Kalau RPC belum terpasang atau gagal, jangan tebak -- tampilkan
    // pesan gabungan yang aman lewat errorCode "invalid_credentials".
    return null;
  }

  return Boolean(data);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      setUser(data.user);
      return { success: true, errorCode: null };
    }

    const message = (error.message || "").toLowerCase();

    if (message.includes("invalid login credentials")) {
      const emailExists = await checkEmailExists(email);

      if (emailExists === null) {
        // RPC gagal/belum ada -- fallback aman, bukan menebak.
        return { success: false, errorCode: "invalid_credentials", error: error.message };
      }

      return {
        success: false,
        errorCode: emailExists ? "wrong_password" : "email_not_found",
        error: error.message,
      };
    }

    if (message.includes("email not confirmed")) {
      return { success: false, errorCode: "email_not_confirmed", error: error.message };
    }

    if (message.includes("rate limit") || message.includes("too many")) {
      return { success: false, errorCode: "too_many_requests", error: error.message };
    }

    if (message.includes("fetch") || message.includes("network")) {
      return { success: false, errorCode: "network_error", error: error.message };
    }

    return { success: false, errorCode: "unknown", error: error.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}