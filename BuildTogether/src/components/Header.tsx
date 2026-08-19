import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Presentation,
  Check,
  Wand2,
  FolderKanban
} from 'lucide-react';
import { CurrentUser } from '../types';

interface HeaderProps {
  currentUser: CurrentUser;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchToProfile: boolean;
  onToggleMatchToProfile: () => void;
  onOpenIdeaStudio: () => void;
  onOpenPostModal: () => void;
  onOpenProfileModal: () => void;
  onOpenPitchMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  searchQuery,
  onSearchChange,
  matchToProfile,
  onToggleMatchToProfile,
  onOpenIdeaStudio,
  onOpenPostModal,
  onOpenProfileModal,
  onOpenPitchMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090A0F]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-mono">
                  BuildTogether
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md">
                  AI Skill Connect
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Idea-to-Team & Multi-Domain Collaboration Workspace
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search ideas, skills, campaigns, tech, eco..."
                className="w-full pl-9 pr-12 py-1.5 bg-[#121520] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#1A1E2E] border border-slate-700/60 rounded">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Idea Studio Button (Featured) */}
            <button
              onClick={onOpenIdeaStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 border border-indigo-400/40 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="font-sans">Idea Studio (AI Match)</span>
            </button>

            {/* Pitch Deck / Guide */}
            <button
              onClick={onOpenPitchMode}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-sm"
              title="Hackathon Pitch Flow"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Pitch Guide</span>
            </button>

            {/* AI Match Toggle */}
            <button
              onClick={onToggleMatchToProfile}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                matchToProfile
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                  : 'bg-[#121520] text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${matchToProfile ? 'text-white fill-white' : 'text-indigo-400'}`} />
              <span>Match Profile</span>
              {matchToProfile && <Check className="w-3.5 h-3.5" />}
            </button>

            {/* Post a Build Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-sans hidden md:inline">Post Build</span>
            </button>

            {/* User Profile Badge */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-[#121520] border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-indigo-500/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#121520]" />
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  {currentUser.primaryRole}
                </span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
