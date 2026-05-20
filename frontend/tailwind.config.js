/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          background: '#050914',
          surface: '#0b1220',
          panel: '#111827',
          border: '#202938',
        },
      },
    },
  },
  plugins: [],
}
