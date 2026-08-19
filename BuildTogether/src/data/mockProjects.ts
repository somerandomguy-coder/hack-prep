import { Project, CurrentUser, ProjectCategory } from '../types';

export const initialCurrentUser: CurrentUser = {
  name: 'Alex Mercer',
  handle: '@alexmercer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  primaryRole: 'Campaign Strategist & Fullstack Builder',
  skills: ['Python', 'React', 'Campaign Strategy', 'Environmental Policy', 'UX Design', 'Community Outreach'],
  availableHoursPerWeek: 10,
  bio: 'Passionate about building tech-enabled social initiatives, environmental campaigns, and collaborative open tools.',
  github: 'https://github.com/alexmercer-dev',
  claimedRoleIds: [],
  claimedIssueIds: [],
  bookmarkedProjectIds: ['project-eco-1', 'project-tech-1'],
};

export const allCategories: ProjectCategory[] = [
  'Tech & AI',
  'Environment & Eco',
  'Campaign & Marketing',
  'Community & Social',
  'Creative & Design',
  'Business & Strategy',
];

export const allTags = [
  'React', 'Python', 'FastAPI', 'PyTorch', 'Sustainability', 
  'Social Impact', 'Campaign Strategy', 'Copywriting', 'UX Design', 
  'Community Outreach', 'Graphic Design', 'Growth Hacking', 'Docker',
  'PostgreSQL', 'Tailwind', 'Video Editing', 'Legal/Policy'
];

