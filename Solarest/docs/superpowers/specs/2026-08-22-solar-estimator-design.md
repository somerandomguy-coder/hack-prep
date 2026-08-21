# Technical Design: Solar Feasibility & Rooftop Area Estimator CLI

## 1. Overview
`solar_estimator.py` is a lightweight, self-contained Python CLI tool that estimates solar energy potential for any street address. It converts an address to coordinates via geocoding, downloads a high-resolution satellite image, calculates physical ground resolution using Web Mercator formulas, segments the target rooftop, and computes usable panel capacity and peak power potential.

---

## 2. System Architecture & Components

```
+-----------------------------------------------------------------------+
|                         solar_estimator.py                            |
|                            (CLI Entry)                                |
+-----------------------------------------------------------------------+
        |                  |                 |               |
        v                  v                 v               v
+---------------+  +---------------+  +------------+  +-----------------+
|   Geocoder    |  |  TileFetcher  |  | Resolution |  | RoofSegmenter   |
| (Nominatim)   |  | (Esri/Mapbox) |  | Engine     |  | (OpenCV/Gemini) |
+---------------+  +---------------+  +------------+  +-----------------+
                                                             |
                                                             v
                                                      +-----------------+
                                                      | SolarMath &     |
                                                      | Visualizer      |
                                                      +-----------------+
```

### Module Breakdown
1. **Geocoding Engine (`core/geocoder.py`)**
   - Query: Address string (e.g. "1600 Amphitheatre Pkwy, Mountain View, CA").
   - Provider: OpenStreetMap Nominatim via `geopy` / HTTP `requests`.
   - Header: Custom `User-Agent: SolarEstimatorPrototype/1.0`.
   - Output: `(latitude, longitude, formatted_address)`.

2. **Satellite Imagery Fetcher (`core/imagery.py`)**
   - **Target Parameters:** Zoom $z = 19$, resolution $600 \times 600\text{ px}$.
   - **Provider Hierarchy:**
     - **Option A:** Mapbox Static Images API (`mapbox.satellite`) or Google Maps Static API (if `MAPBOX_API_KEY` or `GOOGLE_MAPS_API_KEY` present in `.env`).
     - **Option B (Default Zero-Key Fallback):** Esri World Imagery Export API (`https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export`). Calculates Mercator bounding box around center `(lat, lng)` for precise $600 \times 600$ retrieval.

3. **Ground Resolution Engine (`core/resolution.py`)**
   - Formula:
     $$\text{Resolution (m/pixel)} = \frac{156543.03392 \times \cos(\text{radians}(\text{latitude}))}{2^z}$$
   - Pixel Area: $\text{Resolution}^2 \text{ m}^2/\text{pixel}$.

4. **Rooftop Segmentation Engine (`core/segmentation.py`)**
   - Extensible base interface `BaseSegmenter`.
   - **OpenCV Heuristic Segmenter (`OpenCVSegmenter` - Default):**
     1. Preprocessing: CLAHE color enhancement + Gaussian blur.
     2. Thresholding: Adaptive thresholding / Otsu combined with color-based edge detection.
     3. Contour Analysis: Find contours enclosing/nearest to the center point $(300, 300)$.
     4. Refinement: Apply morphological closing to bridge gaps and generate convex hull / smooth polygon mask.
   - **AI Vision Segmenter (`GeminiVisionSegmenter` - Pluggable Hook):**
     - Activated if `--segmenter gemini` specified and `GEMINI_API_KEY` available.
     - Base64 encodes image, prompts Gemini for normalized 2D polygon bounding box `[[x1,y1],[x2,y2],...]`.
     - Draws polygon mask onto binary canvas.

5. **Solar Math & Capacity Engine (`core/solar_math.py`)**
   - Raw Roof Area ($m^2$) = $\text{Mask Pixel Count} \times \text{Pixel Area}$.
   - Usable Area ($m^2$) = $\text{Raw Roof Area} \times 0.65$ ($35\%$ setback/tilt/obstacle discount).
   - Module Size: $1.7 \text{ m}^2$ per $400\text{W}$ panel.
   - Max Panels = $\lfloor \text{Usable Area} / 1.7 \rfloor$.
   - Peak System Capacity ($kW$) = $\text{Max Panels} \times 0.40\text{ kW}$.

6. **Visualization & Annotation Layer (`core/visualization.py`)**
   - Blends base image with semi-transparent green mask ($35\%$ opacity).
   - Outlines roof boundary in bright green contour ($2\text{px}$).
   - Renders a styled HUD box in top-left with coordinates, ground resolution, roof area, usable solar area, panel count, and $kW$ potential.
   - Saves to `output_annotated.png`.

---

## 3. CLI Interface & Outputs

### Command Syntax
```bash
python solar_estimator.py "1600 Amphitheatre Pkwy, Mountain View, CA" [OPTIONS]
```
Options:
- `--zoom`: Zoom level (default: 19).
- `--segmenter`: `opencv` (default) or `gemini`.
- `--output`: Output image path (default: `output_annotated.png`).
- `--json`: Output metrics in JSON format.

---

## 4. Deliverables
1. `solar_estimator.py` (CLI launcher)
2. `core/` package containing geocoder, imagery, resolution, segmentation, solar math, visualization
3. `requirements.txt`
4. `.env.example`
5. `output_annotated.png` (generated during verification)
