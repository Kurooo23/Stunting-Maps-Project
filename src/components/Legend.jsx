import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { getColor } from "../lib/colors";

export default function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend-control");

      const grades = [
        { label: "0", color: getColor(0) },
        { label: "1 – 2", color: getColor(1) },
        { label: "3 >", color: getColor(3) },
      ];

      // Dibangun lewat DOM API (bukan div.innerHTML = "...") supaya gak
      // kena error "This document requires 'TrustedHTML' assignment" di
      // browser/WebView yang menegakkan Trusted Types (ini yang bikin peta
      // gagal render total di beberapa HP).
      const title = document.createElement("div");
      title.className = "legend-title";
      title.textContent = "Kasus Stunting";
      div.appendChild(title);

      grades.forEach((g) => {
        const item = document.createElement("div");
        item.className = "legend-item";

        const swatch = document.createElement("span");
        swatch.className = "legend-color";
        swatch.style.background = g.color;

        const label = document.createElement("span");
        label.className = "legend-label";
        label.textContent = g.label;

        item.appendChild(swatch);
        item.appendChild(label);
        div.appendChild(item);
      });

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
