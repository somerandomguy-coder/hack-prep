import { IntentSchema } from '../types';

export function parseIntent(prompt: string): IntentSchema {
  const text = prompt.toLowerCase();

  // 1. Detect City
  let city = 'Sydney';
  if (text.includes('tokyo')) city = 'Tokyo';
  else if (text.includes('sydney')) city = 'Sydney';

  // 2. Detect Days (e.g. "3 days", "3 day", "for 2 days")
  let days = 3;
  const daysMatch = text.match(/(\d+)\s*day/i) || text.match(/(\d+)\s*d\b/i);
  if (daysMatch) {
    const parsedDays = parseInt(daysMatch[1], 10);
    if (parsedDays > 0 && parsedDays <= 7) {
      days = parsedDays;
    }
  }

  // 3. Detect Daily Budget (e.g. "$50/day", "budget around $50", "budget 50", "$100 per day")
  let daily_budget_max = 60;
  const budgetMatch = 
    text.match(/\$\s*(\d+)/i) || 
    text.match(/budget\s*(?:around|of|is)?\s*\$?\s*(\d+)/i) ||
    text.match(/(\d+)\s*(?:dollars|\$|\/day|per day)/i);

  if (budgetMatch) {
    const parsedBudget = parseFloat(budgetMatch[1]);
    if (parsedBudget > 0) {
      daily_budget_max = parsedBudget;
    }
  }

  // 4. Extract Vibe Tags
  const knownTags = [
    'coffee', 'coastal', 'walk', 'nature', 'scenic', 'food', 'dining',
    'art', 'museum', 'sunset', 'ferry', 'beach', 'history', 'market',
    'jazz', 'nightlife', 'culture', 'garden', 'landmark', 'architecture', 'romantic'
  ];

  const extractedTags: string[] = [];
  for (const tag of knownTags) {
    if (text.includes(tag)) {
      extractedTags.push(tag);
    }
  }

  // Synonyms mapping
  if (text.includes('cafe') || text.includes('espresso')) {
    if (!extractedTags.includes('coffee')) extractedTags.push('coffee');
  }
  if (text.includes('ocean') || text.includes('sea')) {
    if (!extractedTags.includes('coastal')) extractedTags.push('coastal');
  }
  if (text.includes('hike') || text.includes('trail')) {
    if (!extractedTags.includes('walk')) extractedTags.push('walk');
  }

  // Fallback vibe tags if none found
  if (extractedTags.length === 0) {
    extractedTags.push('scenic', 'coffee', 'food');
  }

  // 5. Detect Pacing
  let pacing: 'relaxed' | 'moderate' | 'intense' = 'relaxed';
  if (text.includes('intense') || text.includes('packed') || text.includes('fast')) {
    pacing = 'intense';
  } else if (text.includes('moderate') || text.includes('balanced')) {
    pacing = 'moderate';
  } else {
    pacing = 'relaxed';
  }

  // 6. Detect Accommodation Intent
  const accommodationKeywords = [
    'hotel', 'stay', 'accommodation', 'where to live', 'airbnb', 'lodging',
    'hostel', 'resort', 'where to stay', 'place to stay', 'living'
  ];

  const accommodation_requested = accommodationKeywords.some(keyword => text.includes(keyword));

  return {
    city,
    days,
    daily_budget_max,
    vibe_tags: extractedTags,
    pacing,
    time_slots_per_day: ['morning', 'afternoon', 'evening'],
    accommodation_requested
  };
}
