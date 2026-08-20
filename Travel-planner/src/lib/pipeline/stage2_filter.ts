import { POI, IntentSchema } from '../types';
import { queryPoisFromDb } from '../db';

export interface ScoredCandidate {
  poi: POI;
  relevanceScore: number;
  matchingTagsCount: number;
}

export function selectCandidates(intent: IntentSchema): ScoredCandidate[] {
  // Query DB for matching city and candidates whose cost is within individual budget threshold
  const rawPois = queryPoisFromDb(intent.city, intent.daily_budget_max);

  const scored: ScoredCandidate[] = rawPois.map((poi) => {
    let matchingTagsCount = 0;
    for (const tag of poi.vibe_tags) {
      if (intent.vibe_tags.includes(tag)) {
        matchingTagsCount++;
      }
    }

    // Calculate score: matching tags weighted higher + rating bonus
    const relevanceScore = (matchingTagsCount * 3.0) + poi.rating;

    return {
      poi,
      relevanceScore,
      matchingTagsCount
    };
  });

  // Sort by relevance score descending
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scored;
}
