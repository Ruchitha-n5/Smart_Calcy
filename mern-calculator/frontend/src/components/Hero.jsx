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
    <div className="card relative overflow-hidden p-8 flex items-center justify-between gap-8">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-accent-pink/10 pointer-events-none" />
      <div className="relative z-10 max-w-md">
        <h1 className="text-3xl font-extrabold leading-tight">
          Powerful Calculations
          <br />
          <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
            Beautiful Visualizations
          </span>
        </h1>
        <p className="text-white/50 text-sm mt-3">
          From basic arithmetic to advanced mathematics, visualize every step and concept.
        </p>
      </div>

      <div className="relative z-10 hidden md:block text-6xl">🧮</div>

      <div className="relative z-10 hidden xl:flex flex-col gap-2 text-sm">
        {FEATURES.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2 text-white/70">
            <Icon size={15} className="text-accent-purple" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActions({ onSelect }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
        <Zap size={16} className="text-yellow-400" />
        Quick Actions
      </div>
      <div className="flex flex-col gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onSelect?.(label)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-bg-soft hover:bg-white/5 border border-border text-sm text-left"
          >
            <span className="flex items-center gap-2">
              <Icon size={15} className="text-accent-purple" />
              {label}
            </span>
            <ChevronRight size={14} className="text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}
