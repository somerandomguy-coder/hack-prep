import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SmartMatchBanner } from './components/SmartMatchBanner';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { DocketDrawer } from './components/DocketDrawer';
import { PostBuildModal } from './components/PostBuildModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PitchModeGuide } from './components/PitchModeGuide';
import { ToastContainer, ToastMessage } from './components/Toast';
import { mockProjects, initialCurrentUser, allTags } from './data/mockProjects';
import { Project, ExecutionStage, CurrentUser } from './types';
import { 
  Terminal, 
  Sparkles, 
  Plus, 
  Code2, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2,
  FolderSearch,
  FilterX
} from 'lucide-react';

export function App() {
  // Core State
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(initialCurrentUser);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<ExecutionStage | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openRolesOnly, setOpenRolesOnly] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [matchToProfile, setMatchToProfile] = useState(false);

  // Modals & Drawers
  const [selectedProjectForDocket, setSelectedProjectForDocket] = useState<Project | null>(null);
  const [docketInitialTab, setDocketInitialTab] = useState<string>('overview');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPitchModeOpen, setIsPitchModeOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard shortcut listener (/ for search, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === 'Escape') {
        setSelectedProjectForDocket(null);
        setIsPostModalOpen(false);
        setIsProfileModalOpen(false);
        setIsPitchModeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute smart matched projects for current user
  const smartMatchedProjects = useMemo(() => {
    return projects.filter(p => {
      const overlap = p.techStack.filter(tech => 
        currentUser.skills.some(skill => skill.toLowerCase() === tech.toLowerCase())
      );
      // High synergy if 2+ skills overlap and has open roles
      const hasOpen = p.roleSlots.some(r => r.status === 'open');
      return overlap.length >= 2 && hasOpen;
    });
  }, [projects, currentUser.skills]);

  // Compute Stage Counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Blueprint / Spec': 0,
      'Scaffolding': 0,
      'Alpha / MVP Live': 0,
      'Ship & Distribute': 0,
    };
    projects.forEach(p => {
      if (counts[p.stage] !== undefined) {
        counts[p.stage]++;
      }
    });
    return counts;
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesTagline = p.tagline.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTech = p.techStack.some(t => t.toLowerCase().includes(q));
        const matchesIssue = p.firstGoodIssue?.title.toLowerCase().includes(q);
        const matchesRoles = p.roleSlots.some(r => r.title.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesDesc && !matchesTech && !matchesIssue && !matchesRoles) {
          return false;
        }
      }

      // 2. Stage filter
      if (selectedStage !== 'All' && p.stage !== selectedStage) {
        return false;
      }

      // 3. Tag filters (AND condition if multiple selected)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(selectedTag => 
          p.techStack.some(pt => pt.toLowerCase() === selectedTag.toLowerCase())
        );
        if (!hasAllTags) return false;
      }

      // 4. Open roles only
      if (openRolesOnly) {
        const hasOpen = p.roleSlots.some(r => r.status === 'open');
        if (!hasOpen) return false;
      }

      // 5. Bookmarked only
      if (bookmarkedOnly) {
        if (!currentUser.bookmarkedProjectIds.includes(p.id)) return false;
      }

      // 6. Match to profile toggle
      if (matchToProfile) {
        const hasOverlap = p.techStack.some(tech => 
          currentUser.skills.some(skill => skill.toLowerCase() === tech.toLowerCase())
        );
        if (!hasOverlap) return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedStage, selectedTags, openRolesOnly, bookmarkedOnly, matchToProfile, currentUser]);

  // Handlers
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleBookmark = (projectId: string) => {
    const isCurrentlyBookmarked = currentUser.bookmarkedProjectIds.includes(projectId);
    const updatedBookmarks = isCurrentlyBookmarked
      ? currentUser.bookmarkedProjectIds.filter(id => id !== projectId)
      : [...currentUser.bookmarkedProjectIds, projectId];

    setCurrentUser({
      ...currentUser,
      bookmarkedProjectIds: updatedBookmarks,
    });

    addToast(
      isCurrentlyBookmarked ? 'Bookmark Removed' : 'Project Bookmarked',
      isCurrentlyBookmarked ? 'Removed from your saved list.' : 'Saved to your bookmarked builds.',
      'info'
    );
  };

  const handleOpenDocket = (project: Project, targetTab: string = 'overview') => {
    setSelectedProjectForDocket(project);
    setDocketInitialTab(targetTab);
  };

  const handleClaimRole = (projectId: string, roleId: string, note: string) => {
    // Update role status in projects
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        roleSlots: p.roleSlots.map(r => {
          if (r.id !== roleId) return r;
          return {
            ...r,
            status: 'filled',
            filledBy: {
              name: currentUser.name,
              handle: currentUser.handle,
              avatar: currentUser.avatar,
              role: currentUser.primaryRole,
            },
            claimedByCurrentUser: true,
          };
        }),
        teamMembers: [
          ...p.teamMembers,
          {
            name: currentUser.name,
            handle: currentUser.handle,
            avatar: currentUser.avatar,
            role: currentUser.primaryRole,
          }
        ]
      };
    }));

    // Update user's claimed roles
    setCurrentUser(prev => ({
      ...prev,
      claimedRoleIds: [...prev.claimedRoleIds, roleId],
    }));

    addToast('Role Claimed Successfully!', `You joined the team as a co-builder!`, 'success');
  };

  const handleClaimIssue = (projectId: string, issueId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      claimedIssueIds: [...prev.claimedIssueIds, issueId],
    }));

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        firstGoodIssue: {
          ...p.firstGoodIssue,
          status: 'claimed',
        }
      };
    }));
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    addToast('Build Published!', `"${newProject.title}" is now open for co-builders!`, 'success');
  };

  const handleClearFilters = () => {
    setSelectedStage('All');
    setSelectedTags([]);
    setOpenRolesOnly(false);
    setBookmarkedOnly(false);
    setMatchToProfile(false);
    setSearchQuery('');
  };

  const hasActiveFilters = Boolean(
    selectedStage !== 'All' ||
    selectedTags.length > 0 ||
    openRolesOnly ||
    bookmarkedOnly ||
    matchToProfile ||
    searchQuery.trim()
  );

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans bg-grid-pattern">
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        matchToProfile={matchToProfile}
        onToggleMatchToProfile={() => setMatchToProfile(!matchToProfile)}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenPitchMode={() => setIsPitchModeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Smart Match Recommendation Engine Banner */}
        <SmartMatchBanner
          currentUser={currentUser}
          matchedProjects={smartMatchedProjects}
          onSelectProject={(p) => handleOpenDocket(p, 'overview')}
          onFilterToMatched={() => setMatchToProfile(true)}
          isActive={matchToProfile}
        />

        {/* Quick Filter Bar */}
        <FilterBar
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          availableTags={allTags}
          openRolesOnly={openRolesOnly}
          onToggleOpenRolesOnly={() => setOpenRolesOnly(!openRolesOnly)}
          bookmarkedOnly={bookmarkedOnly}
          onToggleBookmarkedOnly={() => setBookmarkedOnly(!bookmarkedOnly)}
          totalProjectsCount={projects.length}
          stageCounts={stageCounts}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Projects Feed */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDocket={handleOpenDocket}
                isBookmarked={currentUser.bookmarkedProjectIds.includes(project.id)}
                onToggleBookmark={handleToggleBookmark}
                userSkills={currentUser.skills}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl bg-[#111420] border border-border p-12 text-center my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FolderSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">
              No Matching Builds Found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No projects match your current filters. Try resetting active filters or post your own build!
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-[#1A1E2E] hover:bg-[#22283E] border border-border transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post This Build</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-[#0A0C13] py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-400">BuildTogether</span>
            <span>•</span>
            <span>Micro-MVP Contributor Network</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Built for the 2026 Hackathon</span>
            <span>•</span>
            <button 
              onClick={() => setIsPitchModeOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Pitch Deck & Strategy
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <DocketDrawer
        project={selectedProjectForDocket}
        isOpen={Boolean(selectedProjectForDocket)}
        onClose={() => setSelectedProjectForDocket(null)}
        initialTab={docketInitialTab}
        onClaimRole={handleClaimRole}
        onClaimIssue={handleClaimIssue}
        claimedRoleIds={currentUser.claimedRoleIds}
        claimedIssueIds={currentUser.claimedIssueIds}
        onAddToast={addToast}
      />

      <PostBuildModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitProject={handleCreateProject}
        currentUser={currentUser}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        projects={projects}
        onOpenDocket={handleOpenDocket}
      />

      <PitchModeGuide
        isOpen={isPitchModeOpen}
        onClose={() => setIsPitchModeOpen(false)}
        onJumpToFilter={(stage) => setSelectedStage(stage as ExecutionStage)}
        onOpenPulseStream={() => {
          const p = projects.find(x => x.id === 'project-1');
          if (p) handleOpenDocket(p, 'overview');
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;
