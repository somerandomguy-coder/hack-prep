# Design Document: Hybrid Deterministic Travel Planner

**Date**: 2026-08-20  
**Stack**: Next.js (TypeScript) + SQLite (`better-sqlite3`) + Vanilla CSS  
**Architecture**: 4-Stage Hybrid Pipeline (LLM / Rule Intent Parsing -> Deterministic SQL Filter -> Haversine Spatial Routing & Budget Scheduler -> Narrative Synthesizer)

---

## 1. Executive Overview

The **Hybrid Deterministic Travel Planner** combines natural language intent understanding with deterministic, mathematical guarantees for travel planning. 

Traditional LLM travel planners often invent non-existent locations, violate hard budget constraints, or construct logically absurd travel routes with massive geographic backtracking. This system eliminates those issues by delegating candidate selection, cost budgeting, spatial clustering, and itinerary sequencing to deterministic code and SQL, using natural language processing strictly at the input interface (Intent Parsing) and output interface (Narrative Synthesis).

---

## 2. System Architecture & 4-Stage Pipeline

```
+-------------------------------------------------------------------------------+
| Stage 1: Intent Parsing                                                       |
| Input: Raw Natural Language Prompt                                            |
| Output: Strict JSON Intent (city, days, daily_budget_max, vibe_tags, pacing)  |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| Stage 2: Deterministic Filter & Candidate Selection                           |
| Backend: SQL Query on `pois` SQLite table                                     |
| Filters: city match, price_tier <= budget, vibe_tags overlap, rating          |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| Stage 3: Deterministic Routing & Budget Scheduler                             |
| Algorithm: Spatial proximity clustering (Haversine distance matrix)           |
| Enforces: Morning/Afternoon/Evening assignment + Daily Budget <= max_budget  |
| Output: Sequenced Schedule JSON + Distance (km) & Transit Time (min) metrics   |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
| Stage 4: Narrative Synthesizer                                                |
| Transforms pre-calculated Schedule JSON into an engaging, narrative guide      |
+-------------------------------------------------------------------------------+
```

### Stage Details

1. **Stage 1 (Intent Parsing)**
   - Extract parameters:
     - `city` (default: "Sydney")
     - `days` (integer, default: 3, max: 7)
     - `daily_budget_max` (number in USD/AUD, default: 60)
     - `vibe_tags` (string array, e.g., `["coffee", "nature", "scenic", "food"]`)
     - `pacing` ("relaxed" | "moderate" | "intense")
     - `time_slots_per_day` (`["morning", "afternoon", "evening"]`)
   - Uses robust NLP keyword matching & regex rule parser with fallback pattern extractors for 100% offline isolation, expandable with local/cloud LLMs.

2. **Stage 2 (Deterministic SQL Candidate Selection)**
   - Query SQLite `pois` table:
     - `WHERE city = :city AND estimated_cost <= :daily_budget_max`
     - Score candidates by tag match count, rating, and best_time relevance.
     - Fetch pool of top candidate POIs across morning, afternoon, and evening categories.

3. **Stage 3 (Deterministic Spatial Routing & Scheduler)**
   - **Spatial Clustering**: Calculates Haversine distances $d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$ between all candidate pairs.
   - Groups POIs into daily geographical clusters to minimize total travel distance and eliminate backtracking.
   - **Time Slot Assignment**:
     - Morning: Cafes / breakfast / gardens
     - Afternoon: Sights / coastal walks / activities / lunch
     - Evening: Dining / viewpoints / night markets
   - **Budget Constraint Verification**: Checks $\sum \text{estimated\_cost}_{\text{day}} \le \text{daily\_budget\_max}$. If a POI exceeds daily budget remaining, substitutes with lower-cost candidate or free activity (e.g. public parks, scenic lookouts).
   - Computes sequential transit distance ($km$) and transit time ($min$) assuming standard urban transit speed ($25\text{ km/h}$).

4. **Stage 4 (Narrative Synthesizer)**
   - Receives the locked, deterministic Schedule JSON.
   - Formats a vivid day-by-day travel narrative featuring local tips, travel duration commentary, and itinerary highlights without altering any names, costs, or sequence.

---

## 3. Data Schema & Seed Dataset

### SQLite Table (`pois`)
```sql
CREATE TABLE IF NOT EXISTS pois (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,          -- 'cafe', 'activity', 'food', 'sight'
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    price_tier INTEGER NOT NULL,     -- 1 ($), 2 ($$), 3 ($$$)
    estimated_cost REAL NOT NULL,    -- Cost in local currency/USD
    rating REAL NOT NULL,            -- e.g. 4.8
    vibe_tags TEXT NOT NULL,         -- JSON array: ["coffee", "coastal", "walk"]
    best_time TEXT NOT NULL,         -- 'morning', 'afternoon', 'evening'
    description TEXT NOT NULL
);
```

