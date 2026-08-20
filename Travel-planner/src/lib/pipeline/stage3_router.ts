import { POI, IntentSchema, DaySchedule, SlotAssignment, TransitInfo, AccommodationHub } from '../types';
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

const PREDEFINED_ACCOMMODATION_HUBS = [
  {
    suburb: 'Surry Hills',
    recommended_streets: ['Crown St', 'Reservoir St', 'Foveaux St'],
    lat: -33.8835,
    lng: 151.2110,
    price_estimates: { budget: 90, mid_range: 150, luxury: 250 },
    reasoning: 'Central urban location surrounded by specialty coffee roasters and rapid transit. Minimizes average distance across both harbor landmarks and eastern coastal walks.'
  },
  {
    suburb: 'Circular Quay / The Rocks',
    recommended_streets: ['George St', 'Harrington St', 'Macquarie St'],
    lat: -33.8585,
    lng: 151.2100,
    price_estimates: { budget: 130, mid_range: 220, luxury: 420 },
    reasoning: 'Harbourfront location within walking distance to Opera House, Royal Botanic Garden, historic market lanes, and ferry wharves.'
  },
  {
    suburb: 'Potts Point / Darlinghurst',
    recommended_streets: ['Macleay St', 'Victoria St', 'Darlinghurst Rd'],
    lat: -33.8730,
    lng: 151.2230,
    price_estimates: { budget: 85, mid_range: 140, luxury: 230 },
    reasoning: 'Tree-lined leafy avenues featuring vibrant European bistros, local espresso bars, and quick transit to eastern beaches.'
  },
  {
    suburb: 'Pyrmont / Barangaroo',
    recommended_streets: ['Harris St', 'Pirrama Rd', 'Barangaroo Ave'],
    lat: -33.8680,
    lng: 151.1980,
    price_estimates: { budget: 100, mid_range: 170, luxury: 310 },
    reasoning: 'Modern harbor precinct adjacent to Sydney Harbour Bridge, maritime walkways, and ferry terminals.'
  },
  {
    suburb: 'Newtown / Inner West',
    recommended_streets: ['King St', 'Enmore Rd', 'Australia St'],
    lat: -33.8970,
    lng: 151.1790,
    price_estimates: { budget: 75, mid_range: 120, luxury: 190 },
    reasoning: 'Bohemian culture hub offering budget-friendly boutique lodging, craft dining, and indie music venues.'
  }
];

export function findOptimalAccommodationHub(schedule: DaySchedule[]): AccommodationHub {
  const allPois: POI[] = [];

  schedule.forEach((d) => {
    if (d.slots.morning) allPois.push(d.slots.morning);
    if (d.slots.afternoon) allPois.push(d.slots.afternoon);
    if (d.slots.evening) allPois.push(d.slots.evening);
  });

  if (allPois.length === 0) {
    const hub = PREDEFINED_ACCOMMODATION_HUBS[0];
    return {
      ...hub,
      avg_distance_to_pois_km: 2.5,
      search_keywords: [`Sydney ${hub.suburb} hotel`, `Airbnb ${hub.suburb} Sydney`, `${hub.recommended_streets[0]} stay`]
    };
  }

  // Calculate average distance from each candidate hub to all selected POIs
  const scoredHubs = PREDEFINED_ACCOMMODATION_HUBS.map((hub) => {
    const totalDist = allPois.reduce((acc, poi) => {
      return acc + haversineDistance(hub.lat, hub.lng, poi.lat, poi.lng);
    }, 0);

    const avgDist = Math.round((totalDist / allPois.length) * 10) / 10;
    return {
      hub,
      avgDist
    };
  });

  // Rank ascending by average distance
  scoredHubs.sort((a, b) => a.avgDist - b.avgDist);

  const best = scoredHubs[0];
  const bestHub = best.hub;

  return {
    suburb: bestHub.suburb,
    recommended_streets: bestHub.recommended_streets,
    lat: bestHub.lat,
    lng: bestHub.lng,
    avg_distance_to_pois_km: best.avgDist,
    price_estimates: bestHub.price_estimates,
    reasoning: bestHub.reasoning,
    search_keywords: [
      `Sydney ${bestHub.suburb} hotels`,
      `Airbnb ${bestHub.suburb} Sydney`,
      `Stay in ${bestHub.recommended_streets[0]} Sydney`
    ]
  };
}

