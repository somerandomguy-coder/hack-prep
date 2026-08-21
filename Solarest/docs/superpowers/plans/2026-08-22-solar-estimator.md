# Solar Feasibility & Rooftop Area Estimator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight, self-contained Python CLI tool (`solar_estimator.py`) that accepts a street address, downloads a top-down satellite image, calculates real-world ground resolution, segments the primary rooftop, and calculates usable solar panel area ($m^2$) and peak power potential ($kW$).

**Architecture:** A modular Python application with decoupled core modules (`geocoder`, `imagery`, `resolution`, `segmentation`, `solar_math`, `visualization`) orchestrated by `solar_estimator.py` CLI interface.

**Tech Stack:** Python 3.10+, `requests`, `geopy`, `opencv-python`, `numpy`, `pillow`, `python-dotenv`, `pytest`, `rich`.

## Global Constraints

- Standalone executable CLI entry point at root: `solar_estimator.py`.
- Ground resolution formula: $\text{Resolution} = \frac{156543.03392 \times \cos(\text{radians}(\text{latitude}))}{2^z}$ at zoom level $z=19$.
- Zero-key fallback: Must work without API keys using Nominatim for geocoding and Esri World Imagery for satellite tiles ($600 \times 600\text{ px}$).
- Solar panel parameters: Usable area discount = $65\%$, Panel module size = $1.7\text{ m}^2$, Panel output = $400\text{W}$ ($0.40\text{ kW}$).
- Visual output: Must generate `output_annotated.png` overlaying green semi-transparent mask ($35\%$ alpha), contour boundary, HUD info box, and scale bar.

---

### Task 1: Environment & Project Setup

**Files:**
- Create: `requirements.txt`
- Create: `.env.example`
- Create: `core/__init__.py`

**Interfaces:**
- Consumes: None
- Produces: Project dependencies and package structure

- [ ] **Step 1: Create requirements.txt**

```text
requests>=2.31.0
opencv-python>=4.8.0
numpy>=1.24.0
pillow>=10.0.0
python-dotenv>=1.0.0
geopy>=2.4.0
rich>=13.0.0
pytest>=7.4.0
```

- [ ] **Step 2: Create .env.example**

```env
# Optional API Keys
MAPBOX_API_KEY=
GOOGLE_MAPS_API_KEY=
GEMINI_API_KEY=
```

- [ ] **Step 3: Create core/__init__.py**

```python
"""Core module for Solar Feasibility & Rooftop Area Estimator."""
__version__ = "1.0.0"
```

- [ ] **Step 4: Commit setup**

```bash
git add requirements.txt .env.example core/__init__.py
git commit -m "chore: setup dependencies and core package structure"
```

---

### Task 2: Geocoding Engine

**Files:**
- Create: `core/geocoder.py`
- Create: `tests/test_geocoder.py`

**Interfaces:**
- Consumes: Address string
- Produces: `geocode_address(address: str) -> tuple[float, float, str]`

- [ ] **Step 1: Write failing unit test for geocoder**

```python
# tests/test_geocoder.py
import pytest
from core.geocoder import geocode_address

def test_geocode_address():
    lat, lng, full_address = geocode_address("1600 Pennsylvania Ave NW, Washington, DC")
    assert pytest.approx(lat, abs=0.05) == 38.8977
    assert pytest.approx(lng, abs=0.05) == -77.0365
    assert "Washington" in full_address
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_geocoder.py -v`
Expected: FAIL with ModuleNotFoundError or ImportError

- [ ] **Step 3: Implement geocoder module**

```python
# core/geocoder.py
import requests
from geopy.geocoders import Nominatim

def geocode_address(address: str, user_agent: str = "SolarEstimator/1.0") -> tuple[float, float, str]:
    """
    Geocodes an address string to (latitude, longitude, display_name).
    Uses Nominatim with a custom User-Agent to respect service policy.
    """
    geolocator = Nominatim(user_agent=user_agent, timeout=10)
    location = geolocator.geocode(address)
    if not location:
        raise ValueError(f"Could not geocode address: '{address}'")
    return float(location.latitude), float(location.longitude), str(location.address)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_geocoder.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/geocoder.py tests/test_geocoder.py
git commit -m "feat: implement geocoding engine with Nominatim"
```

