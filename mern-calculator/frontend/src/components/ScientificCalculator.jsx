import { useState } from "react";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { evaluateExpression } from "../utils/mathParser";

const KEYS = [
  ["sin", "cos", "tan", "log", "ln", "\u221a", "^"],
  ["\u03c0", "e", "(", ")", "%", "AC", "DEL"],
  ["7", "8", "9", "\u00f7"],
  ["4", "5", "6", "\u00d7"],
  ["1", "2", "3", "\u2212"],
  ["0", ".", "+/-", "+"],
];

const KEY_MAP = { "\u221a": "sqrt(", "\u00f7": "/", "\u00d7": "*", "\u2212": "-", "\u03c0": "\u03c0" };
const FUNC_KEYS = ["sin", "cos", "tan", "log", "ln"];

export default function ScientificCalculator({ onCompute }) {
  const [expr, setExpr] = useState("2 + 3 \u00d7 5\u00b2 \u2212 sin(45\u00b0)");
  const [rawExpr, setRawExpr] = useState("2+3*5^2-sin(45)");
  const [degrees, setDegrees] = useState(true);
  const [result, setResult] = useState("16.2929");
  const [error, setError] = useState(false);

  const press = (key) => {
    if (key === "AC") {
      setExpr("");
      setRawExpr("");
      setResult("0");
      setError(false);
      return;
    }
    if (key === "DEL") {
      setExpr((e) => e.slice(0, -1));
      setRawExpr((r) => r.slice(0, -1));
      return;
    }
    if (key === "+/-") {
      setRawExpr((r) => (r.startsWith("-") ? r.slice(1) : "-" + r));
      setExpr((e) => (e.startsWith("-") ? e.slice(1) : "-" + e));
      return;
    }
    if (FUNC_KEYS.includes(key)) {
      setRawExpr((r) => r + key + "(");
      setExpr((e) => e + key + "(");
      return;
    }
    const mapped = KEY_MAP[key] ?? key;
    setRawExpr((r) => r + mapped);
    setExpr((e) => e + key);
  };

  const compute = () => {
    if (!rawExpr.trim()) return;
    try {
      const val = evaluateExpression(rawExpr, { degrees });
      const rounded = Number.isFinite(val) ? +val.toFixed(4) : NaN;
      if (Number.isNaN(rounded)) throw new Error("Invalid expression");
      setResult(String(rounded));
      setError(false);
      onCompute?.({ type: "calculator", expression: expr, result: String(rounded) });
    } catch {
      setResult("Error");
      setError(true);
    }
  };

  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Scientific Calculator</h3>
          <div className="flex items-center gap-2">
            <div className="flex bg-bg-soft border border-border rounded-lg p-0.5 text-[11px] font-medium">
              <button
                onClick={() => setDegrees(true)}
                className={`px-2 py-0.5 rounded ${degrees ? "bg-accent-purple text-white font-semibold" : "text-white/50"}`}
              >
                DEG
              </button>
              <button
                onClick={() => setDegrees(false)}
                className={`px-2 py-0.5 rounded ${!degrees ? "bg-accent-purple text-white font-semibold" : "text-white/50"}`}
              >
                RAD
              </button>
            </div>
            <button className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white" title="History">
              <HistoryIcon size={14} />
            </button>
            <button onClick={() => press("AC")} className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-accent-pink" title="Clear">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div className="bg-bg-soft border border-border rounded-xl px-4 py-3 mb-3 flex flex-col justify-between min-h-[68px]">
          <input
            value={expr}
            onChange={(e) => {
              setExpr(e.target.value);
              setRawExpr(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && compute()}
            className="bg-transparent text-sm lg:text-base font-medium outline-none w-full text-white/90"
            placeholder="0"
          />
          <div className={`text-right text-base lg:text-lg font-semibold ${error ? "text-red-400" : "text-white/70"}`}>
            = {result}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {KEYS.flat().map((k, idx) => (
            <button
              key={k + idx}
              onClick={() => press(k)}
              className={`key py-2 text-xs font-medium ${
                k === "AC" || k === "DEL" ? "text-accent-pink font-semibold" : "text-white/80"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Equal Button */}
      <button
        onClick={compute}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent-purple to-accent-violet font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow"
      >
        =
      </button>
    </div>
  );
}
