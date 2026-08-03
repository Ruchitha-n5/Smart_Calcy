import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE });

export const fetchHistory = async () => {
  const { data } = await api.get("/history");
  return data;
};

export const saveHistory = async (entry) => {
  const { data } = await api.post("/history", entry);
  return data;
};

export const toggleFavorite = async (id) => {
  const { data } = await api.patch(`/history/${id}/favorite`);
  return data;
};

export const deleteHistoryItem = async (id) => {
  const { data } = await api.delete(`/history/${id}`);
  return data;
};

export const clearAllHistory = async () => {
  const { data } = await api.delete("/history");
  return data;
};

export default api;
