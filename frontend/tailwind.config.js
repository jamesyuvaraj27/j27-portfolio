/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#05050a",
        surface: "#0d0d16",
        "surface-hover": "#14141f",
        border: "#22222f",
        "text-primary": "#f5f5fa",
        "text-secondary": "#a1a1b5",
        primary: {
          DEFAULT: "#6d28d9",
          light: "#8b5cf6",
          dark: "#4c1d95",
        },
        accent: {
          DEFAULT: "#f472b6",
          light: "#f9a8d4",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(109, 40, 217, 0.35)",
      },
    },
  },
  plugins: [],
};
