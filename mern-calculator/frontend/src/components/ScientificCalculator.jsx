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
  const [expr, setExpr] = useState("2+3\u00d75^2\u2212sin(45)");
  const [degrees, setDegrees] = useState(true);
  const [result, setResult] = useState("76.2929");
  const [error, setError] = useState(false);

  const press = (key) => {
    if (key === "AC") {
      setExpr("");
      setResult("0");
      setError(false);
      return;
    }
    if (key === "DEL") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (key === "+/-") {
      setExpr((e) => (e.startsWith("-") ? e.slice(1) : "-" + e));
      return;
    }
    if (FUNC_KEYS.includes(key)) {
      setExpr((e) => e + key + "(");
      return;
    }
    const mapped = KEY_MAP[key] ?? key;
    setExpr((e) => e + mapped);
  };

  const compute = () => {
    if (!expr.trim()) return;
    try {
      const val = evaluateExpression(expr, { degrees });
      const rounded = Number.isFinite(val) ? +val.toFixed(4) : NaN;
      if (Number.isNaN(rounded)) throw new Error("Invalid expression");
      setResult(String(rounded));
      setError(false);
      onCompute?.({ type: "calculator", expression: expr, result: String(rounded) });
    } catch (e) {
      setResult("Error");
      setError(true);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">Scientific Calculator</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-bg-soft border border-border rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setDegrees(true)}
              className={`px-2.5 py-1 rounded-md ${degrees ? "bg-accent-purple text-white" : "text-white/50"}`}
            >
              DEG
            </button>
            <button
              onClick={() => setDegrees(false)}
              className={`px-2.5 py-1 rounded-md ${!degrees ? "bg-accent-purple text-white" : "text-white/50"}`}
            >
              RAD
            </button>
          </div>
          <button className="p-1.5 rounded-md hover:bg-white/5 text-white/40">
            <HistoryIcon size={15} />
          </button>
          <button onClick={() => press("AC")} className="p-1.5 rounded-md hover:bg-white/5 text-white/40">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="bg-bg-soft border border-border rounded-xl p-4 mb-4 min-h-[76px] flex flex-col justify-end">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && compute()}
          className="bg-transparent text-xl font-medium outline-none w-full"
          placeholder="0"
        />
        <div className={`text-right text-lg mt-1 ${error ? "text-red-400" : "text-white/50"}`}>
          = {result}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {KEYS.flat().map((k, idx) => (
          <button
            key={k + idx}
            onClick={() => press(k)}
            className={`key py-2.5 text-sm font-medium ${
              k === "AC" || k === "DEL" ? "text-accent-pink" : "text-white/80"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <button
        onClick={compute}
        className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-accent-violet font-semibold hover:opacity-90"
      >
        =
      </button>
    </div>
  );
}
