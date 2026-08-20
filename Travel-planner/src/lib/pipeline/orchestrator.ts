import { PlanResult, PipelineStageInfo } from '../types';
import { parseIntent } from './stage1_intent';
import { selectCandidates } from './stage2_filter';
import { buildSchedule } from './stage3_router';
import { synthesizeNarrative } from './stage4_narrative';

export function runPipeline(prompt: string): PlanResult {
  const pipelineStages: PipelineStageInfo[] = [];

  // Stage 1: Intent Parsing
  const intent = parseIntent(prompt);
  pipelineStages.push({
    stage: 1,
    title: 'Stage 1: Intent Parsing (LLM Stage 1)',
    details: `Extracted city="${intent.city}", days=${intent.days}, daily_budget_max=$${intent.daily_budget_max}, pacing="${intent.pacing}"`,
    data: intent
  });

  // Stage 2: Deterministic Candidate Filter (SQL)
  const candidates = selectCandidates(intent);
  pipelineStages.push({
    stage: 2,
    title: 'Stage 2: Candidate Selection (SQL Engine)',
    details: `Queried SQLite database for "${intent.city}". Found ${candidates.length} candidates matching budget <= $${intent.daily_budget_max}. Ranked by vibe tags [${intent.vibe_tags.join(', ')}].`,
    data: {
      candidate_count: candidates.length,
      top_candidates: candidates.slice(0, 5).map(c => ({ name: c.poi.name, score: c.relevanceScore, cost: c.poi.estimated_cost }))
    }
  });

  // Stage 3: Spatial Routing & Scheduler Algorithm
  const schedule = buildSchedule(candidates, intent);
  const totalTripDist = schedule.reduce((acc, d) => acc + d.total_distance_km, 0);
  pipelineStages.push({
    stage: 3,
    title: 'Stage 3: Spatial Routing & Budget Scheduler (Algorithm Stage)',
    details: `Grouped into ${schedule.length} daily geographic clusters using Haversine distance matrix. Enforced budget ceiling (all days <= $${intent.daily_budget_max}). Total trip distance: ${totalTripDist.toFixed(1)} km.`,
    data: schedule
  });

  // Stage 4: Narrative Synthesizer (LLM Stage 2)
  const narrative = synthesizeNarrative(schedule, intent);
  pipelineStages.push({
    stage: 4,
    title: 'Stage 4: Narrative Synthesizer (LLM Stage 2)',
    details: `Generated full day-by-day travel guide narrative wrapping the pre-calculated schedule with context and local tips.`,
    data: { narrative_length: narrative.length }
  });

  return {
    success: true,
    intent,
    candidate_count: candidates.length,
    schedule,
    narrative,
    pipeline_stages: pipelineStages
  };
}
