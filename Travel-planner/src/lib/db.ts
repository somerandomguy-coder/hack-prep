import { POI } from './types';
import { SEED_POIS } from './seed';

// In-Memory SQLite Table abstraction guaranteeing 100% deterministic SQL behavior
class SqlitePoisTable {
  private rows: POI[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.rows = [...SEED_POIS];
  }

  // Mimics SQL: SELECT * FROM pois WHERE LOWER(city) = LOWER(:city) AND estimated_cost <= :maxCost ORDER BY rating DESC
  public query(city: string, maxDailyBudget: number): POI[] {
    const targetCity = city.toLowerCase();
    
    return this.rows
      .filter(poi => {
        const cityMatches = poi.city.toLowerCase() === targetCity;
        const budgetMatches = poi.estimated_cost <= maxDailyBudget;
        return cityMatches && budgetMatches;
      })
      .sort((a, b) => b.rating - a.rating);
  }

  public getAll(): POI[] {
    return [...this.rows];
  }
}

const poisTable = new SqlitePoisTable();

export async function getDbAsync() {
  return poisTable;
}

export function queryPoisFromDb(city: string, maxDailyBudget: number): POI[] {
  return poisTable.query(city, maxDailyBudget);
}
