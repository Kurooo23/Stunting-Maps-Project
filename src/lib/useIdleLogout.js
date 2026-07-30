import { useEffect, useRef } from "react";

// ============================================================
// useIdleLogout
// ============================================================
// Auto logout kalau tidak ada aktivitas (mouse, keyboard, scroll,
// sentuhan layar) selama `timeoutMs`. Dipakai di AuthProvider supaya
// sesi kader otomatis ditutup kalau perangkat ditinggal begitu saja
// (mis. komputer/tablet posyandu dipakai bergantian oleh banyak kader).
//
// `active` menyalakan/mematikan pemantauan -- di AuthProvider ini
// diisi `Boolean(user)`, jadi timer cuma jalan selagi ada yang login.
// ============================================================

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

export function useIdleLogout(active, onIdle, timeoutMs) {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!active) return;

    let timeoutId;

    const scheduleTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onIdle, timeoutMs);
    };

    const markActivity = () => {
      lastActivityRef.current = Date.now();
      scheduleTimeout();
    };

    // Timer browser bisa "dibekukan" kalau tab disembunyikan lama demi
    // hemat baterai -- begitu tab aktif lagi, cek manual apakah waktu
    // idle sebenarnya sudah kelewat dari seharusnya.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= timeoutMs) {
        onIdle();
      } else {
        scheduleTimeout();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, markActivity));
    document.addEventListener("visibilitychange", handleVisibilityChange);

    lastActivityRef.current = Date.now();
    scheduleTimeout();

    return () => {
      clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, markActivity));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active, onIdle, timeoutMs]);
}
