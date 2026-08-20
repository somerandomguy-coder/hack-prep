'use client';

import React, { useEffect, useRef } from 'react';
import { DaySchedule } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

interface MapVisualizerProps {
  schedule: DaySchedule[];
}

const DAY_COLORS = ['#00f2fe', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const MapVisualizer: React.FC<MapVisualizerProps> = ({ schedule }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet inside browser environment
    import('leaflet').then((L) => {
      if (!leafletInstance.current) {
        const map = L.map(mapRef.current!).setView([-33.8688, 151.2093], 12);

        // CartoDB Dark Matter tile layer for sleek dark theme matching our UI
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        leafletInstance.current = map;
      }

      const map = leafletInstance.current;

      // Clear previous markers & lines
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });

      const bounds: [number, number][] = [];

      schedule.forEach((daySchedule) => {
        const color = DAY_COLORS[(daySchedule.day - 1) % DAY_COLORS.length];
        const slots = daySchedule.slots;
        const points: { lat: number; lng: number; name: string; slotName: string; cost: number }[] = [];

        if (slots.morning) points.push({ lat: slots.morning.lat, lng: slots.morning.lng, name: slots.morning.name, slotName: 'Morning', cost: slots.morning.estimated_cost });
        if (slots.afternoon) points.push({ lat: slots.afternoon.lat, lng: slots.afternoon.lng, name: slots.afternoon.name, slotName: 'Afternoon', cost: slots.afternoon.estimated_cost });
        if (slots.evening) points.push({ lat: slots.evening.lat, lng: slots.evening.lng, name: slots.evening.name, slotName: 'Evening', cost: slots.evening.estimated_cost });

        const latLngs: [number, number][] = points.map(p => [p.lat, p.lng]);

        // Add route line connecting daily POIs
        if (latLngs.length > 1) {
          L.polyline(latLngs, {
            color: color,
            weight: 4,
            dashArray: '6, 8',
            opacity: 0.9
          }).addTo(map);
        }

        // Add Circle Markers for each POI
        points.forEach((pt) => {
          bounds.push([pt.lat, pt.lng]);

          const circle = L.circleMarker([pt.lat, pt.lng], {
            radius: 8,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(map);

          circle.bindPopup(`
            <div style="color: #0b0f19; font-family: sans-serif; font-size: 13px; line-height: 1.4;">
              <strong style="color: #00f2fe;">Day ${daySchedule.day} - ${pt.slotName}</strong><br/>
              <b style="font-size: 14px;">${pt.name}</b><br/>
              <span>Estimated Cost: <b>$${pt.cost}</b></span>
            </div>
          `);
        });
      });

      if (bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
      }
    });
  }, [schedule]);

  return (
    <div className="map-container card-glass">
      <h3 className="section-title">
        <span className="icon">🗺️</span> Interactive OpenStreetMap & Spatial Route Visualizer
      </h3>

      <div
        ref={mapRef}
        style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }}
      />

      <div className="map-legend">
        {schedule.map((d) => (
          <div key={d.day} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: DAY_COLORS[(d.day - 1) % DAY_COLORS.length] }}
            ></span>
            <span>Day {d.day} Path ({d.total_distance_km} km)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
