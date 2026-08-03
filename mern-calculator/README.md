# Visual Scientific Calculator — MERN Stack

A modern, full-stack **MERN (MongoDB, Express, React, Node.js)** application for scientific calculations, function plotting, matrix algebra, geometry calculations, statistics analysis, and session history management.

- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts + Lucide Icons + Axios
- **Backend:** Node + Express + MongoDB (Mongoose) + JWT + BcryptJS

---

## ⚡ Quick Start (Single Command)

From the project root (`Smart_Calcy`), run:

```bash
npm run dev
```

This starts the backend on `http://localhost:5000` and the frontend on `http://localhost:5173`.

---

## 🌟 Key Features

- **Authentication System**: Manual email/password login & registration with JWT tokens, Google OAuth 2.0 Sign In, GitHub auth placeholder, password recovery modal, and dynamic user profile header.
- **Static Navbar & Sidebar**: Header and sidebar remain pinned with glassmorphism backdrop blur (`backdrop-blur-md`) when scrolling.
- **Scientific Calculator**: Safe expression evaluator (shunting-yard algorithm), DEG/RAD toggle, sin/cos/tan/log/ln/sqrt/^/%.
- **Function Plotter**: Interactive function curve plotter with adjustable X/Y Min/Max parameters and hover tooltips.
- **Geometry Calculator**: Live area and perimeter computations for Circle, Square, Rectangle, and Triangle with SVG diagrams.
- **Matrix Calculator**: Addition, subtraction, multiplication, inverse, and determinant for matrices with formatted bracket displays.
- **Statistics Engine**: Mean, median, mode, standard deviation, and frequency bar chart.
- **History & Favorites**: Calculation history saved to MongoDB; star favorites, delete items, clear history. Includes graceful in-memory fallback.
