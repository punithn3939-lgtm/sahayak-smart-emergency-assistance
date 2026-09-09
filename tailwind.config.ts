import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#080a14',
        panel: '#101427',
        blue: '#4ddde8',
        emergency: '#ff3b4f',
      },
      boxShadow: {
        glow: '0 0 50px rgba(92,246,255,.18)',
        sos: '0 0 55px rgba(255,59,79,.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
