export type ExecutionStage = 
  | 'Blueprint / Spec' 
  | 'Scaffolding' 
  | 'Alpha / MVP Live' 
  | 'Ship & Distribute';

export type ProjectCategory = 
  | 'Tech & AI'
  | 'Environment & Eco'
  | 'Campaign & Marketing'
  | 'Community & Social'
  | 'Creative & Design'
  | 'Business & Strategy';

export type RoleCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'ml-ai' 
  | 'design' 
  | 'devops' 
  | 'growth'
  | 'campaign-lead'
  | 'environment-expert'
  | 'copywriter'
  | 'community-manager'
  | 'marketing-strategist'
  | 'event-coordinator';

export interface TeamMember {
  id?: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  skills?: string[];
  github?: string;
  matchScore?: number;
  matchReason?: string;
  location?: string;
  availableHours?: number;
}

export interface RoleSlot {
  id: string;
  title: string;
  category: RoleCategory;
  status: 'open' | 'filled';
  filledBy?: TeamMember;
  commitmentHours: number;
  requirements: string[];
  responsibilities: string[];
  claimedByCurrentUser?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Quick Win (~30m)' | 'Moderate (~1-2h)' | 'Deep Dive (~3-4h)';
  estimatedMinutes: number;
  summary: string;
  acceptanceCriteria: string[];
  filesToTouch?: string[];
  starterSnippet?: string;
  status: 'open' | 'claimed' | 'completed';
  assignedTo?: string;
  assignedAvatar?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export type FirstGoodIssue = TaskItem;

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
  backendStack?: string;
  frontendStack?: string;
  dataLayer?: string;
  infraStack?: string;
  keyEndpoints?: EndpointSpec[];
  architectureDiagramMarkdown?: string;
  githubUrl?: string;
  specUrl?: string;
  figmaUrl?: string;
  demoUrl?: string;
  campaignDeckUrl?: string;
  communityUrl?: string;
}

export interface WorkspaceResource {
  id: string;
  title: string;
  type: 'figma' | 'github' | 'deck' | 'notion' | 'discord' | 'doc' | 'link';
  url: string;
  description: string;
  addedBy: string;
  addedAt: string;
}

export interface WorkspaceActivity {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'role' | 'task' | 'milestone' | 'resource' | 'ai';
}

export interface AISkillRecommendation {
  roleTitle: string;
  category: RoleCategory;
  reason: string;
  suggestedSkills: string[];
  potentialCandidates: TeamMember[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  stage: ExecutionStage;
  stageProgress: number;
  techStack: string[];
  roleSlots: RoleSlot[];
  firstGoodIssue: TaskItem;
  tasks: TaskItem[];
  creator: TeamMember & { verified: boolean };
  teamMembers: TeamMember[];
  maxTeamSize: number;
  stars: number;
  views: number;
  postedAt: string;
  architecture: ProjectArchitecture;
  milestones: Milestone[];
  workspaceResources: WorkspaceResource[];
  workspaceActivities: WorkspaceActivity[];
  aiSkillRecommendations: AISkillRecommendation[];
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
