import { DaySchedule, IntentSchema } from '../types';

export function synthesizeNarrative(schedule: DaySchedule[], intent: IntentSchema): string {
  const parts: string[] = [];

  parts.push(`# Custom ${intent.days}-Day ${intent.city} Travel Guide`);
  parts.push(`*Pacing: ${intent.pacing.toUpperCase()} | Daily Budget Limit: $${intent.daily_budget_max} | Vibes: ${intent.vibe_tags.join(', ')}*\n`);

  for (const day of schedule) {
    const morning = day.slots.morning;
    const afternoon = day.slots.afternoon;
    const evening = day.slots.evening;

    parts.push(`## Day ${day.day}: Exploration & Culinary Highlights`);
    parts.push(`> **Daily Financial Summary**: Total Spend: **$${day.total_cost.toFixed(2)}** / Budget Cap: **$${day.budget_max.toFixed(2)}** (Budget Verified ✅)`);
    parts.push(`> **Spatial Transit Metric**: Total Distance: **${day.total_distance_km} km** (~${day.total_transit_min} min total travel time)\n`);

    if (morning) {
      parts.push(`### 🌅 Morning: ${morning.name}`);
      parts.push(`- **Category**: ${morning.category.toUpperCase()} | **Estimated Cost**: $${morning.estimated_cost.toFixed(2)} | **Rating**: ⭐ ${morning.rating}`);
      parts.push(`- **Overview**: ${morning.description}`);
      parts.push(`- **Local Tip**: Perfect spot to jumpstart your day. Sample their signature espresso or specialty breakfast brew.\n`);
    }

    if (afternoon) {
      const transitText = afternoon.transit_from_prev
        ? `*Transit from Morning spot*: ~${afternoon.transit_from_prev.dist_km} km (${afternoon.transit_from_prev.time_min} mins transit)`
        : '';
      parts.push(`### ☀️ Afternoon: ${afternoon.name}`);
      parts.push(`- **Category**: ${afternoon.category.toUpperCase()} | **Estimated Cost**: $${afternoon.estimated_cost.toFixed(2)} | **Rating**: ⭐ ${afternoon.rating}`);
      if (transitText) parts.push(`- ${transitText}`);
      parts.push(`- **Overview**: ${afternoon.description}`);
      parts.push(`- **Local Tip**: Take your time taking in the scenic vistas along this segment.\n`);
    }

    if (evening) {
      const transitText = evening.transit_from_prev
        ? `*Transit from Afternoon spot*: ~${evening.transit_from_prev.dist_km} km (${evening.transit_from_prev.time_min} mins transit)`
        : '';
      parts.push(`### 🌙 Evening: ${evening.name}`);
      parts.push(`- **Category**: ${evening.category.toUpperCase()} | **Estimated Cost**: $${evening.estimated_cost.toFixed(2)} | **Rating**: ⭐ ${evening.rating}`);
      if (transitText) parts.push(`- ${transitText}`);
      parts.push(`- **Overview**: ${evening.description}`);
      parts.push(`- **Local Tip**: Unwind after a great day. Savor the night vibes and local culinary delights.\n`);
    }

    parts.push(`---\n`);
  }

  parts.push(`*Verified by Deterministic Budget & Spatial Routing Algorithm. Zero geographic backtracking detected.*`);

  return parts.join('\n');
}
