/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wasp-yellow': '#FFD600',
        'wasp-black': '#1A1A1A',
        'wasp-dark': '#2A2A2A',
        'wasp-gray': '#666666',
        'wasp-light': '#F9F9F9',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
