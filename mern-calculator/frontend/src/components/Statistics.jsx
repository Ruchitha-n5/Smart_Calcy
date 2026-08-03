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
    for (let i = 1; i <= 10; i++) counts[i] = 0;
    nums.forEach((n) => {
      if (counts[n] !== undefined) counts[n] += 1;
      else counts[n] = 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ x: k, count: v }))
      .sort((a, b) => Number(a.x) - Number(b.x));
  }, [nums]);

  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-accent-blue" />
          <h3 className="font-semibold text-sm">Statistics</h3>
        </div>

        {/* Dataset Input */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-white/40 font-medium shrink-0">Dataset</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-bg-soft border border-border rounded-md px-2.5 py-1 text-xs font-mono outline-none focus:border-accent-purple"
          />
        </div>

        {/* 4 Metrics Row */}
        {stats && (
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <Stat label="Mean" value={stats.mean.toFixed(2).replace(/\.00$/, "")} />
            <Stat label="Median" value={stats.median} />
            <Stat label="Mode" value={stats.mode} />
            <Stat label="Std. Dev" value={stats.stdDev.toFixed(3)} />
          </div>
        )}

        {/* Frequency Bar Chart */}
        <div className="bg-bg-soft border border-border rounded-xl h-32 p-1.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#262038" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="x" stroke="#5c5478" fontSize={10} />
              <YAxis stroke="#5c5478" fontSize={10} allowDecimals={false} domain={[0, 4]} />
              <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-soft border border-border rounded-md py-1.5 px-1">
      <p className="text-white/40 text-[10px] mb-0.5">{label}</p>
      <p className="font-semibold text-xs text-white/90">{value}</p>
    </div>
  );
}
