// ============================================================
// GeoJSON batas RT Kelurahan Gunung Sari Ulu
// Kecamatan Balikpapan Tengah, Kota Balikpapan
// ============================================================
// Didigitasi berdasarkan Peta Batas RT (skala 1:4000)
// Universitas Mulawarman BPP — KKN 51
//
// Batas APPROXIMATE — untuk akurasi tinggi gunakan
// alat digitasi di /digitize atau QGIS.
// ============================================================

const rtGeoJson = {
  type: "FeatureCollection",
  features: [
    // ── RT 01 — Area hutan besar, selatan / tenggara ──
    {
      type: "Feature",
      properties: { rt_number: "01", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8455, -1.2585], [116.8490, -1.2578], [116.8530, -1.2572],
          [116.8572, -1.2568], [116.8580, -1.2590], [116.8578, -1.2620],
          [116.8565, -1.2648], [116.8530, -1.2663], [116.8490, -1.2670],
          [116.8455, -1.2665], [116.8442, -1.2650], [116.8440, -1.2620],
          [116.8455, -1.2585]
        ]]
      }
    },

    // ── BARAT — sepanjang Jl. S. Parman ──
    // RT 02
    {
      type: "Feature",
      properties: { rt_number: "02", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8368, -1.2558], [116.8392, -1.2556], [116.8395, -1.2568],
          [116.8393, -1.2579], [116.8370, -1.2580], [116.8365, -1.2570],
          [116.8368, -1.2558]
        ]]
      }
    },
    // RT 03
    {
      type: "Feature",
      properties: { rt_number: "03", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8392, -1.2556], [116.8415, -1.2554], [116.8418, -1.2565],
          [116.8417, -1.2579], [116.8393, -1.2579], [116.8395, -1.2568],
          [116.8392, -1.2556]
        ]]
      }
    },
    // RT 04
    {
      type: "Feature",
      properties: { rt_number: "04", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8368, -1.2580], [116.8393, -1.2579], [116.8395, -1.2590],
          [116.8390, -1.2596], [116.8367, -1.2597], [116.8365, -1.2588],
          [116.8368, -1.2580]
        ]]
      }
    },
    // RT 05
    {
      type: "Feature",
      properties: { rt_number: "05", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8393, -1.2579], [116.8417, -1.2579], [116.8420, -1.2588],
          [116.8418, -1.2596], [116.8395, -1.2597], [116.8395, -1.2590],
          [116.8393, -1.2579]
        ]]
      }
    },
    // RT 06
    {
      type: "Feature",
      properties: { rt_number: "06", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8417, -1.2579], [116.8442, -1.2577], [116.8445, -1.2586],
          [116.8443, -1.2596], [116.8418, -1.2596], [116.8420, -1.2588],
          [116.8417, -1.2579]
        ]]
      }
    },
    // RT 07
    {
      type: "Feature",
      properties: { rt_number: "07", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8367, -1.2597], [116.8390, -1.2596], [116.8392, -1.2605],
          [116.8388, -1.2612], [116.8365, -1.2613], [116.8363, -1.2604],
          [116.8367, -1.2597]
        ]]
      }
    },

    // ── KIRI BAWAH — RT 08-12 ──
    // RT 08
    {
      type: "Feature",
      properties: { rt_number: "08", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8360, -1.2618], [116.8382, -1.2616], [116.8385, -1.2625],
          [116.8383, -1.2638], [116.8362, -1.2640], [116.8358, -1.2630],
          [116.8360, -1.2618]
        ]]
      }
    },
    // RT 09
    {
      type: "Feature",
      properties: { rt_number: "09", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8382, -1.2616], [116.8405, -1.2615], [116.8408, -1.2624],
          [116.8405, -1.2638], [116.8383, -1.2638], [116.8385, -1.2625],
          [116.8382, -1.2616]
        ]]
      }
    },
    // RT 10
    {
      type: "Feature",
      properties: { rt_number: "10", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8385, -1.2605], [116.8408, -1.2604], [116.8410, -1.2612],
          [116.8405, -1.2615], [116.8382, -1.2616], [116.8383, -1.2610],
          [116.8385, -1.2605]
        ]]
      }
    },
    // RT 11
    {
      type: "Feature",
      properties: { rt_number: "11", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8362, -1.2640], [116.8383, -1.2638], [116.8385, -1.2648],
          [116.8382, -1.2658], [116.8360, -1.2660], [116.8358, -1.2650],
          [116.8362, -1.2640]
        ]]
      }
    },
    // RT 12
    {
      type: "Feature",
      properties: { rt_number: "12", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8405, -1.2604], [116.8428, -1.2603], [116.8430, -1.2610],
          [116.8428, -1.2620], [116.8408, -1.2624], [116.8410, -1.2612],
          [116.8405, -1.2604]
        ]]
      }
    },

    // ── TENGAH BARAT — RT 13-16 ──
    // RT 13
    {
      type: "Feature",
      properties: { rt_number: "13", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8425, -1.2568], [116.8445, -1.2566], [116.8448, -1.2576],
          [116.8445, -1.2588], [116.8428, -1.2590], [116.8423, -1.2580],
          [116.8425, -1.2568]
        ]]
      }
    },
    // RT 14
    {
      type: "Feature",
      properties: { rt_number: "14", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8445, -1.2566], [116.8465, -1.2565], [116.8468, -1.2575],
          [116.8465, -1.2588], [116.8448, -1.2576], [116.8445, -1.2566]
        ]]
      }
    },
    // RT 15
    {
      type: "Feature",
      properties: { rt_number: "15", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8465, -1.2565], [116.8485, -1.2564], [116.8488, -1.2574],
          [116.8485, -1.2588], [116.8468, -1.2588], [116.8468, -1.2575],
          [116.8465, -1.2565]
        ]]
      }
    },
    // RT 16
    {
      type: "Feature",
      properties: { rt_number: "16", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8428, -1.2590], [116.8445, -1.2588], [116.8448, -1.2598],
          [116.8445, -1.2608], [116.8425, -1.2610], [116.8423, -1.2600],
          [116.8428, -1.2590]
        ]]
      }
    },

    // ── KIRI BAWAH lanjutan — RT 17-22 ──
    // RT 17
    {
      type: "Feature",
      properties: { rt_number: "17", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8383, -1.2638], [116.8405, -1.2638], [116.8407, -1.2648],
          [116.8405, -1.2658], [116.8385, -1.2658], [116.8385, -1.2648],
          [116.8383, -1.2638]
        ]]
      }
    },
    // RT 18
    {
      type: "Feature",
      properties: { rt_number: "18", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8405, -1.2620], [116.8428, -1.2620], [116.8430, -1.2630],
          [116.8428, -1.2638], [116.8407, -1.2638], [116.8408, -1.2624],
          [116.8405, -1.2620]
        ]]
      }
    },
    // RT 19
    {
      type: "Feature",
      properties: { rt_number: "19", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8407, -1.2638], [116.8428, -1.2638], [116.8430, -1.2648],
          [116.8428, -1.2658], [116.8405, -1.2658], [116.8407, -1.2648],
          [116.8407, -1.2638]
        ]]
      }
    },
    // RT 20
    {
      type: "Feature",
      properties: { rt_number: "20", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8425, -1.2610], [116.8445, -1.2608], [116.8448, -1.2618],
          [116.8445, -1.2628], [116.8430, -1.2630], [116.8428, -1.2620],
          [116.8425, -1.2610]
        ]]
      }
    },
    // RT 21
    {
      type: "Feature",
      properties: { rt_number: "21", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8428, -1.2630], [116.8445, -1.2628], [116.8447, -1.2638],
          [116.8445, -1.2648], [116.8430, -1.2650], [116.8430, -1.2640],
          [116.8428, -1.2630]
        ]]
      }
    },
    // RT 22
    {
      type: "Feature",
      properties: { rt_number: "22", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8430, -1.2650], [116.8445, -1.2648], [116.8445, -1.2658],
          [116.8443, -1.2668], [116.8425, -1.2670], [116.8423, -1.2660],
          [116.8430, -1.2650]
        ]]
      }
    },

    // ── TENGAH — RT 23-28 ──
    // RT 23
    {
      type: "Feature",
      properties: { rt_number: "23", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8448, -1.2596], [116.8465, -1.2594], [116.8468, -1.2600],
          [116.8465, -1.2608], [116.8448, -1.2610], [116.8445, -1.2602],
          [116.8448, -1.2596]
        ]]
      }
    },
    // RT 24
    {
      type: "Feature",
      properties: { rt_number: "24", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8465, -1.2594], [116.8485, -1.2592], [116.8488, -1.2598],
          [116.8485, -1.2608], [116.8468, -1.2610], [116.8468, -1.2600],
          [116.8465, -1.2594]
        ]]
      }
    },
    // RT 25
    {
      type: "Feature",
      properties: { rt_number: "25", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8485, -1.2592], [116.8512, -1.2590], [116.8515, -1.2598],
          [116.8512, -1.2608], [116.8488, -1.2610], [116.8488, -1.2598],
          [116.8485, -1.2592]
        ]]
      }
    },
    // RT 26
    {
      type: "Feature",
      properties: { rt_number: "26", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8468, -1.2610], [116.8485, -1.2608], [116.8488, -1.2618],
          [116.8485, -1.2625], [116.8468, -1.2625], [116.8465, -1.2618],
          [116.8468, -1.2610]
        ]]
      }
    },
    // RT 27
    {
      type: "Feature",
      properties: { rt_number: "27", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8485, -1.2608], [116.8512, -1.2608], [116.8515, -1.2618],
          [116.8512, -1.2625], [116.8488, -1.2625], [116.8488, -1.2618],
          [116.8485, -1.2608]
        ]]
      }
    },
    // RT 28
    {
      type: "Feature",
      properties: { rt_number: "28", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8512, -1.2540], [116.8540, -1.2538], [116.8543, -1.2548],
          [116.8540, -1.2560], [116.8515, -1.2562], [116.8510, -1.2550],
          [116.8512, -1.2540]
        ]]
      }
    },

    // ── RT 29 — tengah timur (kecil) ──
    {
      type: "Feature",
      properties: { rt_number: "29", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8492, -1.2562], [116.8512, -1.2560], [116.8515, -1.2568],
          [116.8512, -1.2578], [116.8490, -1.2578], [116.8488, -1.2570],
          [116.8492, -1.2562]
        ]]
      }
    },

    // ── TENGAH SELATAN — RT 30-32 ──
    // RT 30
    {
      type: "Feature",
      properties: { rt_number: "30", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8448, -1.2610], [116.8465, -1.2610], [116.8468, -1.2618],
          [116.8465, -1.2628], [116.8448, -1.2630], [116.8447, -1.2620],
          [116.8448, -1.2610]
        ]]
      }
    },
    // RT 31
    {
      type: "Feature",
      properties: { rt_number: "31", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8468, -1.2625], [116.8485, -1.2625], [116.8488, -1.2632],
          [116.8485, -1.2640], [116.8468, -1.2642], [116.8465, -1.2634],
          [116.8468, -1.2625]
        ]]
      }
    },
    // RT 32
    {
      type: "Feature",
      properties: { rt_number: "32", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8485, -1.2625], [116.8512, -1.2625], [116.8515, -1.2634],
          [116.8512, -1.2644], [116.8488, -1.2645], [116.8488, -1.2632],
          [116.8485, -1.2625]
        ]]
      }
    },

    // ── KANAN ATAS / TIMUR LAUT — RT 33-41 ──
    // RT 33
    {
      type: "Feature",
      properties: { rt_number: "33", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8510, -1.2492], [116.8550, -1.2490], [116.8553, -1.2505],
          [116.8550, -1.2518], [116.8512, -1.2520], [116.8508, -1.2505],
          [116.8510, -1.2492]
        ]]
      }
    },
    // RT 34 — bukit, atas tengah
    {
      type: "Feature",
      properties: { rt_number: "34", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8472, -1.2520], [116.8510, -1.2520], [116.8512, -1.2530],
          [116.8510, -1.2540], [116.8475, -1.2542], [116.8470, -1.2532],
          [116.8472, -1.2520]
        ]]
      }
    },
    // RT 35
    {
      type: "Feature",
      properties: { rt_number: "35", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8512, -1.2520], [116.8550, -1.2518], [116.8553, -1.2530],
          [116.8550, -1.2540], [116.8515, -1.2542], [116.8512, -1.2530],
          [116.8512, -1.2520]
        ]]
      }
    },
    // RT 36
    {
      type: "Feature",
      properties: { rt_number: "36", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8550, -1.2490], [116.8578, -1.2490], [116.8580, -1.2505],
          [116.8578, -1.2520], [116.8553, -1.2518], [116.8553, -1.2505],
          [116.8550, -1.2490]
        ]]
      }
    },
    // RT 37
    {
      type: "Feature",
      properties: { rt_number: "37", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8550, -1.2520], [116.8578, -1.2520], [116.8580, -1.2535],
          [116.8578, -1.2550], [116.8553, -1.2548], [116.8553, -1.2530],
          [116.8550, -1.2520]
        ]]
      }
    },
    // RT 38
    {
      type: "Feature",
      properties: { rt_number: "38", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8543, -1.2550], [116.8578, -1.2550], [116.8580, -1.2560],
          [116.8578, -1.2570], [116.8545, -1.2572], [116.8540, -1.2562],
          [116.8543, -1.2550]
        ]]
      }
    },
    // RT 39 — area galian, tengah
    {
      type: "Feature",
      properties: { rt_number: "39", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8472, -1.2542], [116.8492, -1.2540], [116.8495, -1.2550],
          [116.8492, -1.2560], [116.8470, -1.2562], [116.8468, -1.2552],
          [116.8472, -1.2542]
        ]]
      }
    },
    // RT 40
    {
      type: "Feature",
      properties: { rt_number: "40", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8512, -1.2562], [116.8540, -1.2560], [116.8543, -1.2570],
          [116.8540, -1.2580], [116.8515, -1.2582], [116.8512, -1.2572],
          [116.8512, -1.2562]
        ]]
      }
    },
    // RT 41
    {
      type: "Feature",
      properties: { rt_number: "41", stunting_count: 0, kelurahan: "Gunung Sari Ulu" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [116.8545, -1.2572], [116.8578, -1.2570], [116.8580, -1.2580],
          [116.8578, -1.2588], [116.8548, -1.2590], [116.8543, -1.2580],
          [116.8545, -1.2572]
        ]]
      }
    }
  ]
};

export default rtGeoJson;