---

### Task 3: Ground Resolution Engine

**Files:**
- Create: `core/resolution.py`
- Create: `tests/test_resolution.py`

**Interfaces:**
- Consumes: `latitude: float`, `zoom: int = 19`
- Produces: `calculate_ground_resolution(latitude: float, zoom: int = 19) -> float`, `calculate_pixel_area(resolution: float) -> float`

- [ ] **Step 1: Write failing unit test for resolution calculation**

```python
# tests/test_resolution.py
import math
import pytest
from core.resolution import calculate_ground_resolution, calculate_pixel_area

def test_ground_resolution_equator():
    # At latitude 0 and zoom 19: 156543.03392 * cos(0) / 2^19 = ~0.29858 m/px
    res = calculate_ground_resolution(0.0, zoom=19)
    assert pytest.approx(res, abs=1e-4) == 156543.03392 / (2**19)

def test_pixel_area():
    res = 0.25
    area = calculate_pixel_area(res)
    assert area == 0.0625
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_resolution.py -v`
Expected: FAIL

- [ ] **Step 3: Implement ground resolution module**

```python
# core/resolution.py
import math

def calculate_ground_resolution(latitude: float, zoom: int = 19) -> float:
    """
    Calculates physical ground resolution (meters per pixel) for Web Mercator projection.
    
    Formula: Resolution = (156543.03392 * cos(radians(latitude))) / (2^zoom)
    """
    rad_lat = math.radians(latitude)
    resolution = (156543.03392 * math.cos(rad_lat)) / (2 ** zoom)
    return resolution

def calculate_pixel_area(resolution_m_per_px: float) -> float:
    """Calculates physical ground area in m² represented by a single pixel."""
    return resolution_m_per_px ** 2
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_resolution.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/resolution.py tests/test_resolution.py
git commit -m "feat: implement Web Mercator ground resolution calculator"
```

---

### Task 4: Satellite Imagery Fetcher (With Zero-Key Fallback)

**Files:**
- Create: `core/imagery.py`
- Create: `tests/test_imagery.py`

**Interfaces:**
- Consumes: `lat: float`, `lng: float`, `zoom: int = 19`, `size: int = 600`
- Produces: `fetch_satellite_image(lat: float, lng: float, zoom: int = 19, size: int = 600) -> Image.Image`

- [ ] **Step 1: Write failing unit test for imagery fetcher**

```python
# tests/test_imagery.py
import pytest
from PIL import Image
from core.imagery import fetch_esri_satellite_tile

def test_fetch_esri_satellite_tile():
    # Washington DC coords
    img = fetch_esri_satellite_tile(38.8977, -77.0365, zoom=19, size=600)
    assert isinstance(img, Image.Image)
    assert img.size == (600, 600)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_imagery.py -v`
Expected: FAIL

- [ ] **Step 3: Implement satellite imagery fetcher**

```python
# core/imagery.py
import os
import math
import io
import requests
from PIL import Image
from core.resolution import calculate_ground_resolution

def latlng_to_web_mercator(lat: float, lng: float) -> tuple[float, float]:
    """Converts lat/lng (EPSG:4326) to Web Mercator meters (EPSG:3857)."""
    r_major = 6378137.0
    x = r_major * math.radians(lng)
    scale = math.sin(math.radians(lat))
    y = 0.5 * r_major * math.log((1.0 + scale) / (1.0 - scale))
    return x, y

def fetch_esri_satellite_tile(lat: float, lng: float, zoom: int = 19, size: int = 600) -> Image.Image:
    """
    Fetches satellite imagery from Esri World Imagery Export API without needing API keys.
    Calculates exact Web Mercator bounding box centered at (lat, lng).
    """
    res = calculate_ground_resolution(lat, zoom)
    half_span_m = (res * size) / 2.0
    cx, cy = latlng_to_web_mercator(lat, lng)
    
    xmin, ymin = cx - half_span_m, cy - half_span_m
    xmax, ymax = cx + half_span_m, cy + half_span_m
    
    url = (
        "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export"
        f"?bbox={xmin},{ymin},{xmax},{ymax}"
        f"&bboxSR=3857&imageSR=3857&size={size},{size}&format=jpg&f=image"
    )
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    
    image = Image.open(io.BytesIO(resp.content)).convert("RGB")
    return image

def fetch_mapbox_satellite_tile(lat: float, lng: float, api_key: str, zoom: int = 19, size: int = 600) -> Image.Image:
    """Fetches satellite imagery from Mapbox Static API."""
    url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{lng},{lat},{zoom},0/{size}x{size}?access_token={api_key}"
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    return Image.open(io.BytesIO(resp.content)).convert("RGB")

def fetch_satellite_image(lat: float, lng: float, zoom: int = 19, size: int = 600) -> Image.Image:
    """Fetches satellite imagery with automatic fallback to zero-key Esri server."""
    mapbox_key = os.getenv("MAPBOX_API_KEY")
    if mapbox_key:
        try:
            return fetch_mapbox_satellite_tile(lat, lng, mapbox_key, zoom, size)
        except Exception as e:
            print(f"[Warning] Mapbox fetch failed ({e}), falling back to Esri World Imagery.")
            
    return fetch_esri_satellite_tile(lat, lng, zoom, size)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_imagery.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/imagery.py tests/test_imagery.py
git commit -m "feat: implement satellite imagery fetcher with Esri zero-key fallback"
```

