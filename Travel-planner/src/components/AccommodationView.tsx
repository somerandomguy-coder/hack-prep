'use client';

import React, { useState } from 'react';
import { AccommodationHub } from '@/lib/types';

interface AccommodationViewProps {
  accommodation?: AccommodationHub;
  isForcedVisible?: boolean;
}

export const AccommodationView: React.FC<AccommodationViewProps> = ({ accommodation, isForcedVisible }) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  if (!accommodation) return null;

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="accommodation-container card-glass glow-border">
      <div className="accommodation-header">
        <div>
          <span className="accommodation-badge">🏨 Optimal Accommodation Location</span>
          <h3 className="suburb-title">{accommodation.suburb}</h3>
        </div>
        <div className="dist-pill">
          Avg <strong>{accommodation.avg_distance_to_pois_km} km</strong> to all itinerary spots
        </div>
      </div>

      <p className="reasoning-text">{accommodation.reasoning}</p>

      <div className="accommodation-grid">
        {/* Recommended Streets */}
        <div className="section-box">
          <h4 className="box-title">📍 Top Recommended Streets / Areas</h4>
          <div className="streets-list">
            {accommodation.recommended_streets.map((street, idx) => (
              <span key={idx} className="street-tag">
                {street}
              </span>
            ))}
          </div>
        </div>

        {/* Estimated Price Range */}
        <div className="section-box">
          <h4 className="box-title">💵 Suggested Nightly Rate Ranges</h4>
          <div className="prices-grid">
            <div className="price-card">
              <span className="price-label">Hostel / Budget</span>
              <span className="price-val">~${accommodation.price_estimates.budget}/night</span>
            </div>
            <div className="price-card highlight">
              <span className="price-label">Mid-Range Hotel</span>
              <span className="price-val">~${accommodation.price_estimates.mid_range}/night</span>
            </div>
            <div className="price-card">
              <span className="price-label">Boutique / Luxury</span>
              <span className="price-val">~${accommodation.price_estimates.luxury}/night</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyable Search Keywords */}
      <div className="keywords-box">
        <span className="keywords-label">🔍 Search Keywords (Click to Copy for Airbnb / Booking.com):</span>
        <div className="chips-wrapper">
          {accommodation.search_keywords.map((kw, i) => (
            <button
              key={i}
              type="button"
              className={`kw-chip ${copiedKeyword === kw ? 'copied' : ''}`}
              onClick={() => handleCopy(kw)}
            >
              {kw} {copiedKeyword === kw ? '✓ Copied!' : '📋'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
