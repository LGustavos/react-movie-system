import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          /** Header e faixas mais profundas. */
          950: '#0e1626',
          /** Fundo da pagina. */
          900: '#141d2f',
          /** Cards, inputs e selects. */
          800: '#1c2537',
          /** Placeholders de imagem. */
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
        /** Roxo/lilas da claquete da marca. */
        lilac: {
          400: '#a78bfa',
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
