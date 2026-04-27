/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: '#d03328',
        redHover: '#7c1e18',
        navy: '#1c2024',
        slate: '#2e3f51',
        slateHover: '#768597',
        light: '#ECEEF0',
        footerBg: '#161a1d',
        muted: '#6b7a8a',
      },
      fontFamily: {
        sans: ['"Neue Montreal"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
