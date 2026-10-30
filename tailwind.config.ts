import type { Config } from "tailwindcss";

// Colors resolve to CSS variables (RGB channels) defined in globals.css so
// the same utility classes work in light and dark, including opacity (accent/10).
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        accent: token("accent"),
        textPrimary: token("text-primary"),
        textSecondary: token("text-secondary"),
        heart: token("heart"),
        surface: token("surface"),
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
