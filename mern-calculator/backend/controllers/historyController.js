import History from "../models/History.js";

const memoryHistory = [];
const usingMongoDB = () => History.db.readyState === 1;

// GET /api/history
export const getHistory = async (req, res) => {
  try {
    if (!usingMongoDB()) {
      return res.json([...memoryHistory].sort((a, b) => b.createdAt - a.createdAt).slice(0, 100));
    }
    const items = await History.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/history
export const addHistory = async (req, res) => {
  try {
    const { type, expression, result } = req.body;
    if (!expression || result === undefined) {
      return res.status(400).json({ message: "expression and result are required" });
    }
    const entry = usingMongoDB()
      ? await History.create({ type, expression, result })
      : {
          _id: crypto.randomUUID(),
          type,
          expression,
          result,
          favorite: false,
          createdAt: new Date(),
        };
    if (!usingMongoDB()) memoryHistory.unshift(entry);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/history/:id/favorite
export const toggleFavorite = async (req, res) => {
  try {
    if (!usingMongoDB()) {
      const entry = memoryHistory.find((item) => item._id === req.params.id);
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      entry.favorite = !entry.favorite;
      return res.json(entry);
    }
    const entry = await History.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    entry.favorite = !entry.favorite;
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/history/:id
export const deleteHistoryItem = async (req, res) => {
  try {
    if (!usingMongoDB()) {
      const index = memoryHistory.findIndex((item) => item._id === req.params.id);
      if (index !== -1) memoryHistory.splice(index, 1);
      return res.json({ message: "Deleted" });
    }
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/history
export const clearHistory = async (req, res) => {
  try {
    if (!usingMongoDB()) {
      memoryHistory.splice(0, memoryHistory.length);
      return res.json({ message: "History cleared" });
    }
    await History.deleteMany({});
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
