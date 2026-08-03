import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import { HeroBanner, QuickActions } from "./components/Hero";
import BasicCalculator from "./components/BasicCalculator";
import ScientificCalculator from "./components/ScientificCalculator";
import FunctionPlotter from "./components/FunctionPlotter";
import GeometryCalculator from "./components/GeometryCalculator";
import MatrixCalculator from "./components/MatrixCalculator";
import Statistics from "./components/Statistics";
import HistoryPanel from "./components/HistoryPanel";
import {
  fetchHistory,
  saveHistory,
  toggleFavorite,
  deleteHistoryItem,
  clearAllHistory,
} from "./api/historyApi";
import { fetchMe } from "./api/authApi";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [active, setActive] = useState("Home");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState("scientific");
  const sectionRefs = useRef({});

  const navigationTargets = {
    Home: "Home",
    Calculator: "Calculator",
    "Basic Calculator": "Calculator",
    "Scientific Calculator": "Calculator",
    "Graph Plotter": "Graph Plotter",
    Geometry: "Geometry",
    "Geometry Calculator": "Geometry",
    Matrix: "Matrix",
    "Matrix Calculator": "Matrix",
    Statistics: "Statistics",
    History: "History",
    Saved: "History",
    Formulas: "Calculator",
    "Formula Library": "Calculator",
    Settings: "Home",
    Help: "Home",
  };

  const handleNavigation = useCallback((label) => {
    const target = navigationTargets[label];
    if (label === "Basic Calculator") setCalculatorMode("basic");
    if (label === "Scientific Calculator") setCalculatorMode("scientific");
    setActive(target ?? label);
    sectionRefs.current[target]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHistory();
      setHistory(data);
      setApiError(false);
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMe(token).then((u) => {
        if (u) {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleCompute = async (entry) => {
    try {
      const saved = await saveHistory(entry);
      setHistory((h) => [saved, ...h]);
    } catch {
      setHistory((h) => [{ _id: crypto.randomUUID(), ...entry, favorite: false }, ...h]);
    }
  };

  const handleToggleFavorite = async (id) => {
    setHistory((h) => h.map((i) => (i._id === id ? { ...i, favorite: !i.favorite } : i)));
    try {
      await toggleFavorite(id);
    } catch {}
  };

  const handleDelete = async (id) => {
    setHistory((h) => h.filter((i) => i._id !== id));
    try {
      await deleteHistoryItem(id);
    } catch {}
  };

  const handleClear = async () => {
    setHistory([]);
    try {
      await clearAllHistory();
    } catch {}
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} dark={dark} setDark={setDark} />;
  }

  return (
    <div className={`min-h-screen flex ${dark ? "dark-theme" : "light-theme"}`}>
      <Sidebar active={active} onSelect={handleNavigation} />

      <div className="flex-1 min-w-0">
        <Header dark={dark} setDark={setDark} user={user} onLogout={handleLogout} />

        <main className="p-6 flex flex-col gap-6">
          {apiError && (
            <div className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2">
              Backend not reachable — history is being kept in this browser tab only. Start the
              Express/MongoDB server to persist it.
            </div>
          )}

          <div ref={(element) => (sectionRefs.current.Home = element)} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-stretch scroll-mt-20">
            <HeroBanner />
            <QuickActions onSelect={handleNavigation} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div ref={(element) => (sectionRefs.current.Calculator = element)} className="h-full scroll-mt-20">
              {calculatorMode === "basic" ? (
                <BasicCalculator onCompute={handleCompute} />
              ) : (
                <ScientificCalculator onCompute={handleCompute} />
              )}
            </div>
            <div ref={(element) => (sectionRefs.current["Graph Plotter"] = element)} className="h-full scroll-mt-20">
              <FunctionPlotter />
            </div>
            <div ref={(element) => (sectionRefs.current.Geometry = element)} className="h-full scroll-mt-20">
              <GeometryCalculator onCompute={handleCompute} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div ref={(element) => (sectionRefs.current.Matrix = element)} className="h-full scroll-mt-20">
              <MatrixCalculator onCompute={handleCompute} />
            </div>
            <div ref={(element) => (sectionRefs.current.Statistics = element)} className="h-full scroll-mt-20">
              <Statistics onCompute={handleCompute} />
            </div>
            <div ref={(element) => (sectionRefs.current.History = element)} className="h-full scroll-mt-20">
              <HistoryPanel
                items={history}
                loading={loading}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                onClear={handleClear}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
