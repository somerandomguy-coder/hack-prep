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
