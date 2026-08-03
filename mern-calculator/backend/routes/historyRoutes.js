import express from "express";
import {
  getHistory,
  addHistory,
  toggleFavorite,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getHistory);
router.post("/", addHistory);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteHistoryItem);
router.delete("/", clearHistory);

export default router;
