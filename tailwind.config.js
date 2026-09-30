/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bluerake: {
          green: '#044A29',
          emerald: '#0A7244',
          slate: '#0F172A',
          white: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
};