---

### Task 5: Rooftop Segmentation Engine (OpenCV & Pluggable Gemini Vision)

**Files:**
- Create: `core/segmentation.py`
- Create: `tests/test_segmentation.py`

**Interfaces:**
- Consumes: `image: PIL.Image.Image`, `center_point: tuple[int, int] = (300, 300)`
- Produces: `segment_rooftop_opencv(image: Image.Image) -> np.ndarray`, `segment_rooftop_gemini(image: Image.Image, api_key: str) -> np.ndarray`

- [ ] **Step 1: Write failing unit test for segmentation engine**

```python
# tests/test_segmentation.py
import numpy as np
from PIL import Image
from core.segmentation import segment_rooftop_opencv

def test_segment_rooftop_opencv():
    # Create a synthetic image with a bright rectangle near center
    arr = np.zeros((600, 600, 3), dtype=np.uint8) + 50
    arr[200:400, 200:400] = 200 # Bright roof square
    img = Image.fromarray(arr)
    
    mask = segment_rooftop_opencv(img)
    assert isinstance(mask, np.ndarray)
    assert mask.shape == (600, 600)
    assert mask.dtype == np.uint8
    # Center pixel should be part of mask (255)
    assert mask[300, 300] == 255
    # Mask count should be close to 200x200 = 40,000 pixels
    pixel_count = np.sum(mask > 0)
    assert 35000 <= pixel_count <= 45000
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_segmentation.py -v`
Expected: FAIL

- [ ] **Step 3: Implement segmentation engine module**

