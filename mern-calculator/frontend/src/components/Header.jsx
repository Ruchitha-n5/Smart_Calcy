import { Search, Moon, Sun, ChevronDown } from "lucide-react";

export default function Header({ dark, setDark }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4 border-b border-border/60 bg-header-bg backdrop-blur-md transition-colors">
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search formulas, functions..."
          className="w-full bg-bg-soft border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-accent-purple placeholder:text-white/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className={`w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-soft transition-colors ${dark ? "hover:bg-accent-purple/20" : "hover:bg-yellow-400/20"}`}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={dark}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-semibold">
            AD
          </div>
          <span className="text-sm text-white/80">Hello, Aditya</span>
          <ChevronDown size={14} className="text-white/40" />
        </div>
      </div>
    </header>
  );
}
