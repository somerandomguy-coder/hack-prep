import re
import os
import requests
from geopy.geocoders import Nominatim

def parse_coordinates(query: str) -> tuple[float, float] | None:
    """
    Tries to parse string as lat, lng coordinates.
    Supports formats:
    - "-33.72951, 150.99442"
    - "33.72951 S, 150.99442 E"
    - "-33.72951 150.99442"
    """
    if not query:
        return None
    query = query.strip()
    
    # 1. Decimal coordinates: -33.72951, 150.99442 or -33.72951 150.99442
    match = re.match(r"^([+-]?\d+\.?\d*)\s*[\s,]\s*([+-]?\d+\.?\d*)$", query)
    if match:
        try:
            lat, lng = float(match.group(1)), float(match.group(2))
            if -90 <= lat <= 90 and -180 <= lng <= 180:
                return lat, lng
        except ValueError:
            pass
            
    # 2. Coordinates with N/S E/W suffixes: 33.72951 S, 150.99442 E
    match_dir = re.match(r"^(\d+\.?\d*)\s*([NS])\s*[\s,]\s*(\d+\.?\d*)\s*([EW])$", query, re.IGNORECASE)
    if match_dir:
        try:
            lat = float(match_dir.group(1)) * (-1 if match_dir.group(2).upper() == "S" else 1)
            lng = float(match_dir.group(3)) * (-1 if match_dir.group(4).upper() == "W" else 1)
            if -90 <= lat <= 90 and -180 <= lng <= 180:
                return lat, lng
        except ValueError:
            pass
            
    return None

def geocode_address(address: str, user_agent: str = "SolarEstimator/1.0") -> tuple[float, float, str]:
    """
    Geocodes an address string OR raw coordinate string to (latitude, longitude, display_name).
    """
    geolocator = Nominatim(user_agent=user_agent, timeout=10)
    
    # Check if input is direct raw coordinates
    parsed = parse_coordinates(address)
    if parsed:
        lat, lng = parsed
        # Reverse geocode for clean address display
        try:
            loc = geolocator.reverse((lat, lng), timeout=5)
            display_name = loc.address if loc else f"Coordinates ({lat:.5f}, {lng:.5f})"
        except Exception:
            display_name = f"Coordinates ({lat:.5f}, {lng:.5f})"
        return lat, lng, display_name
        
    # Check if Google Maps API key is configured
    google_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if google_key:
        try:
            url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(address)}&key={google_key}"
            resp = requests.get(url, timeout=10)
            data = resp.json()
            if data.get("status") == "OK" and data.get("results"):
                res = data["results"][0]
                loc = res["geometry"]["location"]
                return float(loc["lat"]), float(loc["lng"]), str(res["formatted_address"])
        except Exception as e:
            print(f"[Warning] Google Geocoding API failed ({e}), falling back to Nominatim.")

    # Fallback to Nominatim
    location = geolocator.geocode(address)
    if not location:
        raise ValueError(f"Could not geocode address: '{address}'")
    return float(location.latitude), float(location.longitude), str(location.address)

