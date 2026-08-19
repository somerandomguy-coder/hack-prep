import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Layers, 
  Check, 
  FolderKanban
} from 'lucide-react';
import { Project, ExecutionStage, ProjectCategory, RoleCategory, RoleSlot, CurrentUser, TaskItem } from '../types';
import { allCategories, allTags } from '../data/mockProjects';

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
  const [category, setCategory] = useState<ProjectCategory>('Environment & Eco');
  const [stage, setStage] = useState<ExecutionStage>('Scaffolding');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sustainability', 'Campaign Strategy', 'React']);
  const [customTag, setCustomTag] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');

  // Role Slots state
  const [roles, setRoles] = useState<RoleSlot[]>([
    {
      id: 'role-1',
      title: 'Initiative Creator / Lead (Filled)',
      category: 'campaign-lead',
      status: 'filled',
      filledBy: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        role: currentUser.primaryRole,
      },
      commitmentHours: 8,
      requirements: ['Domain strategy', 'Initiative leadership'],
      responsibilities: ['Guide project vision', 'Manage deliverables'],
    },
    {
      id: 'role-2',
      title: 'UI/UX Visual Storyteller (Open)',
      category: 'design',
      status: 'open',
      commitmentHours: 6,
      requirements: ['Figma', 'Responsive UI design'],
      responsibilities: ['Create public landing page & asset deck'],
    }
  ]);

  // First Good Task state
  const [issueTitle, setIssueTitle] = useState('Draft 1-page launch charter & target milestones');
  const [issueTime, setIssueTime] = useState(30);
  const [issueCriteria, setIssueCriteria] = useState('1. Define core target outcome\n2. Outline week-1 deliverable checklist');

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddRole = () => {
    const newRole: RoleSlot = {
      id: `role-${Date.now()}`,
      title: 'New Open Role (Open)',
      category: 'frontend',
      status: 'open',
      commitmentHours: 5,
      requirements: ['Skill expertise in domain'],
      responsibilities: ['Build feature components'],
    };
    setRoles([...roles, newRole]);
  };

  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const firstTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: issueTitle || 'Initiative starter task',
      category: 'Execution',
      difficulty: 'Quick Win (~30m)',
      estimatedMinutes: Number(issueTime) || 30,
      summary: issueCriteria || 'Starter task for incoming collaborators.',
      acceptanceCriteria: issueCriteria.split('\n').filter(Boolean),
      status: 'open',
      priority: 'high',
    };

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title,
      tagline,
      description: description || tagline,
      category,
      stage,
      stageProgress: stage === 'Blueprint / Spec' ? 25 : stage === 'Scaffolding' ? 50 : 75,
      techStack: selectedTags,
      roleSlots: roles,
      firstGoodIssue: firstTask,
      tasks: [firstTask],
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
      maxTeamSize: 6,
      stars: 0,
      views: 1,
      postedAt: 'Just now',
      matchScore: 95,
      matchReason: 'Your newly created build workspace.',
      milestones: [
        { id: 'm-1', title: 'Initiative Charter & Roles Defined', stage: 'Blueprint / Spec', status: 'completed', owner: currentUser.name },
        { id: 'm-2', title: 'Onboard Core Collaborators', stage: 'Scaffolding', status: 'in_progress', eta: 'Next 7 Days' }
      ],
      architecture: {
        summary: `Workspace configuration for ${category} build.`,
        githubUrl: githubUrl || undefined,
        figmaUrl: figmaUrl || undefined,
      },
      workspaceResources: [
        ...(githubUrl ? [{ id: 'res-gh', title: 'GitHub Repository', type: 'github' as const, url: githubUrl, description: 'Source code repository', addedBy: currentUser.name, addedAt: 'Just now' }] : []),
        ...(figmaUrl ? [{ id: 'res-[#121520]', title: 'Figma Workspace', type: 'figma' as const, url: figmaUrl, description: 'Design assets board', addedBy: currentUser.name, addedAt: 'Just now' }] : [])
      ],
      workspaceActivities: [
        { id: 'act-post', user: currentUser.name, userAvatar: currentUser.avatar, action: 'posted build & launched workspace', target: title, timestamp: 'Just now', type: 'resource' }
      ],
      aiSkillRecommendations: []
    };

    onSubmitProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Post New Project Workspace</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Domain Category Selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Domain Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CleanOcean Action Network"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ExecutionStage)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Blueprint / Spec">Blueprint / Spec</option>
                <option value="Scaffolding">Scaffolding</option>
                <option value="Alpha / MVP Live">Alpha / MVP Live</option>
                <option value="Ship & Distribute">Ship & Distribute</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Elevator Pitch / Tagline *</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., Localized coastal plastic cleanup mobilization app."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detailed background, goals, and required collaboration..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Skill Tag Picker */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Required Skills / Tech Stack</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl max-h-28 overflow-y-auto custom-scrollbar">
              {allTags.map(tag => {
                const isSel = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      isSel ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Slot Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Open Collaborator Role Slots</label>
              <button
                type="button"
                onClick={handleAddRole}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Role Slot
              </button>
            </div>

            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRoles(roles.map(r => r.id === role.id ? { ...r, title: val } : r));
                      }}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                    />
                    <input
                      type="number"
                      value={role.commitmentHours}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRoles(roles.map(r => r.id === role.id ? { ...r, commitmentHours: val } : r));
                      }}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                      placeholder="h/wk"
                    />
                  </div>
                  {roles.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRole(role.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">
              Create Project & Workspace
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
