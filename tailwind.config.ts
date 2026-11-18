import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        paper: "#F4F1EB",
        bone: "#E9E3D8",
        sand: "#D8CFBF",
        line: "#DCD4C5",
        ink: {
          DEFAULT: "#0F2235",
          soft: "#33475B",
          muted: "#66717D",
        },
        navy: "#02437B",
        accent: {
          DEFAULT: "#F05A28",
          deep: "#C2410C",
          soft: "#FBE3D8",
        },
        background: "#F4F1EB",
        foreground: "#0F2235",
        border: "#DCD4C5",
        input: "#CFC6B5",
        ring: "#0F2235",
        muted: { DEFAULT: "#E9E3D8", foreground: "#66717D" },
        card: { DEFAULT: "#FBF9F5", foreground: "#0F2235" },
        popover: { DEFAULT: "#FBF9F5", foreground: "#0F2235" },
        primary: { DEFAULT: "#0F2235", foreground: "#F4F1EB" },
        secondary: { DEFAULT: "#E9E3D8", foreground: "#0F2235" },
        destructive: { DEFAULT: "#B42318", foreground: "#FFFFFF" },
        success: "#2F6B4F",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 8.25rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.4rem, 5.4vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2rem, 3.8vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.5rem, 2.4vw, 2.2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        lg: "6px",
        md: "4px",
        sm: "2px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "scroll-cue": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "overlay-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "overlay-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "modal-in": {
          from: { opacity: "0", transform: "translate(-50%, -46%) scale(0.98)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "modal-out": {
          from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          to: { opacity: "0", transform: "translate(-50%, -48%) scale(0.98)" },
        },
        "drawer-in": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "drawer-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "drawer-out": { from: { transform: "translateX(0)" }, to: { transform: "translateX(100%)" } },
        "sheet-in": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "sheet-out": { from: { transform: "translateY(0)" }, to: { transform: "translateY(100%)" } },
      },
      animation: {
        "overlay-in": "overlay-in 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "overlay-out": "overlay-out 250ms ease-in forwards",
        "modal-in": "modal-in 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        "modal-out": "modal-out 200ms ease-in forwards",
        "drawer-in": "drawer-in 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        "drawer-out": "drawer-out 350ms cubic-bezier(0.76, 0, 0.24, 1) forwards",
        "sheet-in": "sheet-in 550ms cubic-bezier(0.16, 1, 0.3, 1)",
        "sheet-out": "sheet-out 300ms cubic-bezier(0.76, 0, 0.24, 1) forwards",
        marquee: "marquee 38s linear infinite",
        "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.76, 0, 0.24, 1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
