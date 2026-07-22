import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Fix Leaflet marker icons in Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function SearchControl() {
  const map = useMap();

  useEffect(() => {
    // Create geocoder control using Nominatim (OpenStreetMap) - free, no API key needed
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false, // we handle our own marker
      position: "topleft",
      placeholder: "Cari lokasi...",
      errorMessage: "Lokasi tidak ditemukan.",
      geocoder: L.Control.Geocoder.nominatim({
        // Bias results to Balikpapan area
        geocodingQueryParams: {
          viewbox: "116.75,-1.35,116.95,-1.18",
          bounded: 0, // allow results outside the box too, but prefer inside
        },
      }),
    })
      .on("markgeocode", function (e) {
        const { center, name } = e.geocode;

        // Fly to the searched location
        map.flyTo(center, 17, { duration: 1.5 });

        // Add a temporary marker
        const marker = L.marker(center)
          .addTo(map)
          .bindPopup(`<strong>${name}</strong>`)
          .openPopup();

        // Remove marker after 30 seconds
        setTimeout(() => {
          map.removeLayer(marker);
        }, 30000);
      })
      .addTo(map);

    return () => {
      geocoder.remove();
    };
  }, [map]);

  return null;
}
