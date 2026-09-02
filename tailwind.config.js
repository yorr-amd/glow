/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: {
          50:  '#FDF5F7',
          100: '#FAEAEF',
          200: '#F5D0DC',
          300: '#EDB0C2',
          400: '#E08AA4',
          500: '#D06885',
          600: '#B84E6A',
          700: '#963A53',
          800: '#762D41',
          900: '#5A2232',
        },
        rose: {
          muted: '#C9899A',
        },
      },
    },
  },
  plugins: [],
}
