'use client';

import React from 'react';

interface NarrativeViewProps {
  narrative?: string;
}

export const NarrativeView: React.FC<NarrativeViewProps> = ({ narrative }) => {
  if (!narrative) return null;

  return (
    <div className="narrative-container card-glass">
      <h3 className="section-title">
        <span className="icon">📖</span> Stage 4: Synthesized Travel Guide Narrative
      </h3>
      <div className="narrative-content">
        {narrative.split('\n').map((line, idx) => {
          if (line.startsWith('# ')) {
            return <h2 key={idx} className="narrative-h1">{line.replace('# ', '')}</h2>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="narrative-h2">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="narrative-h3">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('> ')) {
            return <blockquote key={idx} className="narrative-quote">{line.replace('> ', '')}</blockquote>;
          }
          if (line.startsWith('- ')) {
            return <li key={idx} className="narrative-li">{line.replace('- ', '')}</li>;
          }
          if (line.trim() === '---') {
            return <hr key={idx} className="narrative-hr" />;
          }
          if (!line.trim()) return <div key={idx} className="narrative-spacer" />;
          return <p key={idx} className="narrative-p">{line}</p>;
        })}
      </div>
    </div>
  );
};
