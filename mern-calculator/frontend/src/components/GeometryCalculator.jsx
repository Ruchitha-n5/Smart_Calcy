import { useMemo, useState } from "react";
import { Triangle as TriangleIcon } from "lucide-react";

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
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <TriangleIcon size={16} className="text-amber-400" />
          <h3 className="font-semibold text-sm">Geometry Calculator</h3>
        </div>

        {/* Dropdown */}
        <select
          value={shape}
          onChange={(e) => selectShape(e.target.value)}
          className="w-full bg-bg-soft border border-border rounded-lg px-3 py-1.5 text-xs font-medium mb-4 outline-none focus:border-accent-purple text-white/80"
        >
          {Object.keys(SHAPES).map((s) => (
            <option key={s} className="bg-[#14121f]">
              {s}
            </option>
          ))}
        </select>

        {/* Shape Preview & Fields */}
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 shrink-0 flex items-center justify-center bg-bg-soft/40 border border-border/40 rounded-xl p-2">
            <ShapePreview shape={shape} />
          </div>

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {config.fields.map((f) => (
              <div key={f.key}>
                <p className="text-[11px] text-white/40 mb-1">{f.label}</p>
                <input
                  type="number"
                  value={values[f.key] ?? f.default}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-bg-soft border border-border rounded-md px-2.5 py-1.5 text-xs font-medium outline-none focus:border-accent-purple"
                />
              </div>
            ))}

            {Object.entries(results).map(([label, val]) => (
              <div key={label}>
                <p className="text-[11px] text-white/40 mb-1">{label}</p>
                <div className="bg-bg-soft border border-border rounded-md px-2.5 py-1.5 text-xs font-semibold text-white/90">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formula Footer */}
      <div className="mt-3 text-center text-xs font-serif text-white/40 bg-bg-soft border border-border rounded-lg py-2">
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
        <circle cx="50" cy="50" r="38" className={common} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="2" fill="#8b5cf6" />
        <line x1="50" y1="50" x2="88" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="44" y="54" fill="#a78bfa" fontSize="9" fontWeight="bold">O</text>
        <text x="68" y="44" fill="#a78bfa" fontSize="9" italic="true">r</text>
      </svg>
    );
  if (shape === "Square")
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="15" y="15" width="70" height="70" className={common} strokeWidth="1.5" />
        <text x="46" y="93" fill="#a78bfa" fontSize="9">s</text>
      </svg>
    );
  if (shape === "Rectangle")
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="25" width="80" height="50" className={common} strokeWidth="1.5" />
        <text x="48" y="87" fill="#a78bfa" fontSize="9">l</text>
        <text x="92" y="53" fill="#a78bfa" fontSize="9">w</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,15 85,85 15,85" className={common} strokeWidth="1.5" />
      <line x1="50" y1="15" x2="50" y2="85" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
      <text x="46" y="94" fill="#a78bfa" fontSize="9">b</text>
      <text x="53" y="55" fill="#a78bfa" fontSize="9">h</text>
    </svg>
  );
}
