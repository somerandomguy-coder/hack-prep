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
