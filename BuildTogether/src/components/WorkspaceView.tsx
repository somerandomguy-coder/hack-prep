import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  FileText, 
  Layout, 
  Target, 
  Bot, 
  ChevronRight, 
  Flame, 
  Folder, 
  UserCheck, 
  CheckSquare, 
  ShieldCheck,
  TreePine,
  Megaphone,
  Code2,
  Heart,
  Palette,
  Briefcase
} from 'lucide-react';
import { Project, TaskItem, RoleSlot, WorkspaceResource, CurrentUser, TeamMember } from '../types';
import confetti from 'canvas-confetti';

interface WorkspaceViewProps {
  project: Project;
  currentUser: CurrentUser;
  onClose: () => void;
  onUpdateProject: (updatedProject: Project) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project,
  currentUser,
  onClose,
  onUpdateProject,
  onAddToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'tasks' | 'roadmap' | 'resources' | 'ai'>('overview');
  
  // Task State & Add Task Modal
  const [taskFilter, setTaskFilter] = useState<'all' | 'open' | 'claimed' | 'completed'>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Execution');
  const [newTaskEstMinutes, setNewTaskEstMinutes] = useState(45);
  const [newTaskSummary, setNewTaskSummary] = useState('');

  // Add Resource Modal
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState<WorkspaceResource['type']>('doc');
  const [newResDesc, setNewResDesc] = useState('');

  // AI Assistant Chat State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Project Assistant for "${project.title}". I analyzed your project requirements and skill structure. How can I help you accelerate execution today?`,
      time: 'Just now'
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Computed Skill Coverage
  const totalSlots = project.roleSlots.length || 1;
  const filledSlots = project.roleSlots.filter(s => s.status === 'filled').length;
  const skillCoveragePct = Math.min(100, Math.round(((filledSlots + 1) / (totalSlots + 1)) * 100));

