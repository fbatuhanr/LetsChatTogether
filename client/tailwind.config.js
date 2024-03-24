/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/src/assets/hero.png')",
        'blur-ellipse': "url('/src/assets/ellipse.png')"
      },
      fontFamily: {
        "outfit": ['Outfit', 'sans-serif'],
        "roboto": ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

