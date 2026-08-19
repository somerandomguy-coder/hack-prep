import React from 'react';
import { 
  X, 
  Bookmark, 
  TreePine, 
  Megaphone, 
  Code2, 
  Heart, 
  Palette, 
  Briefcase,
  Layers
} from 'lucide-react';
import { ExecutionStage, ProjectCategory } from '../types';
import { getStageBadgeStyle } from '../utils/colors';

interface FilterBarProps {
  selectedCategory: ProjectCategory | 'All';
  onSelectCategory: (category: ProjectCategory | 'All') => void;
  selectedStage: ExecutionStage | 'All';
  onSelectStage: (stage: ExecutionStage | 'All') => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  availableTags: string[];
  openRolesOnly: boolean;
  onToggleOpenRolesOnly: () => void;
  bookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  totalProjectsCount: number;
  stageCounts: Record<string, number>;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const categories: (ProjectCategory | 'All')[] = [
  'All',
  'Environment & Eco',
  'Campaign & Marketing',
  'Tech & AI',
  'Community & Social',
  'Creative & Design',
  'Business & Strategy'
];

const stages: (ExecutionStage | 'All')[] = [
  'All',
  'Blueprint / Spec',
  'Scaffolding',
  'Alpha / MVP Live',
  'Ship & Distribute'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStage,
  onSelectStage,
  selectedTags,
  onToggleTag,
  availableTags,
  openRolesOnly,
  onToggleOpenRolesOnly,
  bookmarkedOnly,
  onToggleBookmarkedOnly,
  totalProjectsCount,
  stageCounts,
  onClearFilters,
  hasActiveFilters,
}) => {

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Environment & Eco': return TreePine;
      case 'Campaign & Marketing': return Megaphone;
      case 'Tech & AI': return Code2;
      case 'Community & Social': return Heart;
      case 'Creative & Design': return Palette;
      case 'Business & Strategy': return Briefcase;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-3.5 mb-6">
      
      {/* Category Pills (Primary Domain Filter) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-mono text-slate-400 font-semibold mr-1 flex-shrink-0">
          DOMAIN:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const Icon = getCategoryIcon(cat);
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-[#121520] text-slate-400 hover:text-slate-200 hover:bg-[#181D2C] border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
              <span>{cat === 'All' ? 'All Domains' : cat}</span>
            </button>
          );
        })}
      </div>

      {/* Execution Stage Pills & Quick Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1 border-b border-slate-800">
        
        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-mono text-slate-500 mr-1.5 hidden sm:inline flex-shrink-0">
            STAGE:
          </span>
          {stages.map((stage) => {
            const isSelected = selectedStage === stage;
            const count = stage === 'All' ? totalProjectsCount : (stageCounts[stage] || 0);

            if (stage === 'All') {
              return (
                <button
                  key={stage}
                  onClick={() => onSelectStage('All')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-slate-200 text-slate-950 font-semibold shadow-sm'
                      : 'bg-[#121520] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>All Stages</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-900/20 text-slate-900 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            }

            const style = getStageBadgeStyle(stage);

            return (
              <button
                key={stage}
                onClick={() => onSelectStage(stage)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 border ${
                  isSelected
                    ? `${style.bg} ${style.text} ${style.border} ring-1 ring-offset-1 ring-offset-[#090A0F] ring-current font-semibold`
                    : 'bg-[#121520] text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                <span>{stage}</span>
                <span className="text-[10px] font-mono opacity-80">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Option Toggles */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleOpenRolesOnly}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              openRolesOnly
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-[#121520] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-amber-400">⚡</span>
            <span>Open Skill Slots</span>
          </button>

          <button
            onClick={onToggleBookmarkedOnly}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              bookmarkedOnly
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                : 'bg-[#121520] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3 h-3 text-indigo-400" />
            <span>Bookmarked</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
              title="Reset all active filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Tech & Skill Stack Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline flex-shrink-0">
          SKILL / STACK:
        </span>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex-shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400/60 font-semibold shadow-sm'
                  : 'bg-[#10131D] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {isSelected ? `✓ ${tag}` : tag}
            </button>
          );
        })}
      </div>

    </div>
  );
};
