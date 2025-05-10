
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
      screens: {
        'xs': '475px',
      },
      fontSize: {
        'base': ['1rem', '1.5rem'],      // Adjusted for mobile  
        'lg': ['1.125rem', '1.75rem'],   // Adjusted for mobile
        'xl': ['1.25rem', '1.75rem'],    // Adjusted for mobile
        '2xl': ['1.5rem', '2rem'],       // Adjusted for mobile
        '3xl': ['1.875rem', '2.25rem'],  // Adjusted for mobile
        '4xl': ['2.25rem', '2.5rem'],    // Adjusted for mobile
        // Larger on desktop via responsive utilities
        'sm:base': '1.125rem',
        'sm:lg': '1.25rem',  
        'sm:xl': '1.375rem',
        'sm:2xl': '1.625rem',
        'sm:3xl': '2rem',
        'sm:4xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
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
        xl: "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.08)',
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
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.4s ease-out",
      },
      backgroundImage: {
        'cooking-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOSAyLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0yNCAxMmMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0yNCAxMmMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xeiIvPjwvZz48L2c+PC9zdmc+')",
        'gradient-warm': "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
