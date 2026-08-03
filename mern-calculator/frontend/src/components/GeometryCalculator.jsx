import { useMemo, useState } from "react";
import { Triangle } from "lucide-react";

const SHAPES = {
  Circle: {
    fields: [{ key: "r", label: "Radius (r)", default: 5 }],
    compute: ({ r }) => ({
      Area: (Math.PI * r * r).toFixed(4),
      Perimeter: (2 * Math.PI * r).toFixed(4),
    }),
    formula: "Area = \u03c0r\u00b2   Perimeter = 2\u03c0r",
  },
  Square: {
    fields: [{ key: "s", label: "Side (s)", default: 4 }],
    compute: ({ s }) => ({
      Area: (s * s).toFixed(4),
      Perimeter: (4 * s).toFixed(4),
    }),
    formula: "Area = s\u00b2   Perimeter = 4s",
  },
  Rectangle: {
    fields: [
      { key: "l", label: "Length (l)", default: 6 },
      { key: "w", label: "Width (w)", default: 4 },
    ],
    compute: ({ l, w }) => ({
      Area: (l * w).toFixed(4),
      Perimeter: (2 * (l + w)).toFixed(4),
    }),
    formula: "Area = l\u00d7w   Perimeter = 2(l+w)",
  },
  Triangle: {
    fields: [
      { key: "b", label: "Base (b)", default: 6 },
      { key: "h", label: "Height (h)", default: 4 },
    ],
    compute: ({ b, h }) => ({
      Area: (0.5 * b * h).toFixed(4),
    }),
    formula: "Area = \u00bd \u00d7 b \u00d7 h",
  },
};

export default function GeometryCalculator({ onCompute }) {
  const [shape, setShape] = useState("Circle");
  const [values, setValues] = useState({ r: 5 });

  const config = SHAPES[shape];

  const results = useMemo(() => {
    try {
      return config.compute(values);
    } catch {
      return {};
    }
  }, [shape, values]);

  const selectShape = (name) => {
    setShape(name);
    const defaults = {};
    SHAPES[name].fields.forEach((f) => (defaults[f.key] = f.default));
    setValues(defaults);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Triangle size={16} className="text-orange-400" />
        <h3 className="font-semibold">Geometry Calculator</h3>
      </div>

      <select
        value={shape}
        onChange={(e) => selectShape(e.target.value)}
        className="w-full bg-bg-soft border border-border rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-accent-purple"
      >
        {Object.keys(SHAPES).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <div className="flex gap-4">
        <div className="w-32 h-32 shrink-0 flex items-center justify-center">
          <ShapePreview shape={shape} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {config.fields.map((f) => (
            <div key={f.key}>
              <p className="text-xs text-white/40 mb-1">{f.label}</p>
              <input
                type="number"
                value={values[f.key] ?? f.default}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: parseFloat(e.target.value) || 0 }))
                }
                className="w-full bg-bg-soft border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent-purple"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 mt-4">
        {Object.entries(results).map(([label, val]) => (
          <div key={label}>
            <p className="text-xs text-white/40 mb-1">{label}</p>
            <div className="bg-bg-soft border border-border rounded-md px-3 py-2 text-sm font-medium">
              {val}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          onCompute?.({
            type: "geometry",
            expression: `${shape}(${config.fields.map((f) => `${f.key}=${values[f.key]}`).join(", ")})`,
            result: Object.entries(results).map(([k, v]) => `${k}=${v}`).join(", "),
          })
        }
        className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-accent-violet text-sm font-medium hover:opacity-90"
      >
        Save to History
      </button>

      <div className="mt-4 text-center text-xs text-white/40 bg-bg-soft border border-border rounded-lg py-2">
        {config.formula}
      </div>
    </div>
  );
}

function ShapePreview({ shape }) {
  const common = "stroke-accent-purple fill-none";
  if (shape === "Circle")
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" className={common} strokeWidth="2" />
        <circle cx="50" cy="50" r="2" fill="#8b5cf6" />
        <line x1="50" y1="50" x2="90" y2="50" stroke="#8b5cf6" strokeWidth="1.5" />
      </svg>
    );
  if (shape === "Square")
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="15" y="15" width="70" height="70" className={common} strokeWidth="2" />
      </svg>
    );
  if (shape === "Rectangle")
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="25" width="80" height="50" className={common} strokeWidth="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,15 85,85 15,85" className={common} strokeWidth="2" />
    </svg>
  );
}
