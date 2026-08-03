import { useMemo, useState } from "react";
import { Maximize2, LineChart as ChartIcon } from "lucide-react";
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
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      let y;
      try {
        y = evaluateAtX(fn.expr, x, { degrees: false });
        if (!Number.isFinite(y)) y = null;
      } catch {
        y = null;
      }
      points.push({ x: +x.toFixed(2), y: y === null ? null : +y.toFixed(2) });
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
    return v.toFixed(1);
  };

  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <ChartIcon size={16} className="text-green-400" />
            <span>Function Plotter</span>
          </div>
          <button className="p-1 text-white/40 hover:text-white rounded" title="Maximize">
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Dropdown Preset */}
        <select
          value={fn.label}
          onChange={(e) => setFn(PRESETS.find((p) => p.label === e.target.value))}
          className="w-full bg-bg-soft border border-border rounded-lg px-3 py-1.5 text-xs font-medium mb-3 outline-none focus:border-accent-purple text-white/80"
        >
          {PRESETS.map((p) => (
            <option key={p.label} value={p.label} className="bg-[#14121f]">
              {p.label}
            </option>
          ))}
        </select>

        {/* Chart Area */}
        <div className="bg-bg-soft border border-border rounded-xl p-2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#262038" strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[xMin, xMax]}
                tickFormatter={fmtPi}
                stroke="#5c5478"
                fontSize={10}
              />
              <YAxis domain={[yMin, yMax]} stroke="#5c5478" fontSize={10} />
              <ReferenceLine x={0} stroke="#3b3354" />
              <ReferenceLine y={0} stroke="#3b3354" />
              <Tooltip
                contentStyle={{ background: "#151226", border: "1px solid #362e54", borderRadius: 6, fontSize: "11px" }}
                labelFormatter={(v) => `x = ${v}`}
              />
              <Line type="monotone" dataKey="y" stroke="#22c55e" dot={false} strokeWidth={2} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Min/Max Controls */}
      <div className="grid grid-cols-4 gap-2 text-[11px] mt-3">
        {[
          ["X Min", xMin, setXMin, "-2\u03c0"],
          ["X Max", xMax, setXMax, "2\u03c0"],
          ["Y Min", yMin, setYMin, "-1.5"],
          ["Y Max", yMax, setYMax, "1.5"],
        ].map(([label, val, setter]) => (
          <div key={label}>
            <p className="text-white/40 mb-1">{label}</p>
            <input
              type="number"
              value={+val.toFixed(2)}
              onChange={(e) => setter(parseFloat(e.target.value) || 0)}
              className="w-full bg-bg-soft border border-border rounded-md px-2 py-1 outline-none focus:border-accent-purple text-xs text-center font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
