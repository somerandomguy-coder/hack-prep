import React from 'react';
import { Zap, Mic, ShieldCheck, FileText, Settings, Radio } from 'lucide-react';

export default function HeaderNav({ activeTab, setActiveTab, onOpenSettings, isApiKeySet }) {
  return (
    <header className="nav-header">
      <div className="brand-logo">
        <div className="brand-icon-wrapper">
          <Zap size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">ShiftFlow</span>
            <span className="brand-tag">Voice AI</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-Time Physical Work Copilot
          </p>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'worker' ? 'active' : ''}`}
          onClick={() => setActiveTab('worker')}
        >
          <Mic size={16} />
          <span>Voice HUD</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <ShieldCheck size={16} />
          <span>Pre-Shift Quiz</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'manager' ? 'active' : ''}`}
          onClick={() => setActiveTab('manager')}
        >
          <FileText size={16} />
          <span>Manager KB</span>
        </button>
      </nav>

      <div className="nav-actions">
        <div className="status-badge" title="Knowledge Base Active">
          <div className="dot-indicator"></div>
          <span>KB Preloaded</span>
        </div>

        <button
          className="icon-btn"
          onClick={onOpenSettings}
          title="Configure API Keys & Voice Settings"
          style={{ position: 'relative' }}
        >
          <Settings size={18} />
          {isApiKeySet && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--emerald-success)'
              }}
            />
          )}
        </button>
      </div>
    </header>
  );
}
