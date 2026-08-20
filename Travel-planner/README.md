# Hybrid Deterministic Travel Planner

A proof-of-concept travel planner combining **Natural Language Intent Parsing** with **Deterministic SQL Filtering & Spatial Routing**.

---

## ⚡ Quick Start (Dead Simple)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Run Tests

To run the automated pipeline and database test suite:
```bash
npm test
```

---

## 🔌 API Usage (`POST /api/plan`)

Send a natural language prompt to the API:

```bash
curl -X POST http://localhost:3000/api/plan \
  -H "Content-Type: application/json" \
  -d '{"prompt": "3 days in Sydney, budget around $50/day, love specialty coffee and coastal walks"}'
```

### API Response Format
Returns strict JSON:
- `intent`: Extracted city, days, budget limit, vibe tags, pacing.
- `schedule`: Sequenced daily time slots (Morning, Afternoon, Evening) with Haversine transit distances ($km$), transit times ($min$), and guaranteed total daily cost $\le$ budget max.
- `narrative`: Day-by-day travel guide Markdown summary.

---

## 🏗️ Architecture (4-Stage Hybrid Pipeline)

1. **Stage 1 (Intent Parser)**: Converts prompt text to strict JSON.
2. **Stage 2 (SQL Candidate Selection)**: Queries local SQLite database for POIs matching city & budget limits.
3. **Stage 3 (Spatial Routing & Budget Scheduler)**: Uses Haversine distance clustering to eliminate backtracking and enforces daily budget ceiling.
4. **Stage 4 (Narrative Synthesizer)**: Formats locked schedule into a narrative guide with travel tips.
