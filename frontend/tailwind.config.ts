import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#556B2F",
          light: "#6B8A3E",
          dark: "#3E5022",
        },
        secondary: {
          DEFAULT: "#8FA31E",
          light: "#A4B84A",
          dark: "#6E7E17",
        },
        accent: {
          DEFAULT: "#C6D870",
          light: "#D4E494",
          dark: "#B0C44E",
        },
        background: {
          DEFAULT: "#EFF5D2",
          card: "#FFFFFF",
          subtle: "#F5F8E4",
        },
        danger: {
          DEFAULT: "#E53935",
          light: "#FFEBEE",
          dark: "#C62828",
        },
        warning: {
          DEFAULT: "#FB8C00",
          light: "#FFF3E0",
        },
        info: {
          DEFAULT: "#1E88E5",
          light: "#E3F2FD",
        },
        success: {
          DEFAULT: "#43A047",
          light: "#E8F5E9",
        },
        gray: {
          900: "#1A1A1A",
          700: "#4F4F4F",
          500: "#9E9E9E",
          200: "#E0E0E0",
          50: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
      },
      fontSize: {
        h1: ["2rem", { lineHeight: "1.25", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover":
          "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
        modal: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
      },
      maxWidth: {
        layout: "1200px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
