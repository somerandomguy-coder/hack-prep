# ☀️ Solar Estimator Prototype - Quick Reference

Informal quick-start guide and tech spec for hackathon demo.

---

## ⚡ Quick Run Commands

```powershell
# 1. Run default (University of Wollongong)
python solar_estimator.py

# 2. Run with custom street address
python solar_estimator.py "89 Showground Rd, Castle Hill NSW, Australia"

# 3. Run with exact Google Maps coordinates
python solar_estimator.py "-33.72875, 150.99557"
python solar_estimator.py --coords "-33.72875, 150.99557"
python solar_estimator.py --lat -33.72875 --lng 150.99557

# 4. JSON output mode
python solar_estimator.py --json

# 5. Run test suite (12 tests)
python -m pytest -v
```

---

## 🛠️ Quick Specs & Tech Stack

- **CLI Interface:** Python 3.10+, `argparse`, `rich` (tables & HUD styling).
- **Geocoding:** `geopy` (Nominatim) + direct regex coordinate parser + Google Maps API fallback.
- **Satellite Ingestion:** Esri World Imagery (zero-key $256\times 256$ XYZ tile grid stitcher) + Mapbox Static API.
- **Ground Resolution Engine:** Web Mercator Mercator formula:
  $$\text{Resolution (m/px)} = \frac{156543.03392 \times \cos(\text{rad}(\text{lat}))}{2^z}$$
- **Rooftop Segmentation:** OpenCV (CLAHE contrast, Otsu thresholding, Canny edges, morphological closing). Pluggable Gemini 2.5 Flash Vision hook (`--segmenter gemini`).
- **AI Pseudo-LiDAR Elevation:** Monocular Depth Estimation (`core/depth_estimation.py`) generating relative 3D height maps to filter out low-elevation ground, driveways, and backyard clutter.
- **Outputs Created:**
  - `output_annotated.png`: Annotated roof outline + green mask + HUD metrics + 10m scale bar.
  - `depth_map.png`: Color-mapped Pseudo-LiDAR elevation surface (Turbo/Inferno colormap).

---

## 💡 Proposal: Sunlit Roof Facet Extraction (Solar Irradiance Optimization)

### Concept
Rooftops consist of multiple sloped pitches (facets). In top-down satellite photos, roof facets receiving direct sunlight appear significantly brighter ($L$-channel in LAB color space), while shaded facets facing away from the sun appear darker.

Since solar panels produce maximum power on direct sunlit facets (e.g. North-facing in Australia / South-facing in North America), we can use this luminance variation to extract exact installable solar space!

### Proposed Implementation Algorithm

1. **LAB Lightness Segmentation ($L$-channel Extraction):**
   ```python
   # Convert roof RGB to LAB color space
   lab = cv2.cvtColor(roof_rgb, cv2.COLOR_RGB2LAB)
   lightness = lab[:, :, 0] # L channel (0-255 luminance)
   ```
2. **K-Means / Adaptive Thresholding on Roof Polygon:**
   - Cluster roof pixels into 2 luminance regions: **Direct Sunlit Pitch** vs **Shaded Pitch**.
   - Generate a binary mask for `sunlit_roof_mask`.

3. **Dynamic Usable Area Math:**
   - Instead of a generic 65% discount across the total roof, calculate:
     $$\text{Usable Sunlit Area (m}^2) = \text{Sunlit Pitch Area} \times 0.85$$
   - Eliminates shaded roof planes, tree overhangs, and un-optimized pitches.

4. **Visual Overlay:**
   - Render sunlit roof pitches in bright yellow/gold and shaded pitches in translucent blue on `output_annotated.png`.
