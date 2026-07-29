import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0b1220',
          900: '#111827',
          800: '#1f2937',
          700: '#334155',
        },
        brand: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
