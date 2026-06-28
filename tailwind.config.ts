import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080A0F",
        foreground: "#F6F8FB",
        card: "#10131A",
        border: "#202534",
        muted: "#94A3B8",
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#EEF2FF",
        },
        accent: {
          DEFAULT: "#10B981",
          foreground: "#052E26",
        },
        danger: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
