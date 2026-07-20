// ============================================================
// Sample GeoJSON data for RT boundaries with stunting data
// ============================================================
// IMPORTANT: These are APPROXIMATE polygons for demonstration.
// You MUST replace this with real digitized boundaries from
// your "Peta Batas RT" PDF using QGIS or geojson.io
//
// Each feature has properties:
//   - rt_number: RT number (01-41)
//   - stunting_count: number of stunting cases
//   - kelurahan: kelurahan name
// ============================================================

const rtGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { rt_number: "01", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2550],
          [116.8290, -1.2550],
          [116.8290, -1.2565],
          [116.8270, -1.2565],
          [116.8270, -1.2550]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "02", stunting_count: 2, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8290, -1.2550],
          [116.8310, -1.2550],
          [116.8310, -1.2565],
          [116.8290, -1.2565],
          [116.8290, -1.2550]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "03", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8310, -1.2550],
          [116.8330, -1.2550],
          [116.8330, -1.2565],
          [116.8310, -1.2565],
          [116.8310, -1.2550]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "04", stunting_count: 4, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8330, -1.2550],
          [116.8350, -1.2550],
          [116.8350, -1.2565],
          [116.8330, -1.2565],
          [116.8330, -1.2550]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "05", stunting_count: 1, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2565],
          [116.8290, -1.2565],
          [116.8290, -1.2580],
          [116.8270, -1.2580],
          [116.8270, -1.2565]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "06", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8290, -1.2565],
          [116.8310, -1.2565],
          [116.8310, -1.2580],
          [116.8290, -1.2580],
          [116.8290, -1.2565]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "07", stunting_count: 2, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8310, -1.2565],
          [116.8330, -1.2565],
          [116.8330, -1.2580],
          [116.8310, -1.2580],
          [116.8310, -1.2565]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "08", stunting_count: 1, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8330, -1.2565],
          [116.8350, -1.2565],
          [116.8350, -1.2580],
          [116.8330, -1.2580],
          [116.8330, -1.2565]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "09", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2580],
          [116.8290, -1.2580],
          [116.8290, -1.2595],
          [116.8270, -1.2595],
          [116.8270, -1.2580]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "10", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8290, -1.2580],
          [116.8310, -1.2580],
          [116.8310, -1.2595],
          [116.8290, -1.2595],
          [116.8290, -1.2580]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "11", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8310, -1.2580],
          [116.8330, -1.2580],
          [116.8330, -1.2595],
          [116.8310, -1.2595],
          [116.8310, -1.2580]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "12", stunting_count: 3, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8330, -1.2580],
          [116.8350, -1.2580],
          [116.8350, -1.2595],
          [116.8330, -1.2595],
          [116.8330, -1.2580]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "13", stunting_count: 1, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2595],
          [116.8290, -1.2595],
          [116.8290, -1.2610],
          [116.8270, -1.2610],
          [116.8270, -1.2595]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "14", stunting_count: 2, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8290, -1.2595],
          [116.8310, -1.2595],
          [116.8310, -1.2610],
          [116.8290, -1.2610],
          [116.8290, -1.2595]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "15", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8310, -1.2595],
          [116.8330, -1.2595],
          [116.8330, -1.2610],
          [116.8310, -1.2610],
          [116.8310, -1.2595]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "16", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8330, -1.2595],
          [116.8350, -1.2595],
          [116.8350, -1.2610],
          [116.8330, -1.2610],
          [116.8330, -1.2595]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "17", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2610],
          [116.8295, -1.2610],
          [116.8295, -1.2625],
          [116.8270, -1.2625],
          [116.8270, -1.2610]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "18", stunting_count: 1, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8295, -1.2610],
          [116.8320, -1.2610],
          [116.8320, -1.2625],
          [116.8295, -1.2625],
          [116.8295, -1.2610]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "19", stunting_count: 5, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8320, -1.2610],
          [116.8350, -1.2610],
          [116.8350, -1.2625],
          [116.8320, -1.2625],
          [116.8320, -1.2610]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "20", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8270, -1.2625],
          [116.8300, -1.2625],
          [116.8300, -1.2640],
          [116.8270, -1.2640],
          [116.8270, -1.2625]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "21", stunting_count: 0, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8300, -1.2625],
          [116.8325, -1.2625],
          [116.8325, -1.2640],
          [116.8300, -1.2640],
          [116.8300, -1.2625]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { rt_number: "22", stunting_count: 2, kelurahan: "Damai" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8325, -1.2625],
          [116.8350, -1.2625],
          [116.8350, -1.2640],
          [116.8325, -1.2640],
          [116.8325, -1.2625]
        ]]
      }
    },
  ]
};

export default rtGeoJson;
