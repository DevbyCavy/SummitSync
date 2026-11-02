/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { purple: '#4B2852', 'purple-light': '#5D3E64', orange: '#F57627', 'orange-light': '#F6843D', 'orange-dark': '#C85A14' },
        // Dark "rich" surfaces derived from brand purple (site background and panels).
        night: { 950: '#120914', 900: '#1B0E20', 800: '#24142A', 700: '#311D38' },
        ink: '#231F20',
        cream: '#FEF4EE',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1240px' },
    },
  },
  plugins: [],
};
