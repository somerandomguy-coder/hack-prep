import React from 'react';
import { 
  X, 
  Presentation, 
  Target, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface PitchModeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToFilter: (stage: string) => void;
  onOpenPulseStream: () => void;
}

export const PitchModeGuide: React.FC<PitchModeGuideProps> = ({
  isOpen,
  onClose,
  onJumpToFilter,
  onOpenPulseStream,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0F121C] border border-amber-500/30 rounded-2xl shadow-2xl z-10 overflow-hidden my-8 animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/40 via-[#131624] to-indigo-950/40 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                The Hackathon Winning Pitch & Wedge Strategy
              </h3>
              <p className="text-xs text-amber-300/80">
                Why BuildTogether solves the side-project execution void.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] text-xs">
          
          {/* Pitch Flow Stepper (3-Minute Winning Pitch) */}
          <div className="p-4 rounded-xl bg-[#121522] border border-border">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              The 3-Minute Demo Pitch Flow
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#0C0E17] border border-border">
                <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">01. THE HOOK (30s)</span>
                <p className="text-slate-300 leading-snug">
                  "Most side projects stall not from bad ideas, but because onboarding a new contributor takes weeks of context dumping."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0C0E17] border border-border">
                <span className="text-[10px] font-mono text-sky-400 font-bold block mb-1">02. THE SOLUTION (1m)</span>
                <p className="text-slate-300 leading-snug">
                  "Filter builds by concrete Execution Stages (Scaffolding / Blueprint) and exact missing tech voids (FastAPI / React)."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0C0E17] border border-border">
                <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1">03. THE DOCKET (1m)</span>
                <p className="text-slate-300 leading-snug">
                  "Open a card &rarr; Instant architecture overview + The 30-minute 'First Good Issue' &rarr; 1-click workspace join."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0C0E17] border border-border">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">04. THE IMPACT (30s)</span>
                <p className="text-slate-300 leading-snug">
                  "Reduces collaborator onboarding from 14 days of Discord back-and-forth to 2 minutes of focused code shipping."
                </p>
              </div>
            </div>
          </div>

          {/* Wedge Comparison Table */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              Avoiding The "Generic Idea Board" Trap: Comparison
            </h4>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141726] text-slate-400 font-mono text-[10px] uppercase border-b border-border">
                  <tr>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Primary Trap / Friction</th>
                    <th className="p-3 text-indigo-300 font-bold">BuildTogether Wedge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-[#0E111C]">
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">Discord / Reddit</td>
                    <td className="p-3 text-rose-300/80">Endless chat threads, lost context, ghosted contributors.</td>
                    <td className="p-3 text-emerald-300 font-medium">Context Onboarding Docket with git clone & API contract.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">Trello / Notion</td>
                    <td className="p-3 text-rose-300/80">Bloated Kanban boards with zero skill matching or verification.</td>
                    <td className="p-3 text-emerald-300 font-medium">30-min "First Good Issue" quick-win test of synergy.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">AngelList / Wellfound</td>
                    <td className="p-3 text-rose-300/80">Geared for formal equity/salary corporate Series A hires.</td>
                    <td className="p-3 text-emerald-300 font-medium">Micro-MVP Builder Milestones (Blueprint &rarr; Scaffolding &rarr; Alpha).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Demo Launchers */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Try the Live Pitch Experience</span>
              <span className="text-[11px] text-slate-400">Open the pre-configured PulseStream AI Scaffolding Docket with 1-click.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPulseStream();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex-shrink-0"
            >
              <span>Open PulseStream Demo Docket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
