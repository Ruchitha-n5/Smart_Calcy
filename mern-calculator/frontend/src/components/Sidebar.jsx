import {
  Home,
  Calculator as CalcIcon,
  ChevronDown,
  LineChart,
  Triangle,
  Grid3x3,
  BarChart3,
  BookOpen,
  Clock,
  Heart,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", icon: Home },
  { label: "Calculator", icon: CalcIcon },
  { label: "Graph Plotter", icon: LineChart },
  { label: "Geometry", icon: Triangle },
  { label: "Matrix", icon: Grid3x3 },
  { label: "Statistics", icon: BarChart3 },
  { label: "Formulas", icon: BookOpen },
  { label: "History", icon: Clock },
  { label: "Saved", icon: Heart },
  { label: "Settings", icon: Settings },
  { label: "Help", icon: HelpCircle },
];

export default function Sidebar({ active, onSelect }) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border/60 px-3 py-5 gap-1 sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center font-bold text-sm">
          fx
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">Visual Scientific Calculator</p>
          <p className="text-[11px] text-white/40 leading-tight">Calculate. Visualize. Understand.</p>
        </div>
      </div>

      {NAV_ITEMS.map(({ label, icon: Icon }) => {
        const isActive = active === label;
        const isCalculator = label === "Calculator";
        return (
          <div key={label}>
            <button
              onClick={() => {
                if (isCalculator) {
                  setCalculatorOpen((open) => !open);
                } else {
                  onSelect(label);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-accent-purple to-accent-violet text-white font-medium shadow-glow"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
              aria-expanded={isCalculator ? calculatorOpen : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
              {isCalculator && (
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${calculatorOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {isCalculator && calculatorOpen && (
              <div className="ml-5 mt-1 flex flex-col border-l border-border pl-3">
                {['Basic Calculator', 'Scientific Calculator'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSelect(option);
                      setCalculatorOpen(false);
                    }}
                    className="py-2 text-left text-xs text-white/60 transition-colors hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-auto card p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center text-2xl">
          🧑‍💻
        </div>
        <p className="text-sm font-semibold">Master Math</p>
        <p className="text-[11px] text-white/40">Visualize concepts and solve like a pro!</p>
      </div>
    </aside>
  );
}
