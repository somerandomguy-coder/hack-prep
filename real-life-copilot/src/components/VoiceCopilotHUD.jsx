import React from 'react';
import { Mic, Sparkles, Volume2, Command, MessageSquareText, Lightbulb } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer.jsx';

export default function VoiceCopilotHUD({
  voiceState,
  onMicClick,
  transcript,
  spokenAnswer,
  onQuickChipClick
}) {
  const quickChips = [
    { label: "Matcha Latte L Recipe", query: "What is the recipe for a Matcha Latte size L?" },
    { label: "Fix Error E-02", query: "Coffee machine error code E-02 emergency fix" },
    { label: "Daily Sanitization SOP", query: "How to clean group heads and steam wands closing checklist?" },
    { label: "Matcha Water Temp", query: "What temperature should water be for whisking matcha?" }
  ];

  const getStatusText = () => {
    switch (voiceState) {
      case 'listening':
        return 'Listening... Speak your question clearly';
      case 'processing':
        return 'Searching internal SOP knowledge base...';
      case 'speaking':
        return 'Speaking answer out loud (Hands-free audio)...';
      default:
        return 'Tap microphone or hold Spacebar to speak';
    }
  };

  return (
    <div className="glass-card voice-hud-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)' }}>
        <Sparkles size={20} />
        <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          On-Demand Voice Copilot
        </span>
      </div>

      <AudioVisualizer voiceState={voiceState} onMicClick={onMicClick} />

      <h3 className="voice-status-text">{getStatusText()}</h3>
      <p className="voice-subtext">
        <Command size={12} style={{ display: 'inline', marginRight: '4px' }} />
        Shortcut: Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'white' }}>Spacebar</kbd> anytime on shift
      </p>

      {/* Transcript / Spoken Output Box */}
      <div className="transcript-box">
        {voiceState === 'listening' && (
          <p style={{ color: 'var(--primary-cyan)', fontWeight: '500' }}>
            "{transcript || 'Listening for speech...'}"
          </p>
        )}

        {voiceState === 'processing' && (
          <p style={{ color: 'var(--amber-warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Querying local RAG & Gemini Flash API...
          </p>
        )}

        {(voiceState === 'speaking' || voiceState === 'idle') && spokenAnswer && (
          <div style={{ textAlign: 'left', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--emerald-success)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              <Volume2 size={14} /> AI Voice Output
            </div>
            <p style={{ fontSize: '0.95rem', color: '#f1f5f9', fontStyle: 'normal' }}>
              "{spokenAnswer}"
            </p>
          </div>
        )}

        {voiceState === 'idle' && !spokenAnswer && !transcript && (
          <p style={{ color: 'var(--text-muted)' }}>
            "Ask e.g. 'How do I fix coffee machine error E-02?' or 'Matcha Latte Size L recipe'"
          </p>
        )}
      </div>

      {/* Quick Voice Chips */}
      <div className="quick-chips-section">
        <div className="chips-label">
          <Lightbulb size={14} color="var(--amber-warning)" />
          One-Tap Voice Demo Queries
        </div>
        <div className="chips-grid">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => onQuickChipClick(chip.query)}
            >
              <MessageSquareText size={14} />
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
