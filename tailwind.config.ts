import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom colors defined as HSL variables in globals.scss
        "login-dark-blue": "hsl(var(--login-dark-blue))",
        "login-button-blue": "hsl(var(--login-button-blue))",
        "login-text-dark": "hsl(var(--login-text-dark))",
        "login-text-light": "hsl(var(--login-text-light))",
        "login-grid-line": "hsl(var(--login-grid-line))",

        "skill-0": "hsl(var(--skill-0))",
        "skill-1": "hsl(var(--skill-1))",
        "skill-2": "hsl(var(--skill-2))",
        "skill-3": "hsl(var(--skill-3))",
        "skill-4": "hsl(var(--skill-4))",
        "text-skill-0": "hsl(var(--text-skill-0))",
        "text-skill-1": "hsl(var(--text-skill-1))",
        "text-skill-2": "hsl(var(--text-skill-2))",
        "text-skill-3": "hsl(var(--text-skill-3))",
        "text-skill-4": "hsl(var(--text-skill-4))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "login-grid": `repeating-linear-gradient(0deg, var(--login-grid-line) 0px, var(--login-grid-line) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, var(--login-grid-line) 0px, var(--login-grid-line) 1px, transparent 1px, transparent 20px)`,
      },
    },
  },
  plugins: [animate],
};
export default config;
