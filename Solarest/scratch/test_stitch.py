import math
import requests
import io
from PIL import Image

def latlng_to_global_pixels(lat: float, lng: float, zoom: int) -> tuple[float, float]:
    n = 2 ** zoom
    rad_lat = math.radians(lat)
    px = ((lng + 180.0) / 360.0) * n * 256.0
    py = (1.0 - math.log(math.tan(rad_lat) + (1.0 / math.cos(rad_lat))) / math.pi) / 2.0 * n * 256.0
    return px, py

def fetch_esri_tile_grid(lat: float, lng: float, zoom: int = 19, size: int = 600) -> Image.Image:
    center_px_x, center_px_y = latlng_to_global_pixels(lat, lng, zoom)
    
    half_size = size / 2.0
    crop_x1 = center_px_x - half_size
    crop_y1 = center_px_y - half_size
    crop_x2 = center_px_x + half_size
    crop_y2 = center_px_y + half_size
    
    tile_x1 = int(math.floor(crop_x1 / 256.0))
    tile_x2 = int(math.floor(crop_x2 / 256.0))
    tile_y1 = int(math.floor(crop_y1 / 256.0))
    tile_y2 = int(math.floor(crop_y2 / 256.0))
    
    grid_w = (tile_x2 - tile_x1 + 1) * 256
    grid_h = (tile_y2 - tile_y1 + 1) * 256
    canvas = Image.new("RGB", (grid_w, grid_h))
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    session = requests.Session()
    
    for tx in range(tile_x1, tile_x2 + 1):
        for ty in range(tile_y1, tile_y2 + 1):
            url = f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{zoom}/{ty}/{tx}"
            resp = session.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                tile_img = Image.open(io.BytesIO(resp.content)).convert("RGB")
            else:
                tile_img = Image.new("RGB", (256, 256), color=(50, 50, 50))
            
            pos_x = (tx - tile_x1) * 256
            pos_y = (ty - tile_y1) * 256
            canvas.paste(tile_img, (pos_x, pos_y))
            
    # Crop exact 600x600 area
    offset_x = int(round(crop_x1 - (tile_x1 * 256)))
    offset_y = int(round(crop_y1 - (tile_y1 * 256)))
    
    cropped = canvas.crop((offset_x, offset_y, offset_x + size, offset_y + size))
    return cropped

# Test Wollongong
lat, lng = -34.4081, 150.8784
img = fetch_esri_tile_grid(lat, lng, zoom=19, size=600)
print(f"Successfully fetched stitched image for Wollongong! Size: {img.size}")
img.save("scratch/wollongong_tile.png")
