import pytest
from core.geocoder import geocode_address

def test_geocode_address():
    lat, lng, full_address = geocode_address("University of Wollongong, Northfields Ave, Wollongong NSW 2522, Australia")
    assert pytest.approx(lat, abs=0.05) == -34.4081
    assert pytest.approx(lng, abs=0.05) == 150.8784
    assert "Wollongong" in full_address
