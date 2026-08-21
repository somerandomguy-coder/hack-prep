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
