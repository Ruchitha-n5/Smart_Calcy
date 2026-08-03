import { Clock, Star, Trash2 } from "lucide-react";

const DEMO_HISTORY = [
  { _id: "demo-1", expression: "2 + 3 \u00d7 5\u00b2 \u2212 sin(45\u00b0)", result: "16.2929", favorite: true },
  { _id: "demo-2", expression: "log\u2081\u2080(100) + \u221a16", result: "4", favorite: true },
  { _id: "demo-3", expression: "sin(30\u00b0) + cos(60\u00b0)", result: "1", favorite: true },
  { _id: "demo-4", expression: "\u222b x\u00b2 dx", result: "x\u00b3/3 + C", favorite: true },
  { _id: "demo-5", expression: "Determinant([1,2],[3,4])", result: "-2", favorite: true },
];

export default function HistoryPanel({ items, onToggleFavorite, onDelete, onClear, loading }) {
  const displayItems = items && items.length > 0 ? items : DEMO_HISTORY;

  return (
    <div className="card h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Clock size={16} className="text-green-400" />
            <span>History</span>
          </div>
        </div>

        {/* History Item List */}
        <div className="flex flex-col gap-2.5 max-h-[210px] overflow-y-auto pr-1">
          {loading && <p className="text-xs text-white/30">Loading history...</p>}
          {displayItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-bg-soft/70 border border-border/80 rounded-lg px-3 py-2 text-xs transition-colors hover:border-border"
            >
              <div className="min-w-0 pr-2">
                <p className="font-mono text-white/80 truncate text-[11px]">{item.expression}</p>
                <p className="text-white/40 text-[10px] font-mono mt-0.5">= {item.result}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                <button
                  onClick={() => onToggleFavorite?.(item._id)}
                  className="p-0.5 hover:scale-110 transition-transform"
                  title="Favorite"
                >
                  <Star
                    size={13}
                    className={item.favorite ? "fill-yellow-400 text-yellow-400" : "text-white/30"}
                  />
                </button>
                <button
                  onClick={() => onDelete?.(item._id)}
                  className="p-0.5 hover:scale-110 transition-transform"
                  title="Delete"
                >
                  <Trash2 size={13} className="text-white/30 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear History Link at Bottom Right */}
      <div className="flex justify-end mt-3">
        <button
          onClick={onClear}
          className="text-xs text-red-400/90 hover:text-red-400 flex items-center gap-1 font-medium transition-colors"
        >
          <span>Clear History</span>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
