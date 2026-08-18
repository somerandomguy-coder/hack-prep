/**
 * Main Application Controller for Mekong Delta GeoAI Salinity Engine
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Starting Mekong Delta GeoAI App Initialization...");

  let apiRecords = [];
  let selectedStation = null;
  let forecastChart = null;
  let currentHorizon = 1; // t+1D, t+3D, t+7D
  let isPlaying = false;
  let playInterval = null;

  // Initialize Map
  const salinityMap = new SalinityMap('map', (stationFeature, salVal) => {
    onStationSelected(stationFeature, salVal);
  });
  window.salinityMap = salinityMap;
  salinityMap.initMap();
  await salinityMap.loadGeoData();

  // Load API Data
  apiRecords = await window.dataAPI.fetchAllData();
  console.log(`Loaded ${apiRecords.length} API records.`);

  // Process Hydrodynamic Physics for current date (index 75: Peak Dry Season March 15)
  let currentIndex = 75;
  updateAppSnapshot(currentIndex);

  // Initialize Forecast Chart
  initForecastChart();

  // Select default station (ST01: Trà Vinh Station)
  if (salinityMap.stationsGeoJSON && salinityMap.stationsGeoJSON.features.length > 0) {
    const defaultSt = salinityMap.stationsGeoJSON.features[0];
    const defaultSal = window.hydrophysics.calculateSalinity(
      apiRecords[currentIndex].Q || 1850,
      apiRecords[currentIndex].tideHeightH || 3.85,
      defaultSt.properties.distance_inland_km
    );
    onStationSelected(defaultSt, defaultSal);
  }

  // -------------------------------------------------------------------------
  // CORE SNAPSHOT UPDATE FUNCTION
  // -------------------------------------------------------------------------
  function updateAppSnapshot(index, scenarioOverride = null) {
    if (!apiRecords || apiRecords.length === 0) return;
    const currentRec = apiRecords[index];

    // Upstream Q Flow and Vũng Tàu Tide H
    const Q = scenarioOverride ? scenarioOverride.Q : (currentRec.Q || window.hydrophysics.estimateUpstreamDischarge(index, apiRecords.length));
    const H = scenarioOverride ? scenarioOverride.H : currentRec.tideHeightH;
    const incision = scenarioOverride ? scenarioOverride.incision : 2.0;

    currentRec.Q = Q;
    currentRec.H = H;

    const RM = window.hydrophysics.calculateMomentumRatio(Q, H);

    // Calculate salinity for all stations
    const stationSalMap = new Map();
    let maxSal = 0;

    if (salinityMap.stationsGeoJSON) {
      salinityMap.stationsGeoJSON.features.forEach((st) => {
        const dist = st.properties.distance_inland_km;
        const sal = window.hydrophysics.calculateSalinity(Q, H, dist, currentRec.windSpeed, incision);
        stationSalMap.set(st.properties.id, sal);
        if (sal > maxSal) maxSal = sal;
      });
    }

    // Update KPIs
    document.getElementById('kpi-peak-salinity').innerHTML = `${maxSal.toFixed(1)} <small>g/L</small>`;
    document.getElementById('kpi-discharge').innerHTML = `${Math.round(Q).toLocaleString()} <small>m³/s</small>`;
    document.getElementById('kpi-tide').innerHTML = `${H.toFixed(2)} <small>m</small>`;
    document.getElementById('kpi-rm').innerHTML = `${RM.toFixed(3)} <small>Q/H</small>`;

    // Update Map
    salinityMap.updateSalinityValues(stationSalMap);

    // Update Station Table Leaderboard
    renderStationLeaderboard(stationSalMap);

    // Update Alert Center
    renderAlertCenter(stationSalMap, Q, H);

    // Update Chart if station selected
    if (selectedStation) {
      updateForecastChart(selectedStation, scenarioOverride);
    }
  }

  // -------------------------------------------------------------------------
  // STATION LEADERBOARD TABLE
  // -------------------------------------------------------------------------
  function renderStationLeaderboard(salMap) {
    const tbody = document.getElementById('station-table-body');
    if (!tbody || !salinityMap.stationsGeoJSON) return;

    const rows = [];
    salinityMap.stationsGeoJSON.features.forEach((st) => {
      const p = st.properties;
      const sal = salMap.get(p.id) || p.base_salinity;
      const f3d = window.hydrophysics.calculateSalinity(sal, 3.8, p.distance_inland_km);

      let pillClass = 'sal-safe';
      if (sal >= 4.0) pillClass = 'sal-danger';
      else if (sal >= 1.0) pillClass = 'sal-warn';

      rows.push({
        id: p.id,
        name: p.name,
        river: p.river,
        sal: sal,
        f3d: f3d,
        pillClass: pillClass
      });
    });

    rows.sort((a, b) => b.sal - a.sal);

    tbody.innerHTML = rows.map(r => `
      <tr onclick="window.salinityMap.selectStation('${r.id}')">
        <td><strong>${r.name}</strong></td>
        <td style="color:var(--text-muted);">${r.river}</td>
        <td><span class="sal-pill ${r.pillClass}">${r.sal.toFixed(1)} g/L</span></td>
        <td style="color:var(--text-muted);">${r.f3d.toFixed(1)}</td>
      </tr>
    `).join('');
  }

  // -------------------------------------------------------------------------
  // OPERATIONAL ALERT CENTER
  // -------------------------------------------------------------------------
  function renderAlertCenter(salMap, Q, H) {
    const container = document.getElementById('alert-list-container');
    const badge = document.getElementById('alert-count');
    if (!container) return;

    const alerts = [];

    // Check critical stations
    salMap.forEach((sal, stId) => {
      if (sal >= 4.0) {
        const st = salinityMap.stationsGeoJSON.features.find(f => f.properties.id === stId);
        if (st) {
          alerts.push({
            type: 'danger',
            title: `Emergency Gate Shutdown: ${st.properties.name}`,
            desc: `Salinity reached ${sal.toFixed(1)} g/L (exceeds 4.0 g/L legal limit). Order Ba Lai / Huống Mỹ sluice gates fully shut to protect agricultural soil.`
          });
        }
      } else if (sal >= 1.0) {
        const st = salinityMap.stationsGeoJSON.features.find(f => f.properties.id === stId);
        if (st) {
          alerts.push({
            type: 'warn',
            title: `Drinking Water Warning: ${st.properties.name}`,
            desc: `Salinity at ${sal.toFixed(1)} g/L. Municipal water treatment intake warnings issued for local fruit orchards (durian/rambutan).`
          });
        }
      }
    });

    if (Q < 2000) {
      alerts.unshift({
        type: 'danger',
        title: 'Upstream Flow Crisis (Q < 2000 m³/s)',
        desc: `Freshwater flow dropped to ${Math.round(Q)} m³/s. Ocean tides are dominating estuarine channels.`
      });
    }

    if (badge) badge.innerText = `${alerts.length} Active`;

    container.innerHTML = alerts.slice(0, 4).map(a => `
      <div class="alert-item ${a.type}">
        <div class="alert-item-title">
          <span>${a.title}</span>
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="alert-item-desc">${a.desc}</div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------------------
  // FORECAST CHART CONTROLLER (CHART.JS)
  // -------------------------------------------------------------------------
  function initForecastChart() {
    const ctx = document.getElementById('salinityForecastChart').getContext('2d');
    forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Historical Observed (g/L)',
            data: [],
            borderColor: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'AI Forecast Trajectory (g/L)',
            data: [],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderDash: [5, 5],
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: '1.0 g/L Drinking Limit',
            data: [],
            borderColor: '#f59e0b',
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0
          },
          {
            label: '4.0 g/L Gate Shutdown',
            data: [],
            borderColor: '#ef4444',
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { size: 10 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } },
            title: { display: true, text: 'Salinity (g/L)', color: '#94a3b8' }
          }
        }
      }
    });
  }

  function onStationSelected(stationFeature, salVal) {
    selectedStation = stationFeature;
    const p = stationFeature.properties;

    document.getElementById('chart-station-name').innerText = `${p.name} (${p.river})`;
    document.getElementById('chart-station-sub').innerText = `Distance from sea: ${p.distance_inland_km} km | Province: ${p.province}`;

    updateForecastChart(stationFeature);
  }

  function updateForecastChart(stationFeature, scenarioOverride = null) {
    if (!forecastChart || !apiRecords.length) return;

    const slicedRecords = apiRecords.slice(0, currentIndex + 1);
    const trajectory = window.hydrophysics.predictTrajectory(slicedRecords, stationFeature, scenarioOverride);

    const labels = trajectory.map(t => t.date.slice(5));
    const histData = trajectory.map(t => t.type === 'historical' ? t.salinity : null);
    const foreData = trajectory.map(t => t.type === 'forecast' ? t.salinity : null);
    
    // Connect historical to forecast line
    const lastHistIdx = histData.lastIndexOf(trajectory.find(t => t.type === 'historical')?.salinity);
    if (lastHistIdx !== -1 && foreData[lastHistIdx] === null) {
      foreData[lastHistIdx] = histData[lastHistIdx];
    }

    forecastChart.data.labels = labels;
    forecastChart.data.datasets[0].data = histData;
    forecastChart.data.datasets[1].data = foreData;
    forecastChart.data.datasets[2].data = new Array(labels.length).fill(1.0);
    forecastChart.data.datasets[3].data = new Array(labels.length).fill(4.0);

    forecastChart.update();
  }

  // -------------------------------------------------------------------------
  // HYDRAULIC "WHAT-IF" SCENARIO SIMULATOR
  // -------------------------------------------------------------------------
  const drawerToggle = document.getElementById('drawer-toggle-btn');
  const drawer = document.getElementById('scenario-drawer');
  if (drawerToggle && drawer) {
    drawerToggle.addEventListener('click', () => {
      drawer.classList.toggle('collapsed');
    });
  }

  const simQSlider = document.getElementById('sim-q-slider');
  const simHSlider = document.getElementById('sim-h-slider');
  const simIncisionSlider = document.getElementById('sim-incision-slider');

  function runSimulatorUpdate() {
    const qVal = parseFloat(simQSlider.value);
    const hVal = parseFloat(simHSlider.value);
    const incisionVal = parseFloat(simIncisionSlider.value);

    document.getElementById('val-sim-q').innerText = `${qVal.toLocaleString()} m³/s`;
    document.getElementById('val-sim-h').innerText = `${hVal.toFixed(1)} m`;
    document.getElementById('val-sim-incision').innerText = `${incisionVal.toFixed(1)} m`;

    const res = window.hydrophysics.simulateScenario(qVal, hVal, incisionVal);
    document.getElementById('sim-res-rm').innerText = res.RM;
    document.getElementById('sim-res-distance').innerText = `${res.penetrationKm} km inland`;
    document.getElementById('sim-res-area').innerText = `${res.affectedAreaHa} ha`;

    // Apply live scenario snapshot to map & chart
    updateAppSnapshot(currentIndex, { Q: qVal, H: hVal, incision: incisionVal });
  }

  if (simQSlider) simQSlider.addEventListener('input', runSimulatorUpdate);
  if (simHSlider) simHSlider.addEventListener('input', runSimulatorUpdate);
  if (simIncisionSlider) simIncisionSlider.addEventListener('input', runSimulatorUpdate);

  // -------------------------------------------------------------------------
  // TIMELINE PLAYBACK PLAYER
  // -------------------------------------------------------------------------
  const timelineSlider = document.getElementById('timeline-slider');
  const dateDisplay = document.getElementById('timeline-date-display');
  const playBtn = document.getElementById('play-pause-btn');

  if (timelineSlider) {
    timelineSlider.addEventListener('input', (e) => {
      currentIndex = parseInt(e.target.value);
      if (apiRecords[currentIndex]) {
        dateDisplay.innerText = apiRecords[currentIndex].date;
        updateAppSnapshot(currentIndex);
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        playInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % apiRecords.length;
          timelineSlider.value = currentIndex;
          dateDisplay.innerText = apiRecords[currentIndex].date;
          updateAppSnapshot(currentIndex);
        }, 300);
      } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        clearInterval(playInterval);
      }
    });
  }

  // Toolbar layer toggle buttons
  document.getElementById('btn-layer-estuary')?.addEventListener('click', function() {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    salinityMap.setLayerMode('estuary');
  });

  document.getElementById('btn-layer-satellite')?.addEventListener('click', function() {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    salinityMap.setLayerMode('satellite');
  });

  document.getElementById('province-filter')?.addEventListener('change', (e) => {
    salinityMap.renderStations(e.target.value);
  });

  document.getElementById('refresh-data-btn')?.addEventListener('click', async () => {
    console.log("Refreshing live APIs...");
    apiRecords = await window.dataAPI.fetchAllData();
    updateAppSnapshot(currentIndex);
  });
});
