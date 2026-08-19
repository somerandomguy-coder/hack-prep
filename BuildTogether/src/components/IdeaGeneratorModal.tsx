import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Layers, 
  Lightbulb,
  TreePine,
  Megaphone,
  Code2,
  Heart,
  Palette,
  Briefcase,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Project, ProjectCategory, RoleCategory, TeamMember, TaskItem } from '../types';

interface IdeaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
  onOpenWorkspace: (project: Project) => void;
}

const CATEGORY_PROMPTS: { category: ProjectCategory; icon: any; label: string; example: string; color: string }[] = [
  { 
    category: 'Environment & Eco', 
    icon: TreePine, 
    label: 'Eco & Environment', 
    example: 'Neighborhood plastic recycling initiative & beach cleanup action network in San Diego',
    color: 'emerald'
  },
  { 
    category: 'Campaign & Marketing', 
    icon: Megaphone, 
    label: 'Campaign & Viral', 
    example: 'Short-form TikTok video campaign pushing zero-waste reusables for urban coffee shops',
    color: 'amber'
  },
  { 
    category: 'Tech & AI', 
    icon: Code2, 
    label: 'Tech & AI Software', 
    example: 'Real-time multi-lingual AI audio transcription app for remote medical clinics',
    color: 'indigo'
  },
  { 
    category: 'Community & Social', 
    icon: Heart, 
    label: 'Community & Social', 
    example: 'Community garden solar co-op pooling local purchasing power to lower energy bills',
    color: 'rose'
  },
  { 
    category: 'Creative & Design', 
    icon: Palette, 
    label: 'Creative & Design', 
    example: 'Open-source climate crisis visual infographic toolkit & motion graphic templates',
    color: 'violet'
  },
  { 
    category: 'Business & Strategy', 
    icon: Briefcase, 
    label: 'Business Strategy', 
    example: 'Ethical marketplace connecting local organic farmers directly with city restaurants',
    color: 'cyan'
  },
];