```python
# core/segmentation.py
import os
import io
import base64
import json
import numpy as np
import cv2
from PIL import Image

def segment_rooftop_opencv(image: Image.Image) -> np.ndarray:
    """
    Baseline / Fast OpenCV Heuristic:
    Applies color preprocessing, adaptive thresholding / Otsu, and morphological ops
    to isolate the main rooftop enclosing or closest to the center of the image.
    """
    img_np = np.array(image)
    h, w, _ = img_np.shape
    center_x, center_y = w // 2, h // 2
    
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    
    # Enhance contrast using CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    
    # Blur to reduce noise
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
    
    # Otsu thresholding
    _, thresh_otsu = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Canny edge detection & dilation to isolate structural polygons
    edges = cv2.Canny(blurred, 50, 150)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilated_edges = cv2.dilate(edges, kernel, iterations=2)
    
    # Combine threshold with edge boundary mask
    combined = cv2.bitwise_or(thresh_otsu, cv2.bitwise_not(dilated_edges))
    
    # Morphological closing to bridge roof texture gaps
    close_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    closed = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, close_kernel)
    
    # Find contours
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    target_contour = None
    min_dist = float("inf")
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 500: # Filter out small noise
            continue
            
        # Check if center point is inside contour or calculate distance to center
        dist = cv2.pointPolygonTest(cnt, (center_x, center_y), True)
        if dist >= 0: # Point is inside
            target_contour = cnt
            break
        else:
            # Measure distance from contour centroid to center
            M = cv2.moments(cnt)
            if M["m00"] > 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                d = math.hypot(cx - center_x, cy - center_y)
                if d < min_dist:
                    min_dist = d
                    target_contour = cnt

    mask = np.zeros((h, w), dtype=np.uint8)
    if target_contour is not None:
        # Create convex hull for clean rooftop outline polygon
        hull = cv2.convexHull(target_contour)
        cv2.drawContours(mask, [hull], -1, 255, -1)
    else:
        # Fallback bounding box around center if no contour enclosing center
        crop_size = 150
        mask[center_y - crop_size : center_y + crop_size, center_x - crop_size : center_x + crop_size] = 255

    return mask

def segment_rooftop_gemini(image: Image.Image, api_key: str) -> np.ndarray:
    """
    Pluggable AI Vision Layer: Uses Gemini API to detect rooftop polygon coordinates.
    """
    import requests
    
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    b64_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    prompt = (
        "Identify the primary main building rooftop located at the center of this satellite image. "
        "Return JSON containing key 'polygon' with a list of 2D pixel coordinates [[x1, y1], [x2, y2], ...] "
        "defining the boundary of the primary roof. Standard image resolution is 600x600 px."
    )
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}}
            ]
        }],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    resp = requests.post(url, json=payload, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    
    text = data['candidates'][0]['content']['parts'][0]['text']
    parsed = json.loads(text)
    polygon = parsed.get("polygon", [])
    
    mask = np.zeros((image.height, image.width), dtype=np.uint8)
    if polygon:
        pts = np.array(polygon, dtype=np.int32)
        cv2.fillPoly(mask, [pts], 255)
        
    return mask

def get_segmenter(method: str = "opencv"):
    """Segmenter factory."""
    if method == "gemini":
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            return lambda img: segment_rooftop_gemini(img, gemini_key)
        else:
            print("[Warning] GEMINI_API_KEY not set. Falling back to OpenCV heuristic.")
    return segment_rooftop_opencv
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_segmentation.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/segmentation.py tests/test_segmentation.py
git commit -m "feat: implement rooftop segmentation engine with OpenCV and Gemini Vision plugin"
```

---

### Task 6: Solar Capacity Math & Discount Engine

**Files:**
- Create: `core/solar_math.py`
- Create: `tests/test_solar_math.py`

**Interfaces:**
- Consumes: `mask_pixel_count: int`, `pixel_area_m2: float`, `discount_factor: float = 0.65`, `panel_area_m2: float = 1.7`, `panel_power_kw: float = 0.40`
- Produces: `SolarEstimate` dataclass containing `raw_roof_area`, `usable_roof_area`, `max_panels`, `system_capacity_kw`

- [ ] **Step 1: Write failing unit test for solar math module**

```python
# tests/test_solar_math.py
from core.solar_math import calculate_solar_capacity, SolarEstimate

def test_solar_capacity_calculation():
    # 4000 pixels, each pixel = 0.05 m² -> raw area = 200 m²
    # usable area = 200 * 0.65 = 130 m²
    # max panels = floor(130 / 1.7) = 76 panels
    # capacity = 76 * 0.40 = 30.4 kW
    est = calculate_solar_capacity(mask_pixel_count=4000, pixel_area_m2=0.05)
    assert isinstance(est, SolarEstimate)
    assert est.raw_roof_area == 200.0
    assert est.usable_roof_area == 130.0
    assert est.max_panels == 76
    assert est.system_capacity_kw == 30.4
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_solar_math.py -v`
Expected: FAIL

- [ ] **Step 3: Implement solar math module**

