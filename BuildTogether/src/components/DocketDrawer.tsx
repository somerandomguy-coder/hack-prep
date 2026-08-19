import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  FileCode2, 
  Milestone as MilestoneIcon, 
  Users, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Share2, 
  Code2, 
  Database, 
  Server, 
  Layout, 
  ArrowRight,
  MessageSquare,
  Terminal,
  FileCheck
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import confetti from 'canvas-confetti';
import { Project, RoleSlot, Milestone } from '../types';
import { getStageBadgeStyle, getCategoryBadge } from '../utils/colors';

interface DocketDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  onClaimRole: (projectId: string, roleId: string, note: string) => void;
  onClaimIssue: (projectId: string, issueId: string) => void;
  claimedRoleIds: string[];
  claimedIssueIds: string[];
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const DocketDrawer: React.FC<DocketDrawerProps> = ({
  project,
  isOpen,
  onClose,
  initialTab = 'overview',
  onClaimRole,
  onClaimIssue,
  claimedRoleIds,
  claimedIssueIds,
  onAddToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issue' | 'milestones' | 'roles'>('overview');
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  
  // Claim Role Modal state inside docket
  const [selectedRoleToClaim, setSelectedRoleToClaim] = useState<RoleSlot | null>(null);
  const [claimNote, setClaimNote] = useState('');
  const [showWorkspaceAccessModal, setShowWorkspaceAccessModal] = useState(false);

  // Sync initial tab when changed externally
  React.useEffect(() => {
    if (initialTab === 'issue' || initialTab === 'milestones' || initialTab === 'roles' || initialTab === 'overview') {
      setActiveTab(initialTab);
    }
  }, [initialTab, project]);

  if (!isOpen || !project) return null;

  const stageStyle = getStageBadgeStyle(project.stage);
  const openRoles = project.roleSlots.filter(r => r.status === 'open');
  const isIssueClaimed = claimedIssueIds.includes(project.firstGoodIssue.id);

  const handleCopyClone = () => {
    const cmd = project.repoCloneCommand || `git clone https://github.com/buildtogether/${project.id}.git`;
    navigator.clipboard.writeText(cmd);
    setCopiedClone(true);
    onAddToast('Copied to Clipboard', cmd, 'info');
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopySnippet = () => {
    if (project.firstGoodIssue.starterSnippet) {
      navigator.clipboard.writeText(project.firstGoodIssue.starterSnippet);
      setCopiedSnippet(true);
      onAddToast('Code Copied', 'Starter snippet copied to clipboard', 'info');
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleToggleCriterion = (index: number) => {
    const key = `${project.id}-${index}`;
    setCheckedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmClaimRole = () => {
    if (!selectedRoleToClaim) return;
    onClaimRole(project.id, selectedRoleToClaim.id, claimNote);
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setShowWorkspaceAccessModal(true);
  };

  const handleClaimIssueClick = () => {
    onClaimIssue(project.id, project.firstGoodIssue.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onAddToast('First Good Issue Claimed!', `You claimed "${project.firstGoodIssue.title}"`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in" 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-3xl bg-[#0F121C] border-l border-border/80 h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-left">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-border/80 bg-[#121522] flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stageStyle.dot} animate-pulse`} />
                  {project.stage}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  Stage Progress: {project.stageProgress}%
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 truncate">
                {project.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-[#191D2E] hover:bg-[#22283E] border border-border transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* Quick Context Strip */}
          <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Quick Repo Clone Snippet */}
            <div className="flex items-center gap-2 bg-[#0A0C13] px-3 py-1.5 rounded-lg border border-border font-mono text-slate-300 text-[11px] max-w-full overflow-hidden">
              <Terminal className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="truncate text-slate-400">
                {project.repoCloneCommand || `git clone https://github.com/pulsestream/${project.id}.git`}
              </span>
              <button
                onClick={handleCopyClone}
                className="text-slate-400 hover:text-indigo-300 p-0.5 transition-colors flex-shrink-0"
                title="Copy git clone command"
              >
                {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 flex-wrap">
              {project.architecture.githubUrl && (
                <a
                  href={project.architecture.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181C2B] text-slate-300 hover:text-white border border-border transition-colors text-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {project.architecture.figmaUrl && (
                <a
                  href={project.architecture.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181C2B] text-pink-300 hover:text-pink-200 border border-pink-500/20 transition-colors text-xs"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Figma</span>
                </a>
              )}
              {project.architecture.specUrl && (
                <a
                  href={project.architecture.specUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181C2B] text-sky-300 hover:text-sky-200 border border-sky-500/20 transition-colors text-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>API Spec</span>
                </a>
              )}
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#161A28] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Architecture & Stack</span>
            </button>

            <button
              onClick={() => setActiveTab('issue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                activeTab === 'issue'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#161A28] text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>First Good Issue (30m)</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                activeTab === 'roles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#161A28] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Open Roles ({openRoles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                activeTab === 'milestones'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#161A28] text-slate-400 hover:text-slate-200'
              }`}
            >
              <MilestoneIcon className="w-3.5 h-3.5" />
              <span>Milestones & Roadmap</span>
            </button>
          </div>

        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & ARCHITECTURE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Project Description */}
              <div className="p-4 rounded-xl bg-[#131623] border border-border">
                <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">
                  Project Mission & Problem Statement
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {project.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Technical Stack Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#121522] border border-border">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">Backend Core</span>
                    <p className="text-xs font-mono text-indigo-300 font-semibold mt-1">
                      {project.architecture.backendStack}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121522] border border-border">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">Frontend & UI</span>
                    <p className="text-xs font-mono text-cyan-300 font-semibold mt-1">
                      {project.architecture.frontendStack}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121522] border border-border">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">Data & Cache Layer</span>
                    <p className="text-xs font-mono text-emerald-300 font-semibold mt-1">
                      {project.architecture.dataLayer}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121522] border border-border">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">Infrastructure & Deployment</span>
                    <p className="text-xs font-mono text-amber-300 font-semibold mt-1">
                      {project.architecture.infraStack}
                    </p>
                  </div>
                </div>
              </div>

              {/* Architecture Diagram */}
              {project.architecture.architectureDiagramMarkdown && (
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Architecture Topology Flow
                  </h4>
                  <div className="p-4 rounded-xl bg-[#090B12] border border-border font-mono text-xs text-indigo-300/90 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                    {project.architecture.architectureDiagramMarkdown.replace(/```/g, '')}
                  </div>
                </div>
              )}

              {/* Key Endpoints & API Contract */}
              {project.architecture.keyEndpoints && project.architecture.keyEndpoints.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-400" />
                    Key API Endpoints & Interfaces
                  </h4>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="divide-y divide-border bg-[#111420]">
                      {project.architecture.keyEndpoints.map((ep, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs font-mono">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300' :
                              ep.method === 'WS' ? 'bg-purple-500/20 text-purple-300' :
                              ep.method === 'GET' ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {ep.method}
                            </span>
                            <span className="text-slate-200 font-semibold truncate">
                              {ep.path}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px] font-sans truncate text-right">
                            {ep.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: THE "FIRST GOOD ISSUE" (30-MIN QUICK WIN) */}
          {activeTab === 'issue' && (
            <div className="space-y-6">
              
              {/* Highlighted Issue Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#161825] to-indigo-950/40 border border-amber-500/40 p-5 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <FileCode2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {project.firstGoodIssue.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Est. Time: {project.firstGoodIssue.estimatedMinutes} minutes
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {project.firstGoodIssue.title}
                      </h3>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={handleClaimIssueClick}
                    disabled={isIssueClaimed}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                      isIssueClaimed
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    {isIssueClaimed ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Issue Claimed</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>Claim First Issue</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {project.firstGoodIssue.summary}
                </p>
              </div>

              {/* Acceptance Criteria Checklist */}
              <div className="p-4 rounded-xl bg-[#121522] border border-border">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Acceptance Criteria Checklist
                </h4>
                <div className="space-y-2.5">
                  {project.firstGoodIssue.acceptanceCriteria.map((crit, idx) => {
                    const key = `${project.id}-${idx}`;
                    const isChecked = !!checkedCriteria[key];
                    return (
                      <label
                        key={idx}
                        onClick={() => handleToggleCriterion(idx)}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-[#0D101A] hover:bg-[#161928] border border-border/60 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-300'} font-sans`}>
                          {crit}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Files to Touch */}
              <div className="p-4 rounded-xl bg-[#121522] border border-border">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  Target Files to Modify / Create
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(project.firstGoodIssue.filesToTouch || []).map((file, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#0A0C14] border border-border font-mono text-xs text-indigo-300"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </div>

              {/* Starter Snippet */}
              {project.firstGoodIssue.starterSnippet && (
                <div className="rounded-xl bg-[#090A11] border border-border overflow-hidden">
                  <div className="px-4 py-2 bg-[#121522] border-b border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">
                      Starter Implementation Reference
                    </span>
                    <button
                      onClick={handleCopySnippet}
                      className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white transition-colors"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    {project.firstGoodIssue.starterSnippet}
                  </pre>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: OPEN ROLES & COMMITMENT MATCHER */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-[#121522] border border-border">
                <h4 className="text-sm font-semibold text-white">
                  Explicit Role Slots & Weekly Time Expectations
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  We don't do vague "3 people joined". Every builder holds an explicit slot with defined weekly commitments.
                </p>
              </div>

              <div className="space-y-3">
                {project.roleSlots.map((role) => {
                  const catStyle = getCategoryBadge(role.category);
                  const isClaimedByUser = claimedRoleIds.includes(role.id);

                  return (
                    <div
                      key={role.id}
                      className={`p-4 rounded-xl border transition-all ${
                        role.status === 'filled'
                          ? 'bg-[#10131E]/60 border-slate-800/80 opacity-75'
                          : 'bg-[#141725] border-border hover:border-indigo-500/50 shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${catStyle.color}`}>
                              {catStyle.label}
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {role.title.replace(' (Filled)', '').replace(' (Open)', '')}
                            </h4>
                            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                              ~{role.commitmentHours} hrs/week
                            </span>
                          </div>

                          {role.status === 'filled' && role.filledBy && (
                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src={role.filledBy.avatar}
                                alt={role.filledBy.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs text-slate-400">
                                Filled by <span className="text-slate-200 font-medium">{role.filledBy.name}</span> ({role.filledBy.role})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Role Action Button */}
                        {role.status === 'open' && (
                          <button
                            onClick={() => setSelectedRoleToClaim(role)}
                            disabled={isClaimedByUser}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                              isClaimedByUser
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                            }`}
                          >
                            {isClaimedByUser ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Slot Claimed</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>Claim Slot & Join</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Requirements & Responsibilities */}
                      <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                            Stack Requirements:
                          </span>
                          <ul className="mt-1 space-y-1 text-slate-300 list-disc list-inside">
                            {role.requirements.map((req, idx) => (
                              <li key={idx} className="text-slate-300">{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                            Primary Responsibilities:
                          </span>
                          <ul className="mt-1 space-y-1 text-slate-300 list-disc list-inside">
                            {role.responsibilities.map((resp, idx) => (
                              <li key={idx} className="text-slate-300">{resp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: MILESTONES & ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-[#121522] border border-border">
                <h4 className="text-sm font-semibold text-white">
                  Execution Milestones & Current Blockers
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Track concrete technical deliverables from Spec to Distribution.
                </p>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                {project.milestones.map((ms, idx) => {
                  const isDone = ms.status === 'completed';
                  const isInProgress = ms.status === 'in_progress';

                  return (
                    <div key={ms.id} className="relative flex items-start gap-4 pl-1">
                      {/* Node Icon */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                        isDone ? 'bg-emerald-500 text-slate-950' :
                        isInProgress ? 'bg-amber-400 text-slate-950 animate-pulse' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5 font-bold" /> : idx + 1}
                      </div>

                      {/* Milestone Card */}
                      <div className="flex-1 p-3.5 rounded-xl bg-[#131623] border border-border">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-300 line-through' : 'text-white'}`}>
                            {ms.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            isInProgress ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {ms.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        {ms.blockerNote && (
                          <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Current Blocker: {ms.blockerNote}</span>
                          </div>
                        )}

                        {ms.owner && (
                          <span className="inline-block text-[11px] text-slate-400 mt-2 font-mono">
                            Lead: {ms.owner}
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer Quick Action */}
        <div className="p-4 border-t border-border bg-[#121522] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={project.creator.avatar}
              alt={project.creator.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">
                Created by {project.creator.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {project.creator.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {openRoles.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab('roles');
                  setSelectedRoleToClaim(openRoles[0]);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-400/40 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Claim Open Role & Join</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Role Claim Confirmation Modal */}
      {selectedRoleToClaim && !showWorkspaceAccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedRoleToClaim(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-md bg-[#131724] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl z-10 animate-scale-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Claim Builder Role
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRoleToClaim(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#0D101A] border border-border">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Target Project</span>
                <p className="text-sm font-semibold text-white">{project.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-400 font-mono">
                    {selectedRoleToClaim.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    (~{selectedRoleToClaim.commitmentHours}h/wk)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  Quick Intro / What You'll Ship First (Optional)
                </label>
                <textarea
                  value={claimNote}
                  onChange={(e) => setClaimNote(e.target.value)}
                  placeholder="e.g. Hey Alex! I've built WebSocket streaming waveforms in Next.js before. Ready to pick up the 1st Good Issue right away."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#0A0C14] border border-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedRoleToClaim(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClaimRole}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Get Workspace Access</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Instant Workspace Access Modal */}
      {showWorkspaceAccessModal && selectedRoleToClaim && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            onClick={() => {
              setShowWorkspaceAccessModal(false);
              setSelectedRoleToClaim(null);
            }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
          />
          <div className="relative w-full max-w-lg bg-[#111422] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl z-10 animate-scale-up">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Welcome to {project.title}!
                </h3>
                <p className="text-xs text-slate-400">
                  You are now registered as <span className="text-indigo-300 font-semibold">{selectedRoleToClaim.title}</span>.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0B0E18] border border-border space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Step 1: Clone Repository & Install
                </span>
                <div className="flex items-center justify-between bg-[#131724] px-3 py-2 rounded-lg font-mono text-xs text-indigo-300 border border-border">
                  <span className="truncate">{project.repoCloneCommand || `git clone https://github.com/buildtogether/${project.id}.git`}</span>
                  <button
                    onClick={handleCopyClone}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B0E18] border border-border space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Step 2: Join Builder Discord Channel
                </span>
                <a
                  href={project.discordInviteUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#8EA1FF] text-xs font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Open #{project.id}-builders on Discord</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B0E18] border border-border space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Step 3: Start 1st Good Issue
                </span>
                <p className="text-xs text-slate-300">
                  {project.firstGoodIssue.title} (~{project.firstGoodIssue.estimatedMinutes} min)
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowWorkspaceAccessModal(false);
                  setSelectedRoleToClaim(null);
                  setActiveTab('issue');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-400/20 transition-all"
              >
                Go to 1st Good Issue
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
