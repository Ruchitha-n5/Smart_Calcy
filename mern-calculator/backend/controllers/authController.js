import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "visual_calculator_secret_key_2026";

// Fallback in-memory user storage if MongoDB is offline
const inMemoryUsers = [];

function generateToken(id, email) {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" });
}

function sanitizeUser(user) {
  return {
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
  };
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
      });

      const token = generateToken(user._id, user.email);
      return res.status(201).json({ token, user: sanitizeUser(user) });
    } else {
      // In-memory fallback
      const existing = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: "mem_" + Date.now() + Math.random().toString(36).substr(2, 5),
        name,
        email: cleanEmail,
        password: hashedPassword,
        createdAt: new Date(),
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(newUser._id, newUser.email);
      return res.status(201).json({ token, user: sanitizeUser(newUser) });
    }
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      if (!user.password) {
        return res.status(400).json({ message: "Account registered via Google. Please use Google Sign In." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id, user.email);
      return res.json({ token, user: sanitizeUser(user) });
    } else {
      // In-memory fallback
      const user = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id, user.email);
      return res.json({ token, user: sanitizeUser(user) });
    }
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Google authentication payload incomplete" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          name,
          email: cleanEmail,
          googleId: googleId || "google_" + Date.now(),
          avatar: avatar || "",
        });
      }

      const token = generateToken(user._id, user.email);
      return res.json({ token, user: sanitizeUser(user) });
    } else {
      let user = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        user = {
          _id: "goog_" + Date.now() + Math.random().toString(36).substr(2, 5),
          name,
          email: cleanEmail,
          googleId: googleId || "google_" + Date.now(),
          avatar: avatar || "",
          createdAt: new Date(),
        };
        inMemoryUsers.push(user);
      }

      const token = generateToken(user._id, user.email);
      return res.json({ token, user: sanitizeUser(user) });
    }
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ message: "Server error during Google authentication" });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user: sanitizeUser(user) });
    } else {
      const user = inMemoryUsers.find((u) => u._id === decoded.id || u.email === decoded.email);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user: sanitizeUser(user) });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
};