```python
# core/solar_math.py
import math
from dataclasses import dataclass

@dataclass
class SolarEstimate:
    raw_roof_area: float      # Total roof area in m²
    usable_roof_area: float   # Discounted usable area in m² (65% factor)
    max_panels: int           # Maximum count of 400W panels
    system_capacity_kw: float # Peak capacity in kW

def calculate_solar_capacity(
    mask_pixel_count: int,
    pixel_area_m2: float,
    discount_factor: float = 0.65,
    panel_area_m2: float = 1.7,
    panel_power_kw: float = 0.40
) -> SolarEstimate:
    """
    Calculates rooftop area and solar energy potential based on segmented mask.
    
    Params:
      - mask_pixel_count: Number of roof pixels in segmentation mask.
      - pixel_area_m2: Physical area represented by 1 pixel in m².
      - discount_factor: Usable fraction accounting for setbacks, vents, tilt (default 0.65).
      - panel_area_m2: Area of standard panel module (default 1.7 m²).
      - panel_power_kw: Rated power output per panel (default 0.40 kW / 400W).
    """
    raw_area = float(mask_pixel_count) * pixel_area_m2
    usable_area = raw_area * discount_factor
    max_panels = int(math.floor(usable_area / panel_area_m2)) if panel_area_m2 > 0 else 0
    system_capacity_kw = max_panels * panel_power_kw
    
    return SolarEstimate(
        raw_roof_area=round(raw_area, 2),
        usable_roof_area=round(usable_area, 2),
        max_panels=max_panels,
        system_capacity_kw=round(system_capacity_kw, 2)
    )
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_solar_math.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/solar_math.py tests/test_solar_math.py
git commit -m "feat: implement solar capacity and discount math engine"
```

---

### Task 7: Visual Verification & Annotation Layer

**Files:**
- Create: `core/visualization.py`
- Create: `tests/test_visualization.py`

**Interfaces:**
- Consumes: `base_image: PIL.Image.Image`, `mask: np.ndarray`, `address: str`, `lat: float`, `lng: float`, `resolution: float`, `estimate: SolarEstimate`
- Produces: `annotate_solar_feasibility(...) -> PIL.Image.Image`

- [ ] **Step 1: Write failing unit test for visualization layer**

```python
# tests/test_visualization.py
import numpy as np
from PIL import Image
from core.solar_math import SolarEstimate
from core.visualization import annotate_solar_feasibility

def test_annotate_solar_feasibility():
    img = Image.new("RGB", (600, 600), color=(100, 100, 100))
    mask = np.zeros((600, 600), dtype=np.uint8)
    mask[200:400, 200:400] = 255
    est = SolarEstimate(raw_roof_area=200.0, usable_roof_area=130.0, max_panels=76, system_capacity_kw=30.4)
    
    annotated = annotate_solar_feasibility(
        base_image=img,
        mask=mask,
        address="1600 Pennsylvania Ave",
        lat=38.8977,
        lng=-77.0365,
        resolution=0.237,
        estimate=est
    )
    
    assert isinstance(annotated, Image.Image)
    assert annotated.size == (600, 600)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_visualization.py -v`
Expected: FAIL

- [ ] **Step 3: Implement visualization module**

