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
