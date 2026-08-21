import pytest
from core.geocoder import geocode_address, parse_coordinates

def test_parse_coordinates():
    assert parse_coordinates("-33.72951, 150.99442") == (-33.72951, 150.99442)
    assert parse_coordinates("33.72951 S, 150.99442 E") == (-33.72951, 150.99442)
    assert parse_coordinates("invalid address") is None

def test_geocode_address():
    lat, lng, full_address = geocode_address("University of Wollongong, Northfields Ave, Wollongong NSW 2522, Australia")
    assert pytest.approx(lat, abs=0.05) == -34.4081
    assert pytest.approx(lng, abs=0.05) == 150.8784
    assert "Wollongong" in full_address

def test_geocode_direct_coordinates():
    lat, lng, full_address = geocode_address("-33.72951, 150.99442")
    assert pytest.approx(lat, abs=0.001) == -33.72951
    assert pytest.approx(lng, abs=0.001) == 150.99442
    assert "Fishburn" in full_address or "Australia" in full_address
