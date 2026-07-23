import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, ImageOverlay, Polygon, CircleMarker, Polyline, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapReference from "../assets/Peta Batas RT_page-0001.jpg";

const imageBounds = [
  [-1.267, 116.835],
  [-1.249, 116.858],
];

function FitMapBounds() {
  const map = useMap();

  useEffect(() => {
    const fitMap = () => {
      map.invalidateSize();
      map.fitBounds(imageBounds, { padding: [0, 0], animate: false });
    };

    const frame = requestAnimationFrame(fitMap);
    window.addEventListener("resize", fitMap);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", fitMap);
    };
  }, [map]);

  return null;
}

function MapClickHandler({ onAddVertex }) {
  useMapEvents({
    click: (e) => onAddVertex([e.latlng.lng, e.latlng.lat]),
    mousemove: (e) => {
      const el = document.getElementById("coord-display");
      if (el) el.textContent = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
    },
  });
  return null;
}

export default function DigitizerPage() {
  const [rtNumber, setRtNumber] = useState(1);
  const [vertices, setVertices] = useState([]);
  const [completedRTs, setCompletedRTs] = useState({});
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [exportText, setExportText] = useState("");
  const textareaRef = useRef(null);

  const rtStr = String(rtNumber).padStart(2, "0");

  const addVertex = useCallback((coord) => {
    setVertices((prev) => [...prev, coord]);
  }, []);

  const undoVertex = useCallback(() => {
    setVertices((prev) => prev.slice(0, -1));
  }, []);

  const completePolygon = useCallback(() => {
    if (vertices.length < 3) return;
    const coords = [...vertices, vertices[0]];
    setCompletedRTs((prev) => ({
      ...prev,
      [rtStr]: {
        type: "Feature",
        properties: { rt_number: rtStr, stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
        geometry: { type: "Polygon", coordinates: [coords] },
      },
    }));
    setVertices([]);
    setRtNumber((prev) => (prev >= 41 ? 1 : prev + 1));
  }, [vertices, rtStr]);

  const clearVertices = useCallback(() => setVertices([]), []);

  const editRT = useCallback((num) => {
    const key = String(num).padStart(2, "0");
    const existing = completedRTs[key];
    if (!existing) return;
    setRtNumber(parseInt(num));
    setVertices(existing.geometry.coordinates[0].slice(0, -1));
    setCompletedRTs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [completedRTs]);

  const deleteRT = useCallback((num) => {
    const key = String(num).padStart(2, "0");
    setCompletedRTs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const exportGeoJson = useCallback(() => {
    const rts = Object.keys(completedRTs).sort((a, b) => parseInt(a) - parseInt(b));
    const geojson = {
      type: "FeatureCollection",
      features: rts.map((rt) => completedRTs[rt]),
    };
    const text = `const rtGeoJson = ${JSON.stringify(geojson, null, 2)};\n\nexport default rtGeoJson;\n`;
    setExportText(text);
  }, [completedRTs]);

  const copyToClipboard = useCallback(() => {
    if (!exportText) exportGeoJson();
    navigator.clipboard.writeText(exportText || "").then(() => alert("Copied!"));
  }, [exportText, exportGeoJson]);

  const completedCount = Object.keys(completedRTs).length;
  const completedList = Object.keys(completedRTs).sort((a, b) => parseInt(a) - parseInt(b));

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && !e.target.closest("textarea, input")) {
        e.preventDefault();
        completePolygon();
      }
      if (e.key === "z" && e.ctrlKey) {
        e.preventDefault();
        undoVertex();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [completePolygon, undoVertex]);

  return (
    <div style={{ display: "flex", flex: 1, width: "100%", overflow: "hidden" }}>
      {/* Panel */}
      <div
        style={{
          width: 340, background: "#1a1a2e", color: "#eee", padding: 16,
          overflowY: "auto", display: "flex", flexDirection: "column", gap: 12,
          flexShrink: 0,
        }}
      >
        <h2 style={{ fontSize: "1rem", color: "#7fdbca", margin: 0 }}>
          RT Digitizer — Gunung Sari Ulu
        </h2>
        <p style={{ fontSize: "0.8rem", color: "#888", lineHeight: 1.4, margin: 0 }}>
          Klik di peta untuk menambah vertex. Trace batas RT sesuai garis putih di peta referensi.
          Enter = selesai, Ctrl+Z = undo.
        </p>

        {/* RT Number */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", minWidth: 50 }}>RT #:</span>
          <input
            type="number" min={1} max={41} value={rtNumber}
            onChange={(e) => setRtNumber(Math.max(1, Math.min(41, parseInt(e.target.value) || 1)))}
            style={{
              width: 70, background: "#16213e", color: "#eee",
              border: "1px solid #333", padding: "6px 10px", borderRadius: 4,
            }}
          />
          <button
            onClick={() => setRtNumber((p) => (p <= 1 ? 41 : p - 1))}
            style={btnStyle}
          >◄</button>
          <button
            onClick={() => setRtNumber((p) => (p >= 41 ? 1 : p + 1))}
            style={btnStyle}
          >►</button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={completePolygon} disabled={vertices.length < 3}
            style={{ ...btnStyle, background: vertices.length >= 3 ? "#18aa3b" : "#444" }}>
            Selesai ({vertices.length} vtx)
          </button>
          <button onClick={undoVertex} style={btnStyle}>Undo</button>
          <button onClick={clearVertices} style={btnStyle}>Clear</button>
        </div>

        {/* Opacity */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", minWidth: 60 }}>Opacity:</span>
          <input
            type="range" min={0} max={100} value={overlayOpacity * 100}
            onChange={(e) => setOverlayOpacity(e.target.value / 100)}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: "0.8rem" }}>{Math.round(overlayOpacity * 100)}%</span>
        </div>

        {/* Cursor coords */}
        <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
          <div style={{
            fontFamily: "monospace", fontSize: "0.8rem", color: "#7fdbca",
            background: "#16213e", padding: 6, borderRadius: 4,
          }}>
            <span id="coord-display">Hover di peta...</span>
          </div>
        </div>

        {/* Completed list */}
        <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
          <h3 style={{ fontSize: "0.9rem", color: "#7fdbca", margin: "0 0 6px 0" }}>
            Selesai: {completedCount}/41
          </h3>
          <div style={{
            maxHeight: 220, overflowY: "auto", fontSize: "0.8rem",
            background: "#16213e", borderRadius: 4, padding: 8,
          }}>
            {completedList.length === 0 ? (
              <span style={{ color: "#666" }}>Belum ada RT.</span>
            ) : (
              completedList.map((rt) => (
                <div key={rt} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "3px 0", borderBottom: "1px solid #222", alignItems: "center",
                }}>
                  <span>RT {rt} ({completedRTs[rt].geometry.coordinates[0].length - 1} vtx)</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => editRT(rt)}
                      style={{ ...btnSmall, background: "#0f3460" }}>Edit</button>
                    <button onClick={() => deleteRT(rt)}
                      style={{ ...btnSmall, background: "#8b0000" }}>×</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Export */}
        <div style={{ borderTop: "1px solid #333", paddingTop: 10 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={exportGeoJson} style={{ ...btnStyle, background: "#e94560" }}>
              Export
            </button>
            <button onClick={copyToClipboard} style={btnStyle}>Copy</button>
          </div>
          <textarea
            ref={textareaRef} value={exportText} readOnly
            placeholder="Klik Export..."
            style={{
              width: "100%", height: 140, background: "#16213e", color: "#7fdbca",
              border: "1px solid #333", borderRadius: 4, padding: 8,
              fontFamily: "monospace", fontSize: "0.7rem", resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[-1.2569, 116.8468]}
        zoom={17}
        style={{ flex: 1, minWidth: 0, minHeight: 0, zIndex: 1 }}
        zoomControl={true}
      >
        <ImageOverlay url={mapReference} bounds={imageBounds} opacity={overlayOpacity} zIndex={0} />
        <MapClickHandler onAddVertex={addVertex} />

        {/* Completed polygons */}
        {completedList.map((rt) => {
          const coords = completedRTs[rt].geometry.coordinates[0].slice(0, -1);
          const latlngs = coords.map((c) => [c[1], c[0]]);
          return (
            <Polygon
              key={rt}
              positions={latlngs}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#18aa3b", fillOpacity: 0.35 }}
            >
              <Tooltip permanent direction="center" className="rt-label">
                {rt}
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Current vertices */}
        {vertices.map((v, i) => (
          <CircleMarker
            key={i}
            center={[v[1], v[0]]}
            radius={5}
            pathOptions={{ color: "#fff", fillColor: "#e94560", weight: 1, fillOpacity: 1 }}
          />
        ))}

        {/* Current polyline */}
        {vertices.length > 1 && (
          <Polyline
            positions={vertices.map((v) => [v[1], v[0]])}
            pathOptions={{ color: "#e94560", weight: 2, dashArray: "6,4" }}
          />
        )}

        <FitMapBounds />
      </MapContainer>
    </div>
  );
}

const btnStyle = {
  background: "#0f3460", color: "#eee", border: "none",
  padding: "8px 14px", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem",
};

const btnSmall = {
  color: "#eee", border: "none", padding: "2px 8px",
  borderRadius: 3, cursor: "pointer", fontSize: "0.75rem",
};
