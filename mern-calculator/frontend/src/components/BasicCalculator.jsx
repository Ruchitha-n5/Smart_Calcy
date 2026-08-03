import { useState } from "react";
import { Trash2 } from "lucide-react";
import { evaluateExpression } from "../utils/mathParser";

const KEYS = [
  "AC", "DEL", "%", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "−",
  "1", "2", "3", "+",
  "0", ".", "+/-", "=",
];

const KEY_MAP = { "÷": "/", "×": "*", "−": "-" };

export default function BasicCalculator({ onCompute }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState(false);

  const calculate = () => {
    if (!expression.trim()) return;

    try {
      const value = evaluateExpression(expression);
      if (!Number.isFinite(value)) throw new Error("Invalid expression");
      const rounded = String(+value.toFixed(8));
      setResult(rounded);
      setError(false);
      onCompute?.({ type: "basic-calculator", expression, result: rounded });
    } catch {
      setResult("Error");
      setError(true);
    }
  };

  const press = (key) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      setError(false);
      return;
    }
    if (key === "DEL") {
      setExpression((value) => value.slice(0, -1));
      return;
    }
    if (key === "+/-") {
      setExpression((value) => (value.startsWith("-") ? value.slice(1) : `-${value}`));
      return;
    }
    if (key === "=") {
      calculate();
      return;
    }

    setExpression((value) => value + (KEY_MAP[key] ?? key));
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Basic Calculator</h3>
        <button
          onClick={() => press("AC")}
          className="p-1.5 rounded-md hover:bg-white/5 text-white/40"
          aria-label="Clear calculator"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="bg-bg-soft border border-border rounded-xl p-4 mb-4 min-h-[76px] flex flex-col justify-end">
        <input
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calculate()}
          className="bg-transparent text-xl font-medium outline-none w-full"
          placeholder="0"
          aria-label="Basic calculator expression"
        />
        <div className={`text-right text-lg mt-1 ${error ? "text-red-400" : "text-white/50"}`}>
          = {result}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => press(key)}
            className={`key py-3 text-sm font-medium ${
              key === "="
                ? "bg-accent-purple text-white"
                : key === "AC" || key === "DEL"
                  ? "text-accent-pink"
                  : "text-white/80"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
