/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
          DEFAULT: "hsl(198 100% 28%)", // KMIT Blue
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(28 100% 50%)", // KMIT Orange
          foreground: "hsl(0 0% 100%)",
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
          DEFAULT: "hsl(198 100% 28%)",
          foreground: "hsl(0 0% 100%)",
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
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "pulse": {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        "typing": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "blink": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "hsl(var(--primary))" },
        },
        "rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse": "pulse 2s ease-in-out infinite",
        "typing": "typing 2s steps(40, end), blink .75s step-end infinite",
        "rotate": "rotate 1s linear infinite",
        "fade-in": "fade-in 0.3s ease-in",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      boxShadow: {
        'neumorph': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neumorph-dark': '5px 5px 10px #1a1a1a, -5px -5px 10px #2c2c2c',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}