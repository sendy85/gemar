import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F231B",
          light: "#173328",
          dark: "#0A1913",
        },
        brand: {
          green: "#1F7A4D",
          "green-dark": "#155C39",
          "green-light": "#E7F4EC",
          red: "#D6483C",
          yellow: "#F0B429",
          blue: "#2D6CDF",
        },
        ink: "#14231C",
        paper: "#FFFFFF",
        muted: "#5B6B63",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        soft: "0 4px 20px -6px rgba(15, 35, 27, 0.12)",
        softer: "0 2px 10px -4px rgba(15, 35, 27, 0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
