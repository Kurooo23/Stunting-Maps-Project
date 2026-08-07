// ============================================================
// Choropleth color helper
// ============================================================
// Returns color based on case count, matching the legend:
//   Green  → 0 cases
//   Yellow → 1-2 cases
//   Red    → 3+ cases
// ============================================================

export function getColor(caseCount) {
  if (caseCount === 0) return "#18aa3b";
  if (caseCount <= 2) return "#c49c00";
  return "#ef3030";
}

export function getColorLabel(caseCount) {
  if (caseCount === 0) return "0 kasus";
  if (caseCount <= 2) return "1 - 2 kasus";
  return "3+ kasus";
}

export function getStyle(feature) {
  const caseCount = Number(feature?.properties?.case_count ?? feature?.properties?.stunting_count ?? 0);

  return {
    fillColor: getColor(caseCount),
    weight: 1.4,
    opacity: 1,
    color: "white",
    dashArray: null,
    lineJoin: "round",
    fillOpacity: 0.72,
  };
}
