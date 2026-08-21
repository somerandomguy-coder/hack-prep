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
