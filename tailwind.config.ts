import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        green: {
          500: "#34C759", // iOS Green
          600: "#248A3D",
        },
        blue: {
          500: "#0A84FF", // iOS Blue
          600: "#0064C8",
        },
        red: {
          500: "#FF453A", // iOS Red
          600: "#C9342B",
          700: "#9A251E",
        },
        light: {
          200: "#F2F2F7", // iOS light background
        },
        dark: {
          100: "#000000", // iOS Pure Black (Base background)
          200: "#0A0A0A", // Very dark
          300: "#121212", // Card base
          400: "#1C1C1E", // iOS Elevated Card (The standard dark mode gray)
          500: "#2C2C2E", // iOS Elevated Hover
          600: "#3A3A3C", // iOS Borders/Separators
          700: "#8E8E93", // iOS Secondary Text
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        '3xl': "calc(var(--radius) + 8px)", // For extreme iOS curves (modals)
        '2xl': "calc(var(--radius) + 4px)", // For cards
        xl: "var(--radius)",
        lg: "calc(var(--radius) - 2px)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config