```python
# core/visualization.py
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
from core.solar_math import SolarEstimate

def annotate_solar_feasibility(
    base_image: Image.Image,
    mask: np.ndarray,
    address: str,
    lat: float,
    lng: float,
    resolution: float,
    estimate: SolarEstimate
) -> Image.Image:
    """
    Overlays a semi-transparent green mask on the segmented rooftop,
    draws roof contour outlines, and adds a HUD panel displaying key metrics.
    """
    img_np = np.array(base_image).copy()
    h, w, _ = img_np.shape
    
    # 1. Overlay semi-transparent green mask (35% opacity)
    green_overlay = img_np.copy()
    green_overlay[mask > 0] = [0, 230, 115] # Bright solar green
    cv2.addWeighted(green_overlay, 0.35, img_np, 0.65, 0, img_np)
    
    # 2. Draw roof contour outline
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(img_np, contours, -1, (0, 255, 128), 2)
    
    # Convert back to PIL for crisp text rendering
    pil_annotated = Image.fromarray(img_np)
    draw = ImageDraw.Draw(pil_annotated, "RGBA")
    
    # 3. Draw HUD box top-left
    hud_width, hud_height = 360, 175
    hud_x, hud_y = 15, 15
    
    # Semi-transparent dark box background
    draw.rectangle(
        [hud_x, hud_y, hud_x + hud_width, hud_y + hud_height],
        fill=(15, 23, 42, 220), # Dark slate background
        outline=(56, 189, 248, 255), # Cyan border
        width=2
    )
    
    # Text lines
    lines = [
        f"SOLAR FEASIBILITY ESTIMATE",
        f"Location: {lat:.4f}° N, {lng:.4f}° W",
        f"Ground Res: {resolution:.3f} m/px (z=19)",
        f"Est. Roof Area: {estimate.raw_roof_area} m²",
        f"Usable Solar Area: {estimate.usable_roof_area} m²",
        f"Max 400W Panels: {estimate.max_panels} units",
        f"Peak System Size: {estimate.system_capacity_kw} kW"
    ]
    
    y_offset = hud_y + 10
    for i, line in enumerate(lines):
        color = (56, 189, 248, 255) if i == 0 else (241, 245, 249, 255)
        draw.text((hud_x + 12, y_offset), line, fill=color)
        y_offset += 22

    # 4. Draw Scale Bar bottom-right
    scale_m = 10.0 # 10 meters scale bar
    scale_px = int(scale_m / resolution)
    sb_x2 = w - 20
    sb_x1 = sb_x2 - scale_px
    sb_y = h - 25
    
    draw.line([(sb_x1, sb_y), (sb_x2, sb_y)], fill=(255, 255, 255, 255), width=3)
    draw.line([(sb_x1, sb_y - 4), (sb_x1, sb_y + 4)], fill=(255, 255, 255, 255), width=2)
    draw.line([(sb_x2, sb_y - 4), (sb_x2, sb_y + 4)], fill=(255, 255, 255, 255), width=2)
    draw.text((sb_x1 + (scale_px // 4), sb_y - 18), f"{int(scale_m)} m", fill=(255, 255, 255, 255))
    
    return pil_annotated
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_visualization.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add core/visualization.py tests/test_visualization.py
git commit -m "feat: implement visual verification annotation layer with HUD overlay"
```

---

### Task 8: CLI Launcher & End-to-End Orchestrator

**Files:**
- Create: `solar_estimator.py`
- Create: `tests/test_e2e.py`

**Interfaces:**
- Consumes: CLI argument `address`, `--zoom`, `--segmenter`, `--output`, `--json`
- Produces: Formatted console output + `output_annotated.png`

- [ ] **Step 1: Implement solar_estimator.py CLI script**

