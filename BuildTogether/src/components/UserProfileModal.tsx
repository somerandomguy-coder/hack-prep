import React, { useState } from 'react';
import { 
  X, 
  User, 
  Clock, 
  Check, 
  Sparkles, 
  Plus, 
  Layers, 
  FileCode2, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { CurrentUser, Project } from '../types';
import { allTags } from '../data/mockProjects';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUpdateUser: (updatedUser: CurrentUser) => void;
  projects: Project[];
  onOpenDocket: (project: Project, tab?: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  projects,
  onOpenDocket,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser.name);
  const [primaryRole, setPrimaryRole] = useState(currentUser.primaryRole);
  const [skills, setSkills] = useState<string[]>(currentUser.skills);
  const [availableHours, setAvailableHours] = useState(currentUser.availableHoursPerWeek);
  const [bio, setBio] = useState(currentUser.bio);

  const handleToggleSkill = (tag: string) => {
    if (skills.includes(tag)) {
      setSkills(skills.filter(s => s !== tag));
    } else {
      setSkills([...skills, tag]);
    }
  };

  const handleSave = () => {
    onUpdateUser({
      ...currentUser,
      name,
      primaryRole,
      skills,
      availableHoursPerWeek: availableHours,
      bio,
    });
    onClose();
  };

  // Find user's claimed projects & issues
  const claimedRolesList: { project: Project; roleTitle: string }[] = [];
  projects.forEach(p => {
    p.roleSlots.forEach(r => {
      if (currentUser.claimedRoleIds.includes(r.id)) {
        claimedRolesList.push({ project: p, roleTitle: r.title });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#0F121C] border border-border rounded-2xl shadow-2xl z-10 overflow-hidden my-8 animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#131623] border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-indigo-500/40"
            />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser.handle} • {currentUser.primaryRole}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141826] border border-border text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Primary Specialty
              </label>
              <input
                type="text"
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141826] border border-border text-slate-200"
              />
            </div>
          </div>

          {/* Available Hours */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-mono text-[11px] uppercase">
                Available Time Commitment
              </label>
              <span className="text-indigo-300 font-mono font-bold">
                ~{availableHours} hours / week
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Skills / Tech Tags */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-2">
              My Core Skills (Powers AI Smart Match)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = skills.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleSkill(tag)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 font-semibold'
                        : 'bg-[#121522] text-slate-400 border-border hover:border-slate-600'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Claimed Roles & Workspaces Activity */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase mb-2.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Active Projects & Claimed Roles ({claimedRolesList.length})
            </h4>

            {claimedRolesList.length === 0 ? (
              <div className="p-3 rounded-xl bg-[#121522] border border-border text-center text-slate-400 text-xs">
                No roles claimed yet. Explore the feed and claim an open slot!
              </div>
            ) : (
              <div className="space-y-2">
                {claimedRolesList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      onOpenDocket(item.project, 'roles');
                    }}
                    className="p-2.5 rounded-xl bg-[#121522] hover:bg-[#181C2E] border border-border flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-white">{item.project.title}</span>
                      <span className="text-[11px] text-amber-400 block font-mono">
                        {item.roleTitle}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                      Open Docket →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
