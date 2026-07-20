import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getStyle } from "../lib/colors";
import Legend from "./Legend";
import RTPopup from "./RTPopup";

// Component to fit map bounds to GeoJSON data
function FitBounds({ geoJsonData }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!fitted.current && geoJsonData?.features?.length > 0) {
      // Calculate bounds from all polygons
      const coords = geoJsonData.features.flatMap((f) =>
        f.geometry.coordinates[0].map((c) => [c[1], c[0]])
      );
      if (coords.length > 0) {
        const lats = coords.map((c) => c[0]);
        const lngs = coords.map((c) => c[1]);
        const bounds = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ];
        map.fitBounds(bounds, { padding: [50, 50] });
        fitted.current = true;
      }
    }
  }, [geoJsonData, map]);

  return null;
}

export default function MapComponent({ geoJsonData, onFeatureClick }) {
  // Default center (Balikpan area) — will be overridden by FitBounds
  const defaultCenter = [-1.2590, 116.8310];
  const defaultZoom = 16;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
      zoomControl={true}
    >
      {/* Satellite imagery base layer (Esri World Imagery — free) */}
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* Optional: road labels overlay */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        opacity={0.5}
      />

      {/* GeoJSON choropleth layer */}
      <GeoJSON
        data={geoJsonData}
        style={getStyle}
        onEachFeature={(feature, layer) => {
          // Hover effects
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                weight: 3,
                color: "#333",
                dashArray: "",
                fillOpacity: 0.8,
              });
              target.bringToFront();
            },
            mouseout: (e) => {
              layer.setStyle(getStyle(feature));
            },
            click: () => {
              if (onFeatureClick) onFeatureClick(feature);
            },
          });

          // Bind popup
          layer.bindPopup(
            `<div class="rt-popup">
              <h3>RT ${feature.properties.rt_number}</h3>
              <p><strong>Kelurahan:</strong> ${feature.properties.kelurahan}</p>
              <p><strong>Kasus Stunting:</strong> ${feature.properties.stunting_count}</p>
            </div>`,
            { className: "custom-popup" }
          );
        }}
      />

      {/* Fit map to data bounds */}
      <FitBounds geoJsonData={geoJsonData} />

      {/* Legend */}
      <Legend />
    </MapContainer>
  );
}
