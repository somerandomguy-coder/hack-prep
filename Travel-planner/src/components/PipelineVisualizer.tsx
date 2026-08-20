'use client';

import React, { useState } from 'react';
import { PipelineStageInfo } from '@/lib/types';

interface PipelineVisualizerProps {
  stages?: PipelineStageInfo[];
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ stages }) => {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  if (!stages || stages.length === 0) return null;

  return (
    <div className="pipeline-container card-glass">
      <h3 className="section-title">
        <span className="icon">⚙️</span> 4-Stage Execution Pipeline
      </h3>

      <div className="pipeline-grid">
        {stages.map((stage) => {
          const isExpanded = activeStage === stage.stage;
          return (
            <div
              key={stage.stage}
              className={`pipeline-card ${isExpanded ? 'active' : ''}`}
              onClick={() => setActiveStage(isExpanded ? null : stage.stage)}
            >
              <div className="pipeline-card-header">
                <span className="stage-badge">Stage {stage.stage}</span>
                <h4 className="stage-title">{stage.title}</h4>
              </div>
              <p className="stage-details">{stage.details}</p>

              <button className="toggle-json-btn">
                {isExpanded ? 'Hide Pipeline Data ▲' : 'View Pipeline Data ▼'}
              </button>

              {isExpanded && (
                <div className="json-wrapper">
                  <pre>{JSON.stringify(stage.data, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
