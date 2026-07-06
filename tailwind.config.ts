import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#18344A",
          foreground: "#F8F7F4",
        },
        gold: {
          DEFAULT: "#C9A34E",
          light: "#D4B96A",
          dark: "#A8873A",
        },
        navy: {
          DEFAULT: "#18344A",
          light: "#285A84",
        },
        charcoal: {
          DEFAULT: "#18344A",
          light: "#285A84",
        },
        luxury: {
          black: "#18344A",
          gold: "#C9A34E",
          "gold-light": "#D4B96A",
          charcoal: "#18344A",
          white: "#F8F7F4",
          gray: "#ECECEC",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
"pulse-gold": {
  "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 163, 78, 0.4)" },
  "50%": { boxShadow: "0 0 0 10px rgba(201, 163, 78, 0)" },
},
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-gold": "pulse-gold 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
