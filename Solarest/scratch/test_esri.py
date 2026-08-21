import math
import requests
from PIL import Image
import io

def latlng_to_tile(lat, lng, zoom):
    n = 2 ** zoom
    rad_lat = math.radians(lat)
    xtile = int((lng + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(rad_lat) + (1.0 / math.cos(rad_lat))) / math.pi) / 2.0 * n)
    return xtile, ytile

# Wollongong coords
lat, lng = -34.4081, 150.8784
x, y = latlng_to_tile(lat, lng, 19)
print(f"XYZ tile for Wollongong: z=19, x={x}, y={y}")

url_xyz = f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/19/{y}/{x}"
resp = requests.get(url_xyz, headers={"User-Agent": "Mozilla/5.0"})
print(f"XYZ tile response status: {resp.status_code}")
if resp.status_code == 200:
    img = Image.open(io.BytesIO(resp.content))
    print(f"XYZ Image size: {img.size}")
