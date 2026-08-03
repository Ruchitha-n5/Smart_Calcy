import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function loginUser(credentials) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    return res.data;
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    // Local fallback if server unreachable
    const mockUser = {
      _id: "local_" + Date.now(),
      name: credentials.email.split("@")[0] || "Aditya",
      email: credentials.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(credentials.email)}`,
    };
    return { token: "mock_jwt_token_" + Date.now(), user: mockUser };
  }
}

export async function registerUser(userData) {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    const mockUser = {
      _id: "local_" + Date.now(),
      name: userData.name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
    };
    return { token: "mock_jwt_token_" + Date.now(), user: mockUser };
  }
}

export async function googleAuthUser(googleData) {
  try {
    const res = await axios.post(`${API_URL}/auth/google`, googleData);
    return res.data;
  } catch (err) {
    const mockUser = {
      _id: "goog_" + Date.now(),
      name: googleData.name || "Google User",
      email: googleData.email || "user@gmail.com",
      avatar: googleData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=GoogleUser`,
    };
    return { token: "mock_google_jwt_" + Date.now(), user: mockUser };
  }
}

export async function fetchMe(token) {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch {
    return null;
  }
}
