import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { evaluateAtX } from "../utils/mathParser";

const PRESETS = [
  { label: "y = sin(x)", expr: "sin(x)" },
  { label: "y = cos(x)", expr: "cos(x)" },
  { label: "y = x^2", expr: "x^2" },
  { label: "y = sqrt(x)", expr: "sqrt(x)" },
  { label: "y = ln(x)", expr: "ln(x)" },
];

const PI = Math.PI;

export default function FunctionPlotter() {
  const [fn, setFn] = useState(PRESETS[0]);
  const [xMin, setXMin] = useState(-2 * PI);
  const [xMax, setXMax] = useState(2 * PI);
  const [yMin, setYMin] = useState(-1.5);
  const [yMax, setYMax] = useState(1.5);

  const data = useMemo(() => {
    const points = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      let y;
      try {
        y = evaluateAtX(fn.expr, x, { degrees: false });
        if (!Number.isFinite(y)) y = null;
      } catch {
        y = null;
      }
      points.push({ x: +x.toFixed(3), y: y === null ? null : +y.toFixed(4) });
    }
    return points;
  }, [fn, xMin, xMax]);

  const fmtPi = (v) => {
    const k = v / PI;
    if (Math.abs(k) < 0.01) return "0";
    if (Math.abs(k - Math.round(k)) < 0.01) {
      const r = Math.round(k);
      if (r === 1) return "\u03c0";
      if (r === -1) return "-\u03c0";
      return `${r}\u03c0`;
    }
    return v.toFixed(2);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Function Plotter</h3>
        <Maximize2 size={15} className="text-white/40" />
      </div>

      <select
        value={fn.label}
        onChange={(e) => setFn(PRESETS.find((p) => p.label === e.target.value))}
        className="w-full bg-bg-soft border border-border rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-accent-purple"
      >
        {PRESETS.map((p) => (
          <option key={p.label} value={p.label}>
            {p.label}
          </option>
        ))}
      </select>

      <div className="bg-bg-soft border border-border rounded-xl p-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#2a2540" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[xMin, xMax]}
              tickFormatter={fmtPi}
              stroke="#6b6480"
              fontSize={11}
            />
            <YAxis domain={[yMin, yMax]} stroke="#6b6480" fontSize={11} />
            <ReferenceLine x={0} stroke="#3a3454" />
            <ReferenceLine y={0} stroke="#3a3454" />
            <Tooltip
              contentStyle={{ background: "#1a1828", border: "1px solid #2a2540", borderRadius: 8 }}
              labelFormatter={(v) => `x = ${v}`}
            />
            <Line type="monotone" dataKey="y" stroke="#22c55e" dot={false} strokeWidth={2} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
        {[
          ["X Min", xMin, setXMin],
          ["X Max", xMax, setXMax],
          ["Y Min", yMin, setYMin],
          ["Y Max", yMax, setYMax],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <p className="text-white/40 mb-1">{label}</p>
            <input
              type="number"
              value={+val.toFixed(2)}
              onChange={(e) => setter(parseFloat(e.target.value))}
              className="w-full bg-bg-soft border border-border rounded-md px-2 py-1.5 outline-none focus:border-accent-purple"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
