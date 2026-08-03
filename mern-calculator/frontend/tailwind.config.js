/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0a14",
          card: "#14121f",
          soft: "#1a1828",
        },
        accent: {
          purple: "#8b5cf6",
          violet: "#a855f7",
          pink: "#ec4899",
          blue: "#3b82f6",
          green: "#22c55e",
        },
        border: {
          DEFAULT: "#262238",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 92, 246, 0.25)",
      },
    },
  },
  plugins: [],
};
