/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        surface: {
          dark: "#0a0c10",
          card: "rgba(18, 22, 34, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        brand: {
          cyan: "#38bdf8",
          indigo: "#6366f1",
          emerald: "#10b981",
          violet: "#a855f7",
        }
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
      }
    },
  },
  plugins: [],
}
