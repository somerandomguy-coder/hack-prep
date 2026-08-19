import React from 'react';
import { 
  Users, 
  Clock, 
  ExternalLink, 
  Star, 
  Sparkles, 
  FileCode2, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { Project, RoleSlot } from '../types';
import { getStageBadgeStyle, getCategoryBadge } from '../utils/colors';

interface ProjectCardProps {
  project: Project;
  onOpenDocket: (project: Project, targetTab?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: string) => void;
  userSkills: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDocket,
  isBookmarked,
  onToggleBookmark,
  userSkills,
}) => {
  const stageStyle = getStageBadgeStyle(project.stage);
  const openRoles = project.roleSlots.filter((r) => r.status === 'open');
  const filledRoles = project.roleSlots.filter((r) => r.status === 'filled');

  // Check matching stack
  const matchedStackCount = project.techStack.filter(tech => 
    userSkills.some(skill => skill.toLowerCase() === tech.toLowerCase())
  ).length;

  return (
    <div 
      className="group relative rounded-2xl bg-[#12141E]/90 hover:bg-[#151926] border border-border hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-950/20 backdrop-blur-sm"
    >
      {/* Top row: Title, Stage Badge, Bookmark */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 
              onClick={() => onOpenDocket(project)}
              className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {project.title}
            </h3>

            {/* Stage Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${stageStyle.dot} animate-pulse`} />
              {project.stage}
            </span>

            {/* Match Indicator */}
            {matchedStackCount >= 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {matchedStackCount} Skill Overlap
              </span>
            )}
          </div>

          {/* Elevator Pitch */}
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(project.id);
            }}
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                : 'bg-[#181C2B] text-slate-400 hover:text-white border-border hover:border-slate-600'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>
        </div>

      </div>

      {/* Middle Section: Tech Stack Badges */}
      <div className="flex items-center gap-1.5 flex-wrap mt-3.5 pt-3 border-t border-border/50">
        <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">
          Stack:
        </span>
        {project.techStack.map((tech) => {
          const isUserSkill = userSkills.some(s => s.toLowerCase() === tech.toLowerCase());
          return (
            <span
              key={tech}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                isUserSkill
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'bg-[#171A27] text-slate-400 border border-border/80'
              }`}
            >
              {tech}
            </span>
          );
        })}
      </div>

      {/* Visual Role Slots: Filled vs Needed */}
      <div className="mt-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-400 uppercase">
            <Users className="w-3.5 h-3.5" />
            Role Slots ({project.teamMembers.length}/{project.maxTeamSize} Builders)
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
                  title={`Filled by ${role.filledBy?.name || 'Core Member'}`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80" />
                  <span className="line-through text-slate-400 font-sans text-xs">
                    {role.title.replace(' (Filled)', '')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Filled)
                  </span>
                </div>
              );
            }

            return (
              <button
                key={role.id}
                onClick={() => onOpenDocket(project, 'roles')}
                className="group/slot inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="font-semibold text-white group-hover/slot:text-amber-200">
                  ⚡ Open: {role.title.replace(' (Open)', '')}
                </span>
                <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 px-1 rounded border border-amber-500/20">
                  ~{role.commitmentHours}h/wk
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* First Good Issue Teaser */}
      {project.firstGoodIssue && (
        <div 
          onClick={() => onOpenDocket(project, 'issue')}
          className="mt-3.5 p-2.5 rounded-xl bg-[#0E111B] border border-indigo-500/20 hover:border-indigo-500/40 flex items-center justify-between gap-3 cursor-pointer group/issue transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 flex-shrink-0">
              <FileCode2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase flex-shrink-0">
                1st Good Issue:
              </span>
              <span className="text-xs text-slate-300 truncate group-hover/issue:text-white">
                {project.firstGoodIssue.title}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
            ~{project.firstGoodIssue.estimatedMinutes}m Entry
          </span>
        </div>
      )}

      {/* Bottom Footer Meta Stats & CTA */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-border/60">
        
        {/* Creator Info & Time */}
        <div className="flex items-center gap-2">
          <img
            src={project.creator.avatar}
            alt={project.creator.name}
            className="w-5 h-5 rounded-full object-cover border border-slate-700"
          />
          <span className="text-xs text-slate-400">
            by <span className="text-slate-300 font-medium">{project.creator.name}</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.postedAt}
          </span>
        </div>

        {/* View Docket & Join CTA */}
        <button
          onClick={() => onOpenDocket(project)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-200 bg-indigo-500/15 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 hover:border-indigo-400 transition-all shadow-sm group/btn"
        >
          <span>View Docket & Join</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};
