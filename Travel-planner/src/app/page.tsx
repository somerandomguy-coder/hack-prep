'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PlanResult } from '@/lib/types';
import { PromptInput } from '@/components/PromptInput';
import { PipelineVisualizer } from '@/components/PipelineVisualizer';
import { ItineraryView } from '@/components/ItineraryView';
import { AccommodationView } from '@/components/AccommodationView';
import { NarrativeView } from '@/components/NarrativeView';

const MapVisualizer = dynamic(
  () => import('@/components/MapVisualizer').then((mod) => mod.MapVisualizer),
  { ssr: false }
);

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [manualShowStay, setManualShowStay] = useState<boolean>(false);

  const fetchPlan = async (promptText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data: PlanResult = await res.json();
      if (data.success) {
        setResult(data);
        setManualShowStay(false);
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan("3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace");
  }, []);

  const showAccommodation = Boolean(
    result?.accommodation && (result.intent.accommodation_requested || manualShowStay)
  );

  return (
    <div>
      <PromptInput onSubmit={fetchPlan} isLoading={isLoading} />

      {result && (
        <>
          <div className="toolbar-row">
            <button
              type="button"
              className={`toggle-stay-btn ${showAccommodation ? 'active' : ''}`}
              onClick={() => setManualShowStay(!manualShowStay)}
            >
              🏨 {showAccommodation ? 'Hide Optimal Stay Hub' : 'Show Optimal Stay Hub & Heatmap'}
            </button>
          </div>

          <PipelineVisualizer stages={result.pipeline_stages} />

          <ItineraryView schedule={result.schedule} />

          {showAccommodation && <AccommodationView accommodation={result.accommodation} />}

          <MapVisualizer
            schedule={result.schedule}
            accommodation={result.accommodation}
            showAccommodationOverlay={showAccommodation}
          />

          <NarrativeView narrative={result.narrative} />
        </>
      )}
    </div>
  );
}
