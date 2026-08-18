import React, { useState } from 'react';
import { X, Key, Volume2, Save, Info, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  geminiKey,
  setGeminiKey,
  elevenKey,
  setElevenKey,
  speechSpeed,
  setSpeechSpeed
}) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('shiftflow_gemini_key', geminiKey);
    localStorage.setItem('shiftflow_eleven_key', elevenKey);
    localStorage.setItem('shiftflow_speech_speed', speechSpeed);
    
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key color="var(--primary-cyan)" size={22} />
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>AI & Voice Settings</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Gemini API Key (Optional - Enables Live Gemini RAG)
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Leave blank to use the built-in smart local synthesizer ($0 cost, 100% offline ready).
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              ElevenLabs API Key (Optional - Realistic Voice Synthesis)
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="xi-api-key..."
              value={elevenKey}
              onChange={(e) => setElevenKey(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              If left blank, standard high-speed browser Web Speech API voice synthesis is used.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Speech Speed Rate</span>
              <span style={{ color: 'var(--primary-cyan)', fontWeight: 'bold' }}>{speechSpeed}x</span>
            </label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              style={{ accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              padding: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}
          >
            <Info size={16} color="var(--primary-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              ShiftFlow is built for zero infrastructure cost hackathon demos. All credentials are saved strictly in your local browser storage.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} /> Saved!
                </>
              ) : (
                <>
                  <Save size={16} /> Save Credentials
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
