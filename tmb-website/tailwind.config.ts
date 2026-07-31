import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#0B3D2E",
          50: "#EAF3EF",
          100: "#CFE4DA",
          400: "#1F6B52",
          600: "#0F4C39",
          700: "#0B3D2E",
          900: "#062720",
        },
        gold: {
          DEFAULT: "#B8860B",
          50: "#FBF4E3",
          200: "#E7C36B",
          600: "#B8860B",
          700: "#8F6708",
        },
        slate: {
          ink: "#16211D",
          body: "#3A453F",
          muted: "#6B776F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F7F5",
          line: "#E4E7E2",
        },
        success: "#1F8A4C",
        warning: "#B7791F",
        error: "#B3261E",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,33,29,0.04), 0 8px 24px -12px rgba(22,33,29,0.12)",
        lift: "0 12px 32px -12px rgba(11,61,46,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "grow-line": "grow-line 2.2s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
