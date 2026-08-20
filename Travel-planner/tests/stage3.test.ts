import assert from 'node:assert';
import { test, describe } from 'node:test';
import { parseIntent } from '../src/lib/pipeline/stage1_intent';
import { selectCandidates } from '../src/lib/pipeline/stage2_filter';
import { buildSchedule, haversineDistance } from '../src/lib/pipeline/stage3_router';

describe('Stage 3: Spatial Routing & Budget Scheduler', () => {
  test('calculates Haversine distance correctly', () => {
    // Opera House (-33.8568, 151.2153) to Bondi Beach (-33.8915, 151.2767)
    const dist = haversineDistance(-33.8568, 151.2153, -33.8915, 151.2767);
    assert.strictEqual(dist > 5 && dist < 10, true, `Distance should be ~6.8km, got ${dist}km`);
  });

  test('enforces daily budget ceiling and builds 3-day schedule', () => {
    const intent = parseIntent("3 days in Sydney, budget around $50/day, love coffee and coastal walks");
    const candidates = selectCandidates(intent);
    const schedule = buildSchedule(candidates, intent);

    assert.strictEqual(schedule.length, 3, 'Should generate 3 days of itineraries');

    for (const day of schedule) {
      assert.strictEqual(day.total_cost <= day.budget_max, true, `Day ${day.day} cost $${day.total_cost} exceeds max $${day.budget_max}`);
      assert.strictEqual(day.budget_satisfied, true);
      assert.notStrictEqual(day.slots.morning, undefined);
      assert.notStrictEqual(day.slots.afternoon, undefined);
      assert.notStrictEqual(day.slots.evening, undefined);

      // Verify transit metrics exist
      assert.strictEqual(typeof day.slots.afternoon?.transit_from_prev?.dist_km, 'number');
      assert.strictEqual(typeof day.slots.evening?.transit_from_prev?.dist_km, 'number');
    }
  });
});
