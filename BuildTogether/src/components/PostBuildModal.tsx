import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Zap, 
  Layers, 
  FileCode2, 
  Check, 
  Code2, 
  Sparkles,
  Server,
  HelpCircle
} from 'lucide-react';
import { Project, ExecutionStage, RoleCategory, RoleSlot, FirstGoodIssue, CurrentUser } from '../types';
import { allTags } from '../data/mockProjects';

interface PostBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProject: (newProject: Project) => void;
  currentUser: CurrentUser;
}

export const PostBuildModal: React.FC<PostBuildModalProps> = ({
  isOpen,
  onClose,
  onSubmitProject,
  currentUser,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<ExecutionStage>('Scaffolding');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Python', 'FastAPI', 'React']);
  const [customTag, setCustomTag] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [backendStack, setBackendStack] = useState('Python / FastAPI / Redis');
  const [frontendStack, setFrontendStack] = useState('React / Tailwind CSS');
  const [dataLayer, setDataLayer] = useState('PostgreSQL + Redis Streams');

  // Role Slots state
  const [roles, setRoles] = useState<RoleSlot[]>([
    {
      id: 'role-1',
      title: 'Backend / Architecture (Filled)',
      category: 'backend',
      status: 'filled',
      filledBy: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        role: currentUser.primaryRole,
      },
      commitmentHours: 10,
      requirements: ['Python 3.11+', 'FastAPI', 'Redis'],
      responsibilities: ['Core API endpoints', 'Database schemas'],
    },
    {
      id: 'role-2',
      title: 'Frontend / UI Contributor (Open)',
      category: 'frontend',
      status: 'open',
      commitmentHours: 6,
      requirements: ['React 18', 'Tailwind CSS'],
      responsibilities: ['Interactive dashboard components', 'WebSocket streaming hooks'],
    }
  ]);

  // First Good Issue state
  const [issueTitle, setIssueTitle] = useState('Build JWT auth middleware & session cookie refresh');
  const [issueTime, setIssueTime] = useState(30);
  const [issueCriteria, setIssueCriteria] = useState('1. Validate Bearer token header\n2. Return 401 on expired signature\n3. Include unit test suite');
  const [issueFiles, setIssueFiles] = useState('src/auth/middleware.py, src/auth/jwt.py');

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTag.trim())) {
        setSelectedTags([...selectedTags, customTag.trim()]);
      }
      setCustomTag('');
    }
  };

  const handleAddRole = () => {
    const newRole: RoleSlot = {
      id: `role-${Date.now()}`,
      title: 'New Open Role (Open)',
      category: 'frontend',
      status: 'open',
      commitmentHours: 5,
      requirements: ['TypeScript', 'React'],
      responsibilities: ['Build feature components'],
    };
    setRoles([...roles, newRole]);
  };

  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleUpdateRole = (id: string, field: keyof RoleSlot, value: any) => {
    setRoles(roles.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title,
      tagline,
      description: description || tagline,
      stage,
      stageProgress: stage === 'Blueprint / Spec' ? 25 : stage === 'Scaffolding' ? 50 : stage === 'Alpha / MVP Live' ? 75 : 90,
      techStack: selectedTags,
      creator: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        role: currentUser.primaryRole,
        verified: true,
      },
      teamMembers: [
        {
          name: currentUser.name,
          handle: currentUser.handle,
          avatar: currentUser.avatar,
          role: currentUser.primaryRole,
        }
      ],
      maxTeamSize: roles.length + 1,
      stars: 1,
      views: 12,
      postedAt: 'Just now',
      roleSlots: roles,
      firstGoodIssue: {
        id: `issue-${Date.now()}`,
        title: issueTitle,
        difficulty: issueTime <= 30 ? 'Quick Win (~30m)' : 'Moderate (~1-2h)',
        estimatedMinutes: issueTime,
        summary: `Entry quick-win task designed to onboard incoming collaborator within ~${issueTime} minutes.`,
        acceptanceCriteria: issueCriteria.split('\n').filter(Boolean),
        filesToTouch: issueFiles.split(',').map(f => f.trim()).filter(Boolean),
        status: 'open',
      },
      architecture: {
        summary: `Pre-configured ${stage} project with ${selectedTags.join(', ')}.`,
        backendStack: backendStack,
        frontendStack: frontendStack,
        dataLayer: dataLayer,
        infraStack: 'Docker / GitHub Actions',
        githubUrl: githubUrl || undefined,
        figmaUrl: figmaUrl || undefined,
        keyEndpoints: [
          { method: 'POST', path: '/v1/auth/login', desc: 'User session authentication', authRequired: false },
          { method: 'GET', path: '/v1/data/feed', desc: 'Main resource query endpoint', authRequired: true }
        ]
      },
      milestones: [
        { id: 'm-1', title: 'Architecture spec & schema draft', stage: 'Blueprint / Spec', status: 'completed' },
        { id: 'm-2', title: 'Base repo scaffolding & stack setup', stage: 'Scaffolding', status: 'completed' },
        { id: 'm-3', title: 'Frontend UI integration & 1st Good Issue', stage: 'Scaffolding', status: 'in_progress', blockerNote: 'Awaiting co-builder' },
        { id: 'm-4', title: 'Public Alpha launch', stage: 'Alpha / MVP Live', status: 'upcoming' }
      ],
      matchScore: 99,
      matchReason: 'Created by you.',
      repoCloneCommand: githubUrl ? `git clone ${githubUrl}` : undefined,
    };

    onSubmitProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0F121D] border border-indigo-500/30 rounded-2xl shadow-2xl z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#131724] border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                Post a Build & Onboard Co-Builders
              </h3>
              <p className="text-xs text-slate-400">
                Skip vague pitch decks. Post with an execution stage, tech stack, and 1st Good Issue.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              1. Project Essentials
            </h4>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-sans">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PromptForge Studio"
                className="w-full px-3 py-2 rounded-xl bg-[#141826] border border-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-sans">
                1-Line Elevator Pitch <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Local LLM prompt engineering workspace with latency heatmaps and automated eval."
                className="w-full px-3 py-2 rounded-xl bg-[#141826] border border-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Execution Stage Selector */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 font-sans">
                Current Execution Stage <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { stage: 'Blueprint / Spec' as ExecutionStage, label: 'Blueprint / Spec', desc: 'Wireframe/Schema done' },
                  { stage: 'Scaffolding' as ExecutionStage, label: 'Scaffolding', desc: 'Base repo up' },
                  { stage: 'Alpha / MVP Live' as ExecutionStage, label: 'Alpha / MVP Live', desc: 'Working prototype' },
                  { stage: 'Ship & Distribute' as ExecutionStage, label: 'Ship & Distribute', desc: 'Ready for users' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.stage}
                    onClick={() => setStage(item.stage)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      stage === item.stage
                        ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold shadow-sm'
                        : 'bg-[#121522] border-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Tech Stack Badges */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              2. Tech Stack & Tags
            </h4>
            
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-[#121522] text-slate-400 border-border hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom tag & press Enter (e.g. Svelte, Rust, Prisma)..."
                className="w-full px-3 py-1.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200 placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Section 3: Open Role Slots */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                3. Explicit Role Slots (Skill Voids)
              </h4>
              <button
                type="button"
                onClick={handleAddRole}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-3">
              {roles.map((role, idx) => (
                <div key={role.id} className="p-3.5 rounded-xl bg-[#121522] border border-border space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleUpdateRole(role.id, 'title', e.target.value)}
                      placeholder="Role Title (e.g. Frontend UI Contributor)"
                      className="flex-1 px-2.5 py-1 rounded bg-[#0A0C14] border border-border text-xs text-slate-200 font-sans"
                    />
                    <select
                      value={role.status}
                      onChange={(e) => handleUpdateRole(role.id, 'status', e.target.value)}
                      className="px-2 py-1 rounded bg-[#0A0C14] border border-border text-xs text-slate-300 font-mono"
                    >
                      <option value="open">⚡ Open</option>
                      <option value="filled">✓ Filled</option>
                    </select>
                    <select
                      value={role.commitmentHours}
                      onChange={(e) => handleUpdateRole(role.id, 'commitmentHours', Number(e.target.value))}
                      className="px-2 py-1 rounded bg-[#0A0C14] border border-border text-xs text-slate-300 font-mono"
                    >
                      <option value={3}>~3 hrs/wk</option>
                      <option value={5}>~5 hrs/wk</option>
                      <option value={8}>~8 hrs/wk</option>
                      <option value={12}>~12 hrs/wk</option>
                    </select>
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: The 1st Good Issue */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              4. The "First Good Issue" (30-min quick-win task)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[11px] mb-1">Issue Title</label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Build JWT auth middleware"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Estimated Minutes</label>
                <input
                  type="number"
                  value={issueTime}
                  onChange={(e) => setIssueTime(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Acceptance Criteria (1 per line)</label>
              <textarea
                value={issueCriteria}
                onChange={(e) => setIssueCriteria(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Section 5: Repos & Links */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              5. Prototype Links & Repo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Figma / Spec URL</label>
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://figma.com/file/..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141826] border border-border text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Publish Build Docket</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
