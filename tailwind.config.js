/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'genolcare-blue': '#1A3B8B',
        'genolcare-green': '#6DBE45',
      },
      fontFamily: {
        sans: ['Satoshi', 'var(--font-geist)', 'system-ui', '-apple-system', 'sans-serif'],
        cursive: ['var(--font-dancing-script)', 'cursive'],
        satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
