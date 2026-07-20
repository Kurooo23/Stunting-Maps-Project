// ============================================================
// Choropleth color helper
// ============================================================
// Returns color based on stunting count, matching the legend:
//   Green  → 0 cases
//   Yellow → 1-2 cases
//   Red    → 3+ cases
// ============================================================

export function getColor(stuntingCount) {
  if (stuntingCount === 0) return "#4CAF50"; // green
  if (stuntingCount <= 2) return "#FFC107"; // yellow/amber
  return "#F44336"; // red
}

export function getColorLabel(stuntingCount) {
  if (stuntingCount === 0) return "0 kasus";
  if (stuntingCount <= 2) return "1 - 2 kasus";
  return "3+ kasus";
}

export function getStyle(feature) {
  return {
    fillColor: getColor(feature.properties.stunting_count),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "",
    fillOpacity: 0.6,
  };
}
