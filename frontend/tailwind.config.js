/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'merienda': ['Merienda', 'sans-serif'],
        'sans': ['Merienda', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['Merienda', 'ui-serif', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
