import React from 'react';
import { Mic, Volume2, Loader2, Radio } from 'lucide-react';

export default function AudioVisualizer({ voiceState, onMicClick }) {
  const getIcon = () => {
    switch (voiceState) {
      case 'listening':
        return <Mic size={42} className="pulse-icon" />;
      case 'processing':
        return <Loader2 size={42} className="spin-icon" />;
      case 'speaking':
        return <Volume2 size={42} className="bounce-icon" />;
      default:
        return <Mic size={42} />;
    }
  };

  return (
    <div className={`visualizer-container ${voiceState}`}>
      <div className="orb-ring orb-ring-1"></div>
      <div className="orb-ring orb-ring-2"></div>
      <button
        className="orb-center"
        onClick={onMicClick}
        title={voiceState === 'listening' ? 'Click to Stop Listening' : 'Click to Speak / Ask Question'}
      >
        {getIcon()}
      </button>
    </div>
  );
}
