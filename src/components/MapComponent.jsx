import { useEffect } from "react";
import { MapContainer, ImageOverlay, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getStyle } from "../lib/colors";
import Legend from "./Legend";
import mapReference from "../assets/Peta Batas RT_page-0001.jpg";

const imageBounds = [
  [-1.267, 116.835],
  [-1.249, 116.858],
];

// Component to fit map bounds to GeoJSON data
function FitBounds({ geoJsonData }) {
  const map = useMap();

  useEffect(() => {
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(imageBounds, { padding: [0, 0] });
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [geoJsonData, map]);

  return null;
}

export default function MapComponent({ geoJsonData, onFeatureClick }) {
  // Default center (Gunung Sari Ulu, Balikpapan Tengah) — will be overridden by FitBounds
  const defaultCenter = [-1.2569, 116.8468];
  const defaultZoom = 16;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      dragging={false}
      zoomSnap={0}
      zoomDelta={0.25}
    >
      {/* Reference map image for Gunung Sari Ulu */}
      <ImageOverlay
        url={mapReference}
        bounds={imageBounds}
        opacity={1}
        zIndex={0}
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
                weight: 2.5,
                color: "#ffffff",
                dashArray: "",
                fillOpacity: 0.86,
              });
              target.bringToFront();
            },
            mouseout: () => {
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

          layer.bindTooltip(`${feature.properties.rt_number}`, {
            permanent: true,
            direction: "center",
            className: "rt-label",
            sticky: false,
          });
        }}
      />

      {/* Fit map to data bounds */}
      <FitBounds geoJsonData={geoJsonData} />

      {/* Legend */}
      <Legend />
    </MapContainer>
  );
}