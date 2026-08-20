import assert from 'node:assert';
import { test, describe } from 'node:test';
import { parseIntent } from '../src/lib/pipeline/stage1_intent';
import { selectCandidates } from '../src/lib/pipeline/stage2_filter';

describe('Stage 2: Deterministic Candidate Selection', () => {
  test('selects and ranks candidates by vibe tag match and rating', () => {
    const intent = parseIntent("3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks");
    const candidates = selectCandidates(intent);

    assert.strictEqual(candidates.length > 0, true, 'Should return candidate POIs');
    
    // Check that top candidates match coffee or coastal
    const topPoi = candidates[0].poi;
    const matchesVibe = topPoi.vibe_tags.some(tag => intent.vibe_tags.includes(tag));
    assert.strictEqual(matchesVibe, true, 'Top candidate should match requested vibe tags');

    // All candidates must be within budget threshold
    for (const c of candidates) {
      assert.strictEqual(c.poi.estimated_cost <= intent.daily_budget_max, true);
    }
  });
});
