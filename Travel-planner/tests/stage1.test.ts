import assert from 'node:assert';
import { test, describe } from 'node:test';
import { parseIntent } from '../src/lib/pipeline/stage1_intent';

describe('Stage 1: Intent Parsing', () => {
  test('parses unstructured prompt correctly', () => {
    const prompt = "3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace";
    const intent = parseIntent(prompt);

    assert.strictEqual(intent.city, 'Sydney');
    assert.strictEqual(intent.days, 3);
    assert.strictEqual(intent.daily_budget_max, 50);
    assert.strictEqual(intent.pacing, 'relaxed');
    assert.strictEqual(intent.vibe_tags.includes('coffee'), true);
    assert.strictEqual(intent.vibe_tags.includes('coastal'), true);
    assert.strictEqual(intent.vibe_tags.includes('walk'), true);
    assert.deepStrictEqual(intent.time_slots_per_day, ['morning', 'afternoon', 'evening']);
  });

  test('provides sensible defaults for missing parameters', () => {
    const prompt = "Trip to Sydney";
    const intent = parseIntent(prompt);

    assert.strictEqual(intent.city, 'Sydney');
    assert.strictEqual(intent.days, 3);
    assert.strictEqual(intent.daily_budget_max, 60);
    assert.strictEqual(intent.vibe_tags.length > 0, true);
  });
});
