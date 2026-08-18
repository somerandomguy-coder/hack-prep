# Mekong Delta Salinity GeoAI Forecasting & Interactive Map Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a state-of-the-art interactive GeoAI Salinity Intrusion Dashboard & Map Application for the Vietnamese Mekong Delta, featuring real-time public API ingestion, Leaflet.js river estuary heatmaps, 44 station predictors, a physics-informed scenario simulator, and an agricultural early warning system.

**Architecture:** A modern single-page application (SPA) backed by Vanilla JavaScript (ES6+), Leaflet.js, and Chart.js, served via a local Python/Node HTTP server. Integrates live Open-Meteo APIs for dry season weather and Vũng Tàu coastal tide heights, computing $R_M = Q / H_{\text{tide}}$ momentum ratios and lag features in real time.

**Tech Stack:** HTML5, Vanilla CSS3 (Glassmorphism design, dark mode, Google Fonts Outfit/Inter), Leaflet.js (Map visualizer), Chart.js (Time-series forecaster), Open-Meteo REST APIs (Weather & Marine tide data), Python `http.server` / Node.js.

## Global Constraints

- Design: Dark mode theme (`#0b0f19`), glassmorphism cards, glowing status indicators, non-generic curated palette.
- Responsiveness: Fully mobile/desktop responsive layout.
- Performance: Smooth 60fps map rendering, interactive time slider playback.
- No placeholders: All map stations, coordinates, equations, APIs, and alerts must be fully functional.

---

### Task 1: Project Setup & GeoJSON River Network / Station Data Architecture

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\data\stations.json`
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\data\rivers.json`

**Interfaces:**
- Consumes: Geo-coordinates of VMD monitoring stations and main river branches (Cổ Chiên, Hàm Luông, Cung Hầu, Định An, Mỹ Tho).
- Produces: Structured GeoJSON data format consumed by Leaflet map renderer.

- [x] **Step 1: Write Station & River GeoJSON dataset**
- [x] **Step 2: Verify JSON syntax & coordinate validity**

---

### Task 2: High-End UI Layout & Glassmorphism Design System (`index.html` & `styles.css`)

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\index.html`
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\styles.css`

**Interfaces:**
- Consumes: Google Fonts (Outfit, Inter), FontAwesome, Leaflet CSS, Chart.js.
- Produces: Responsive HTML5 dashboard shell with sidebar stats, main map viewport, forecast chart panel, scenario simulator drawer, and alert center.

- [x] **Step 1: Build semantic HTML structure with navigation header, KPI cards, Leaflet map container, chart modal, and interactive sliders**
- [x] **Step 2: Implement styling design system in `styles.css` with CSS variables, dark glassmorphism, glowing badges, map overlays, custom slider controls, and smooth transition animations**

---

### Task 3: Real-Time API Data Ingestion & Physics Engine (`js/api.js` & `js/physics.js`)

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\js\api.js`
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\js\physics.js`

**Interfaces:**
- Consumes: Open-Meteo Weather API (`latitude=10.23, longitude=106.37`) and Marine API (`latitude=10.35, longitude=107.08`).
- Produces: Real-time & historical daily data frames with physics ratio $R_M = Q / H_{\text{tide}}$, lag features, and 1-day/3-day/7-day forecast trajectories.

- [x] **Step 1: Write Open-Meteo API fetching logic with robust fallback cache for offline resiliency**
- [x] **Step 2: Write physics engine to calculate $R_M$, estuarine salinity exponential decay function, lag feature generation, and XGBoost/RF approximation model in JavaScript**

---

### Task 4: Interactive Leaflet Map Visualizer & Station Explorer (`js/map.js`)

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\js\map.js`

**Interfaces:**
- Consumes: GeoJSON river paths and station data, calculated station salinity levels.
- Produces: Dynamic Leaflet map with colored river heat gradient lines, station markers, animated tide pulse effects, downscaled satellite canal grid overlay, and popup details.

- [x] **Step 1: Initialize Leaflet map centered on Mekong Delta (`10.03° N, 105.78° E`, zoom level 9)**
- [x] **Step 2: Render interactive station markers with color-coded badges (<1.0g/L green, 1.0-4.0g/L yellow, >4.0g/L red)**
- [x] **Step 3: Render river reach polylines with salinity gradient color maps and satellite canal layer toggle**

---

### Task 5: Time-Series Forecast Charts, What-If Scenario Simulator & Alert Center (`js/app.js`)

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\js\app.js`

**Interfaces:**
- Consumes: API data, physics engine, map state, slider input values.
- Produces: Integrated Chart.js time-series plots, live scenario updating ($Q$ flow vs $H_{\text{tide}}$ sliders), automated sluice gate alert notifications, and historical playback controller.

- [x] **Step 1: Initialize Chart.js graph displaying 14-day historical salinity + 7-day forecast with 1.0g/L and 4.0g/L threshold lines**
- [x] **Step 2: Implement "What-If" hydraulic scenario simulator sliders updating predictions in real time**
- [x] **Step 3: Implement Early Warning Alert Center generating sluice gate closure alerts and farmer recommendations**
- [x] **Step 4: Wire timeline player for 2024 dry season historical drought playback**

---

### Task 6: Local Server Execution, Testing & Verification

**Files:**
- Create: `c:\Users\Nam\Projects\hackathon\DBSCL\server.py`

**Interfaces:**
- Serves application on `http://localhost:8000`

- [x] **Step 1: Create lightweight Python HTTP server script with CORS headers**
- [x] **Step 2: Run local server and verify web app in browser**
- [x] **Step 3: Conduct visual and functional validation**
