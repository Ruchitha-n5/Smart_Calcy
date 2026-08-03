import { useState } from "react";
import { Grid3x3 } from "lucide-react";

function parseMatrix(text) {
  return text
    .trim()
    .split("\n")
    .map((row) => row.trim().split(/\s+/).map(Number));
}

function matToText(m) {
  return m.map((row) => row.map((v) => (Number.isInteger(v) ? v : +v.toFixed(2))).join("  ")).join("\n");
}

function add(a, b) {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}
function subtract(a, b) {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}
function multiply(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    const row = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) sum += a[i][k] * b[k][j];
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}
function determinant(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let det = 0;
  for (let c = 0; c < n; c++) {
    const minor = m.slice(1).map((row) => row.filter((_, j) => j !== c));
    det += (c % 2 === 0 ? 1 : -1) * m[0][c] * determinant(minor);
  }
  return det;
}
function inverse(m) {
  const n = m.length;
  const det = determinant(m);
  if (det === 0) throw new Error("Matrix is singular (no inverse)");
  if (n === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }
  const cof = m.map((row, i) =>
    row.map((_, j) => {
      const minor = m.filter((_, r) => r !== i).map((row2) => row2.filter((_, c) => c !== j));
      return ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor);
    })
  );
  const adj = cof[0].map((_, j) => cof.map((row) => row[j]));
  return adj.map((row) => row.map((v) => v / det));
}

function MatrixField({ label, value, onChange, result = false }) {
  return (
    <div className="min-w-0 flex flex-col items-center">
      <p className="matrix-label mb-2 text-center text-[11px]">{label}</p>
      <div className={`matrix-field w-full ${result ? "matrix-result" : ""}`}>
        <span className="matrix-bracket matrix-bracket-left" aria-hidden="true" />
        {result ? (
          <pre className="matrix-value text-center font-mono text-xs">{value}</pre>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            spellCheck="false"
            aria-label={label}
            className="matrix-input text-center font-mono text-xs"
          />
        )}
        <span className="matrix-bracket matrix-bracket-right" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function MatrixCalculator({ onCompute }) {
  const [matA, setMatA] = useState("1  2\n3  4");
  const [matB, setMatB] = useState("5  6\n7  8");
  const [result, setResult] = useState("19  22\n43  50");
  const [op, setOp] = useState("Multiply");
  const [error, setError] = useState("");

  const run = (operation) => {
    setOp(operation);
    setError("");
    try {
      const a = parseMatrix(matA);
      const b = parseMatrix(matB);
      let out;
      switch (operation) {
        case "Add":
          out = matToText(add(a, b));
          break;
        case "Subtract":
          out = matToText(subtract(a, b));
          break;
        case "Multiply":
          out = matToText(multiply(a, b));
          break;
        case "Inverse":
          out = matToText(inverse(a));
          break;
        case "Determinant":
          out = String(determinant(a));
          break;
        default:
          out = "";
      }
      setResult(out);
      onCompute?.({
        type: "matrix",
        expression: `${operation}([${matA.replace(/\n/g, ";")}], [${matB.replace(/\n/g, ";")}])`,
        result: out.replace(/\n/g, "; "),
      });
    } catch (e) {
      setError(e.message);
      setResult("Error");
    }
  };

  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 size={16} className="text-accent-purple" />
          <h3 className="font-semibold text-sm">Matrix Calculator</h3>
        </div>

        {/* Matrices Row */}
        <div className="grid grid-cols-3 gap-3 text-xs items-center justify-center min-h-[90px]">
          <MatrixField label="Matrix A" value={matA} onChange={setMatA} />
          <MatrixField label="Matrix B" value={matB} onChange={setMatB} />
          <MatrixField label={op === "Multiply" ? "A \u00d7 B =" : `Result (${op})`} value={result} result />
        </div>

        {error && <p className="text-[11px] text-red-400 mt-2 text-center">{error}</p>}
      </div>

      {/* Operation Buttons */}
      <div className="grid grid-cols-5 gap-1.5 mt-4 text-[11px] font-medium">
        {["Add", "Subtract", "Multiply", "Inverse", "Determinant"].map((label) => (
          <button
            key={label}
            onClick={() => run(label)}
            className={`py-1.5 px-1 rounded-md border text-center transition-all ${
              op === label
                ? "bg-accent-purple border-accent-purple text-white font-semibold"
                : "bg-bg-soft border-border text-white/70 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
