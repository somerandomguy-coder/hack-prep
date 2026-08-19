# ⚡ BuildTogether — Builder-to-Builder Micro-MVP Network

> **Hackathon Subproject**: A high-density collaboration platform designed to eliminate contributor onboarding friction. Built around concrete execution stages, explicit skill-void role slots, and instant context onboarding dockets.

---

## 🚀 Quick Start (Setup & Run)

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm** or **pnpm** / **yarn**

### 2. Installation
Navigate to this subfolder (`BuildTogether`) and install dependencies:

```bash
cd BuildTogether
npm install
```

### 3. Run Dev Server
Start the local development server:

```bash
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

### 4. Build for Production (Optional)
To verify TypeScript compilation and bundle production assets:

```bash
npm run build
```

---

## 🎯 What Makes This Different? (The Hackathon Wedge)

Most side projects die not because of bad ideas, but because onboarding a new collaborator takes weeks of context dumping. Generic platforms (Discord, Trello, AngelList) fail because:
- **Discord / Reddit**: Endless chat messages, zero technical structure, ghosted contributors.
- **Trello / Notion**: Bloated Kanban boards with no skill matching.
- **AngelList / Wellfound**: Built for formal corporate Series A hires with equity/salaries.

**BuildTogether's Solution**:
1. **Execution Stages Instead of Funding Rounds**:
   - `[Blueprint / Spec]` &rarr; Wireframes & data schemas defined.
   - `[Scaffolding]` &rarr; Base repo up, core stack chosen.
   - `[Alpha / MVP Live]` &rarr; Working prototype needs polish/scaling.
   - `[Ship & Distribute]` &rarr; Production tool ready for distribution.
2. **Context Onboarding Docket**: A single drawer providing the architecture flow, stack breakdown, and key endpoints.
3. **The "First Good Issue" (30-Minute Entry Task)**: Quick-win test of team synergy with code snippets and acceptance checklists.
4. **Explicit Role Slots**: Defined skill voids with weekly hour expectations (e.g. `[⚡ Open: Frontend (React) - ~6h/wk]`).

---

## 🕹️ Demo Tour & Features to Explore

Follow this 2-minute tour to test all key features:

1. **Smart AI Matching Toggle**:
   - Look at the top banner or click **"Match to Profile"** in the top header.
   - Notice how the recommendation engine filters and highlights builds matching your skillset (`Python`, `FastAPI`, `Go`).

2. **Stage & Stack Filters**:
   - Click stage pills (`All`, `Blueprint`, `Scaffolding`, `Alpha`, `Ship`).
   - Click tech stack chips (`FastAPI`, `Go`, `PyTorch`, `React`, `Docker`) or toggle **"Has Open Slots"** and **"Bookmarked"**.
   - Press `/` on your keyboard to quick-focus the search bar.

3. **Context Onboarding Docket**:
   - Click on the **"PulseStream AI"** card or **"View Docket & Join"**.
   - **Tab 1 (Architecture & Stack)**: View backend/frontend/data specs, ASCII architecture diagram, and key API endpoints.
   - **Tab 2 (First Good Issue - 30m)**: Interactive quick-win task card. Test checking off the acceptance criteria checkboxes and copying the starter code snippet.
   - **Tab 3 (Open Roles)**: Inspect required skillsets and weekly commitments. Click **"Claim Slot & Join"**, type a quick note, and submit to see celebratory confetti + instant workspace access credentials (repo clone command & Discord invite).
   - **Tab 4 (Milestones & Roadmap)**: View deliverable progression and current blocker flags.

4. **Post a Build**:
   - Click the **"Post a Build"** button in the header.
   - Fill in project details, pick an execution milestone, add custom tags, configure role slots, and specify a 1st Good Issue.
   - Click **"Publish Build Docket"** &rarr; your new build instantly appears in the live feed.

5. **Pitch & Wedge Strategy Guide**:
   - Click the **"Pitch & Wedge Guide"** button in the header to view the 3-minute hackathon pitch script and competitive matrix.

6. **Developer Profile Modal**:
   - Click your user badge in the header (`Nam Lê • Backend / ML`).
   - Adjust your available weekly hours slider or toggle skills to see the Smart Match banner dynamically adapt.

---

## 🧱 Project Structure

```
BuildTogether/
├── index.html                  # HTML entry point with Google Fonts (Inter + JetBrains Mono)
├── package.json                # Dependencies (React 19, Tailwind, Lucide, Canvas Confetti)
├── tailwind.config.js          # Dark theme colors, glow effects & monospace typography
├── src/
│   ├── main.tsx                # React root entry
│   ├── App.tsx                 # Core state, multi-filtering & modal manager
│   ├── index.css               # Tailwind directives & glassmorphism utilities
│   ├── types/
│   │   └── index.ts            # TypeScript models (Project, RoleSlot, FirstGoodIssue, etc.)
│   ├── data/
│   │   └── mockProjects.ts     # Realistic developer projects (PulseStream, SyncLite, KubeLens, etc.)
│   ├── utils/
│   │   └── colors.ts           # Execution stage badge & category color mapping
│   └── components/
│       ├── Header.tsx              # Top navigation, search, profile match & CTAs
│       ├── SmartMatchBanner.tsx    # Recommendation engine banner
│       ├── FilterBar.tsx           # Execution stage pills & stack tags
│       ├── ProjectCard.tsx         # GitHub-issue / Discord-forum style cards
│       ├── DocketDrawer.tsx        # Context Onboarding Docket slide-over drawer
│       ├── PostBuildModal.tsx      # Project creation modal with role generator
│       ├── UserProfileModal.tsx    # User profile & skill configuration
│       ├── PitchModeGuide.tsx      # Hackathon pitch & wedge guide
│       ├── Toast.tsx               # Toast notification system
│       └── icons/
│           └── GithubIcon.tsx      # GitHub SVG icon component
└── README.md                   # Setup guide & exploration walkthrough
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS 3.4 (Custom dark aesthetic: Linear / Raycast / GitHub inspired)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti (instant workspace reward animations)
