import { Calculator, LineChart, Grid3x3, Triangle, BarChart3, Zap, ChevronRight, BookOpen } from "lucide-react";

const FEATURES = [
  { label: "Scientific Calculations", icon: Calculator },
  { label: "Graph Plotting", icon: LineChart },
  { label: "Matrix Operations", icon: Grid3x3 },
  { label: "Geometry Visuals", icon: Triangle },
  { label: "Statistics & More", icon: BarChart3 },
];

const QUICK_ACTIONS = [
  { label: "Basic Calculator", icon: Calculator },
  { label: "Graph Plotter", icon: LineChart },
  { label: "Geometry Calculator", icon: Triangle },
  { label: "Matrix Calculator", icon: Grid3x3 },
  { label: "Formula Library", icon: BookOpen },
];

export function HeroBanner() {
  return (
    <div className="card h-full relative overflow-hidden p-6 md:p-8 flex items-center justify-between gap-6 border border-border/80 bg-gradient-to-br from-[#1b1338] via-[#120d26] to-[#0d091a]">
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-64 h-64 bg-accent-pink/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Text */}
      <div className="relative z-10 max-w-sm shrink-0">
        <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
          Powerful Calculations
          <br />
          <span className="bg-gradient-to-r from-accent-purple via-purple-400 to-accent-pink bg-clip-text text-transparent">
            Beautiful Visualizations
          </span>
        </h1>
        <p className="text-white/50 text-xs lg:text-sm mt-3 leading-relaxed">
          From basic arithmetic to advanced mathematics, visualize every step and concept.
        </p>
      </div>

      {/* Middle 3D Calculator Graphic */}
      <div className="relative z-10 hidden md:flex items-center justify-center shrink-0 w-44 lg:w-52 h-40">
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_15px_25px_rgba(139,92,246,0.35)] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <rect x="20" y="20" width="160" height="200" rx="20" fill="url(#calc-body)" stroke="#5b4594" strokeWidth="3" />
          <rect x="35" y="38" width="130" height="42" rx="10" fill="#0d0a1a" stroke="#372c5c" strokeWidth="1.5" />
          <text x="150" y="66" fill="#a78bfa" fontSize="18" fontWeight="bold" textAnchor="end" fontFamily="monospace">78.5398</text>
          
          {/* Keypad Grid */}
          <g fill="#241b42" stroke="#3b2d66" strokeWidth="1">
            <rect x="35" y="95" width="28" height="20" rx="5" />
            <rect x="69" y="95" width="28" height="20" rx="5" />
            <rect x="103" y="95" width="28" height="20" rx="5" />
            <rect x="137" y="95" width="28" height="20" rx="5" fill="#e11d48" stroke="#f43f5e" />

            <rect x="35" y="122" width="28" height="20" rx="5" />
            <rect x="69" y="122" width="28" height="20" rx="5" />
            <rect x="103" y="122" width="28" height="20" rx="5" />
            <rect x="137" y="122" width="28" height="20" rx="5" fill="#7c3aed" stroke="#8b5cf6" />

            <rect x="35" y="149" width="28" height="20" rx="5" />
            <rect x="69" y="149" width="28" height="20" rx="5" />
            <rect x="103" y="149" width="28" height="20" rx="5" />
            <rect x="137" y="149" width="28" height="20" rx="5" fill="#7c3aed" stroke="#8b5cf6" />

            <rect x="35" y="176" width="28" height="20" rx="5" />
            <rect x="69" y="176" width="28" height="20" rx="5" />
            <rect x="103" y="176" width="28" height="20" rx="5" />
            <rect x="137" y="176" width="28" height="47" rx="5" fill="url(#equal-grad)" stroke="#c084fc" />

            <rect x="35" y="203" width="62" height="20" rx="5" />
            <rect x="103" y="203" width="28" height="20" rx="5" />
          </g>

          <defs>
            <linearGradient id="calc-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2e2254" />
              <stop offset="100%" stopColor="#151029" />
            </linearGradient>
            <linearGradient id="equal-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Feature List */}
      <div className="relative z-10 hidden xl:flex flex-col gap-2.5 text-xs font-medium shrink-0">
        {FEATURES.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-md bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center shrink-0">
              <Icon size={13} className="text-accent-purple" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActions({ onSelect }) {
  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div className="flex items-center gap-2 font-semibold text-sm mb-3">
        <Zap size={16} className="text-yellow-400 fill-yellow-400" />
        <span>Quick Actions</span>
      </div>
      <div className="flex flex-col gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onSelect?.(label)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-bg-soft hover:bg-white/5 border border-border text-xs font-medium text-left transition-all hover:border-accent-purple/40"
          >
            <span className="flex items-center gap-2.5 text-white/80">
              <Icon size={14} className="text-accent-purple" />
              {label}
            </span>
            <ChevronRight size={13} className="text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}
