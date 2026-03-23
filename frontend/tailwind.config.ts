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
          DEFAULT: "#2E7D32",
          light: "#43A047",
          dark: "#1B5E20",
        },
        secondary: {
          DEFAULT: "#558B2F",
          light: "#689F38",
          dark: "#33691E",
        },
        accent: {
          DEFAULT: "#AED581",
          light: "#C5E1A5",
          dark: "#9CCC65",
        },
        background: {
          DEFAULT: "#F5F7FA",
          card: "#FFFFFF",
          subtle: "#EDF0F5",
        },
        danger: {
          DEFAULT: "#D32F2F",
          light: "#FFEBEE",
          dark: "#B71C1C",
        },
        warning: {
          DEFAULT: "#EF6C00",
          light: "#FFF3E0",
        },
        info: {
          DEFAULT: "#1565C0",
          light: "#E3F2FD",
        },
        success: {
          DEFAULT: "#2E7D32",
          light: "#E8F5E9",
        },
        gray: {
          900: "#111827",
          700: "#374151",
          500: "#6B7280",
          400: "#9CA3AF",
          200: "#E5E7EB",
          100: "#F3F4F6",
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
        card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)",
        modal: "0 8px 30px rgba(0, 0, 0, 0.18)",
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
