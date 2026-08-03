import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

function computeStats(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const freq = {};
  nums.forEach((n) => (freq[n] = (freq[n] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter((k) => freq[k] === maxFreq);
  const mode = modes.length === Object.keys(freq).length ? "None" : modes.join(", ");

  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, mode, stdDev };
}

export default function Statistics({ onCompute }) {
  const [input, setInput] = useState("2, 4, 4, 4, 5, 5, 7, 9");

  const nums = useMemo(
    () =>
      input
        .split(",")
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !Number.isNaN(v)),
    [input]
  );

  const stats = useMemo(() => computeStats(nums), [nums]);

  const chartData = useMemo(() => {
    const counts = {};
    nums.forEach((n) => (counts[n] = (counts[n] || 0) + 1));
    return Object.entries(counts)
      .map(([k, v]) => ({ x: k, count: v }))
      .sort((a, b) => Number(a.x) - Number(b.x));
  }, [nums]);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className="text-accent-blue" />
        <h3 className="font-semibold">Statistics</h3>
      </div>

      <p className="text-xs text-white/40 mb-1">Dataset</p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-bg-soft border border-border rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-accent-purple font-mono"
      />

      {stats && (
        <div className="grid grid-cols-4 gap-3 text-center mb-4 text-sm">
          <Stat label="Mean" value={stats.mean.toFixed(2).replace(/\.00$/, "")} />
          <Stat label="Median" value={stats.median} />
          <Stat label="Mode" value={stats.mode} />
          <Stat label="Std. Dev." value={stats.stdDev.toFixed(3)} />
        </div>
      )}

      <div className="bg-bg-soft border border-border rounded-xl h-40 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#2a2540" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" stroke="#6b6480" fontSize={11} />
            <YAxis stroke="#6b6480" fontSize={11} allowDecimals={false} />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={() =>
          stats &&
          onCompute?.({
            type: "statistics",
            expression: `stats([${nums.join(", ")}])`,
            result: `mean=${stats.mean.toFixed(2)}, median=${stats.median}, mode=${stats.mode}, sd=${stats.stdDev.toFixed(3)}`,
          })
        }
        className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-medium hover:opacity-90"
      >
        Save to History
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-soft border border-border rounded-lg py-2">
      <p className="text-white/40 text-[11px]">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
