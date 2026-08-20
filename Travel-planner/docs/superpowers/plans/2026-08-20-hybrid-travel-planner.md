# Hybrid Deterministic Travel Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a rapid proof-of-concept travel planner using Next.js, SQLite, and a 4-stage hybrid deterministic pipeline (Intent Parsing -> Deterministic SQL Filter -> Spatial Routing & Budget Scheduler -> Narrative Synthesizer) with an interactive glassmorphic web interface and `POST /api/plan` endpoint.

**Architecture:** A Next.js (TypeScript) full-stack application using SQLite (`better-sqlite3` / `sqlite3`) as a local database for POI candidates. Stage 1 extracts structured JSON intent; Stage 2 queries SQLite for candidates matching city, price, and vibe; Stage 3 uses spatial proximity clustering (Haversine distance matrix) and strict knapsack-like daily budget bounding to produce sequenced itineraries with transit metrics; Stage 4 synthesizes a narrative travel guide without altering deterministic outputs.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, SQLite (`better-sqlite3`), Vanilla CSS (glassmorphism dark mode), Jest / Node test runner.

## Global Constraints

- Isolated local execution without paid external network APIs.
- Total daily itinerary cost MUST NOT exceed `daily_budget_max`.
- Spatial routing MUST minimize geographic distance and eliminate backtracking between consecutive daily time slots.
- Data schema for `pois` table MUST match exact fields: `id`, `city`, `name`, `category`, `lat`, `lng`, `price_tier`, `estimated_cost`, `rating`, `vibe_tags`, `best_time`, `description`.
- `POST /api/plan` endpoint MUST accept `{ "prompt": string }` and return strict JSON execution result.

---

### Task 1: Next.js Project Setup & Design System Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: N/A
- Produces: Base Next.js App Router setup with Vanilla CSS styling tokens.

- [ ] **Step 1: Create package.json and project configuration**

