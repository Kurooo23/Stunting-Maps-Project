import { useState, useEffect, useMemo } from "react";
import MapComponent from "./MapComponent";
import { fetchRTData, getCurrentPeriod } from "../lib/dataService";
import { useAuth } from "../lib/useAuth";

// Label bulan dalam Bahasa Indonesia untuk ditampilkan di sidebar
const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatPeriodLabel(period) {
  if (!period) return "";
  const [year, month] = period.split("-");
  const namaBulan = NAMA_BULAN[Number(month) - 1] || month;
  return `${namaBulan} ${year}`;
}

export default function MapPage() {
  const { user } = useAuth();
  const kelurahan = user?.user_metadata?.kelurahan;
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(getCurrentPeriod());

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setLoading(true);
      const data = await fetchRTData(kelurahan, period);
      if (cancelled) return;
      setGeoJsonData(data);
      setLoading(false);
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [kelurahan, period]);

  const stats = useMemo(() => {
    if (!geoJsonData?.features) return null;
    const features = geoJsonData.features;
    const totalRT = features.length;
    const totalStunting = features.reduce(
      (sum, f) => sum + f.properties.stunting_count,
      0
    );
    const rtHijau = features.filter((f) => f.properties.stunting_count === 0).length;
    const rtKuning = features.filter(
      (f) => f.properties.stunting_count >= 1 && f.properties.stunting_count <= 2
    ).length;
    const rtMerah = features.filter((f) => f.properties.stunting_count >= 3).length;
    return { totalRT, totalStunting, rtHijau, rtKuning, rtMerah };
  }, [geoJsonData]);

  if (!geoJsonData || !stats) {
    return (
      <div className="map-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Memuat data peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-section">
          <h2>Ringkasan</h2>
          <div className="period-picker">
            <label htmlFor="periode-peta">Periode data</label>
            <input
              type="month"
              id="periode-peta"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <span className="period-picker-label">
              {loading ? "Memuat..." : formatPeriodLabel(period)}
            </span>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.totalRT}</span>
              <span className="stat-label">Total RT</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalStunting}</span>
              <span className="stat-label">Total Kasus</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h2>Status Wilayah</h2>
          <div className="status-list">
            <div className="status-item">
              <span className="status-dot status-green"></span>
              <span className="status-text">0 Kasus (Hijau)</span>
              <span className="status-count">{stats.rtHijau} RT</span>
            </div>
            <div className="status-item">
              <span className="status-dot status-yellow"></span>
              <span className="status-text">1 - 2 Kasus (Kuning)</span>
              <span className="status-count">{stats.rtKuning} RT</span>
            </div>
            <div className="status-item">
              <span className="status-dot status-red"></span>
              <span className="status-text">3+ Kasus (Merah)</span>
              <span className="status-count">{stats.rtMerah} RT</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h2>Daftar RT</h2>
          {geoJsonData.features.length === 0 && (
            <p style={{ fontSize: "0.85rem", color: "#888" }}>
              Belum ada data batas RT untuk wilayah akun ini. Hubungi admin untuk menambahkan data
              lewat halaman Digitizer.
            </p>
          )}
          <div className="rt-list">
            {geoJsonData.features
              .sort(
                (a, b) =>
                  Number(a.properties.rt_number) -
                  Number(b.properties.rt_number)
              )
              .map((f) => {
                const count = f.properties.stunting_count;
                const colorClass =
                  count === 0
                    ? "rt-green"
                    : count <= 2
                    ? "rt-yellow"
                    : "rt-red";
                return (
                  <div key={f.properties.rt_number} className={`rt-item ${colorClass}`}>
                    <span className="rt-num">RT {f.properties.rt_number}</span>
                    <span className="rt-count">{count} kasus</span>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>

      {/* Map */}
      <main className="map-wrapper">
        <MapComponent geoJsonData={geoJsonData} />
      </main>
    </div>
  );
}