```python
#!/usr/bin/env python3
"""
Solar Feasibility & Rooftop Area Estimator Prototype
CLI Tool to compute rooftop solar potential from street addresses.
"""

import sys
import os
import argparse
import json
import numpy as np
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

# Load environment variables
load_dotenv()

from core.geocoder import geocode_address
from core.resolution import calculate_ground_resolution, calculate_pixel_area
from core.imagery import fetch_satellite_image
from core.segmentation import get_segmenter
from core.solar_math import calculate_solar_capacity
from core.visualization import annotate_solar_feasibility

console = Console()

def run_solar_estimator(
    address: str,
    zoom: int = 19,
    segmenter_method: str = "opencv",
    output_path: str = "output_annotated.png",
    as_json: bool = False
):
    if not as_json:
        console.print(Panel.fit("[bold yellow]Solar Feasibility & Rooftop Area Estimator[/bold yellow]"))
        console.print(f"[bold cyan]Geocoding address:[/bold cyan] {address}")

    # 1. Geocoding
    lat, lng, full_address = geocode_address(address)
    
    # 2. Ground Resolution
    res = calculate_ground_resolution(lat, zoom)
    pixel_area = calculate_pixel_area(res)
    
    # 3. Satellite Imagery Ingestion
    if not as_json:
        console.print(f"[bold cyan]Fetching satellite tile...[/bold cyan] (lat: {lat:.4f}, lng: {lng:.4f}, z: {zoom})")
    tile_image = fetch_satellite_image(lat, lng, zoom=zoom, size=600)
    
    # 4. Roof Segmentation
    if not as_json:
        console.print(f"[bold cyan]Segmenting rooftop using:[/bold cyan] {segmenter_method.upper()}")
    segmenter = get_segmenter(segmenter_method)
    mask = segmenter(tile_image)
    mask_pixel_count = int(np.sum(mask > 0))
    
    # 5. Solar Capacity Math
    estimate = calculate_solar_capacity(mask_pixel_count, pixel_area)
    
    # 6. Visual Annotation
    annotated = annotate_solar_feasibility(
        base_image=tile_image,
        mask=mask,
        address=full_address,
        lat=lat,
        lng=lng,
        resolution=res,
        estimate=estimate
    )
    annotated.save(output_path)
    
    # Output formatting
    results = {
        "address": full_address,
        "coordinates": {"latitude": lat, "longitude": lng},
        "zoom": zoom,
        "ground_resolution_m_per_px": round(res, 4),
        "pixel_area_m2": round(pixel_area, 4),
        "raw_roof_area_m2": estimate.raw_roof_area,
        "usable_roof_area_m2": estimate.usable_roof_area,
        "max_400w_panels": estimate.max_panels,
        "system_capacity_kw": estimate.system_capacity_kw,
        "output_image": output_path
    }
    
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        table = Table(title="Solar Feasibility Summary", show_header=True, header_style="bold magenta")
        table.add_column("Parameter / Metric", style="cyan")
        table.add_column("Value", style="bold green")
        
        table.add_row("Full Address", full_address)
        table.add_row("Coordinates", f"{lat:.5f}° N, {lng:.5f}° W")
        table.add_row("Ground Resolution", f"{res:.3f} m / pixel")
        table.add_row("Raw Roof Area", f"{estimate.raw_roof_area:.2f} m²")
        table.add_row("Usable Solar Area (65%)", f"{estimate.usable_roof_area:.2f} m²")
        table.add_row("Max 400W Solar Panels", f"{estimate.max_panels} units")
        table.add_row("Estimated Peak Capacity", f"{estimate.system_capacity_kw:.2f} kW")
        
        console.print(table)
        console.print(f"\n[bold green]✓ Visual verification image saved to:[/bold green] [yellow]{output_path}[/yellow]")
        
    return results

def main():
    parser = argparse.ArgumentParser(description="Solar Feasibility & Rooftop Area Estimator Prototype")
    parser.add_argument("address", type=str, help="Target street address (e.g. '1600 Amphitheatre Pkwy, Mountain View, CA')")
    parser.add_argument("--zoom", type=int, default=19, help="Satellite zoom level (default: 19)")
    parser.add_argument("--segmenter", type=str, choices=["opencv", "gemini"], default="opencv", help="Roof segmentation method")
    parser.add_argument("--output", type=str, default="output_annotated.png", help="Output annotated image path")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    
    args = parser.parse_args()
    
    try:
        run_solar_estimator(
            address=args.address,
            zoom=args.zoom,
            segmenter_method=args.segmenter,
            output_path=args.output,
            as_json=args.json
        )
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Write end-to-end integration test**

```python
# tests/test_e2e.py
import os
import pytest
from solar_estimator import run_solar_estimator

def test_run_solar_estimator_e2e(tmp_path):
    out_img = str(tmp_path / "test_output.png")
    results = run_solar_estimator(
        address="1600 Amphitheatre Pkwy, Mountain View, CA",
        zoom=19,
        segmenter_method="opencv",
        output_path=out_img,
        as_json=True
    )
    
    assert "coordinates" in results
    assert results["raw_roof_area_m2"] > 0
    assert results["usable_roof_area_m2"] > 0
    assert results["max_400w_panels"] > 0
    assert results["system_capacity_kw"] > 0
    assert os.path.exists(out_img)
```

- [ ] **Step 3: Run all pytest tests**

Run: `pytest -v`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
git add solar_estimator.py tests/test_e2e.py
git commit -m "feat: implement CLI launcher and end-to-end solar estimator pipeline"
```

---

### Task 9: Verification, Demo Execution & Git Push

**Files:**
- Create: `output_annotated.png` (generated by running CLI)

**Interfaces:**
- Consumes: Real address run
- Produces: Verified executable and committed code pushed to remote repository

- [ ] **Step 1: Execute solar_estimator.py CLI on sample address**

Run: `python solar_estimator.py "1600 Amphitheatre Pkwy, Mountain View, CA"`
Expected: Clean Rich table display and `output_annotated.png` created.

- [ ] **Step 2: Run pytest test suite to ensure 100% pass rate**

Run: `pytest -v`
Expected: PASS

- [ ] **Step 3: Commit and Push to remote repository**

```bash
git add output_annotated.png
git commit -m "feat: generate visual verification sample output_annotated.png"
git push origin main
```
