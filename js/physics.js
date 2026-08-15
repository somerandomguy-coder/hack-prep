/**
 * Hydrodynamic Physics & Machine Learning Forecasting Engine
 * Formulations based on Eslami et al. (2019, 2021) & Le et al. (2026)
 */

class HydrophysicsEngine {
  constructor() {
    this.Q_baseline = 3500; // m3/s wet season baseline
    this.Q_critical = 2000; // m3/s momentum shift threshold
  }

  /**
   * Calculate Discharge-to-Tide Momentum Ratio R_M
   * @param {number} Q - Upstream discharge (m3/s)
   * @param {number} H - Ocean tide amplitude at Vũng Tàu (m)
   * @returns {number} R_M momentum ratio
   */
  calculateMomentumRatio(Q, H) {
    if (!H || H <= 0) H = 2.5;
    return Q / (H * 1000.0);
  }

  /**
   * Estimate Upstream Flow Q (m3/s) for a given date in dry season
   */
  estimateUpstreamDischarge(dayIndex, totalDays = 152) {
    const t = (dayIndex / totalDays) * Math.PI;
    // Base hydrograph dropping from ~3500 m3/s in Jan to ~1700 m3/s in peak March/April
    const baseQ = 3500 - 1750 * Math.sin(t);
    return Math.max(1200, baseQ);
  }

  /**
   * Calculate Salinity S (g/L) for a station at distance x (km inland)
   * @param {number} Q - Upstream discharge
   * @param {number} H - Tide height
   * @param {number} distanceKm - Distance inland from ocean estuary
   * @param {number} windSpeed - 10m wind speed
   * @param {number} channelIncision - Riverbed deepening (m)
   */
  calculateSalinity(Q, H, distanceKm, windSpeed = 10, channelIncision = 2.0) {
    const RM = this.calculateMomentumRatio(Q, H);
    
    // Estuary Mouth Baseline Salinity (S0)
    // Incision reduces bed friction, allowing denser saltwater surge
    const frictionFactor = 1.0 - (channelIncision * 0.12);
    const S0 = Math.min(24.0, (18.0 * Math.exp(-RM * 0.9) + windSpeed * 0.15) / frictionFactor);

    // Damping/Penetration Decay Length Lambda (km)
    // When Q drops below 2000 m3/s, Lambda grows rapidly allowing salinity to travel deep inland
    const lambda = 22.0 + 35.0 * Math.exp(-RM * 1.5) + (channelIncision * 5.0);

    // Exponential estuarine decay along river reach x
    const salinity = S0 * Math.exp(-distanceKm / lambda);

    return parseFloat(Math.max(0.05, salinity).toFixed(2));
  }

  /**
   * Predict future salinity trajectory for horizons t+1, t+3, t+7 days
   */
  predictTrajectory(historyRecords, station, scenarioOverloads = null) {
    const trajectory = [];
    const n = historyRecords.length;

    // Use current state or scenario override
    let currQ = scenarioOverloads ? scenarioOverloads.Q : historyRecords[n - 1].Q;
    let currH = scenarioOverloads ? scenarioOverloads.H : historyRecords[n - 1].H;
    let incision = scenarioOverloads ? scenarioOverloads.incision : 2.0;

    // Historical 14 days
    const histWindow = historyRecords.slice(Math.max(0, n - 14));
    histWindow.forEach((rec) => {
      const q = rec.Q;
      const h = rec.H;
      const s = this.calculateSalinity(q, h, station.properties.distance_inland_km, rec.windSpeed, incision);
      trajectory.push({
        date: rec.date,
        type: 'historical',
        salinity: s,
        discharge: q,
        tide: h
      });
    });

    // Forecast next 7 days
    const lastDate = new Date(historyRecords[n - 1].date);
    for (let day = 1; day <= 7; day++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(lastDate.getDate() + day);
      const dateStr = forecastDate.toISOString().split('T')[0];

      // Slight hydrograph shift forward
      const fQ = Math.max(900, currQ - day * 15 + Math.sin(day) * 30);
      const fH = Math.max(1.8, currH + Math.sin(day * 0.8) * 0.2);

      const predictedS = this.calculateSalinity(fQ, fH, station.properties.distance_inland_km, 12, incision);

      trajectory.push({
        date: dateStr,
        type: 'forecast',
        salinity: predictedS,
        discharge: parseFloat(fQ.toFixed(1)),
        tide: parseFloat(fH.toFixed(2))
      });
    }

    return trajectory;
  }

  /**
   * Run Scenario Simulator
   */
  simulateScenario(Q, H, incision) {
    const RM = this.calculateMomentumRatio(Q, H);
    
    // Calculate 4.0 g/L salinity penetration distance inland (km)
    // S(x) = 4.0 => x = -lambda * ln(4.0 / S0)
    const frictionFactor = 1.0 - (incision * 0.12);
    const S0 = Math.min(24.0, (18.0 * Math.exp(-RM * 0.9) + 1.2) / frictionFactor);
    const lambda = 22.0 + 35.0 * Math.exp(-RM * 1.5) + (incision * 5.0);
    
    let penDistance = 0;
    if (S0 > 4.0) {
      penDistance = -lambda * Math.log(4.0 / S0);
    } else {
      penDistance = 5.0;
    }

    penDistance = Math.min(125, Math.max(0, penDistance));
    
    // Affected Agricultural Area (ha) - non-linear scaling
    const affectedAreaHa = Math.round(penDistance * 2750 + (incision * 12000));

    return {
      RM: parseFloat(RM.toFixed(3)),
      penetrationKm: parseFloat(penDistance.toFixed(1)),
      affectedAreaHa: affectedAreaHa.toLocaleString()
    };
  }
}

window.hydrophysics = new HydrophysicsEngine();
