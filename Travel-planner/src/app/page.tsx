'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PlanResult } from '@/lib/types';
import { PromptInput } from '@/components/PromptInput';
import { PipelineVisualizer } from '@/components/PipelineVisualizer';
import { ItineraryView } from '@/components/ItineraryView';
import { NarrativeView } from '@/components/NarrativeView';

// Dynamically import MapVisualizer to disable SSR for Leaflet (window object safety)
const MapVisualizer = dynamic(
  () => import('@/components/MapVisualizer').then((mod) => mod.MapVisualizer),
  { ssr: false }
);

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PlanResult | null>(null);

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
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial default prompt on load
  useEffect(() => {
    fetchPlan("3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace");
  }, []);

  return (
    <div>
      <PromptInput onSubmit={fetchPlan} isLoading={isLoading} />

      {result && (
        <>
          <PipelineVisualizer stages={result.pipeline_stages} />

          <ItineraryView schedule={result.schedule} />

          <MapVisualizer schedule={result.schedule} />

          <NarrativeView narrative={result.narrative} />
        </>
      )}
    </div>
  );
}
