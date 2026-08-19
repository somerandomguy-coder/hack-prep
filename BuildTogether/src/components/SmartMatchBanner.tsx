import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { CurrentUser, Project } from '../types';

interface SmartMatchBannerProps {
  currentUser: CurrentUser;
  matchedProjects: Project[];
  onSelectProject: (project: Project) => void;
  onFilterToMatched: () => void;
  isActive: boolean;
}

export const SmartMatchBanner: React.FC<SmartMatchBannerProps> = ({
  currentUser,
  matchedProjects,
  onSelectProject,
  onFilterToMatched,
  isActive,
}) => {
  if (matchedProjects.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#131724]/90 to-purple-950/50 border border-indigo-500/30 p-4 sm:p-5 shadow-xl shadow-indigo-950/30 backdrop-blur-md mb-6">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 left-1/4 w-60 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Text and context */}
        <div className="flex items-start gap-3.5">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                Smart Match Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {matchedProjects.length} High-Synergy Builds Found
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mt-1 leading-snug">
              Based on your stack ({currentUser.skills.slice(0, 3).join(' / ')}), these {matchedProjects.length} projects need your exact skills at the <span className="text-amber-300 font-medium">Scaffolding</span> & <span className="text-sky-300 font-medium">Blueprint</span> stages.
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero fluff. Jump directly into pre-scaffolded repos with active first issues.
            </p>
          </div>
        </div>

        {/* Action pills & preview */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
          {matchedProjects.slice(0, 2).map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181C2B] hover:bg-[#1F2438] border border-border-subtle hover:border-indigo-500/40 transition-all text-left group"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[120px]">
                  {project.title}
                </span>
                <span className="text-[10px] text-indigo-300/80 font-mono">
                  {project.matchScore}% Match
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}

          <button
            onClick={onFilterToMatched}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isActive
                ? 'bg-indigo-600 text-white border border-indigo-400'
                : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40'
            }`}
          >
            <span>{isActive ? 'Showing Matched' : 'Filter Feed'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
