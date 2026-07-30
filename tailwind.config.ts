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
      /*
       * Todas as animacoes mexem so em transform/opacity - propriedades que o
       * browser compoe na GPU, sem recalcular layout a cada frame.
       */
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4%, 6%, 0) scale(1.25)' },
        },
        'aurora-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1.15)' },
          '50%': { transform: 'translate3d(-6%, -4%, 0) scale(1)' },
        },
        'card-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        aurora: 'aurora 26s ease-in-out infinite',
        'aurora-slow': 'aurora-slow 34s ease-in-out infinite',
        // `both` segura o opacity:0 durante o animation-delay do escalonamento.
        'card-in': 'card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        pop: 'pop 320ms ease-out',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
