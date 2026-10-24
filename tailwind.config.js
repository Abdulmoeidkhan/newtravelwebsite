import forms from '@tailwindcss/forms';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    colors: { navy: { 900: '#0F172A', 800: '#1E293B' }, ocean: { 600: '#2563EB', 500: '#0284C7' }, gold: { 500: '#F59E0B', 600: '#D97706' }, slate: { 50: '#F8FAFC', 100: '#F1F5F9', 700: '#334155' } },
    fontFamily: { serif: ['Outfit', 'sans-serif'], sans: ['Outfit', 'sans-serif'] },
  } },
  plugins: [forms],
};
