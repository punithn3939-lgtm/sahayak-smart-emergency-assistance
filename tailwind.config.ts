import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { navy:'#071426', panel:'#0c1b2e', blue:'#2f80ed', emergency:'#ef3340' }, boxShadow:{glow:'0 0 50px rgba(47,128,237,.18)', sos:'0 0 55px rgba(239,51,64,.25)'} } },
  plugins: []
};
export default config;
