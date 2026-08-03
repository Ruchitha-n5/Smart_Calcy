# Visual Scientific Calculator — MERN Stack

A recreation of the "Visual Scientific Calculator" dashboard UI (dark purple theme,
scientific calculator, function plotter, geometry calculator, matrix calculator,
statistics, and history) built as a full MERN application.

- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts + lucide-react icons
- **Backend:** Node + Express + MongoDB (Mongoose)

## Project structure

```
mern-calculator/
├── backend/          Express API + MongoDB models
│   ├── config/db.js
│   ├── controllers/historyController.js
│   ├── models/History.js
│   ├── routes/historyRoutes.js
│   ├── server.js
│   └── .env.example
└── frontend/          React app (Vite)
    ├── src/
    │   ├── components/   Sidebar, Header, Hero, ScientificCalculator,
    │   │                 FunctionPlotter, GeometryCalculator, MatrixCalculator,
    │   │                 Statistics, HistoryPanel
    │   ├── utils/mathParser.js   safe expression evaluator (no eval())
    │   ├── api/historyApi.js     axios calls to the backend
    │   └── App.jsx
    └── .env.example
```

## What actually works

- **Scientific calculator** — real expression parsing (shunting-yard, no `eval`),
  DEG/RAD toggle, sin/cos/tan/log/ln/sqrt/^/%, keypad + typing.
- **Function plotter** — plots `sin(x)`, `cos(x)`, `x^2`, `sqrt(x)`, `ln(x)` with
  adjustable X/Y bounds, rendered with Recharts.
- **Geometry calculator** — circle, square, rectangle, triangle with live area/perimeter.
- **Matrix calculator** — add, subtract, multiply, inverse, determinant for
  arbitrary N×N / N×M matrices you type in.
- **Statistics** — mean, median, mode, std. dev., and a frequency bar chart from a
  comma-separated dataset.
- **History** — every "Save to History" call POSTs to the Express API, which
  stores it in MongoDB; favoriting/deleting/clearing all hit real endpoints.
  If the backend isn't running, the UI degrades gracefully and keeps history
  in memory for that tab only (with a banner telling you so).

## Setup

### Run everything with one command

After installing the frontend and backend dependencies once, start both services
from the project root:

```bash
cd mern-calculator
npm run dev
```

This starts the backend on `http://localhost:5000` and the frontend on
`http://localhost:5173`. Press `Ctrl+C` to stop both.

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit MONGO_URI if not using local MongoDB
npm install
npm run dev                # starts on http://localhost:5000
```

You need a MongoDB instance running — either local (`mongod`) or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster (paste its connection
string into `MONGO_URI` in `.env`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # only needed if your API isn't on localhost:5000
npm install
npm run dev                # starts on http://localhost:5173
```

Open `http://localhost:5173` — the app talks to the API automatically.

## Extending it

- Add more plotter presets in `frontend/src/components/FunctionPlotter.jsx` →
  the `PRESETS` array, or let users type an arbitrary expression (the parser
  in `utils/mathParser.js` already supports a free variable `x`).
- Add user accounts by extending `backend/models` with a `User` schema and
  gating `History` documents behind a `userId`, then adding JWT auth
  middleware to `historyRoutes.js`.
- Deploy: host the backend (Render/Railway/Fly.io) + MongoDB Atlas, host the
  frontend (Vercel/Netlify), and point `VITE_API_URL` at the deployed API.
