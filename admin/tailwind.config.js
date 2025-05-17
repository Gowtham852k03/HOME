/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        'primary':'#00FF99',
        'primary-green-start': '#00FF99',  // light neon green
        'primary-green-end': '#00CC66', // dark neon green
      }
    },
  },
  plugins: [],
}