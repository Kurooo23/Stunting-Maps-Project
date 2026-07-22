import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import "./Login.css";

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5.5h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M2.5 6.2 10 11l7.5-4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      {off && <path d="M2.5 17.5 17.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}

// Kurva "pertumbuhan" -- pita hijau/kuning/merah proporsional dengan
// sebaran status RT sungguhan (kurang lebih 29 hijau : 11 kuning : 1 merah
// dari 41 RT), disatukan garis naik ala grafik KMS/pemantauan balita.
function GrowthSignature() {
  return (
    <svg className="growth-signature" viewBox="0 0 380 230" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bandGradient" x1="0" y1="230" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e4574b" stopOpacity="0.55" />
          <stop offset="0.16" stopColor="#f2a93c" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#2f9e6d" stopOpacity="0.42" />
          <stop offset="1" stopColor="#2f9e6d" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="curveStroke" x1="0" y1="230" x2="380" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="380" height="230" rx="18" fill="url(#bandGradient)" />

      <path
        className="growth-curve-line"
        d="M8 198 C 60 200, 90 176, 118 158 C 158 132, 150 108, 196 90 C 240 73, 250 96, 292 62 C 320 40, 330 46, 372 20"
        stroke="url(#curveStroke)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {[
        [8, 198],
        [118, 158],
        [196, 90],
        [292, 62],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="4" fill="#ffffff" fillOpacity="0.85" />
      ))}

      <circle className="growth-curve-dot" cx="372" cy="20" r="7" fill="#ffffff" />
      <circle className="growth-curve-pulse" cx="372" cy="20" r="7" fill="#ffffff" />
    </svg>
  );
}

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sudah login? langsung lempar ke halaman peta (atau halaman asal jika ada)
  if (!loading && user) {
    const redirectTo = location.state?.from?.pathname || "/peta";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Email atau kata sandi belum cocok. Coba periksa lagi.");
      return;
    }

    const redirectTo = location.state?.from?.pathname || "/peta";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        {/* Panel identitas */}
        <div className="login-visual">
          <GrowthSignature />

          <div className="login-visual-content">
            <span className="login-eyebrow">Untuk Kader Posyandu &amp; Puskesmas</span>
            <h1 className="login-headline">
              Halo, <em>Kader.</em>
            </h1>
            <p className="login-tagline">
              Terima kasih sudah menjaga tumbuh kembang anak-anak di wilayahmu.
              Masuk untuk mulai mencatat dan memantau data hari ini.
            </p>

            <div className="login-chips">
              <span className="login-chip">41 RT dipantau</span>
              <span className="login-chip">Kel. Gunung Sari Ulu</span>
              <span className="login-chip">Kec. Balikpapan Tengah</span>
            </div>
          </div>
        </div>

        {/* Panel form */}
        <div className="login-panel">
          <div className="login-panel-inner">
            <div className="login-panel-header">
              <h2>Masuk ke Akun</h2>
              <p>Gunakan akun yang diberikan oleh admin Puskesmas.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="login-label" htmlFor="login-email">
                Email
                <div className="login-input-wrap">
                  <span className="login-input-icon"><MailIcon /></span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@puskesmas.go.id"
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="login-label" htmlFor="login-password">
                Kata Sandi
                <div className="login-input-wrap">
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="login-input login-input-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
              </label>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="login-spinner" aria-hidden="true" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>

              <p className="login-footnote">
                Lupa kata sandi? Hubungi admin Puskesmas setempat.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}