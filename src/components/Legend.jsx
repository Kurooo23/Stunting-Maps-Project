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

      div.innerHTML = `
        <div class="legend-title">Kasus Stunting</div>
        ${grades
          .map(
            (g) => `
          <div class="legend-item">
            <span class="legend-color" style="background:${g.color}"></span>
            <span class="legend-label">${g.label}</span>
          </div>
        `
          )
          .join("")}
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
