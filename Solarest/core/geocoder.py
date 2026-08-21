import requests
from geopy.geocoders import Nominatim

def geocode_address(address: str, user_agent: str = "SolarEstimator/1.0") -> tuple[float, float, str]:
    """
    Geocodes an address string to (latitude, longitude, display_name).
    Uses Nominatim with a custom User-Agent to respect service policy.
    """
    geolocator = Nominatim(user_agent=user_agent, timeout=10)
    location = geolocator.geocode(address)
    if not location:
        raise ValueError(f"Could not geocode address: '{address}'")
    return float(location.latitude), float(location.longitude), str(location.address)
