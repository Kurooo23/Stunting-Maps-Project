import { useState, useEffect, useMemo } from "react";
import MapComponent from "./MapComponent";
import { fetchRTData } from "../lib/dataService";

export default function MapPage() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchRTData();
      setGeoJsonData(data);
      setLoading(false);
    }
    loadData();
  }, []);

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

  if (loading || !stats) {
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
