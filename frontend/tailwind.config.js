/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand colors live in src/index.css (@theme, Tailwind v4 CSS-first) — the single
      // source of truth. Do not duplicate palette values here.
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(116, 47, 28, 0.06)',
        'floating': '0 10px 30px -4px rgba(116, 47, 28, 0.28)',
        'card': '0 2px 12px rgba(116, 47, 28, 0.05)',
      }
    },
  },
  plugins: [],
}
