import { ExecutionStage, RoleCategory } from '../types';

export function getStageBadgeStyle(stage: ExecutionStage) {
  switch (stage) {
    case 'Blueprint / Spec':
      return {
        bg: 'bg-sky-500/10',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
        dot: 'bg-sky-400',
        label: 'Blueprint / Spec',
        desc: 'Spec & Wireframe defined',
      };
    case 'Scaffolding':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'Scaffolding',
        desc: 'Base repo up, core stack picked',
      };
    case 'Alpha / MVP Live':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Alpha / MVP Live',
        desc: 'Working prototype needs polish',
      };
    case 'Ship & Distribute':
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
        label: 'Ship & Distribute',
        desc: 'Ready for user distribution',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        label: stage,
        desc: '',
      };
  }
}

export function getCategoryBadge(category: RoleCategory) {
  switch (category) {
    case 'frontend':
      return { label: 'Frontend', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    case 'backend':
      return { label: 'Backend', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    case 'fullstack':
      return { label: 'Fullstack', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    case 'ml-ai':
      return { label: 'ML / AI', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    case 'design':
      return { label: 'Design & UI', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
    case 'devops':
      return { label: 'DevOps / Infra', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    case 'growth':
      return { label: 'DevRel & Growth', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    default:
      return { label: category, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
  }
}
