import React from 'react';
import { 
  Users, 
  Clock, 
  Star, 
  Sparkles, 
  FileCode2, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  FolderKanban,
  TreePine,
  Megaphone,
  Code2,
  Heart,
  Palette,
  Briefcase
} from 'lucide-react';
import { Project } from '../types';
import { getStageBadgeStyle } from '../utils/colors';

interface ProjectCardProps {
  project: Project;
  onOpenWorkspace: (project: Project) => void;
  onOpenDocket: (project: Project, targetTab?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: string) => void;
  userSkills: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenWorkspace,
  onOpenDocket,
  isBookmarked,
  onToggleBookmark,
  userSkills,
}) => {
  const stageStyle = getStageBadgeStyle(project.stage);
  const openRoles = project.roleSlots.filter((r) => r.status === 'open');

  // Check matching stack
  const matchedStackCount = project.techStack.filter(tech => 
    userSkills.some(skill => skill.toLowerCase() === tech.toLowerCase())
  ).length;

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

  return (
    <div 
      className="group relative rounded-2xl bg-[#12141E]/90 hover:bg-[#151926] border border-slate-800 hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-950/20 backdrop-blur-sm flex flex-col justify-between"
    >
      <div>
        {/* Top row: Title, Domain Category Badge, Stage Badge, Bookmark */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Pill */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <CategoryIcon className="w-3.5 h-3.5 text-indigo-400" />
                {project.category}
              </span>

              {/* Stage Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stageStyle.dot} animate-pulse`} />
                {project.stage}
              </span>

              {/* Match Indicator */}
              {matchedStackCount >= 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {matchedStackCount} Skill Overlap
                </span>
              )}
            </div>

            <h3 
              onClick={() => onOpenWorkspace(project)}
              className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer pt-1"
            >
              {project.title}
            </h3>

            {/* Elevator Pitch */}
            <p className="text-xs sm:text-sm text-slate-300 font-normal line-clamp-2 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Bookmark Action */}
          <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(project.id);
              }}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-[#181C2B] text-slate-400 hover:text-white border-slate-800 hover:border-slate-600'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400 text-indigo-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Skill / Stack Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3.5 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">
            Required Skills:
          </span>
          {project.techStack.map((tech) => {
            const isUserSkill = userSkills.some(s => s.toLowerCase() === tech.toLowerCase());
            return (
              <span
                key={tech}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  isUserSkill
                    ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'bg-[#171A27] text-slate-400 border border-slate-800'
                }`}
              >
                {tech}
              </span>
            );
          })}
        </div>

        {/* Visual Role Slots */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-400 uppercase">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Collaborators ({project.teamMembers.length}/{project.maxTeamSize})
            </span>
            <span className="text-amber-400/90 font-sans font-medium text-xs">
              {openRoles.length > 0 ? `${openRoles.length} open position${openRoles.length > 1 ? 's' : ''}` : 'Team full'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.roleSlots.map((role) => {
              if (role.status === 'filled') {
                return (
                  <div
                    key={role.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/60 text-slate-400 border border-slate-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/80" />
                    <span className="line-through text-slate-400 font-sans text-xs">
                      {role.title.replace(' (Filled)', '')}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={role.id}
                  onClick={() => onOpenWorkspace(project)}
                  className="group/slot inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
                >
                  <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="font-semibold text-white group-hover/slot:text-amber-200">
                    ⚡ {role.title.replace(' (Open)', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* First Good Task Teaser */}
        {project.firstGoodIssue && (
          <div 
            onClick={() => onOpenWorkspace(project)}
            className="mt-3.5 p-2.5 rounded-xl bg-[#0E111B] border border-indigo-500/20 hover:border-indigo-500/40 flex items-center justify-between gap-3 cursor-pointer group/issue transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                <FileCode2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase flex-shrink-0">
                  Starter Task:
                </span>
                <span className="text-xs text-slate-300 truncate group-hover/issue:text-white">
                  {project.firstGoodIssue.title}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
              ~{project.firstGoodIssue.estimatedMinutes}m
            </span>
          </div>
        )}
      </div>

      {/* Bottom Actions: Open Workspace Primary CTA */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-800/80">
        
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <img
            src={project.creator.avatar}
            alt={project.creator.name}
            className="w-5 h-5 rounded-full object-cover border border-slate-700"
          />
          <span className="text-xs text-slate-400 truncate max-w-[120px]">
            {project.creator.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDocket(project)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-all"
          >
            Spec Docket
          </button>

          <button
            onClick={() => onOpenWorkspace(project)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border border-indigo-400/40 transition-all shadow-md shadow-indigo-600/20 group/btn"
          >
            <FolderKanban className="w-3.5 h-3.5 text-indigo-300" />
            <span>Open Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
