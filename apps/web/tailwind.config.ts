import type { Config } from 'tailwindcss';

// Design tokens per docs/06-web-app-wireframes.md §8 — luxury academy palette.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        academy: {
          navy: '#0B1220',
          charcoal: '#161B22',
          gold: '#D4AF37',
          goldLight: '#F0D98C',
          ivory: '#F5F1E8',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
