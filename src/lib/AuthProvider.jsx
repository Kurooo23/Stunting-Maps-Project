import { useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";

let supabasePromise;
function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import("./supabase").then((m) => m.supabase);
  }
  return supabasePromise;
}

async function checkEmailExists(supabase, email) {
  const { data, error } = await supabase.rpc("check_email_exists", {
    p_email: email,
  });

  if (error) {
    console.error("[Auth] Gagal memeriksa keberadaan email:", error.message);
    return null;
  }

  return Boolean(data);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    getSupabase().then((supabase) => {
      if (!mounted) return;

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
      unsubscribeRef.current = () => listener.subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubscribeRef.current?.();
    };
  }, []);

  const signIn = async (email, password) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const signedUser = data?.user ?? data?.session?.user;
    if (!error && signedUser) {
      setUser(signedUser);
      return { success: true, errorCode: null };
    }

    if (!error) {
      console.error("[Auth] signIn succeeded but no user was returned", data);
      return {
        success: false,
        errorCode: "unknown",
        error: "Login gagal: respons Supabase tidak berisi data pengguna.",
      };
    }

    const message = (error.message || "").toLowerCase();

    if (message.includes("invalid login credentials")) {
      const emailExists = await checkEmailExists(supabase, email);

      if (emailExists === null) {
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
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}