import assert from 'node:assert';
import { test, describe } from 'node:test';
import { runPipeline } from '../src/lib/pipeline/orchestrator';

describe('Full 4-Stage Pipeline Integration', () => {
  test('executes end-to-end pipeline for 3-day Sydney prompt', () => {
    const result = runPipeline("3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace");

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.intent.city, 'Sydney');
    assert.strictEqual(result.intent.days, 3);
    assert.strictEqual(result.intent.daily_budget_max, 50);
    assert.strictEqual(result.schedule.length, 3);
    assert.strictEqual(result.pipeline_stages?.length, 4);

    // Verify budget compliance for all 3 days
    for (const day of result.schedule) {
      assert.strictEqual(day.total_cost <= 50, true);
    }

    // Verify narrative content
    assert.strictEqual(result.narrative.includes('Sydney'), true);
    assert.strictEqual(result.narrative.includes('Day 1'), true);
  });
});