  // Category Icon Generator
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environment & Eco': return TreePine;
      case 'Campaign & Marketing': return Megaphone;
      case 'Tech & AI': return Code2;
      case 'Community & Social': return Heart;
      case 'Creative & Design': return Palette;
      default: return Briefcase;
    }
  };

  const CategoryIcon = getCategoryIcon(project.category);

  // Action Handlers
  const handleClaimRole = (roleSlot: RoleSlot) => {
    const updatedSlots = project.roleSlots.map(s => {
      if (s.id === roleSlot.id) {
        return {
          ...s,
          status: 'filled' as const,
          filledBy: {
            name: currentUser.name,
            handle: currentUser.handle,
            avatar: currentUser.avatar,
            role: roleSlot.title,
          },
          claimedByCurrentUser: true,
        };
      }
      return s;
    });

    const isAlreadyMember = project.teamMembers.some(m => m.handle === currentUser.handle);
    const updatedTeam = isAlreadyMember 
      ? project.teamMembers 
      : [...project.teamMembers, { name: currentUser.name, handle: currentUser.handle, avatar: currentUser.avatar, role: roleSlot.title }];

    const newActivity = {
      id: `act-${Date.now()}`,
      user: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'claimed role slot',
      target: roleSlot.title,
      timestamp: 'Just now',
      type: 'role' as const,
    };

    const updated: Project = {
      ...project,
      roleSlots: updatedSlots,
      teamMembers: updatedTeam,
      workspaceActivities: [newActivity, ...project.workspaceActivities],
    };

    onUpdateProject(updated);
    onAddToast('Role Claimed!', `You joined ${project.title} as ${roleSlot.title}.`, 'success');
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleToggleTaskStatus = (task: TaskItem) => {
    const nextStatus: 'open' | 'claimed' | 'completed' = task.status === 'open' ? 'claimed' : task.status === 'claimed' ? 'completed' : 'open';
    
    const updatedTasks: TaskItem[] = project.tasks.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          status: nextStatus,
          assignedTo: nextStatus !== 'open' ? (t.assignedTo || currentUser.name) : undefined,
          assignedAvatar: nextStatus !== 'open' ? (t.assignedAvatar || currentUser.avatar) : undefined,
        };
      }
      return t;
    });

    const newActivity = {
      id: `act-${Date.now()}`,
      user: currentUser.name,
      userAvatar: currentUser.avatar,
      action: `marked task as ${nextStatus}`,
      target: task.title,
      timestamp: 'Just now',
      type: 'task' as const,
    };

    const updated: Project = {
      ...project,
      tasks: updatedTasks,
      workspaceActivities: [newActivity, ...project.workspaceActivities],
    };

    onUpdateProject(updated);
    if (nextStatus === 'completed') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      onAddToast('Task Completed! 🎉', `"${task.title}" has been completed.`, 'success');
    } else {
      onAddToast('Task Status Updated', `Task status changed to ${nextStatus.replace('_', ' ')}.`, 'info');
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const createdTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      category: newTaskCategory,
      difficulty: 'Moderate (~1-2h)',
      estimatedMinutes: Number(newTaskEstMinutes) || 45,
      summary: newTaskSummary || 'New task added to project workspace.',
      acceptanceCriteria: ['Task deliverable validated by team'],
      status: 'open',
      priority: 'high',
    };

    const updated: Project = {
      ...project,
      tasks: [createdTask, ...project.tasks],
    };

    onUpdateProject(updated);
    setIsAddTaskOpen(false);
    setNewTaskTitle('');
    setNewTaskSummary('');
    onAddToast('Task Created', `Added "${createdTask.title}" to project task board.`, 'success');
  };

  const handleCreateResource = () => {
    if (!newResTitle.trim() || !newResUrl.trim()) return;

    const newRes: WorkspaceResource = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      type: newResType,
      url: newResUrl.startsWith('http') ? newResUrl : `https://${newResUrl}`,
      description: newResDesc || 'Project workspace resource link.',
      addedBy: currentUser.name,
      addedAt: 'Just now',
    };

    const updated: Project = {
      ...project,
      workspaceResources: [newRes, ...project.workspaceResources],
    };

    onUpdateProject(updated);
    setIsAddResourceOpen(false);
    setNewResTitle('');
    setNewResUrl('');
    setNewResDesc('');
    onAddToast('Resource Linked', `Added ${newRes.title} to workspace resources.`, 'success');
  };

  const handleInviteCandidate = (candidate: TeamMember, roleTitle: string) => {
    onAddToast('Invitation Sent!', `Invited ${candidate.name} (${candidate.handle}) to join as ${roleTitle}.`, 'success');
  };

  const handleSendAiMessage = () => {
    if (!aiInputText.trim() || isAiThinking) return;

    const userText = aiInputText;
    setAiInputText('');
    setAiMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponseText = `Based on project "${project.title}" (${project.category}), I recommend prioritizing the open ${project.roleSlots.find(r => r.status === 'open')?.title || 'collaborator'} role. Also, completing the top 2 tasks will advance your stage progress beyond ${project.stageProgress}%.`;
      
      if (userText.toLowerCase().includes('task') || userText.toLowerCase().includes('todo')) {
        aiResponseText = `I can suggest 2 actionable tasks for ${project.title}:\n1. "Draft 1-page stakeholder & volunteer outreach template"\n2. "Set up central dashboard metrics for weekly progress"`;
      } else if (userText.toLowerCase().includes('skill') || userText.toLowerCase().includes('team')) {
        aiResponseText = `Your team currently has ${skillCoveragePct}% skill coverage. Adding a specialist in ${project.techStack[0] || 'Domain Execution'} will maximize execution speed.`;
      }

      setAiMessages(prev => [...prev, { sender: 'ai', text: aiResponseText, time: 'Just now' }]);
      setIsAiThinking(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden animate-in fade-in duration-200">
      
      {/* Workspace Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
            <CategoryIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {project.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {project.stage} ({project.stageProgress}%)
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" /> {project.teamMembers.length}/{project.maxTeamSize} Members
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Quick Stats & Close */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">SKILL COVERAGE</span>
              <span className="font-bold text-emerald-400">{skillCoveragePct}% Ready</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">OPEN TASKS</span>
              <span className="font-bold text-indigo-400">{project.tasks.filter(t => t.status === 'open').length} Tasks</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" /> Ask AI Copilot
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-800 bg-slate-900/50 px-6 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
        {[
          { id: 'overview', label: 'Overview & Vision', icon: Layout },
          { id: 'skills', label: 'AI Skill Matcher & Team', icon: Users, badge: project.roleSlots.filter(r => r.status === 'open').length },
          { id: 'tasks', label: 'Interactive Task Board', icon: CheckSquare, badge: project.tasks.length },
          { id: 'roadmap', label: 'Milestone Roadmap', icon: Target },
          { id: 'resources', label: 'Resources & Assets', icon: Folder, badge: project.workspaceResources.length },
          { id: 'ai', label: 'AI Copilot', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Workspace Workspace Body */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/60">
        
        {/* TAB 1: OVERVIEW & VISION */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Mission Banner */}
              <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> Project Mission & Vision
                  </span>
                  <span className="text-xs text-slate-500">Posted {project.postedAt}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{project.description}</p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stage & Execution Tracker */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" /> Stage Execution Progress
                  </h3>
                  <span className="text-xs font-semibold text-indigo-400">{project.stageProgress}% Complete</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md"
                    style={{ width: `${project.stageProgress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {['Blueprint / Spec', 'Scaffolding', 'Alpha / MVP Live', 'Ship & Distribute'].map((st) => (
                    <div 
                      key={st} 
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium ${
                        project.stage === st 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-950/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Task Overview */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" /> Active Workspace Tasks
                  </h3>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    View All Board ({project.tasks.length}) <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {project.tasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleTaskStatus(t)}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            t.status === 'completed' 
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                              : 'border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          {t.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <span className={`font-medium ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                        {t.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1 Col) */}
            <div className="space-y-6">
              
              {/* Creator Card */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Initiative Lead</span>
                <div className="flex items-center gap-3">
                  <img src={project.creator.avatar} alt={project.creator.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/40" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{project.creator.name}</h4>
                      {project.creator.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-indigo-400">{project.creator.role}</p>
                    <span className="text-[11px] text-slate-500">{project.creator.handle}</span>
                  </div>
                </div>
              </div>

              {/* Workspace Links & External Links */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Assets</span>
                <div className="space-y-2 text-xs">
                  {project.architecture.githubUrl && (
                    <a href={project.architecture.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors">
                      <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-indigo-400" /> GitHub Repository</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                  {project.architecture.figmaUrl && (
                    <a href={project.architecture.figmaUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors">
                      <span className="flex items-center gap-2"><Palette className="w-4 h-4 text-pink-400" /> Figma Design Board</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                  {project.architecture.campaignDeckUrl && (
                    <a href={project.architecture.campaignDeckUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Campaign & Pitch Deck</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                  {project.discordInviteUrl && (
                    <a href={project.discordInviteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-indigo-300 transition-colors">
                      <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-400" /> Team Community Discord</span>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Activity Log Feed */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace Activity Feed</span>
                <div className="space-y-3 text-xs max-h-60 overflow-y-auto custom-scrollbar">
                  {project.workspaceActivities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <img src={act.userAvatar} alt={act.user} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-300">
                          <span className="font-bold text-white">{act.user}</span> {act.action} <span className="text-indigo-400 font-medium">{act.target}</span>
                        </p>
                        <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI SKILL MATCHER & TEAM */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            
            {/* Skill Radar / Coverage Header Banner */}
            <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> AI Skill Matching Engine
                </span>
                <h2 className="text-lg font-bold text-white">Team Skill Coverage & Capacity</h2>
                <p className="text-xs text-slate-300">
                  AI automatically evaluates missing roles against candidate profiles in the network to ensure your team has 100% skill coverage for execution.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center min-w-[200px]">
                <span className="text-2xl font-extrabold text-emerald-400">{skillCoveragePct}%</span>
                <span className="block text-xs font-semibold text-slate-400">Team Readiness Score</span>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${skillCoveragePct}%` }} />
                </div>
              </div>
            </div>

            {/* Role Slots Management */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Project Role Slots & Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.roleSlots.map((slot) => {
                  const isFilled = slot.status === 'filled';
                  return (
                    <div 
                      key={slot.id} 
                      className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                        isFilled 
                          ? 'bg-slate-900/60 border-slate-800' 
                          : 'bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isFilled 
                              ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {slot.status === 'filled' ? 'Slot Filled' : 'Open Slot'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">~{slot.commitmentHours}h/wk</span>
                        </div>
                        
                        <h4 className="text-sm font-bold text-white">{slot.title}</h4>

                        {isFilled && slot.filledBy ? (
                          <div className="flex items-center gap-2.5 pt-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                            <img src={slot.filledBy.avatar} alt={slot.filledBy.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-xs font-bold text-white block">{slot.filledBy.name}</span>
                              <span className="text-[10px] text-slate-400">{slot.filledBy.role}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 pt-1">
                            <span className="text-[11px] font-semibold text-slate-400 block">Requirements:</span>
                            <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                              {slot.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {!isFilled ? (
                        <button
                          onClick={() => handleClaimRole(slot)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" /> Claim This Role Slot
                        </button>
                      ) : (
                        <div className="text-center py-1 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Position Active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Matched Collaborators */}
            {project.aiSkillRecommendations && project.aiSkillRecommendations.length > 0 && (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> AI Candidate Match Recommendations
                    </h3>
                    <p className="text-xs text-slate-400">People in the network with matching skill sets for open slots.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.aiSkillRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">{rec.roleTitle}</span>
                        <span className="text-[10px] text-slate-400">Suggested by AI</span>
                      </div>
                      <p className="text-xs text-slate-300">{rec.reason}</p>

                      <div className="space-y-2 pt-2 border-t border-slate-900">
                        {rec.potentialCandidates.map((cand) => (
                          <div key={cand.handle} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900">
                            <div className="flex items-center gap-3">
                              <img src={cand.avatar} alt={cand.name} className="w-9 h-9 rounded-full object-cover" />
                              <div>
                                <span className="text-xs font-bold text-white block">{cand.name}</span>
                                <span className="text-[11px] text-slate-400">{cand.role}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                {cand.matchScore}% match
                              </span>
                              <button
                                onClick={() => handleInviteCandidate(cand, rec.roleTitle)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                Invite
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INTERACTIVE TASK KANBAN BOARD */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {['all', 'open', 'claimed', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      taskFilter === f
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {f} Tasks ({f === 'all' ? project.tasks.length : project.tasks.filter(t => t.status === f).length})
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Task to Workspace
              </button>
            </div>

            {/* Task List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.tasks
                .filter(t => taskFilter === 'all' || t.status === taskFilter)
                .map((task) => (
                  <div key={task.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                          {task.category}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          task.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : task.status === 'claimed'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{task.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{task.summary}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> ~{task.estimatedMinutes} mins
                        </span>
                        {task.assignedTo && (
                          <span className="flex items-center gap-1 text-slate-300">
                            {task.assignedAvatar && <img src={task.assignedAvatar} alt="" className="w-4 h-4 rounded-full" />}
                            {task.assignedTo}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          task.status === 'completed'
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : task.status === 'claimed'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {task.status === 'completed' ? (
                          <>Re-open Task</>
                        ) : task.status === 'claimed' ? (
                          <><CheckCircle2 className="w-4 h-4" /> Mark Completed</>
                        ) : (
                          <>Claim Task</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: MILESTONE ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Milestone & Stage Roadmap
            </h3>

            <div className="space-y-4">
              {project.milestones.map((m, idx) => (
                <div key={m.id} className="flex items-start gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.status === 'completed' 
                      ? 'bg-emerald-500 text-slate-950' 
                      : m.status === 'in_progress'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Stage: {m.stage} {m.owner && `• Owner: ${m.owner}`} {m.eta && `• Target: ${m.eta}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RESOURCES & ASSETS */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" /> Linked Workspace Resources
              </h3>
              <button
                onClick={() => setIsAddResourceOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Link New Resource
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.workspaceResources.map((res) => (
                <div key={res.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        {res.type}
                      </span>
                      <span className="text-[10px] text-slate-500">{res.addedAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{res.title}</h4>
                    <p className="text-xs text-slate-400">{res.description}</p>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition-colors mt-3"
                  >
                    Open Asset Link <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI COPILOT / ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="h-[600px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Workspace AI Copilot</h3>
                  <p className="text-xs text-slate-400">Ask questions, request task breakdowns, or draft outreach content.</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/60">
              {aiMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] opacity-60 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400 animate-spin" /> AI Copilot is formulating answer...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                placeholder="Ask AI to break down tasks, draft copy, or suggest missing roles..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiInputText.trim() || isAiThinking}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> Create Workspace Task
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Design hero landing page graphic"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={newTaskEstMinutes}
                    onChange={(e) => setNewTaskEstMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTaskSummary}
                  onChange={(e) => setNewTaskSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsAddTaskOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400">Cancel</button>
              <button onClick={handleCreateTask} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddResourceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" /> Link Workspace Resource
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Resource Title</label>
                <input
                  type="text"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="e.g. Figma Design System"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Asset URL</label>
                <input
                  type="text"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="https://figma.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Resource Type</label>
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="figma">Figma Design</option>
                  <option value="github">GitHub Repo</option>
                  <option value="deck">Pitch Deck</option>
                  <option value="notion">Notion Doc</option>
                  <option value="discord">Discord Community</option>
                  <option value="doc">Document Link</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsAddResourceOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400">Cancel</button>
              <button onClick={handleCreateResource} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">Link Resource</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
