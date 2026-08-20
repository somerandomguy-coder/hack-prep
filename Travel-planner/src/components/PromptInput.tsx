'use client';

import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  "3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace",
  "3 days in Sydney, budget $60/day, coastal walks & fine dining, recommend best hotel location",
  "2 days in Sydney under $40/day, focus on historic sights, harbor ferry and local markets"
];

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="prompt-container card-glass glow-border">
      <div className="prompt-header">
        <h2 className="prompt-title">
          <span className="icon">🚀</span> Hybrid Deterministic Travel Planner
        </h2>
        <p className="prompt-subtitle">
          Natural Language Intent Parsing + Deterministic SQL Filtering, Spatial Routing & Accommodation Suggester
        </p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-wrapper">
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, suggest hotel location..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="preset-chips">
          <span className="chips-label">Try Presets:</span>
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn"
              onClick={() => setPrompt(p)}
              disabled={isLoading}
            >
              {p.slice(0, 42)}...
            </button>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner-text">
              <span className="spinner"></span> Running 4-Stage Pipeline...
            </span>
          ) : (
            '✨ Generate Verified Itinerary & Stay Hub'
          )}
        </button>
      </form>
    </div>
  );
};