export const mockProjects: Project[] = [
  {
    id: 'project-eco-1',
    title: 'EcoPulse: Ocean Plastic Action Network',
    tagline: 'AI-driven coastal pollution mapping & localized volunteer mobilization campaign.',
    description: 'Combining satellite imagery AI analysis with grassroots community campaigns to clean up coastal plastic hotspots. We need environmental strategists, campaign coordinators, and frontend UI designers to launch our nationwide campaign.',
    category: 'Environment & Eco',
    stage: 'Scaffolding',
    stageProgress: 60,
    techStack: ['Sustainability', 'Campaign Strategy', 'Python', 'React', 'Community Outreach', 'UX Design'],
    creator: {
      name: 'Maya Lin',
      handle: '@mayalin_eco',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Environmental Policy Lead',
      verified: true,
      github: 'mayalin-climate',
    },
    teamMembers: [
      {
        name: 'Maya Lin',
        handle: '@mayalin_eco',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'Environmental Policy Lead',
      },
      {
        name: 'David Kim',
        handle: '@dkim_gis',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'GIS & Satellite Data Analyst',
      }
    ],
    maxTeamSize: 6,
    stars: 128,
    views: 890,
    postedAt: '1 hour ago',
    matchScore: 96,
    matchReason: 'High synergy with your Environmental Policy & Campaign Strategy skills.',
    discordInviteUrl: 'https://discord.gg/ecopulse-action',
    repoCloneCommand: 'git clone https://github.com/ecopulse/coastal-action.git',
    roleSlots: [
      {
        id: 'eco-role-1',
        title: 'Grassroots Campaign Lead (Open)',
        category: 'campaign-lead',
        status: 'open',
        commitmentHours: 8,
        requirements: ['Community mobilization experience', 'Social media outreach', 'Event planning'],
        responsibilities: ['Coordinate weekend coastal cleanup drives', 'Partner with local eco-NGOs', 'Manage volunteer leaderboard'],
      },
      {
        id: 'eco-role-2',
        title: 'UI/UX Impact Designer (Open)',
        category: 'design',
        status: 'open',
        commitmentHours: 6,
        requirements: ['Figma', 'Responsive UI design', 'Data visualization'],
        responsibilities: ['Design mobile-first map interface for pollution reporting', 'Create impact dashboard'],
      },
      {
        id: 'eco-role-3',
        title: 'Environmental Scientist / Auditor (Open)',
        category: 'environment-expert',
        status: 'open',
        commitmentHours: 5,
        requirements: ['Marine biology or Eco science background', 'Plastic footprint metrics'],
        responsibilities: ['Audit collected trash metrics', 'Verify recycling supply chain tracking'],
      }
    ],
    firstGoodIssue: {
      id: 'task-eco-1',
      title: 'Design volunteer onboarding & signup flow card',
      category: 'Design & UX',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Craft a 3-step signup wizard UI for local ocean cleanup volunteers.',
      acceptanceCriteria: ['Form fields for location, available weekends, equipment', 'Confirmation badge component'],
      status: 'open',
      priority: 'high',
    },
    tasks: [
      {
        id: 'task-eco-1',
        title: 'Design volunteer onboarding & signup flow card',
        category: 'Design & UX',
        difficulty: 'Quick Win (~30m)',
        estimatedMinutes: 30,
        summary: 'Craft a 3-step signup wizard UI for local ocean cleanup volunteers.',
        acceptanceCriteria: ['Form fields for location, available weekends, equipment', 'Confirmation badge component'],
        status: 'open',
        priority: 'high',
      },
      {
        id: 'task-eco-2',
        title: 'Integrate OpenStreetMap GPS coordinates for cleanup sites',
        category: 'Development',
        difficulty: 'Moderate (~1-2h)',
        estimatedMinutes: 90,
        summary: 'Connect cleanup target database to interactive map pins with live progress markers.',
        acceptanceCriteria: ['Render interactive Leaflet/Mapbox pins', 'Filter by cleanup urgency level'],
        status: 'claimed',
        assignedTo: 'David Kim',
        assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        priority: 'medium',
      },
      {
        id: 'task-eco-3',
        title: 'Draft press kit & social media launch templates',
        category: 'Campaign',
        difficulty: 'Quick Win (~30m)',
        estimatedMinutes: 45,
        summary: 'Create shareable templates for Instagram, LinkedIn, and Twitter campaign push.',
        acceptanceCriteria: ['3 graphic banner presets', 'Sample copy for ambassador recruitment'],
        status: 'completed',
        assignedTo: 'Maya Lin',
        assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        priority: 'high',
      }
    ],
    milestones: [
      { id: 'm-eco-1', title: 'Pollution Satellite Model Training & Hotspot Detection', stage: 'Blueprint / Spec', status: 'completed', owner: 'David Kim' },
      { id: 'm-eco-2', title: 'Community Launch & First 1,000 Volunteers', stage: 'Scaffolding', status: 'in_progress', owner: 'Maya Lin', eta: 'Next 2 Weeks' },
      { id: 'm-eco-3', title: 'Deploy Live Cleanup Tracking App in 5 Coastal Cities', stage: 'Alpha / MVP Live', status: 'upcoming' },
      { id: 'm-eco-4', title: 'National Media Campaign & Corporate Sponsorship', stage: 'Ship & Distribute', status: 'upcoming' },
    ],
    architecture: {
      summary: 'Hybrid campaign infrastructure combining Python PyTorch satellite image classifier backend with React interactive web dashboard and mobile volunteer tracking interface.',
      backendStack: 'Python 3.11, FastAPI, PyTorch (YOLOv8 Satellite), PostgreSQL/PostGIS',
      frontendStack: 'React 19, Tailwind CSS, Leaflet/Mapbox GL',
      infraStack: 'AWS S3, Supabase, Cloudflare Workers',
      figmaUrl: 'https://figma.com/file/ecopulse-ux',
      githubUrl: 'https://github.com/ecopulse/coastal-action',
      campaignDeckUrl: 'https://canva.com/deck/ecopulse-ocean-deck',
      communityUrl: 'https://discord.gg/ecopulse-action',
    },
    workspaceResources: [
      { id: 'res-1', title: 'Coastal Action Campaign Deck', type: 'deck', url: 'https://canva.com/deck/ecopulse-ocean-deck', description: 'Pitch deck for eco-sponsors and NGO partners', addedBy: 'Maya Lin', addedAt: '2 days ago' },
      { id: 'res-2', title: 'Figma Mobile App Wireframes', type: 'figma', url: 'https://figma.com/file/ecopulse-ux', description: 'Interactive prototypes for volunteer check-ins', addedBy: 'David Kim', addedAt: 'Yesterday' },
      { id: 'res-3', title: 'GitHub Repository', type: 'github', url: 'https://github.com/ecopulse/coastal-action', description: 'Main codebase for map & backend', addedBy: 'David Kim', addedAt: '3 days ago' },
    ],
    workspaceActivities: [
      { id: 'act-1', user: 'Maya Lin', userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', action: 'completed task', target: 'Draft press kit & social media templates', timestamp: '10m ago', type: 'task' },
      { id: 'act-2', user: 'David Kim', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', action: 'claimed task', target: 'Integrate OpenStreetMap GPS coordinates', timestamp: '1h ago', type: 'task' },
      { id: 'act-3', user: 'AI Architect', userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ecopulse', action: 'recommended role', target: 'Grassroots Campaign Lead', timestamp: '3h ago', type: 'ai' },
    ],
    aiSkillRecommendations: [
      {
        roleTitle: 'Grassroots Campaign Lead',
        category: 'campaign-lead',
        reason: 'Essential for driving local community signups and managing coastal cleanup event schedules.',
        suggestedSkills: ['Community Outreach', 'Social Media Marketing', 'Event Coordination'],
        potentialCandidates: [
          { name: 'Sarah Jenkins', handle: '@sjenkins_outreach', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Community Organizer', location: 'Seattle, WA', matchScore: 94 },
          { name: 'Marcus Vance', handle: '@marcus_campaigns', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Eco Growth Marketer', location: 'San Francisco, CA', matchScore: 89 },
        ]
      },
      {
        roleTitle: 'UI/UX Impact Designer',
        category: 'design',
        reason: 'Needed to simplify pollution logging form so volunteers can report plastic in under 15 seconds.',
        suggestedSkills: ['Figma', 'Mobile UI', 'Visual Storytelling'],
        potentialCandidates: [
          { name: 'Chloe Zhang', handle: '@chloez_design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Product Designer', location: 'Vancouver, CA', matchScore: 91 },
        ]
      }
    ]
  },
  {
    id: 'project-camp-1',
    title: 'ZeroWaste Viral: GenZ Eco Campaign',
    tagline: 'Multi-channel social campaign turning single-use plastic reduction into viral TikTok/Reels challenges.',
    description: 'We are creating a high-energy, youth-led campaign to challenge fast food chains to adopt reusable packaging. We need creative copywriters, short-form video editors, and viral marketing strategists to execute Phase 1.',
    category: 'Campaign & Marketing',
    stage: 'Blueprint / Spec',
    stageProgress: 35,
    techStack: ['Campaign Strategy', 'Copywriting', 'Video Editing', 'Growth Hacking', 'Graphic Design'],
    creator: {
      name: 'Jordan Brooks',
      handle: '@jordan_viral',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      role: 'Creative Campaign Director',
      verified: true,
    },
    teamMembers: [
      {
        name: 'Jordan Brooks',
        handle: '@jordan_viral',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        role: 'Campaign Director',
      }
    ],
    maxTeamSize: 5,
    stars: 95,
    views: 640,
    postedAt: '3 hours ago',
    matchScore: 92,
    matchReason: 'Matches your Campaign Strategy & Creative direction capabilities.',
    discordInviteUrl: 'https://discord.gg/zerowaste-campaign',
    roleSlots: [
      {
        id: 'camp-role-1',
        title: 'Lead Viral Copywriter & Hook Specialist (Open)',
        category: 'copywriter',
        status: 'open',
        commitmentHours: 6,
        requirements: ['Short-form video scriptwriting', 'Gen-Z culture resonance', 'Punchy headline crafting'],
        responsibilities: ['Write 15 video script concepts for TikTok/Reels', 'Draft petition slogans'],
      },
      {
        id: 'camp-role-2',
        title: 'Short-Form Video Editor & Motion Graphics (Open)',
        category: 'design',
        status: 'open',
        commitmentHours: 8,
        requirements: ['Premiere / CapCut Pro / After Effects', 'Pacing and caption styling'],
        responsibilities: ['Edit 10 hero campaign videos with engaging motion captions'],
      },
      {
        id: 'camp-role-3',
        title: 'Influencer Outreach & Partner Lead (Open)',
        category: 'marketing-strategist',
        status: 'open',
        commitmentHours: 5,
        requirements: ['Creator relations', 'DM campaign execution', 'Brand partnership tracking'],
        responsibilities: ['Recruit 50 eco-influencers for coordinated launch day hashtag takeover'],
      }
    ],
    firstGoodIssue: {
      id: 'task-camp-1',
      title: 'Brainstorm 10 viral challenge concepts & hashtag names',
      category: 'Creative Concept',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Generate catchy hashtag ideas and 15-second challenge concepts for campaign launch.',
      acceptanceCriteria: ['10 distinct challenge hooks', '3 hashtag variations with domain/social availability'],
      status: 'open',
      priority: 'high',
    },
    tasks: [
      {
        id: 'task-camp-1',
        title: 'Brainstorm 10 viral challenge concepts & hashtag names',
        category: 'Creative Concept',
        difficulty: 'Quick Win (~30m)',
        estimatedMinutes: 30,
        summary: 'Generate catchy hashtag ideas and 15-second challenge concepts for campaign launch.',
        acceptanceCriteria: ['10 distinct challenge hooks', '3 hashtag variations with domain/social availability'],
        status: 'open',
        priority: 'high',
      },
      {
        id: 'task-camp-2',
        title: 'Design brand style guide & neon typography badge',
        category: 'Branding',
        difficulty: 'Moderate (~1-2h)',
        estimatedMinutes: 60,
        summary: 'Create color palette, stickers, and profile avatar frame overlays for campaign supporters.',
        acceptanceCriteria: ['Figma style tile', 'PNG overlay templates'],
        status: 'open',
        priority: 'medium',
      }
    ],
    milestones: [
      { id: 'm-camp-1', title: 'Finalize Campaign Messaging & Brand Identity', stage: 'Blueprint / Spec', status: 'in_progress', owner: 'Jordan Brooks' },
      { id: 'm-camp-2', title: 'Produce 10 Launch Hero Short Videos', stage: 'Scaffolding', status: 'upcoming' },
      { id: 'm-camp-3', title: 'Coordinated Launch Day Hashtag Takeover', stage: 'Alpha / MVP Live', status: 'upcoming' },
    ],
    architecture: {
      summary: 'Creative campaign framework driven by Notion content pipeline, Figma asset library, and CapCut video production workflow.',
      campaignDeckUrl: 'https://notion.so/zerowaste-campaign-plan',
      figmaUrl: 'https://figma.com/file/zerowaste-brand-kit',
    },
    workspaceResources: [
      { id: 'res-camp-1', title: 'Notion Campaign Hub & Script Pipeline', type: 'notion', url: 'https://notion.so/zerowaste-campaign-plan', description: 'Central hub for content ideas & status', addedBy: 'Jordan Brooks', addedAt: '1 day ago' },
      { id: 'res-camp-2', title: 'Figma Visual Brand Kit', type: 'figma', url: 'https://figma.com/file/zerowaste-brand-kit', description: 'Graphics, sticker packs, and typography', addedBy: 'Jordan Brooks', addedAt: 'Yesterday' }
    ],
    workspaceActivities: [
      { id: 'act-camp-1', user: 'Jordan Brooks', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', action: 'created project workspace', target: 'ZeroWaste Viral', timestamp: '3h ago', type: 'resource' }
    ],
    aiSkillRecommendations: [
      {
        roleTitle: 'Lead Viral Copywriter',
        category: 'copywriter',
        reason: 'Crucial for writing snappy TikTok hooks that convert casual viewers into campaign participants.',
        suggestedSkills: ['Copywriting', 'Viral Storytelling', 'Social Media'],
        potentialCandidates: [
          { name: 'Mia Thorne', handle: '@mia_words', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Copywriter & Strategist', matchScore: 97 },
          { name: 'Leo Vance', handle: '@leovance_content', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Content Creator', matchScore: 88 }
        ]
      }
    ]
  },
  {
    id: 'project-tech-1',
    title: 'PulseStream AI',
    tagline: 'Real-time multi-speaker audio transcription & semantic diarization pipeline.',
    description: 'High-throughput async audio stream processing pipeline built on Whisper and FastAPI. Backend GPU chunking architecture is implemented; looking for frontend react engineers and ML devops specialists.',
    category: 'Tech & AI',
    stage: 'Scaffolding',
    stageProgress: 55,
    techStack: ['Python', 'FastAPI', 'PyTorch', 'React', 'Tailwind', 'Docker'],
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
    matchReason: 'Direct stack overlap with your FastAPI & Python background.',
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
        responsibilities: ['Maintain 100ms chunk processing buffer', 'GPU worker orchestration'],
      },
      {
        id: 'ps-role-2',
        title: 'Frontend / Reactive Timeline (Open)',
        category: 'frontend',
        status: 'open',
        commitmentHours: 6,
        requirements: ['React 18+', 'Tailwind CSS', 'Web Audio API / WaveSurfer.js experience'],
        responsibilities: ['Build interactive speaker timeline editor', 'Wire up WebSocket transcript live stream'],
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
      id: 'task-ps-1',
      title: 'Build WebSocket client audio visualizer & live chunk progress bar',
      category: 'Frontend Dev',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: 30,
      summary: 'Subscribe to `ws://localhost:8000/v1/stream/transcribe` and render a real-time dB audio amplitude level meter.',
      acceptanceCriteria: ['Display audio frequency bar with 60fps canvas or CSS transform animation', 'Handle disconnect/reconnect states gracefully'],
      status: 'open',
      priority: 'high',
    },
    tasks: [
      {
        id: 'task-ps-1',
        title: 'Build WebSocket client audio visualizer & live chunk progress bar',
        category: 'Frontend Dev',
        difficulty: 'Quick Win (~30m)',
        estimatedMinutes: 30,
        summary: 'Subscribe to `ws://localhost:8000/v1/stream/transcribe` and render a real-time dB audio amplitude level meter.',
        acceptanceCriteria: ['Display audio frequency bar with 60fps canvas or CSS transform animation'],
        status: 'open',
        priority: 'high',
      },
      {
        id: 'task-ps-2',
        title: 'Implement speaker diarization color tags in transcript feed',
        category: 'Frontend Dev',
        difficulty: 'Moderate (~1-2h)',
        estimatedMinutes: 90,
        summary: 'Assign distinct avatar pills and colors for Speaker 0, Speaker 1, Speaker 2 in the live view.',
        acceptanceCriteria: ['Dynamic color generator by speaker ID', 'Editable speaker name labels'],
        status: 'open',
        priority: 'medium',
      }
    ],
    milestones: [
      { id: 'm-ps-1', title: 'FastAPI WebSocket Engine & Whisper Model Integration', stage: 'Blueprint / Spec', status: 'completed', owner: 'Alex Vance' },
      { id: 'm-ps-2', title: 'Real-time Waveform & Transcript UI Editor', stage: 'Scaffolding', status: 'in_progress', owner: 'Seeking Frontend Lead', eta: 'Next 5 Days' },
      { id: 'm-ps-3', title: 'Multi-GPU Auto-scaling Infrastructure', stage: 'Alpha / MVP Live', status: 'upcoming' },
    ],
    architecture: {
      summary: 'FastAPI async gateway receiving binary Opus chunks, pushing to Redis Stream workers running Whisper v3 on CUDA GPUs.',
      backendStack: 'FastAPI, Python 3.11, PyTorch, PyTorch CUDA, Redis Streams',
      frontendStack: 'React 19, Tailwind CSS, Wavesurfer.js, Zustand',
      infraStack: 'Docker Container Registry, RunPod Serverless GPU, Cloudflare Tunnels',
      githubUrl: 'https://github.com/pulsestream/core',
      demoUrl: 'https://pulsestream.dev/demo',
    },
    workspaceResources: [
      { id: 'res-ps-1', title: 'GitHub Repository', type: 'github', url: 'https://github.com/pulsestream/core', description: 'Core FastAPI & PyTorch service', addedBy: 'Alex Vance', addedAt: '3 days ago' },
      { id: 'res-ps-2', title: 'API Endpoint OpenAPI Spec', type: 'doc', url: 'https://pulsestream.dev/docs', description: 'Interactive Swagger UI & WebSocket payloads', addedBy: 'Alex Vance', addedAt: '2 days ago' }
    ],
    workspaceActivities: [
      { id: 'act-ps-1', user: 'Elena Rostova', userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', action: 'pushed commit', target: 'fix: optimize Redis buffer latency', timestamp: '45m ago', type: 'resource' }
    ],
    aiSkillRecommendations: [
      {
        roleTitle: 'Frontend / Reactive Timeline Lead',
        category: 'frontend',
        reason: 'Required immediately to connect WebSocket audio streams to interactive React components.',
        suggestedSkills: ['React', 'Tailwind', 'Web Audio API'],
        potentialCandidates: [
          { name: 'Kaito Tanaka', handle: '@kaito_ui', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Senior React Developer', matchScore: 95 },
        ]
      }
    ]
  },
  {
    id: 'project-comm-1',
    title: 'Neighborhood Solar Co-op Mobilizer',
    tagline: 'Empowering local communities to pool purchasing power for rooftop solar installs.',
    description: 'A social action framework & web app helping neighbors organize solar co-ops, lower installation costs by 30%, and navigate municipal clean energy grants together. We need community organizers, legal advisors, and web developers.',
    category: 'Community & Social',
    stage: 'Alpha / MVP Live',
    stageProgress: 80,
    techStack: ['Community Outreach', 'Social Impact', 'Legal/Policy', 'React', 'UX Design'],
    creator: {
      name: 'Carlos Mendez',
      handle: '@carlos_solar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'Clean Energy Organizer',
      verified: true,
    },
    teamMembers: [
      {
        name: 'Carlos Mendez',
        handle: '@carlos_solar',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        role: 'Clean Energy Organizer',
      },
      {
        name: 'Lisa Nguyen',
        handle: '@lisa_law',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Clean Energy Legal Advisor',
      }
    ],
    maxTeamSize: 6,
    stars: 142,
    views: 1120,
    postedAt: '5 hours ago',
    matchScore: 88,
    matchReason: 'Fits your interest in community mobilization and social impact tech.',
    discordInviteUrl: 'https://discord.gg/neighborhood-solar',
    roleSlots: [
      {
        id: 'sol-role-1',
        title: 'Community District Ambassador (Open)',
        category: 'community-manager',
        status: 'open',
        commitmentHours: 6,
        requirements: ['Local neighborhood networking', 'Townhall presentation skills'],
        responsibilities: ['Host monthly solar co-op Q&A sessions', 'Onboard 20 households per cluster'],
      },
      {
        id: 'sol-role-2',
        title: 'Grant & Policy Researcher (Open)',
        category: 'environment-expert',
        status: 'open',
        commitmentHours: 4,
        requirements: ['Clean energy tax credit knowledge', 'Municipal policy research'],
        responsibilities: ['Maintain updated database of local clean energy tax rebates and subsidies'],
      }
    ],
    firstGoodIssue: {
      id: 'task-sol-1',
      title: 'Build solar savings calculator widget for neighborhood homeowners',
      category: 'Frontend Dev',
      difficulty: 'Moderate (~1-2h)',
      estimatedMinutes: 60,
      summary: 'Create an interactive slider calculator estimating annual $ savings based on roof size & location.',
      acceptanceCriteria: ['Sliders for roof sq ft & monthly electric bill', 'Outputs estimated 10-year ROI and CO2 reduction'],
      status: 'open',
      priority: 'high',
    },
    tasks: [
      {
        id: 'task-sol-1',
        title: 'Build solar savings calculator widget for neighborhood homeowners',
        category: 'Frontend Dev',
        difficulty: 'Moderate (~1-2h)',
        estimatedMinutes: 60,
        summary: 'Create an interactive slider calculator estimating annual $ savings based on roof size & location.',
        acceptanceCriteria: ['Sliders for roof sq ft & monthly electric bill', 'Outputs estimated 10-year ROI'],
        status: 'open',
        priority: 'high',
      }
    ],
    milestones: [
      { id: 'm-sol-1', title: 'Legal Co-op Agreement Template Creation', stage: 'Blueprint / Spec', status: 'completed', owner: 'Lisa Nguyen' },
      { id: 'm-sol-2', title: 'Pilot in 3 Neighborhood Clusters (120 Homes)', stage: 'Alpha / MVP Live', status: 'in_progress', owner: 'Carlos Mendez' },
    ],
    architecture: {
      summary: 'Community action portal built with React, Supabase backend, and open municipal rebate API integration.',
      frontendStack: 'React, Tailwind CSS, Recharts',
      dataLayer: 'Supabase PostgreSQL & Row Level Security',
    },
    workspaceResources: [
      { id: 'res-sol-1', title: 'Solar Co-op Bylaws & Contract Template', type: 'doc', url: 'https://docs.google.com/document/solar-bylaws', description: 'Standard legal template for neighborhood co-ops', addedBy: 'Lisa Nguyen', addedAt: '4 days ago' }
    ],
    workspaceActivities: [
      { id: 'act-sol-1', user: 'Carlos Mendez', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', action: 'added milestone', target: 'Pilot in 3 Neighborhood Clusters', timestamp: '2h ago', type: 'milestone' }
    ],
    aiSkillRecommendations: [
      {
        roleTitle: 'Community District Ambassador',
        category: 'community-manager',
        reason: 'Needed to engage homeowners directly and run neighborhood solar workshops.',
        suggestedSkills: ['Community Outreach', 'Public Speaking', 'Sustainability'],
        potentialCandidates: [
          { name: 'Elena Torres', handle: '@elena_community', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', role: 'Community Lead', matchScore: 92 }
        ]
      }
    ]
  }
];