### Seed Data (Sydney - 20 Curated POIs)
1. **Single O Surry Hills** (Cafe, Morning, $15, tags: coffee, food, trendy)
2. **Bondi to Coogee Coastal Walk** (Activity, Afternoon, $0, tags: coastal, walk, nature, scenic)
3. **Sydney Opera House & Circular Quay** (Sight, Afternoon/Morning, $25, tags: landmark, scenic, culture)
4. **The Rocks Historic Quarter & Night Market** (Food/Activity, Evening, $20, tags: market, food, history, nightlife)
5. **The Grounds of Alexandria** (Cafe/Activity, Morning, $22, tags: coffee, food, instagrammable, garden)
6. **Royal Botanic Garden Sydney** (Sight/Activity, Morning/Afternoon, $0, tags: nature, walk, scenic, park)
7. **Barangaroo Reserve & Crown Observation** (Sight/Activity, Evening, $0, tags: scenic, sunset, walk)
8. **Manly Ferry & Shelly Beach** (Activity, Afternoon, $10, tags: coastal, ferry, beach, scenic)
9. **Celsius Coffee Co. Kirribilli** (Cafe, Morning, $18, tags: coffee, harbor, view, breakfast)
10. **Taronga Zoo Waterfront** (Activity, Afternoon, $40, tags: nature, wildlife, view)
11. **Hubert Underground French Restaurant** (Food, Evening, $45, tags: food, dining, jazz, romantic)
12. **Coogee Pavilion Rooftop** (Food/Activity, Evening, $30, tags: food, sunset, ocean, vibe)
13. **Art Gallery of New South Wales** (Sight, Afternoon, $0, tags: art, culture, museum)
14. **Edition Roasters Haymarket** (Cafe, Morning, $16, tags: coffee, Japanese, minimalist)
15. **Mr Wong Chinese Dining** (Food, Evening, $40, tags: food, dining, Cantonese)
16. **Watsons Bay & Camp Cove Walk** (Activity, Afternoon, $8, tags: coastal, walk, beach)
17. **Mary's Newtown Burger Bar** (Food, Evening, $18, tags: food, casual, rock, craft beer)
18. **Room 10 Espresso Potts Point** (Cafe, Morning, $14, tags: coffee, breakfast, local)
19. **Observatory Hill Park** (Sight, Evening, $0, tags: sunset, picnic, view, romantic)
20. **Spit to Manly Coastal Track** (Activity, Afternoon, $0, tags: coastal, walk, nature, hiking)

---

## 4. Web Interface & UI Design

- **Theme**: Premium Dark Glassmorphism with neon accents (Cyan `#00f2fe`, Indigo `#4facfe`, Emerald `#10b981`).
- **Typography**: Google Fonts Inter / Outfit.
- **Interactive Components**:
  1. **Header & Prompt Input**: Search box with preset prompt tags ("3 days Sydney coastal & coffee", "2 days relaxed budget Sydney", "1 day iconic landmarks").
  2. **Pipeline Progress Flow**: 4 visual stage cards showing live processing & output:
     - Stage 1: Extracted JSON parameters
     - Stage 2: Filtered POI candidates & SQL query count
     - Stage 3: Spatial Routing Map / Matrix & daily budget verification
     - Stage 4: Narrative synthesis
  3. **Itinerary Timeline View**: Day-by-Day schedule card layout:
     - Morning, Afternoon, Evening cards with category badge, cost tag, vibe tags.
     - Inter-slot distance ($km$) and transit time ($min$) connector indicator.
     - Daily Summary Header: Total daily cost vs Daily Budget Limit (with green check guarantee badge).
  4. **Interactive Map / Spatial Visualizer**: SVG/Canvas geographic map visualization showing POI nodes and sequential daily paths.

---

## 5. API Specification

### `POST /api/plan`
**Request Body**:
```json
{
  "prompt": "3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace"
}
```

**Response Body**:
```json
{
  "success": true,
  "intent": {
    "city": "Sydney",
    "days": 3,
    "daily_budget_max": 50,
    "vibe_tags": ["coffee", "coastal", "walk", "nature"],
    "pacing": "relaxed",
    "time_slots_per_day": ["morning", "afternoon", "evening"]
  },
  "candidate_count": 18,
  "schedule": [
    {
      "day": 1,
      "total_cost": 33.0,
      "budget_max": 50.0,
      "budget_satisfied": true,
      "total_distance_km": 4.2,
      "total_transit_min": 18,
      "slots": {
        "morning": { "id": "poi_1", "name": "Single O Surry Hills", "cost": 15.0, "category": "cafe", "lat": -33.8812, "lng": 151.2093 },
        "afternoon": { "id": "poi_2", "name": "Bondi to Coogee Coastal Walk", "cost": 0.0, "category": "activity", "lat": -33.8915, "lng": 151.2767, "transit_from_prev": { "dist_km": 6.3, "time_min": 22 } },
        "evening": { "id": "poi_17", "name": "Mary's Newtown Burger Bar", "cost": 18.0, "category": "food", "lat": -33.8958, "lng": 151.1798, "transit_from_prev": { "dist_km": 9.1, "time_min": 30 } }
      }
    }
  ],
  "narrative": "### Day 1: Surry Hills Coffee & Coastal Wonders\nStart your morning at Single O..."
}
```

---

## 6. Verification & Quality Assurance

1. **Deterministic Budget Test**: Run algorithm against high, medium, and ultra-low budget inputs ($20/day) to verify that zero itineraries exceed `daily_budget_max`.
2. **Spatial Route Efficiency Test**: Ensure no geographic backtracking occurs between sequential time slots.
3. **API Endpoint Test**: Validate `POST /api/plan` returns strict, compliant JSON matching the system specification.
