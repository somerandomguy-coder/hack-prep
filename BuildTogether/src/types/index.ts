export type ExecutionStage = 
  | 'Blueprint / Spec' 
  | 'Scaffolding' 
  | 'Alpha / MVP Live' 
  | 'Ship & Distribute';

export type RoleCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'ml-ai' 
  | 'design' 
  | 'devops' 
  | 'growth';

export interface TeamMember {
  name: string;
  handle: string;
  avatar: string;
  role: string;
  github?: string;
}

export interface RoleSlot {
  id: string;
  title: string;
  category: RoleCategory;
  status: 'open' | 'filled';
  filledBy?: TeamMember;
  commitmentHours: number; // e.g. 5 means ~5h/wk
  requirements: string[];
  responsibilities: string[];
  claimedByCurrentUser?: boolean;
}

export interface FirstGoodIssue {
  id: string;
  title: string;
  difficulty: 'Quick Win (~30m)' | 'Moderate (~1-2h)' | 'Deep Dive (~3-4h)';
  estimatedMinutes: number;
  summary: string;
  acceptanceCriteria: string[];
  filesToTouch: string[];
  starterSnippet?: string;
  status: 'open' | 'claimed' | 'completed';
}

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  path: string;
  desc: string;
  authRequired: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  stage: ExecutionStage;
  status: 'completed' | 'in_progress' | 'upcoming';
  owner?: string;
  blockerNote?: string;
  eta?: string;
}

export interface ProjectArchitecture {
  summary: string;
  backendStack: string;
  frontendStack: string;
  dataLayer: string;
  infraStack: string;
  keyEndpoints: EndpointSpec[];
  architectureDiagramMarkdown?: string;
  githubUrl?: string;
  specUrl?: string;
  figmaUrl?: string;
  demoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stage: ExecutionStage;
  stageProgress: number; // 0 to 100
  techStack: string[];
  roleSlots: RoleSlot[];
  firstGoodIssue: FirstGoodIssue;
  creator: TeamMember & { verified: boolean };
  teamMembers: TeamMember[];
  maxTeamSize: number;
  stars: number;
  views: number;
  postedAt: string;
  architecture: ProjectArchitecture;
  milestones: Milestone[];
  matchScore?: number;
  matchReason?: string;
  discordInviteUrl?: string;
  repoCloneCommand?: string;
}

export interface CurrentUser {
  name: string;
  handle: string;
  avatar: string;
  primaryRole: string;
  skills: string[];
  availableHoursPerWeek: number;
  bio: string;
  github: string;
  claimedRoleIds: string[];
  claimedIssueIds: string[];
  bookmarkedProjectIds: string[];
}
