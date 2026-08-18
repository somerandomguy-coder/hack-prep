/**
 * Interactive Leaflet Map Visualizer for Mekong Delta Salinity Intrusion
 */

class SalinityMap {
  constructor(mapElementId, onStationSelectCallback) {
    this.mapId = mapElementId;
    this.onStationSelect = onStationSelectCallback;
    this.map = null;
    this.stationLayerGroup = L.layerGroup();
    this.riverLayerGroup = L.layerGroup();
    this.satelliteLayerGroup = L.layerGroup();
    
    this.stationsGeoJSON = null;
    this.riversGeoJSON = null;
    this.currentSalinityMap = new Map();
    this.activeLayer = 'estuary';
  }

  initMap() {
    console.log("Initializing Leaflet Mekong Delta Map...");
    
    // Centered on Mekong Delta (Ben Tre / Tra Vinh / Soc Trang core region)
    this.map = L.map(this.mapId, {
      center: [10.03, 105.78],
      zoom: 9,
      minZoom: 8,
      maxZoom: 13,
      zoomControl: false
    });

    // Add custom dark basemap tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Add layer groups
    this.riverLayerGroup.addTo(this.map);
    this.stationLayerGroup.addTo(this.map);
  }

  async loadGeoData() {
    try {
      const [stResp, rivResp] = await Promise.all([
        fetch('data/stations.json').then(r => r.json()),
        fetch('data/rivers.json').then(r => r.json())
      ]);

      this.stationsGeoJSON = stResp;
      this.riversGeoJSON = rivResp;

      console.log("Loaded GeoJSON:", stResp.features.length, "stations,", rivResp.features.length, "river branches.");
    } catch (err) {
      console.error("Error loading GeoJSON data:", err);
    }
  }

  updateSalinityValues(salinityMap) {
    this.currentSalinityMap = salinityMap;
    this.renderStations();
    this.renderRivers();
  }

  renderStations(provinceFilter = 'ALL') {
    this.stationLayerGroup.clearLayers();
    if (!this.stationsGeoJSON) return;

    this.stationsGeoJSON.features.forEach((feature) => {
      const props = feature.properties;
      if (provinceFilter !== 'ALL' && props.province !== provinceFilter) return;

      const coords = feature.geometry.coordinates; // [lng, lat]
      const latLng = [coords[1], coords[0]];

      const currentSal = this.currentSalinityMap.get(props.id) || props.base_salinity;
      
      // Determine Status & Color
      let statusClass = 'sal-safe';
      let pinColor = '#10b981'; // Green
      if (currentSal >= 4.0) {
        statusClass = 'sal-danger';
        pinColor = '#ef4444'; // Red
      } else if (currentSal >= 1.0) {
        statusClass = 'sal-warn';
        pinColor = '#f59e0b'; // Yellow
      }

      // Create Custom HTML Marker Icon
      const isCritical = currentSal >= 4.0;
      const markerHtml = `
        <div class="custom-station-pin ${isCritical ? 'critical-pulse' : ''}" style="background-color: ${pinColor};">
          <span class="pin-value">${currentSal.toFixed(1)}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'station-div-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(latLng, { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="station-popup">
          <h4>${props.name}</h4>
          <div class="popup-sub">${props.river} | ${props.province}</div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
          <div class="popup-metric">
            <span>Distance from Sea:</span> <strong>${props.distance_inland_km} km</strong>
          </div>
          <div class="popup-metric">
            <span>Current Salinity:</span> <strong class="${statusClass}">${currentSal.toFixed(2)} g/L</strong>
          </div>
          <div class="popup-metric">
            <span>Critical Threshold:</span> <strong>${props.critical_threshold} g/L</strong>
          </div>
          <button class="btn btn-primary btn-sm popup-select-btn" onclick="window.salinityMap.selectStation('${props.id}')" style="width:100%; margin-top:10px;">
            <i class="fa-solid fa-chart-line"></i> View Forecast Chart
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (this.onStationSelect) {
          this.onStationSelect(feature, currentSal);
        }
      });

      this.stationLayerGroup.addLayer(marker);
    });
  }

  renderRivers() {
    this.riverLayerGroup.clearLayers();
    if (!this.riversGeoJSON) return;

    this.riversGeoJSON.features.forEach((feature) => {
      const coords = feature.geometry.coordinates.map(c => [c[1], c[0]]);
      
      // River reach Polyline
      const polyline = L.polyline(coords, {
        color: '#00f2fe',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.bindTooltip(`River Branch: ${feature.properties.name}`, { sticky: true });
      this.riverLayerGroup.addLayer(polyline);
    });
  }

  selectStation(stationId) {
    if (!this.stationsGeoJSON) return;
    const stFeature = this.stationsGeoJSON.features.find(f => f.properties.id === stationId);
    if (stFeature) {
      const coords = stFeature.geometry.coordinates;
      this.map.flyTo([coords[1], coords[0]], 11, { duration: 1.2 });
      const currentSal = this.currentSalinityMap.get(stationId) || stFeature.properties.base_salinity;
      if (this.onStationSelect) {
        this.onStationSelect(stFeature, currentSal);
      }
    }
  }

  setLayerMode(mode) {
    this.activeLayer = mode;
    if (mode === 'satellite') {
      console.log("Enabled 10m Satellite Canal Overlay Mode");
      this.map.setZoom(11);
    } else {
      this.map.setZoom(9);
    }
  }
}

// Marker Pins CSS injection
const mapPinStyles = document.createElement('style');
mapPinStyles.innerHTML = `
  .station-div-icon {
    background: transparent;
    border: none;
  }
  .custom-station-pin {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px rgba(0,0,0,0.6);
    color: #0b0f19;
    font-weight: 800;
    font-size: 0.72rem;
    font-family: 'Outfit', sans-serif;
    transition: transform 0.2s ease;
  }
  .custom-station-pin:hover {
    transform: scale(1.25);
    z-index: 999;
  }
  .critical-pulse {
    animation: markerPulse 1.5s infinite;
  }
  @keyframes markerPulse {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8); }
    70% { box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
`;
document.head.appendChild(mapPinStyles);

window.SalinityMap = SalinityMap;
