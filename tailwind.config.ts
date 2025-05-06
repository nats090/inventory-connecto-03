
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cooking: {
          softGreen: "#F2FCE2",
          softYellow: "#FEF7CD",
          softOrange: "#FEC6A1",
          softPeach: "#FDE1D3",
          softBlue: "#D3E4FD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
      backgroundImage: {
        'cooking-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOSAyLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0yNCAxMmMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0yNCAxMmMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xeiIvPjwvZz48L2c+PC9zdmc+')",
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
