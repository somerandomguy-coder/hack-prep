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
