/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#d03328',
          hover: '#6a6056',
        },
        navy: '#1c2024',
        slate: {
          DEFAULT: '#2e3f51',
          hover: '#768597',
        },
        light: '#ECEEF0',
        footer: '#161a1d',
        muted: '#6b7a8a',
      },
      fontFamily: {
        sans: ['"Neue Montreal"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
