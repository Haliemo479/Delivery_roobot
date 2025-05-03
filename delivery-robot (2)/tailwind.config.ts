import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        // New Egyptian-inspired color palette
        primary: {
          DEFAULT: "#1A365D", // Deep Nile blue
          50: "#E6EBF2",
          100: "#f0f4ff",
          200: "#9AB3D1",
          300: "#7295C1",
          400: "#4A77B0",
          500: "#1A365D", // Base
          600: "#152D4D",
          700: "#2563eb",
          800: "#0B1B2E",
          900: "#05121F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4AF37", // Egyptian gold
          50: "#FAF5E6",
          100: "#F4E9C2",
          200: "#EDDA9A",
          300: "#E6CC72",
          400: "#DFBD4A",
          500: "#D4AF37", // Base
          600: "#B3922D",
          700: "#927624",
          800: "#70591C",
          900: "#4F3D13",
          foreground: "#1A1A1A",
        },
        accent: {
          DEFAULT: "#2C7873", // Turquoise
          50: "#E6F1F0",
          100: "#C2DDDB",
          200: "#9AC9C5",
          300: "#72B5AF",
          400: "#4AA199",
          500: "#2C7873", // Base
          600: "#246360",
          700: "#1C4F4D",
          800: "#143B3A",
          900: "#0C2726",
          foreground: "#FFFFFF",
        },
        sand: {
          DEFAULT: "#E6D7B0", // Desert sand
          50: "#FCF9F2",
          100: "#F7F0DD",
          200: "#F1E6C9",
          300: "#ECDCB4",
          400: "#E6D7B0", // Base
          500: "#D9C38A",
          600: "#CCAF64",
          700: "#BF9B3E",
          800: "#9A7D32",
          900: "#755F26",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-egyptian": "linear-gradient(to bottom right, #1A365D, #0F2942, #081C2E)",
      },
      // Add custom utility for hiding scrollbars
      utilities: {
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
