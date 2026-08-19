import { Project, CurrentUser } from '../types';

export const initialCurrentUser: CurrentUser = {
  name: 'Nam Lê',
  handle: '@namle',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  primaryRole: 'Backend & ML Systems',
  skills: ['Python', 'FastAPI', 'PyTorch', 'Go', 'PostgreSQL', 'Redis', 'Docker'],
  availableHoursPerWeek: 8,
  bio: 'Building distributed pipelines and ML backend microservices. Looking for frontend/design co-builders.',
  github: 'https://github.com/namle-dev',
  claimedRoleIds: [],
  claimedIssueIds: [],
  bookmarkedProjectIds: ['project-1', 'project-2'],
};

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'PulseStream AI',
    tagline: 'Real-time multi-speaker audio transcription & semantic diarization pipeline.',
    description: 'High-throughput async audio stream processing pipeline built on Whisper and FastAPI. Backend and GPU chunking architecture are fully implemented; we need a frontend co-builder to craft the reactive waveform UI and timeline editor.',
    stage: 'Scaffolding',
    stageProgress: 55,
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Redis', 'React', 'Tailwind'],
    creator: {
      name: 'Alex Vance',
      handle: '@alexv',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'ML Infrastructure Architect',
      verified: true,
      github: 'alexv-ml',
    },
    teamMembers: [
      {
        name: 'Alex Vance',
        handle: '@alexv',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'ML Lead & Backend',
        github: 'alexv-ml',
      },
      {
        name: 'Elena Rostova',
        handle: '@elena_r',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'Data Pipeline Engineer',
        github: 'erostova',
      }
    ],
    maxTeamSize: 4,
    stars: 84,
    views: 420,
    postedAt: '2 hours ago',
    matchScore: 98,
    matchReason: 'Direct stack overlap with your FastAPI & Python background. Looking for Scaffolding stage collaborators.',
    discordInviteUrl: 'https://discord.gg/pulsestream-dev',
    repoCloneCommand: 'git clone https://github.com/pulsestream/core.git',
    roleSlots: [
      {
        id: 'ps-role-1',
        title: 'Backend / Audio Streaming (Filled)',
        category: 'backend',
        status: 'filled',
        filledBy: {
          name: 'Alex Vance',
          handle: '@alexv',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'Core Backend',
        },
        commitmentHours: 12,
        requirements: ['Python 3.11+', 'FastAPI WebSockets', 'Redis Streams'],
        responsibilities: ['Maintain 100ms chunk processing buffer', 'GPU worker orchestration via Celery/Redis'],
      },
      {
        id: 'ps-role-2',
        title: 'Frontend / Reactive Timeline (Open)',
        category: 'frontend',
        status: 'open',
        commitmentHours: 6,
        requirements: ['React 18+', 'Tailwind CSS', 'Web Audio API / WaveSurfer.js experience'],
        responsibilities: ['Build interactive speaker timeline editor', 'Wire up WebSocket transcript live stream', 'Keyboard shortcut navigation for scrubbing'],
      },
      {
        id: 'ps-role-3',
        title: 'DevOps / CUDA Runner Deployment (Open)',
        category: 'devops',
        status: 'open',
        commitmentHours: 4,
        requirements: ['Docker', 'NVIDIA Container Toolkit', 'Modal / RunPod serverless GPU'],
        responsibilities: ['Containerize GPU inference image', 'Configure auto-scaling queue worker thresholds'],
      }
    ],
    firstGoodIssue: {
      id: 'issue-ps-1',
      title: 'Build WebSocket client audio visualizer & live chunk progress bar',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Subscribe to `ws://localhost:8000/v1/stream/transcribe` and render a real-time dB audio amplitude level meter alongside incoming token word-by-word streaming.',
      acceptanceCriteria: [
        'Display audio frequency bar with 60fps canvas or CSS transform animation',
        'Append incoming JSON transcript tokens without UI stutter',
        'Handle reconnect exponential backoff with a clean toast notification'
      ],
      filesToTouch: ['src/components/AudioVisualizer.tsx', 'src/hooks/useTranscriptStream.ts'],
      starterSnippet: `// Quick snippet to verify WebSocket payload contract:
const ws = new WebSocket("ws://localhost:8000/v1/stream/transcribe");
ws.onmessage = (event) => {
  const { chunk_id, speaker_id, text, confidence } = JSON.parse(event.data);
  console.log(\`Speaker \${speaker_id}: \${text} (\${confidence}%)\`);
};`,
      status: 'open',
    },
    architecture: {
      summary: 'FastAPI async gateway receiving dual-channel PCM audio over WebSockets -> Redis queue -> batch Whisper-large-v3 GPU worker -> WebSocket push back to frontend with word timestamps.',
      backendStack: 'Python 3.12, FastAPI, Celery, PyTorch Whisper-Large-v3',
      frontendStack: 'Next.js 14 / React, Tailwind CSS, Zustand, WaveSurfer',
      dataLayer: 'Redis Streams (Buffer) + PostgreSQL (Persistent transcripts & search)',
      infraStack: 'Docker Compose (local dev), RunPod Serverless GPU (Prod inference)',
      keyEndpoints: [
        { method: 'WS', path: '/v1/stream/transcribe', desc: 'Bidirectional binary PCM stream & JSON token responses', authRequired: true },
        { method: 'POST', path: '/v1/sessions/new', desc: 'Initialize diarization session and retrieve worker routing key', authRequired: true },
        { method: 'GET', path: '/v1/transcripts/{id}', desc: 'Fetch full structured transcript with speaker turn timestamps', authRequired: false }
      ],
      architectureDiagramMarkdown: `\`\`\`
[Browser / Microphone]
         │ (Binary PCM WebSockets)
         ▼
[FastAPI Gateway] ──(Redis Stream Buffer)──► [GPU Inference Worker]
         │                                          │ (Whisper v3)
         ◄──(Real-time Token Push via WS)────────────┘
\`\`\``,
      githubUrl: 'https://github.com/pulsestream/pulsestream-core',
      specUrl: 'https://pulsestream.dev/docs/architecture-v1.pdf',
      figmaUrl: 'https://figma.com/@alexv/pulsestream-ui-draft',
    },
    milestones: [
      { id: 'm1', title: 'FastAPI WebSocket ingestion engine', stage: 'Blueprint / Spec', status: 'completed', owner: 'Alex Vance' },
      { id: 'm2', title: 'Whisper GPU batching & token streamer', stage: 'Scaffolding', status: 'completed', owner: 'Elena Rostova' },
      { id: 'm3', title: 'Next.js frontend with live waveform', stage: 'Scaffolding', status: 'in_progress', blockerNote: 'Awaiting frontend co-builder to take over UI components' },
      { id: 'm4', title: 'End-to-end latency benchmarks under 250ms', stage: 'Alpha / MVP Live', status: 'upcoming' },
      { id: 'm5', title: 'Public hacker launch on X and ProductHunt', stage: 'Ship & Distribute', status: 'upcoming' }
    ]
  },
  {
    id: 'project-2',
    title: 'SyncLite Engine',
    tagline: 'Zero-config local-first SQLite sync engine for offline-first React & mobile apps.',
    description: 'A lightweight CRDT-driven sync layer that mirrors local SQLite/IndexedDB databases to a central Go cluster with automatic delta conflict resolution.',
    stage: 'Blueprint / Spec',
    stageProgress: 25,
    techStack: ['Go', 'SQLite', 'TypeScript', 'WebAssembly', 'CRDT'],
    creator: {
      name: 'Elena Rostova',
      handle: '@elena_r',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'Distributed Systems Dev',
      verified: true,
      github: 'erostova',
    },
    teamMembers: [
      {
        name: 'Elena Rostova',
        handle: '@elena_r',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'Go Core Architect',
      }
    ],
    maxTeamSize: 3,
    stars: 126,
    views: 890,
    postedAt: '5 hours ago',
    matchScore: 92,
    matchReason: 'Strong match for your Go experience and interest in distributed sync architecture.',
    discordInviteUrl: 'https://discord.gg/synclite-engine',
    repoCloneCommand: 'git clone https://github.com/synclite/synclite-go.git',
    roleSlots: [
      {
        id: 'sl-role-1',
        title: 'Core Engine / Distributed Sync (Filled)',
        category: 'backend',
        status: 'filled',
        filledBy: {
          name: 'Elena Rostova',
          handle: '@elena_r',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          role: 'Core Architect',
        },
        commitmentHours: 10,
        requirements: ['Go 1.22+', 'SQLite Cgo / modernc.org', 'Vector clocks'],
        responsibilities: ['Implement logical timestamp transaction log', 'Replication server RPC protocol'],
      },
      {
        id: 'sl-role-2',
        title: 'WASM & TypeScript Client SDK (Open)',
        category: 'fullstack',
        status: 'open',
        commitmentHours: 8,
        requirements: ['TypeScript', 'WebAssembly / Emscripten or Rust wasm-pack', 'OPFS (Origin Private File System)'],
        responsibilities: ['Compile SQLite engine to WASM with OPFS backing', 'Write useSyncLite() React hooks library'],
      },
      {
        id: 'sl-role-3',
        title: 'Technical Writer & Quickstart Docs (Open)',
        category: 'growth',
        status: 'open',
        commitmentHours: 3,
        requirements: ['Markdown / Astro Starlight', 'Clear technical writing'],
        responsibilities: ['Build interactive playground documentation showing offline toggle sync'],
      }
    ],
    firstGoodIssue: {
      id: 'issue-sl-1',
      title: 'Implement basic LWW (Last-Write-Wins) timestamp conflict resolver in Go',
      difficulty: 'Moderate (~1-2h)',
      estimatedMinutes: 60,
      summary: 'Write a pure Go helper function `ResolveConflict(rowA, rowB RowChange) RowChange` that checks logical timestamps and breaks ties with lexicographical node ID ordering.',
      acceptanceCriteria: [
        'Deterministic resolution test suite passing 10+ edge cases',
        'Zero allocations on hot-path row comparison',
        'Includes unit tests in `pkg/crdt/lww_test.go`'
      ],
      filesToTouch: ['pkg/crdt/lww.go', 'pkg/crdt/lww_test.go'],
      starterSnippet: `type RowChange struct {
    RowID     string
    Column    string
    Value     []byte
    Timestamp uint64
    NodeID    string
}

func ResolveConflict(a, b RowChange) RowChange {
    if a.Timestamp > b.Timestamp { return a }
    if b.Timestamp > a.Timestamp { return b }
    if a.NodeID > b.NodeID { return a }
    return b
}`,
      status: 'open',
    },
    architecture: {
      summary: 'Client-side SQLite database compiled to WebAssembly storing changes into an append-only delta table. On connection, deltas are synchronized via lightweight HTTP/2 SSE streaming to the central Go coordinator.',
      backendStack: 'Go 1.22, ConnectRPC / gRPC-Web, BoltDB / SQLite metadata',
      frontendStack: 'TypeScript SDK, WebAssembly (SQLite via OPFS), React Hooks',
      dataLayer: 'Local SQLite (Client) + Central Postgres WAL / S3 cold snapshots',
      infraStack: 'Fly.io edge instances + Docker',
      keyEndpoints: [
        { method: 'POST', path: '/v1/sync/push', desc: 'Push encrypted client change deltas', authRequired: true },
        { method: 'GET', path: '/v1/sync/pull', desc: 'Server-Sent Events delta stream since cursor', authRequired: true },
        { method: 'GET', path: '/v1/healthz', desc: 'Node sync health check', authRequired: false }
      ],
      architectureDiagramMarkdown: `\`\`\`
[React App + WASM SQLite]
       │ (Push/Pull Deltas via SSE)
       ▼
[Go Coordinator Edge Node] ──(Consensus Log)──► [Global Postgres Hub]
\`\`\``,
      githubUrl: 'https://github.com/synclite/synclite-specs',
      specUrl: 'https://synclite.dev/spec-v0.1.md',
    },
    milestones: [
      { id: 'm2-1', title: 'Define CRDT mutation wire protocol', stage: 'Blueprint / Spec', status: 'completed', owner: 'Elena Rostova' },
      { id: 'm2-2', title: 'Go delta ingest handler & unit tests', stage: 'Blueprint / Spec', status: 'in_progress', blockerNote: 'Need conflict resolver function verified' },
      { id: 'm2-3', title: 'WASM SQLite wrapper with OPFS persistence', stage: 'Scaffolding', status: 'upcoming' },
      { id: 'm2-4', title: 'Sample offline Notes app demo', stage: 'Alpha / MVP Live', status: 'upcoming' }
    ]
  },
  {
    id: 'project-3',
    title: 'KubeLens Terminal',
    tagline: 'Zero-bloat TUI & Web Dashboard for multi-cluster Kubernetes log tracing.',
    description: 'A blazing-fast developer-first Kubernetes observability dashboard. Native Bubbletea TUI + companion React web view for engineers tired of heavy enterprise APM bills.',
    stage: 'Alpha / MVP Live',
    stageProgress: 75,
    techStack: ['Go', 'React', 'Tailwind', 'Docker', 'Kubernetes', 'GraphQL'],
    creator: {
      name: 'Marcus Chen',
      handle: '@mchen_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Platform & SRE Engineer',
      verified: true,
      github: 'mchen-ops',
    },
    teamMembers: [
      {
        name: 'Marcus Chen',
        handle: '@mchen_dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'TUI & Core Engine',
      },
      {
        name: 'Sarah Kim',
        handle: '@skim_k8s',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'K8s Controller & Auth',
      }
    ],
    maxTeamSize: 4,
    stars: 340,
    views: 1840,
    postedAt: '1 day ago',
    matchScore: 88,
    matchReason: 'Active alpha project with Docker/K8s/Go backend. Immediate UI issues to claim.',
    discordInviteUrl: 'https://discord.gg/kubelens',
    repoCloneCommand: 'git clone https://github.com/kubelens/kubelens.git',
    roleSlots: [
      {
        id: 'kl-role-1',
        title: 'Backend / K8s Client & TUI (Filled)',
        category: 'backend',
        status: 'filled',
        filledBy: {
          name: 'Marcus Chen',
          handle: '@mchen_dev',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Core Developer',
        },
        commitmentHours: 12,
        requirements: ['Go 1.22', 'client-go', 'Bubbletea TUI'],
        responsibilities: ['Maintain cluster watch streams', 'Terminal ANSI rendering'],
      },
      {
        id: 'kl-role-2',
        title: 'Frontend / Web UI Polish (Open)',
        category: 'frontend',
        status: 'open',
        commitmentHours: 5,
        requirements: ['React', 'Tailwind CSS', 'Virtual list / High performance canvas'],
        responsibilities: ['Build keyboard-driven pod log viewer', 'Add dark mode syntax highlighting for JSON logs'],
      },
      {
        id: 'kl-role-3',
        title: 'Security & RBAC Auditor (Open)',
        category: 'devops',
        status: 'open',
        commitmentHours: 3,
        requirements: ['Kubernetes RBAC', 'ServiceAccount scoping'],
        responsibilities: ['Ensure read-only cluster role bindings have minimal surface area'],
      }
    ],
    firstGoodIssue: {
      id: 'issue-kl-1',
      title: 'Add keyboard shortcut modal and vim keybindings (j/k/h/l) for pod row navigation',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 25,
      summary: 'Users want to navigate the web dashboard pod log stream without taking hands off the keyboard. Implement `j`/`k` for scrolling and `?` to toggle keybindings cheat sheet.',
      acceptanceCriteria: [
        'Pressing "j" scrolls down by 1 log entry; "k" scrolls up',
        'Pressing "?" opens accessible dialog modal with keymap',
        'Keys are disabled when focused on the filter input field'
      ],
      filesToTouch: ['web/src/hooks/useVimKeymap.ts', 'web/src/components/KeymapModal.tsx'],
      starterSnippet: `export function useVimKeymap(onNext: () => void, onPrev: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'j') onNext();
      if (e.key === 'k') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, onPrev]);
}`,
      status: 'open',
    },
    architecture: {
      summary: 'Embedded Go binary connects to current kubeconfig context, subscribes to Kubernetes Watch API, and exposes both an interactive Bubbletea terminal interface and a local React web UI via embedded http.FileServer.',
      backendStack: 'Go, k8s.io/client-go, gorilla/websocket, Charm Bubbletea',
      frontendStack: 'React 19, Tailwind CSS, TanStack Virtual, Lucide',
      dataLayer: 'In-memory ring buffer (100k log lines) + SQLite cache',
      infraStack: 'Single static binary (distroless)',
      keyEndpoints: [
        { method: 'GET', path: '/api/v1/pods', desc: 'List active pods with restart counts & health', authRequired: false },
        { method: 'WS', path: '/api/v1/logs/stream', desc: 'Live log tailing stream with regex filter params', authRequired: false }
      ],
      architectureDiagramMarkdown: `\`\`\`
[K8s API Server] ──(Watch API)──► [KubeLens Go Daemon]
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
          [Terminal (Bubbletea)]                       [Local Web Browser (React)]
\`\`\``,
      githubUrl: 'https://github.com/kubelens/kubelens',
      demoUrl: 'https://demo.kubelens.dev',
    },
    milestones: [
      { id: 'm3-1', title: 'Multi-cluster kubeconfig auto-detect', stage: 'Blueprint / Spec', status: 'completed' },
      { id: 'm3-2', title: 'Bubbletea terminal log streamer', stage: 'Scaffolding', status: 'completed' },
      { id: 'm3-3', title: 'React web UI log viewer with virtualizer', stage: 'Alpha / MVP Live', status: 'completed' },
      { id: 'm3-4', title: 'Vim navigation and log color schemes', stage: 'Alpha / MVP Live', status: 'in_progress', blockerNote: 'Active First Good Issue' },
      { id: 'm3-5', title: 'Homebrew tap and single binary release', stage: 'Ship & Distribute', status: 'upcoming' }
    ]
  },
  {
    id: 'project-4',
    title: 'VibeCheck Analytics',
    tagline: 'Privacy-first, self-hosted web analytics with clickstream heatmaps.',
    description: 'Cookieless, GDPR-compliant web analytics powered by ClickHouse and FastAPI. We already have 1,200 self-hosted instances running the MVP; now scaling distribution and CMS plugins.',
    stage: 'Ship & Distribute',
    stageProgress: 90,
    techStack: ['FastAPI', 'ClickHouse', 'Python', 'PostgreSQL', 'Tailwind', 'Docker'],
    creator: {
      name: 'Devon Vance',
      handle: '@devon_v',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Fullstack & Founder',
      verified: true,
      github: 'devon-vibe',
    },
    teamMembers: [
      {
        name: 'Devon Vance',
        handle: '@devon_v',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Fullstack Lead',
      },
      {
        name: 'Priya Patel',
        handle: '@priyadata',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'ClickHouse Data Architect',
      }
    ],
    maxTeamSize: 4,
    stars: 940,
    views: 4500,
    postedAt: '2 days ago',
    matchScore: 94,
    matchReason: 'FastAPI + Python stack with ready-to-scale distribution needs.',
    discordInviteUrl: 'https://discord.gg/vibecheck-analytics',
    repoCloneCommand: 'git clone https://github.com/vibecheck/vibecheck.git',
    roleSlots: [
      {
        id: 'vc-role-1',
        title: 'Core Backend / ClickHouse Queries (Filled)',
        category: 'backend',
        status: 'filled',
        filledBy: {
          name: 'Priya Patel',
          handle: '@priyadata',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          role: 'Data Architect',
        },
        commitmentHours: 10,
        requirements: ['ClickHouse SQL', 'Python / FastAPI', 'PostgreSQL'],
        responsibilities: ['Optimize rollup materialized views for 100M+ events/day'],
      },
      {
        id: 'vc-role-2',
        title: 'Developer Relations & Docs (Open)',
        category: 'growth',
        status: 'open',
        commitmentHours: 5,
        requirements: ['Technical writing', 'Community management', 'DevRel'],
        responsibilities: ['Write integration guides for Next.js, Remix, and Astro', 'Coordinate GitHub Discussions and Discord support'],
      },
      {
        id: 'vc-role-3',
        title: 'Plugin & SDK Contributor (Open)',
        category: 'fullstack',
        status: 'open',
        commitmentHours: 6,
        requirements: ['TypeScript', 'WordPress PHP or Shopify App APIs'],
        responsibilities: ['Build 1-click WordPress plugin and npm package wrapper'],
      }
    ],
    firstGoodIssue: {
      id: 'issue-vc-1',
      title: 'Create lightweight 1.2KB vanilla JS tracker snippet with beacon API fallback',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Write a zero-dependency `tracker.js` script that captures pageview and custom event data using `navigator.sendBeacon` with fallback to `fetch(..., { keepalive: true })`.',
      acceptanceCriteria: [
        'Final minified + gzipped bundle size strictly under 1.4KB',
        'Respects `navigator.doNotTrack` header when enabled',
        'Does not drop events during page unload / tab switch'
      ],
      filesToTouch: ['packages/tracker/src/index.ts', 'packages/tracker/tests/beacon.test.ts'],
      starterSnippet: `export function sendEvent(endpoint: string, payload: object) {
  const data = JSON.stringify({ ...payload, ts: Date.now() });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, data);
  } else {
    fetch(endpoint, { method: 'POST', body: data, keepalive: true });
  }
}`,
      status: 'open',
    },
    architecture: {
      summary: 'High-throughput async ingestion endpoint buffering pageviews into ClickHouse columnar storage. Aggregated querying is performed via FastAPI backend and served to the reactive dashboard.',
      backendStack: 'FastAPI, Uvicorn, Python 3.12',
      frontendStack: 'Tailwind CSS, Chart.js, Vite React',
      dataLayer: 'ClickHouse (event store) + PostgreSQL (users, websites, tokens)',
      infraStack: 'Docker Compose, Caddy Reverse Proxy with auto SSL',
      keyEndpoints: [
        { method: 'POST', path: '/api/v1/collect', desc: 'Public cookieless event ingestion endpoint', authRequired: false },
        { method: 'GET', path: '/api/v1/stats/overview', desc: 'Aggregated unique visitors and pageviews breakdown', authRequired: true }
      ],
      githubUrl: 'https://github.com/vibecheck/vibecheck',
      demoUrl: 'https://app.vibecheck.dev/demo',
    },
    milestones: [
      { id: 'm4-1', title: 'Core ClickHouse table schema & materialized views', stage: 'Blueprint / Spec', status: 'completed' },
      { id: 'm4-2', title: 'FastAPI ingest service with 10k req/sec throughput', stage: 'Scaffolding', status: 'completed' },
      { id: 'm4-3', title: 'Dashboard MVP with real-time visitor counter', stage: 'Alpha / MVP Live', status: 'completed' },
      { id: 'm4-4', title: 'Official Next.js & Astro plugin ecosystem', stage: 'Ship & Distribute', status: 'in_progress', blockerNote: 'Looking for SDK contributors' },
      { id: 'm4-5', title: '1-Click Cloud Hosting Template on Railway & Render', stage: 'Ship & Distribute', status: 'upcoming' }
    ]
  },
  {
    id: 'project-5',
    title: 'HyperVector DB',
    tagline: 'Embedded in-memory vector database with AVX-512 SIMD hardware acceleration.',
    description: 'Ultra low-latency vector search engine designed to run inside edge functions and local AI apps. Rust core with zero-copy Python and Node.js bindings.',
    stage: 'Scaffolding',
    stageProgress: 40,
    techStack: ['Rust', 'Python', 'PyTorch', 'FastAPI', 'C++'],
    creator: {
      name: 'Viktor K.',
      handle: '@viktor_simd',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Systems & Performance Engineer',
      verified: true,
      github: 'viktor-simd',
    },
    teamMembers: [
      {
        name: 'Viktor K.',
        handle: '@viktor_simd',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Rust Core Lead',
      }
    ],
    maxTeamSize: 3,
    stars: 215,
    views: 1120,
    postedAt: '12 hours ago',
    matchScore: 91,
    matchReason: 'High performance Python + PyTorch vector bindings needed for Rust engine.',
    discordInviteUrl: 'https://discord.gg/hypervector',
    repoCloneCommand: 'git clone https://github.com/hypervector/hypervector-rs.git',
    roleSlots: [
      {
        id: 'hv-role-1',
        title: 'Core Engine / Rust & SIMD (Filled)',
        category: 'backend',
        status: 'filled',
        filledBy: {
          name: 'Viktor K.',
          handle: '@viktor_simd',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'Core Lead',
        },
        commitmentHours: 12,
        requirements: ['Rust 1.78+', 'SIMD intrinsics', 'HNSW graph indexing'],
        responsibilities: ['AVX-512 distance calculation kernels', 'Lock-free index mutations'],
      },
      {
        id: 'hv-role-2',
        title: 'Python SDK & PyO3 Bindings (Open)',
        category: 'ml-ai',
        status: 'open',
        commitmentHours: 6,
        requirements: ['Python 3.10+', 'PyO3 / maturin', 'NumPy / PyTorch buffer protocol'],
        responsibilities: ['Create pip package `pip install hypervector`', 'Zero-copy NumPy array ingestion'],
      }
    ],
    firstGoodIssue: {
      id: 'issue-hv-1',
      title: 'Expose Cosine Similarity benchmark CLI runner with JSON output format',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Add a `--benchmark` flag to the Rust CLI tool that generates 10,000 random 1536-dim vectors and outputs percentile latencies (p50, p95, p99) formatted as JSON.',
      acceptanceCriteria: [
        'Outputs clean JSON matching `{"p50_us": 12, "p95_us": 28, "throughput_qps": 85000}`',
        'Supports configurable dimension `--dim 1536` and `--count 10000`'
      ],
      filesToTouch: ['crates/cli/src/bench.rs', 'crates/cli/src/main.rs'],
      status: 'open',
    },
    architecture: {
      summary: 'Rust HNSW vector index supporting cosine and Euclidean distance metrics with runtime CPU feature detection (AVX-512, AVX2, ARM Neon).',
      backendStack: 'Rust, PyO3, Maturin',
      frontendStack: 'N/A (CLI and SDKs)',
      dataLayer: 'Memory-mapped files (.hvec format)',
      infraStack: 'GitHub Actions Matrix (x86_64, aarch64 builds)',
      keyEndpoints: [
        { method: 'POST', path: 'SDK: client.insert(vector, metadata)', desc: 'Zero-copy vector insertion', authRequired: false },
        { method: 'GET', path: 'SDK: client.query(vector, top_k=10)', desc: 'Sub-millisecond nearest neighbor query', authRequired: false }
      ],
      githubUrl: 'https://github.com/hypervector/hypervector-rs',
    },
    milestones: [
      { id: 'm5-1', title: 'AVX-512 Euclidean distance kernel', stage: 'Blueprint / Spec', status: 'completed' },
      { id: 'm5-2', title: 'HNSW graph indexing in pure safe Rust', stage: 'Scaffolding', status: 'completed' },
      { id: 'm5-3', title: 'PyO3 bindings for Python NumPy integration', stage: 'Scaffolding', status: 'in_progress', blockerNote: 'Looking for PyO3 contributor' },
      { id: 'm5-4', title: 'Publish wheels to PyPI and crates.io', stage: 'Alpha / MVP Live', status: 'upcoming' }
    ]
  }
];

export const allTags = [
  'Python',
  'FastAPI',
  'React',
  'Tailwind',
  'Go',
  'PyTorch',
  'PostgreSQL',
  'Redis',
  'Rust',
  'TypeScript',
  'WebAssembly',
  'Docker',
  'Kubernetes',
  'ClickHouse',
  'CRDT'
];