export function buildSchedule(scoredCandidates: ScoredCandidate[], intent: IntentSchema): DaySchedule[] {
  const usedPoiIds = new Set<string>();
  const allPois = scoredCandidates.map(sc => sc.poi);

  const schedule: DaySchedule[] = [];

  for (let day = 1; day <= intent.days; day++) {
    let availablePois = allPois.filter(p => !usedPoiIds.has(p.id));
    if (availablePois.length < 3) {
      availablePois = [...allPois];
    }

    let morningPool = availablePois.filter(p => p.best_time === 'morning' || p.category === 'cafe');
    if (morningPool.length === 0) morningPool = availablePois;

    let afternoonPool = availablePois.filter(p => p.best_time === 'afternoon' || p.category === 'activity' || p.category === 'sight');
    if (afternoonPool.length === 0) afternoonPool = availablePois;

    let eveningPool = availablePois.filter(p => p.best_time === 'evening' || p.category === 'food' || p.category === 'sight');
    if (eveningPool.length === 0) eveningPool = availablePois;

    let morningPoi = morningPool[0];

    let afternoonCandidates = afternoonPool.filter(p => p.id !== morningPoi.id);
    if (afternoonCandidates.length === 0) afternoonCandidates = availablePois;
    afternoonCandidates.sort((a, b) => {
      const dA = haversineDistance(morningPoi.lat, morningPoi.lng, a.lat, a.lng);
      const dB = haversineDistance(morningPoi.lat, morningPoi.lng, b.lat, b.lng);
      return dA - dB;
    });
    let afternoonPoi = afternoonCandidates[0];

    let eveningCandidates = eveningPool.filter(p => p.id !== morningPoi.id && p.id !== afternoonPoi.id);
    if (eveningCandidates.length === 0) eveningCandidates = availablePois;
    eveningCandidates.sort((a, b) => {
      const dA = haversineDistance(afternoonPoi.lat, afternoonPoi.lng, a.lat, a.lng);
      const dB = haversineDistance(afternoonPoi.lat, afternoonPoi.lng, b.lat, b.lng);
      return dA - dB;
    });
    let eveningPoi = eveningCandidates[0];

    let currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;

    if (currentCost > intent.daily_budget_max) {
      const cheapMorning = availablePois
        .filter(p => (p.best_time === 'morning' || p.category === 'cafe') && p.estimated_cost < morningPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      const cheapAfternoon = availablePois
        .filter(p => (p.best_time === 'afternoon' || p.category === 'activity' || p.category === 'sight') && p.estimated_cost < afternoonPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      const cheapEvening = availablePois
        .filter(p => (p.best_time === 'evening' || p.category === 'food' || p.category === 'sight') && p.estimated_cost < eveningPoi.estimated_cost)
        .sort((a, b) => a.estimated_cost - b.estimated_cost);

      if (cheapEvening.length > 0) {
        eveningPoi = cheapEvening[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

      if (currentCost > intent.daily_budget_max && cheapAfternoon.length > 0) {
        afternoonPoi = cheapAfternoon[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

      if (currentCost > intent.daily_budget_max && cheapMorning.length > 0) {
        morningPoi = cheapMorning[0];
        currentCost = morningPoi.estimated_cost + afternoonPoi.estimated_cost + eveningPoi.estimated_cost;
      }

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

    usedPoiIds.add(morningPoi.id);
    usedPoiIds.add(afternoonPoi.id);
    usedPoiIds.add(eveningPoi.id);

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