export const IdeaGeneratorModal: React.FC<IdeaGeneratorModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  onOpenWorkspace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('Environment & Eco');
  const [promptText, setPromptText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<Partial<Project> | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: typeof CATEGORY_PROMPTS[0]) => {
    setSelectedCategory(preset.category);
    setPromptText(preset.example);
  };

  const handleGenerate = () => {
    if (!promptText.trim()) return;

    setIsAnalyzing(true);
    setStepIndex(1);
    setGeneratedResult(null);

    // Step-by-step AI simulation timer
    setTimeout(() => setStepIndex(2), 900);
    setTimeout(() => setStepIndex(3), 1800);
    setTimeout(() => {
      setStepIndex(4);
      setIsAnalyzing(false);

      // Construct AI Generated Project Blueprint
      const isTech = selectedCategory === 'Tech & AI';
      const isEco = selectedCategory === 'Environment & Eco';
      const isCampaign = selectedCategory === 'Campaign & Marketing';
      const isCommunity = selectedCategory === 'Community & Social';

      const generatedProject: Project = {
        id: `ai-project-${Date.now()}`,
        title: promptText.split(' ').slice(0, 5).join(' ').replace(/[^a-zA-Z0-9 ]/g, '') || 'New AI Initiative',
        tagline: promptText.length > 80 ? promptText.slice(0, 80) + '...' : promptText,
        description: `An AI-architected initiative for "${promptText}". Built to connect passion with execution by orchestrating cross-functional collaborators, clear milestones, and targeted tasks.`,
        category: selectedCategory,
        stage: 'Blueprint / Spec',
        stageProgress: 25,
        techStack: isEco 
          ? ['Sustainability', 'Campaign Strategy', 'Community Outreach', 'UX Design'] 
          : isCampaign 
          ? ['Campaign Strategy', 'Copywriting', 'Video Editing', 'Growth Hacking'] 
          : isCommunity 
          ? ['Community Outreach', 'Social Impact', 'Event Planning', 'UX Design']
          : ['Python', 'FastAPI', 'React', 'Tailwind CSS', 'PostgreSQL'],
        creator: {
          name: 'Alex Mercer',
          handle: '@alexmercer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Initiative Lead',
          verified: true,
        },
        teamMembers: [
          {
            name: 'Alex Mercer',
            handle: '@alexmercer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'Initiative Creator',
          }
        ],
        maxTeamSize: 5,
        stars: 1,
        views: 12,
        postedAt: 'Just now',
        matchScore: 99,
        matchReason: 'Generated specifically around your idea with custom AI skill matching.',
        roleSlots: [
          {
            id: `role-ai-1`,
            title: isEco ? 'Grassroots Campaign Lead' : isCampaign ? 'Lead Viral Copywriter' : 'Lead Architect / Frontend',
            category: (isEco ? 'campaign-lead' : isCampaign ? 'copywriter' : 'frontend') as RoleCategory,
            status: 'open',
            commitmentHours: 6,
            requirements: ['Strong storytelling & organizing', 'Proven experience in domain', 'Independent contributor'],
            responsibilities: ['Guide execution strategy', 'Coordinate team milestone deliverables'],
          },
          {
            id: `role-ai-2`,
            title: isEco ? 'Environmental Data Analyst' : isCampaign ? 'Short-Form Video Editor' : 'Backend & Infrastructure Lead',
            category: (isEco ? 'environment-expert' : isCampaign ? 'design' : 'backend') as RoleCategory,
            status: 'open',
            commitmentHours: 5,
            requirements: ['Analytical mindset', 'Fast turn-around', 'High attention to detail'],
            responsibilities: ['Analyze impact metrics', 'Build core assets'],
          },
          {
            id: `role-ai-3`,
            title: 'UI/UX Visual Storyteller',
            category: 'design',
            status: 'open',
            commitmentHours: 4,
            requirements: ['Figma expertise', 'Brand identity design'],
            responsibilities: ['Create public presentation deck & web landing page'],
          }
        ],
        firstGoodIssue: {
          id: `task-ai-1`,
          title: 'Draft initiative launch charter & milestone map',
          category: 'Strategy & Spec',
          difficulty: 'Quick Win (~30m)',
          estimatedMinutes: 30,
          summary: 'Define key success metrics and week-1 goals for the initiative.',
          acceptanceCriteria: ['Written charter document', 'List of top 3 target milestones'],
          status: 'open',
          priority: 'high',
        },
        tasks: [
          {
            id: `task-ai-1`,
            title: 'Draft initiative launch charter & milestone map',
            category: 'Strategy & Spec',
            difficulty: 'Quick Win (~30m)',
            estimatedMinutes: 30,
            summary: 'Define key success metrics and week-1 goals for the initiative.',
            acceptanceCriteria: ['Written charter document', 'List of top 3 target milestones'],
            status: 'open',
            priority: 'high',
          },
          {
            id: `task-ai-2`,
            title: 'Set up Discord/Slack collaboration channels & asset folder',
            category: 'Operations',
            difficulty: 'Quick Win (~30m)',
            estimatedMinutes: 20,
            summary: 'Establish primary hub for incoming team members.',
            acceptanceCriteria: ['Created channel structure', 'Shared Figma link'],
            status: 'open',
            priority: 'medium',
          }
        ],
        milestones: [
          { id: 'm-ai-1', title: 'AI Blueprint & Skill Mapping', stage: 'Blueprint / Spec', status: 'completed', owner: 'Alex Mercer' },
          { id: 'm-ai-2', title: 'Onboard 3 Key Collaborators', stage: 'Scaffolding', status: 'in_progress', eta: 'Next 7 Days' },
          { id: 'm-ai-3', title: 'Public Pilot & Community Launch', stage: 'Alpha / MVP Live', status: 'upcoming' },
        ],
        architecture: {
          summary: `AI Blueprint generated for ${selectedCategory} initiative.`,
          campaignDeckUrl: 'https://notion.so/ai-initiative-plan',
          figmaUrl: 'https://figma.com/file/ai-initiative-design',
        },
        workspaceResources: [
          {
            id: 'res-ai-1',
            title: 'AI Blueprint & Vision Document',
            type: 'notion',
            url: 'https://notion.so/ai-initiative-plan',
            description: 'AI generated roadmap and mission outline',
            addedBy: 'AI Architect',
            addedAt: 'Just now'
          }
        ],
        workspaceActivities: [
          {
            id: 'act-ai-1',
            user: 'AI Architect',
            userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-studio',
            action: 'generated initiative blueprint & team role slots',
            target: promptText,
            timestamp: 'Just now',
            type: 'ai'
          }
        ],
        aiSkillRecommendations: [
          {
            roleTitle: isEco ? 'Grassroots Campaign Lead' : isCampaign ? 'Lead Viral Copywriter' : 'Lead Frontend Developer',
            category: (isEco ? 'campaign-lead' : isCampaign ? 'copywriter' : 'frontend') as RoleCategory,
            reason: 'High priority role needed to lead outreach and execution.',
            suggestedSkills: isEco ? ['Community Outreach', 'Social Media', 'Eco Policy'] : ['Copywriting', 'Content Strategy'],
            potentialCandidates: [
              {
                name: 'Sarah Jenkins',
                handle: '@sjenkins_outreach',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                role: 'Community & Campaign Specialist',
                location: 'Seattle, WA',
                matchScore: 96
              },
              {
                name: 'Marcus Vance',
                handle: '@marcus_growth',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                role: 'Impact Marketer',
                location: 'San Francisco, CA',
                matchScore: 91
              }
            ]
          }
        ]
      };

      setGeneratedResult(generatedProject);
    }, 2700);
  };

  const handleLaunchProject = () => {
    if (!generatedResult) return;
    const fullProj = generatedResult as Project;
    onProjectCreated(fullProj);
    onClose();
    onOpenWorkspace(fullProj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Idea Studio <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">AI Team Matcher</span>
              </h2>
              <p className="text-xs text-slate-400">
                Describe your idea (tech, environmental, marketing campaign, or community initiative) & AI will connect the skills needed.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {!generatedResult && !isAnalyzing && (
            <>
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Project Domain Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_PROMPTS.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.category;
                    return (
                      <button
                        key={cat.category}
                        onClick={() => handlePresetSelect(cat)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-sm font-medium ${
                          isSelected 
                            ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-200 shadow-lg shadow-indigo-500/10' 
                            : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idea Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> What is your project or campaign idea?
                  </label>
                  <span className="text-xs text-slate-500">Any domain welcome!</span>
                </div>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g., I want to launch an ocean plastic cleanup campaign and need an eco strategist, community organizer, and UI designer..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              {/* Quick Examples */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Click an example to test:
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PROMPTS.map((p) => (
                    <button
                      key={p.category}
                      onClick={() => handlePresetSelect(p)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg transition-colors text-left"
                    >
                      <span className="text-indigo-400 font-semibold">{p.category}:</span> {p.example.slice(0, 38)}...
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AI Analyzing Loading State */}
          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 animate-spin flex items-center justify-center p-0.5 shadow-xl shadow-indigo-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Bot className="w-8 h-8 text-indigo-400 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white">Deconstructing Your Idea...</h3>
                <p className="text-xs text-slate-400">AI is mapping skill requirements, matching collaborators, and generating your workspace structure.</p>
              </div>

              {/* Step checklist */}
              <div className="w-full max-w-sm bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5 text-left text-xs">
                <div className={`flex items-center gap-2.5 ${stepIndex >= 1 ? 'text-indigo-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 1 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span>Analyzing mission & domain requirements</span>
                </div>
                <div className={`flex items-center gap-2.5 ${stepIndex >= 2 ? 'text-indigo-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 2 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span>Identifying required skill sets & role slots</span>
                </div>
                <div className={`flex items-center gap-2.5 ${stepIndex >= 3 ? 'text-indigo-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 3 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span>Matching top talent profiles from network</span>
                </div>
                <div className={`flex items-center gap-2.5 ${stepIndex >= 4 ? 'text-emerald-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 4 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Generating interactive Workspace & starter tasks</span>
                </div>
              </div>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedResult && !isAnalyzing && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Team Blueprint Ready!</h4>
                    <p className="text-xs text-emerald-300">Workspace structure, skill slots, and candidates matched successfully.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Configured
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                    {generatedResult.category}
                  </span>
                  <span className="text-xs text-slate-400">Stage: {generatedResult.stage}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{generatedResult.title}</h3>
                <p className="text-xs text-slate-300">{generatedResult.description}</p>
              </div>

              {/* Required Skill Slots */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Required Skill & Role Slots (Auto-Created)
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  {generatedResult.roleSlots?.map((slot) => (
                    <div key={slot.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
                      <span className="font-bold text-white block truncate">{slot.title}</span>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block">
                        ~{slot.commitmentHours}h/wk commitment
                      </span>
                      <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                        {slot.requirements.map((req, idx) => (
                          <li key={idx} className="truncate">{req}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Collaborators Preview */}
              {generatedResult.aiSkillRecommendations && generatedResult.aiSkillRecommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Recommended Collaborators Matched
                  </h4>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    {generatedResult.aiSkillRecommendations[0].potentialCandidates.map((cand) => (
                      <div key={cand.handle} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                        <div className="flex items-center gap-2.5">
                          <img src={cand.avatar} alt={cand.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-white block">{cand.name}</span>
                            <span className="text-[11px] text-slate-400">{cand.role} • {cand.location}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          {cand.matchScore}% Skill Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {!generatedResult && !isAnalyzing ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!promptText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" /> Generate Project & Skill Team
              </button>
            </>
          ) : generatedResult ? (
            <>
              <button
                onClick={() => setGeneratedResult(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Edit Prompt
              </button>
              <button
                onClick={handleLaunchProject}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/25"
              >
                Launch & Open Project Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
