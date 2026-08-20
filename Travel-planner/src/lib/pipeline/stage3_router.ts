import { POI, IntentSchema, DaySchedule, SlotAssignment, TransitInfo } from '../types';
import { ScoredCandidate } from './stage2_filter';

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

export function estimateTransit(distKm: number): TransitInfo {
  const timeMin = Math.max(5, Math.round((distKm / 25) * 60 + 5));
  return {
    dist_km: distKm,
    time_min: timeMin
  };
}

export function buildSchedule(scoredCandidates: ScoredCandidate[], intent: IntentSchema): DaySchedule[] {
  const usedPoiIds = new Set<string>();
  const allPois = scoredCandidates.map(sc => sc.poi);

  const schedule: DaySchedule[] = [];

  for (let day = 1; day <= intent.days; day++) {
    // Available candidates not yet used in previous days
    let availablePois = allPois.filter(p => !usedPoiIds.has(p.id));
    if (availablePois.length < 3) {
      // Reuse available if pool exhausted
      availablePois = [...allPois];
    }

    // Filter pools by slot
    let morningPool = availablePois.filter(p => p.best_time === 'morning' || p.category === 'cafe');
    if (morningPool.length === 0) morningPool = availablePois;

    let afternoonPool = availablePois.filter(p => p.best_time === 'afternoon' || p.category === 'activity' || p.category === 'sight');
    if (afternoonPool.length === 0) afternoonPool = availablePois;

    let eveningPool = availablePois.filter(p => p.best_time === 'evening' || p.category === 'food' || p.category === 'sight');
    if (eveningPool.length === 0) eveningPool = availablePois;

    // Pick top Morning POI
    let morningPoi = morningPool[0];

    // Pick Afternoon POI closest to Morning POI
    let afternoonCandidates = afternoonPool.filter(p => p.id !== morningPoi.id);
    if (afternoonCandidates.length === 0) afternoonCandidates = availablePois;
    afternoonCandidates.sort((a, b) => {
      const dA = haversineDistance(morningPoi.lat, morningPoi.lng, a.lat, a.lng);
      const dB = haversineDistance(morningPoi.lat, morningPoi.lng, b.lat, b.lng);
      return dA - dB;
    });
    let afternoonPoi = afternoonCandidates[0];

    // Pick Evening POI closest to Afternoon POI
    let eveningCandidates = eveningPool.filter(p => p.id !== morningPoi.id && p.id !== afternoonPoi.id);
    if (eveningCandidates.length === 0) eveningCandidates = availablePois;
    eveningCandidates.sort((a, b) => {
      const dA = haversineDistance(afternoonPoi.lat, afternoonPoi.lng, a.lat, a.lng);
      const dB = haversineDistance(afternoonPoi.lat, afternoonPoi.lng, b.lat, b.lng);
      return dA - dB;
    });
    let eveningPoi = eveningCandidates[0];

    // --- HARD BUDGET ENFORCEMENT LOOP ---
    // If morningPoi + afternoonPoi + eveningPoi > daily_budget_max, substitute items starting with highest cost item
    let currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;

    if (currentCost > intent.daily_budget_max) {
      // Find cheaper substitutes in availablePois
      const cheapMorning = availablePois
        .filter(p => (p.best_time === 'morning' || p.category === 'cafe') && p.estimated_cost < morningPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      const cheapAfternoon = availablePois
        .filter(p => (p.best_time === 'afternoon' || p.category === 'activity' || p.category === 'sight') && p.estimated_cost < afternoonPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      const cheapEvening = availablePois
        .filter(p => (p.best_time === 'evening' || p.category === 'food' || p.category === 'sight') && p.estimated_cost < eveningPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      // Try replacing evening first if high
      if (cheapEvening.length > 0) {
        eveningPoi = cheapEvening[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

      // Try replacing afternoon if still over budget
      if (currentCost > intent.daily_budget_max && cheapAfternoon.length > 0) {
        afternoonPoi = cheapAfternoon[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

      // Try replacing morning if still over budget
      if (currentCost > intent.daily_budget_max && cheapMorning.length > 0) {
        morningPoi = cheapMorning[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

      // Ultimate fallback: Pick $0 free spots (e.g. walks, gardens, parks)
      if (currentCost > intent.daily_budget_max) {
        const freeSpots = availablePois.filter(p => p.estimated_cost === 0);
        if (freeSpots.length > 0 && afternoonPoi.estimated_cost > 0) {
          afternoonPoi = freeSpots[0];
        }
        if (freeSpots.length > 1 && eveningPoi.estimated_cost > 0) {
          eveningPoi = freeSpots[1];
        }
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }
    }

    // Mark as used
    usedPoiIds.add(morningPoi.id);
    usedPoiIds.add(afternoonPoi.id);
    usedPoiIds.add(eveningPoi.id);

    // Calculate transit metrics
    const morningToAfternoonDist = haversineDistance(morningPoi.lat, morningPoi.lng, afternoonPoi.lat, afternoonPoi.lng);
    const morningToAfternoonTransit = estimateTransit(morningToAfternoonDist);

    const afternoonToEveningDist = haversineDistance(afternoonPoi.lat, afternoonPoi.lng, eveningPoi.lat, eveningPoi.lng);
    const afternoonToEveningTransit = estimateTransit(afternoonToEveningDist);

    const morningSlot: SlotAssignment = { ...morningPoi };
    const afternoonSlot: SlotAssignment = {
      ...afternoonPoi,
      transit_from_prev: morningToAfternoonTransit
    };
    const eveningSlot: SlotAssignment = {
      ...eveningPoi,
      transit_from_prev: afternoonToEveningTransit
    };

    const totalDistDay = Math.round((morningToAfternoonDist + afternoonToEveningDist) * 10) / 10;
    const totalTransitMin = morningToAfternoonTransit.time_min + afternoonToEveningTransit.time_min;

    schedule.push({
      day,
      total_cost: Math.round(currentCost * 100) / 100,
      budget_max: intent.daily_budget_max,
      budget_satisfied: currentCost <= intent.daily_budget_max,
      total_distance_km: totalDistDay,
      total_transit_min: totalTransitMin,
      slots: {
        morning: morningSlot,
        afternoon: afternoonSlot,
        evening: eveningSlot
      }
    });
  }

  return schedule;
}
