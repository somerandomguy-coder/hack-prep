import pytest
from core.geocoder import geocode_address

def test_geocode_address():
    lat, lng, full_address = geocode_address("1600 Pennsylvania Ave NW, Washington, DC")
    assert pytest.approx(lat, abs=0.05) == 38.8977
    assert pytest.approx(lng, abs=0.05) == -77.0365
    assert "Washington" in full_address
