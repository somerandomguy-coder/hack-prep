'use client';

import React from 'react';
import { DaySchedule, SlotAssignment } from '@/lib/types';

interface ItineraryViewProps {
  schedule: DaySchedule[];
}

const SlotCard: React.FC<{ slot?: SlotAssignment; timeOfDay: string; icon: string }> = ({ slot, timeOfDay, icon }) => {
  if (!slot) return null;

  return (
    <div className="slot-card">
      <div className="slot-header">
        <span className="slot-time-badge">
          {icon} {timeOfDay.toUpperCase()}
        </span>
        <span className="slot-cost-badge">${slot.estimated_cost.toFixed(2)}</span>
      </div>

      <h4 className="slot-name">{slot.name}</h4>
      <div className="slot-meta">
        <span className="category-tag">{slot.category}</span>
        <span className="rating-tag">⭐ {slot.rating}</span>
        <span className="best-time-tag">Best: {slot.best_time}</span>
      </div>

      <p className="slot-description">{slot.description}</p>

      <div className="slot-vibe-tags">
        {slot.vibe_tags.map((tag, i) => (
          <span key={i} className="vibe-pill">
            #{tag}
          </span>
        ))}
      </div>

      {slot.transit_from_prev && (
        <div className="transit-connector">
          <span className="transit-icon">🚶 / 🚌</span>
          <span>
            Transit: <strong>{slot.transit_from_prev.dist_km} km</strong> (~{slot.transit_from_prev.time_min} mins)
          </span>
        </div>
      )}
    </div>
  );
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="itinerary-container card-glass">
      <h3 className="section-title">
        <span className="icon">📅</span> Verified Day-by-Day Itinerary
      </h3>

      <div className="days-stack">
        {schedule.map((daySchedule) => (
          <div key={daySchedule.day} className="day-box">
            <div className="day-header">
              <div className="day-title-group">
                <h4 className="day-num">Day {daySchedule.day}</h4>
                <span className="budget-guarantee-badge">
                  Total Spend: <strong>${daySchedule.total_cost.toFixed(2)}</strong> / Max ${daySchedule.budget_max.toFixed(2)} ✅
                </span>
              </div>
              <div className="day-metrics">
                <span>Total Distance: <strong>{daySchedule.total_distance_km} km</strong></span>
                <span>Transit Time: <strong>~{daySchedule.total_transit_min} min</strong></span>
              </div>
            </div>

            <div className="slots-grid">
              <SlotCard slot={daySchedule.slots.morning} timeOfDay="Morning" icon="🌅" />
              <SlotCard slot={daySchedule.slots.afternoon} timeOfDay="Afternoon" icon="☀️" />
              <SlotCard slot={daySchedule.slots.evening} timeOfDay="Evening" icon="🌙" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
