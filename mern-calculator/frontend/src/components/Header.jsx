import { useState } from "react";
import { Search, Moon, Sun, ChevronDown, LogOut, User } from "lucide-react";

export default function Header({ dark, setDark, user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-6 py-3.5 border-b border-border/60 bg-header-bg backdrop-blur-md transition-colors">
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search formulas, functions..."
          className="w-full bg-bg-soft border border-border rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-accent-purple placeholder:text-white/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className={`w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-soft transition-colors ${dark ? "hover:bg-accent-purple/20" : "hover:bg-yellow-400/20"}`}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-90 transition-opacity"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-accent-purple/40" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <span className="text-xs font-medium text-white/80 block leading-tight">
                Hello, {user?.name ? user.name.split(" ")[0] : "Aditya"}
              </span>
              <span className="text-[10px] text-white/40 block leading-none">{user?.email || "Pro Member"}</span>
            </div>
            <ChevronDown size={14} className={`text-white/40 transition-transform ${showMenu ? "rotate-180" : ""}`} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#16122a] border border-border rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout?.();
                }}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5 rounded-lg transition-colors font-medium"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
