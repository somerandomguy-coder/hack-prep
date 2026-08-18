import React from 'react';
import { Volume2, AlertTriangle, CheckCircle2, Flame, Utensils, ShieldAlert } from 'lucide-react';

export default function VisualStepCard({ cardData, spokenAnswer, onReplayAudio }) {
  if (!cardData) return null;

  const { title, category, steps = [], warning, ingredients = [] } = cardData;

  return (
    <div className="glass-card step-card-panel">
      {/* Card Header Bar */}
      <div className="card-header-bar">
        <div>
          <span className="sop-badge">{category || 'Workplace SOP'}</span>
          <h2 className="card-title">{title}</h2>
        </div>

        {onReplayAudio && spokenAnswer && (
          <button
            className="btn-secondary"
            onClick={onReplayAudio}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Replay Spoken Audio Response"
          >
            <Volume2 size={16} color="var(--primary-cyan)" /> Replay Voice
          </button>
        )}
      </div>

      {/* Spoken Answer Summary Callout */}
      {spokenAnswer && (
        <div className="card-summary-speak">
          <Volume2 size={20} color="var(--primary-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-cyan)', textTransform: 'uppercase', display: 'block' }}>
              Spoken Voice Summary
            </span>
            <span>"{spokenAnswer}"</span>
          </div>
        </div>
      )}

      {/* Warning Alert Banner if Present */}
      {warning && (
        <div className="warning-alert-box">
          <ShieldAlert size={22} color="var(--amber-warning)" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem' }}>SAFETY PROTOCOL WARNING</strong>
            <span style={{ fontSize: '0.85rem' }}>{warning}</span>
          </div>
        </div>
      )}

      {/* Step by Step Breakdown */}
      <div>
        <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} color="var(--emerald-success)" />
          Step-by-Step Procedure Guide
        </h4>

        <div className="steps-list">
          {steps.map((step, idx) => (
            <div key={idx} className="step-item">
              <div className="step-number">{idx + 1}</div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients or Tool Specs Grid */}
      {ingredients && ingredients.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Utensils size={15} color="var(--accent-purple)" />
            Recipe Specs & Quantities
          </h4>

          <div className="ingredients-grid">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-item">
                <span className="ing-name">{ing.name}</span>
                <span className="ing-qty">{ing.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