```json
{
  "name": "travel-planner",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node --test dist/**/*.test.js"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "better-sqlite3": "^9.4.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.9",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: Create Vanilla CSS Dark Mode Glassmorphism Tokens (`src/app/globals.css`)**

```css
:root {
  --bg-primary: #0b0f19;
  --bg-card: rgba(18, 24, 38, 0.7);
  --bg-card-hover: rgba(28, 36, 56, 0.85);
  --border-color: rgba(255, 255, 255, 0.1);
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --accent-cyan: #00f2fe;
  --accent-indigo: #4facfe;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --radius-lg: 16px;
  --radius-md: 10px;
  --shadow-glow: 0 8px 32px 0 rgba(0, 242, 254, 0.15);
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
```

- [ ] **Step 3: Verify initial server setup**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

---

### Task 2: SQLite Data Layer & Sydney Seed Dataset

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/seed.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: N/A
- Produces: `getDb()`, `seedDatabase()`, `queryPois(city, maxPrice, vibeTags)` returning `POI[]`.

- [ ] **Step 1: Write type definitions (`src/lib/types.ts`)**

```typescript
export interface POI {
  id: string;
  city: string;
  name: string;
  category: 'cafe' | 'activity' | 'food' | 'sight';
  lat: number;
  lng: number;
  price_tier: number; // 1 ($), 2 ($$), 3 ($$$)
  estimated_cost: number;
  rating: number;
  vibe_tags: string[]; // parsed from JSON text
  best_time: 'morning' | 'afternoon' | 'evening';
  description: string;
}

export interface IntentSchema {
  city: string;
  days: number;
  daily_budget_max: number;
  vibe_tags: string[];
  pacing: 'relaxed' | 'moderate' | 'intense';
  time_slots_per_day: ('morning' | 'afternoon' | 'evening')[];
}

export interface TransitInfo {
  dist_km: number;
  time_min: number;
}

export interface SlotAssignment extends POI {
  transit_from_prev?: TransitInfo;
}

export interface DaySchedule {
  day: number;
  total_cost: number;
  budget_max: number;
  budget_satisfied: boolean;
  total_distance_km: number;
  total_transit_min: number;
  slots: {
    morning?: SlotAssignment;
    afternoon?: SlotAssignment;
    evening?: SlotAssignment;
  };
}

export interface PlanResult {
  success: boolean;
  intent: IntentSchema;
  candidate_count: number;
  schedule: DaySchedule[];
  narrative: string;
}
```

- [ ] **Step 2: Implement SQLite initialization & seed script (`src/lib/db.ts` & `src/lib/seed.ts`)**

Create `src/lib/db.ts` to manage the SQLite connection and seed 20 Sydney POIs (Single O, Bondi to Coogee Walk, Opera House, Rocks Night Market, Grounds of Alexandria, Botanic Garden, Barangaroo, Manly Ferry, etc.).

- [ ] **Step 3: Write test for SQLite DB queries (`tests/db.test.ts`)**

Verify table creation, seeding, and filtering by city and budget.

---

### Task 3: Stage 1 Intent Parsing Engine

**Files:**
- Create: `src/lib/pipeline/stage1_intent.ts`
- Test: `tests/stage1.test.ts`

**Interfaces:**
- Consumes: Natural language prompt string
- Produces: `parseIntent(prompt: string): IntentSchema`

- [ ] **Step 1: Write failing unit test for Intent Parser (`tests/stage1.test.ts`)**

```typescript
// Test parsing "3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks, relaxed pace"
// Expect city="Sydney", days=3, daily_budget_max=50, vibe_tags includes "coffee" & "coastal", pacing="relaxed"
```

- [ ] **Step 2: Implement Stage 1 Intent Parser (`src/lib/pipeline/stage1_intent.ts`)**

Implement keyword matching, regex rules for days (`\d+\s*days`), budget (`\$?\d+\s*(?:/day|per day)?`), city detection ("Sydney", "Tokyo"), and vibe tag extraction ("coffee", "coastal", "walk", "nature", "food", "sight", "scenic", "culture").

- [ ] **Step 3: Run unit test to verify PASS**

---

### Task 4: Stage 2 Deterministic SQL Candidate Filter

**Files:**
- Create: `src/lib/pipeline/stage2_filter.ts`
- Test: `tests/stage2.test.ts`

**Interfaces:**
- Consumes: `IntentSchema`
- Produces: `selectCandidates(intent: IntentSchema): POI[]`

- [ ] **Step 1: Write failing unit test for candidate filtering (`tests/stage2.test.ts`)**

Test filtering POIs for budget limit $50/day and tag relevance ranking.

- [ ] **Step 2: Implement Stage 2 (`src/lib/pipeline/stage2_filter.ts`)**

Filter SQLite `pois` table by city and cost ceiling. Calculate candidate relevance score:
$$\text{Score} = (\text{matching\_vibe\_tags} \times 2.0) + \text{rating}$$
Rank candidates and return top matching candidates per category.

- [ ] **Step 3: Run test to verify PASS**

---

### Task 5: Stage 3 Deterministic Spatial Routing & Budget Scheduler Engine

**Files:**
- Create: `src/lib/pipeline/stage3_router.ts`
- Test: `tests/stage3.test.ts`

**Interfaces:**
- Consumes: `candidates: POI[]`, `intent: IntentSchema`
- Produces: `buildSchedule(candidates: POI[], intent: IntentSchema): DaySchedule[]`

- [ ] **Step 1: Write failing unit test (`tests/stage3.test.ts`)**

Verify:
1. `total_cost <= daily_budget_max` for every day.
2. Sequential time slots (`morning` -> `afternoon` -> `evening`) have calculated Haversine distance ($km$) and transit time ($min$).
3. POIs grouped spatially to prevent backtracking.

- [ ] **Step 2: Implement Haversine formula & spatial scheduler (`src/lib/pipeline/stage3_router.ts`)**

Calculate Haversine distance:
$$d = 2 \cdot 6371 \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)}\right)$$
Group POIs by geographic proximity for each day ($1..N$). Assign morning (cafes/gardens), afternoon (sights/walks), evening (dining/viewpoints). Perform greedy substitution if daily total cost exceeds `daily_budget_max`.

- [ ] **Step 3: Run tests to verify PASS**

---

### Task 6: Stage 4 Narrative Synthesizer & Main Pipeline Orchestrator

**Files:**
- Create: `src/lib/pipeline/stage4_narrative.ts`
- Create: `src/lib/pipeline/orchestrator.ts`
- Test: `tests/pipeline.test.ts`

**Interfaces:**
- Consumes: Raw user prompt string
- Produces: `runPipeline(prompt: string): Promise<PlanResult>`

- [ ] **Step 1: Implement Stage 4 Narrative Synthesizer (`src/lib/pipeline/stage4_narrative.ts`)**

Format pre-calculated `DaySchedule[]` into structured markdown narrative with travel tips, daily cost summary, and transit advice.

- [ ] **Step 2: Implement `runPipeline` in `src/lib/pipeline/orchestrator.ts`**

Chains Stage 1 -> Stage 2 -> Stage 3 -> Stage 4. Returns complete `PlanResult`.

- [ ] **Step 3: Test end-to-end pipeline execution**

---

### Task 7: API Endpoint (`POST /api/plan`)

**Files:**
- Create: `src/app/api/plan/route.ts`
- Test: `tests/api.test.ts`

**Interfaces:**
- Consumes: HTTP POST JSON `{ "prompt": string }`
- Produces: HTTP 200 JSON `PlanResult`

- [ ] **Step 1: Implement Next.js App Router Route Handler (`src/app/api/plan/route.ts`)**

- [ ] **Step 2: Write API integration test**

Verify POST payload parsing and response structure.

---

### Task 8: Interactive Web UI Dashboard

**Files:**
- Create: `src/components/PromptInput.tsx`
- Create: `src/components/PipelineVisualizer.tsx`
- Create: `src/components/ItineraryView.tsx`
- Create: `src/components/MapVisualizer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: User interaction on web UI
- Produces: Interactive 4-stage pipeline visualizer, daily schedule timeline, budget guarantee badges, and spatial SVG route map.

- [ ] **Step 1: Build client components with glassmorphic styling**
- [ ] **Step 2: Connect frontend to `/api/plan`**

---

### Task 9: End-to-End Verification & Goal Completion Audit

- [ ] **Step 1: Run full test suite and verify build**
- [ ] **Step 2: Validate deterministic budget compliance across multiple prompts**
- [ ] **Step 3: Document walkthrough and complete goal**
