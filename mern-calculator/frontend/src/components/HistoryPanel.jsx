import { Clock, Star, Trash2 } from "lucide-react";

export default function HistoryPanel({ items, onToggleFavorite, onDelete, onClear, loading }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-semibold">
          <Clock size={16} className="text-accent-green" />
          History
        </div>
        <button
          onClick={onClear}
          className="text-xs text-accent-pink flex items-center gap-1 hover:underline"
        >
          Clear History <Trash2 size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {loading && <p className="text-xs text-white/30">Loading history...</p>}
        {!loading && items.length === 0 && (
          <p className="text-xs text-white/30">
            No calculations yet. Results you compute will show up here.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-bg-soft border border-border rounded-lg px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate">{item.expression}</p>
              <p className="text-white/40 text-xs">= {item.result}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button onClick={() => onToggleFavorite(item._id)}>
                <Star
                  size={15}
                  className={item.favorite ? "fill-yellow-400 text-yellow-400" : "text-white/30"}
                />
              </button>
              <button onClick={() => onDelete(item._id)}>
                <Trash2 size={14} className="text-white/30 hover:text-accent-pink" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
