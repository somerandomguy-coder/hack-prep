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
