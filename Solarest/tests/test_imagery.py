import pytest
from PIL import Image
from core.imagery import fetch_esri_satellite_tile

def test_fetch_esri_satellite_tile():
    # Washington DC coords
    img = fetch_esri_satellite_tile(38.8977, -77.0365, zoom=19, size=600)
    assert isinstance(img, Image.Image)
    assert img.size == (600, 600)
