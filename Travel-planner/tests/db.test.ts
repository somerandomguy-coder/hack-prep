import assert from 'node:assert';
import { test, describe } from 'node:test';
import { getDbAsync, queryPoisFromDb } from '../src/lib/db';

describe('SQLite Database Layer', () => {
  test('initializes SQLite database table with Sydney POIs', async () => {
    const db = await getDbAsync();
    const allPois = db.getAll();
    assert.strictEqual(allPois.length >= 20, true, 'Database should contain at least 20 POIs');
  });

  test('filters POIs by city and budget via SQL query logic', () => {
    const pois = queryPoisFromDb('Sydney', 50);
    assert.strictEqual(pois.length > 0, true, 'Should find POIs in Sydney under $50');
    for (const poi of pois) {
      assert.strictEqual(poi.city.toLowerCase(), 'sydney');
      assert.strictEqual(poi.estimated_cost <= 50, true);
    }
  });
});
