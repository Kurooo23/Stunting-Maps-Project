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
const STORAGE_KEY = "posyandu:last-activity";

function readStoredActivity() {
  if (typeof window === "undefined" || !window.localStorage) {
    return Date.now();
  }

  const stored = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(stored) ? stored : Date.now();
}

function persistActivity(timestamp) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, String(timestamp));
}

function clearStoredActivity() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function useIdleLogout(active, onIdle, timeoutMs) {
  const lastActivityRef = useRef(readStoredActivity());
  const idleTriggeredRef = useRef(false);

  useEffect(() => {
    if (!active) {
      idleTriggeredRef.current = false;
      clearStoredActivity();
      return;
    }

    let timeoutId;

    const clearTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const handleIdle = async () => {
      if (idleTriggeredRef.current) return;

      idleTriggeredRef.current = true;
      clearTimer();
      clearStoredActivity();
      await onIdle();
    };

    const scheduleTimeout = () => {
      clearTimer();
      timeoutId = setTimeout(() => {
        void handleIdle();
      }, timeoutMs);
    };

    const resetActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      persistActivity(now);
    };

    const markActivity = () => {
      resetActivity();
      scheduleTimeout();
    };

    const checkIdle = () => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= timeoutMs) {
        void handleIdle();
      } else {
        scheduleTimeout();
      }
    };

    // Timer browser bisa "dibekukan" kalau tab disembunyikan lama demi
    // hemat baterai -- begitu tab aktif lagi, cek manual apakah waktu
    // idle sebenarnya sudah kelewat dari seharusnya.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkIdle();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, markActivity, { passive: true }));
    window.addEventListener("focus", checkIdle);
    window.addEventListener("pageshow", checkIdle);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    lastActivityRef.current = readStoredActivity();
    if (Date.now() - lastActivityRef.current >= timeoutMs) {
      void handleIdle();
    } else {
      scheduleTimeout();
    }

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, markActivity));
      window.removeEventListener("focus", checkIdle);
      window.removeEventListener("pageshow", checkIdle);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active, onIdle, timeoutMs]);
}
