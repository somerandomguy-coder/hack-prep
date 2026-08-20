export interface POI {
  id: string;
  city: string;
  name: string;
  category: 'cafe' | 'activity' | 'food' | 'sight';
  lat: number;
  lng: number;
  price_tier: number; // 1 ($), 2 ($$), 3 ($$$)
  estimated_cost: number; // Cost in USD/AUD
  rating: number; // e.g. 4.8
  vibe_tags: string[]; // parsed from JSON text array
  best_time: 'morning' | 'afternoon' | 'evening';
  description: string;
}

export interface IntentSchema {
  city: string;
  days: number;
  daily_budget_max: number;
  vibe_tags: string[];
  pacing: 'relaxed' | 'moderate' | 'intense';
  time_slots_per_day: ('morning' | 'afternoon' | 'evening')[];
}

export interface TransitInfo {
  dist_km: number;
  time_min: number;
}

export interface SlotAssignment extends POI {
  transit_from_prev?: TransitInfo;
}

export interface DaySchedule {
  day: number;
  total_cost: number;
  budget_max: number;
  budget_satisfied: boolean;
  total_distance_km: number;
  total_transit_min: number;
  slots: {
    morning?: SlotAssignment;
    afternoon?: SlotAssignment;
    evening?: SlotAssignment;
  };
}

export interface PipelineStageInfo {
  stage: number;
  title: string;
  details: string;
  data: any;
}

export interface PlanResult {
  success: boolean;
  intent: IntentSchema;
  candidate_count: number;
  schedule: DaySchedule[];
  narrative: string;
  pipeline_stages?: PipelineStageInfo[];
}
